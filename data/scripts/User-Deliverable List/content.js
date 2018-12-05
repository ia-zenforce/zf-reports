var request = require('request')

{#asset shared-scripts.js @encoding=utf8};

function beforeRender(req,res,done){
    const user_id = req.data.user_id || 132
    var endDate = formatDate(req.data.endDate || new Date())
    var startDate = formatDate(req.data.startDate || getEndDate(endDate))
    
    login(function(token){
        const data = { user_id, startDate, endDate, token }
        request.post({url: submittedDelReportUrl, json: data} , function(err, response,body){
            if (err || response.statusCode !== 200) {
                return done(err || body || 'Unknown error')
            }

            const details = {
                "name" : body.deliverables[0].user_name,
                "reportDetails": {
                    "id": user_id,
                    "startDate": startDate,
                    "endDate": endDate
                },
                "data": body.deliverables
            }
            req.data.deliverables = details
            done()
        })
    })
}
