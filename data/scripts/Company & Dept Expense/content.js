var request = require('request')

function beforeRender(req,res,done){
    //data for testing
    // req.data.company_id = 1 
    
    const viewBy = req.data.company_id ? "company_id" : "department_id"
    // const company_id = req.data.company_id || 1
    var endDate = formatDate(req.data.endDate || new Date())
    var startDate = formatDate(req.data.startDate || getEndDate(endDate))
    
    login(function(token){
        const data = { [viewBy]: req.data[viewBy], startDate, endDate, token }
        
        //get data from external
        request.post({url: expReportUrl, json: data}, function(err, response, body){
            if (err || response.statusCode !== 200) {
                return done(err || body || 'Unknown error')
            }
            
            const details = {
                "name" : body.details.name,
                "reportDetails": {
                    "id": req.data[viewBy],
                    "startDate": startDate,
                    "endDate": endDate,
                    "viewByCompany": viewBy === "company_id"
                },
                "data": body.data
            }
            
            req.data.expenses = details //set data for template render
            done()
        })
    })
}

{#asset shared-scripts.js @encoding=utf8};
