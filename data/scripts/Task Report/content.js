var request = require('request')

function beforeRender(req,res,done){
    //data for testing
    // req.data.department_id = 6 
    
    const viewBy = req.data.company_id ? "company_id" : req.data.department_id ? "department_id" : "user_id"
    // const company_id = req.data.company_id || 144
    var endDate = formatDate(req.data.endDate || new Date())
    var startDate = formatDate(req.data.startDate || getEndDate(endDate))
    
    login(function(token){
        const data = { [viewBy]: req.data[viewBy], startDate, endDate, token }
        
        //get data from external
        request.post({url: tasksReportUrl, json: data}, function(err, response, body){
            if (err || response.statusCode !== 200) {
                return done(err || body || 'Unknown error')
            }

            const details = {
                "name" : body.details.name,
                "reportDetails": {
                    "id": req.data[viewBy],
                    "startDate": startDate,
                    "endDate": endDate,
                    "viewBy": viewBy
                },
                "data": body.data,
            }

            req.data.tasks = details //set data for template render
            done()
        })
    })
}

{#asset shared-scripts.js @encoding=utf8};