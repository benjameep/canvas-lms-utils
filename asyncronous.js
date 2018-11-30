const axios = require('axios')
const Bottleneck = require('bottleneck')
const url = require('url')

const apiToken = process.env.CANVAS_API_TOKEN || ''
const subdomain = 'byui'
const baseUrl = `https://${subdomain}.instructure.com`

var limiter = new Bottleneck({
  minTime: 10,
  maxConcurrent: 30,
})

// Parses canvas's crazy pagination method
function parseLink(str){
  if(str){
    return str.split(',')
      .map(str => str.match(/<(.*?page=(\d+).*?)>.*?"(.*?)"/))
      .reduce((obj,elm) => {obj[elm[3]] = {path:elm[1],page:elm[2]}; return obj},{})
  }
}

const range = (start,end) => Array.from({length:end-start},(_,i) => i+start)

function canvas(path,query,cb){
  if(!apiToken) throw new Error('Canvas API Token was not set')

  var parsed = url.parse(url.resolve(baseUrl,path),true)
  parsed.query = Object.assign({},parsed.query,query)
  path = url.format({
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    pathname: parsed.pathname,
    query: parsed.query,
  })

  console.log(path)

  axios.get(path,{
    headers: { Authorization: 'Bearer '+ apiToken }
  }).then(res => {
    let links = parseLink(res.headers.link)
    if(res.data.length && links){
      var nextpage = parsed.query.page+1||2
      if(links.last && links.current.page == 1){
        range(nextpage,links.last.page).forEach(page => {
          limiter.submit(canvas,path,{ page },cb)
        })
      } else if(!links.last){
        limiter.submit(canvas,path,{ page:nextpage },cb)
      }
    }
    cb(res.data)
  }).catch(e => {throw e})
}

var fs = require('fs')

var file = fs.createWriteStream('temp.json')

canvas('https://byui.instructure.com/api/v1/accounts/1/courses',{/* per_page:2 */},courses => {
    file.write(JSON.stringify(courses)+'\n')
})

limiter.on('idle', function () {
  file.end()
});