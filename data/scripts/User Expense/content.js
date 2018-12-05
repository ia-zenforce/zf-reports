var request = require('request')

function beforeRender(req,res,done){
    const user_id = req.data.user_id || 162
    var endDate = formatDate(req.data.endDate || new Date())
    var startDate = formatDate(req.data.startDate || getEndDate(endDate))
    login(function(token){
        const data = { user_id, startDate, endDate, token }
        //get data from external
        request.post({url: expReportUrl, json: data}, function(err, response, body){
            if (err || response.statusCode !== 200) {
                return done(err || body || 'Unknown error')
            }
            const details = {
                "name" : body.details.name,
                "reportDetails": {
                    "id": user_id,
                    "startDate": startDate,
                    "endDate": endDate
                },
                "data": body.data
            }
            req.data.expenses = details //set data for template render
            done()
        })
    })
}

{#asset shared-scripts.js @encoding=utf8};
