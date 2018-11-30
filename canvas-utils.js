const got = require('got')

const apiToken = process.env.CANVAS_API_TOKEN || ''
const subdomain = 'byui'
const baseUrl = `https://${subdomain}.instructure.com`

console.time('GET')
got.head('https://byui.instructure.com/api/v1/accounts/1/courses',{
  headers: { Authorization: 'Bearer '+ apiToken }
}).then(res => {
  console.timeEnd('GET')
  console.log(res.url)
  console.log(res.headers)
})

// console.time('GET')
// got.get('https://byui.instructure.com/api/v1/accounts/1/courses',{
//   headers: { Authorization: 'Bearer '+ apiToken }
// }).then(res => {
//   console.timeEnd('GET')
//   console.log(res.url)
// })