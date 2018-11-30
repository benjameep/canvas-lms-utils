const yaml = require('js-yaml')

const aliases = yaml.safeLoad('./aliases.yaml')

function CanvasUtils(settings){
  this.apitoken = settings.apitoken || process.env.CANVAS_API_TOKEN || ''
  this.subdomain = settings.subdomain
  this.baseUrl = `https://${this.subdomain}.instructure.com`
}

CanvasUtils.prototype.alias = function(alias,path){
  return this
}

CanvasUtils.prototype.properties = function(data){
  ['id','name','body','url','type','preview']
  return {
    get id(){},
    set id(val){},
  }
}

CanvasUtils.prototype.getRequests = function(data){
  ['id','name','body','url','type','preview']
  return {
    get id(){},
    set id(val){},
  }
}

const canvasUtils = {
  ...aliases,
}

await canvasUtils()
  .get('/api/v1/users/:id',{id:3})
  .get('/api/v1/courses/:course_id/quizzes/:quiz_id/questions',[{
    course_id,
    id:3924,
  },{
    course_id,
    id:9442,
  },{
    course_id,
    id:9442,    
  }])
  .questions({
    course_id,
    quiz_id:4958
  })