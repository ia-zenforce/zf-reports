const moment = require('moment')
// const request = require('request')
const serviceUrl = 'https://zf.zennerslab.com' 
const expressUrl = 'https://zenforce.zennerslab.com'
// const serviceUrl = 'https://350287d1.ngrok.io' 
// const expressUrl = 'https://c4ebf4c0.ngrok.io'
const expReportUrl = `${expressUrl}/api/reports/expenses`
const tasksReportUrl = `${expressUrl}/api/reports/tasks`
const submittedDelReportUrl = `${expressUrl}/api/deliverable_reports/submitted`
const requiredDelReportUrl = `${expressUrl}/api/deliverable_reports/required`

function getEndDate(date){
    date = new Date(date)
    date = new Date(date.setDate(date.getDate()-5))
    return moment(new Date(date).toString()).format("YYYY-MM-DD")
}

function formatDate(date){
    return moment(date).format("YYYY-MM-DD")
}

function login(cb){
  const url = `${serviceUrl}/login`
  const data = { "username": "admin", "password": "admin"}
//   const data = { "username": "rose", "password": "123456"}
  const headersOpt = {  
    "content-type": "application/json",
    };
  request.post({url: url, json: data} , function(err, response,body){
    if (err || response.statusCode !== 200) {
        console.log('login error: ', JSON.stringify(err))
    }
    
    cb(body.access_token)
  })
}