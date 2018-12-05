var deptIndex = null
var requiredDel = []
var submittedDel = []

function getDeptIndex(index){
    deptIndex =  index 
    return index !== 0 ? 'page-break' : ''
}

function sortData(data){
    return _.sortBy(data, 'date_submitted')
}

function getReturnData(prev, next, objKey){
    const withName = _.has(prev[objKey], 'name')
    const withKeys = _.has(prev[objKey], 'keys')
    const withItems = _.has(prev[objKey], 'items')
    const withType = _.has(prev[objKey], 'type')
    const keys = _.has(next, 'del_details') ? Object.keys(next.del_details) : []
    prev[objKey] = {
        name: withName ? prev[objKey].name : next.submitted_by,
        keys: withKeys ? prev[objKey].keys : keys,
        items: (withItems ? prev[objKey].items : []).concat(next),
        type: withType ? prev[objKey].type : next.del_type || next.type,
    }
    return prev
}

function groupByUser(data){
    data = sortData(data)
    const list = data.reduce(function(prev, next){
        const objKey = next.submitted_by
        submittedDel = submittedDel.concat({id: next.submissionID, submitted_by: objKey})
        prev = getReturnData(prev, next, objKey)
        return prev
    },{})
    return list
}

function groupByUserReq(data){
    data = sortData(data)
    const list = data.reduce(function(prev, next){
        const objKey = next.submittedBy
        prev[objKey] = (prev[objKey] || []).concat(next)
        return prev
    },{})
    return list
}

function groupByType(data){
    data = sortData(data)
    const list = data.reduce(function(prev, next){
        const objKey = next.del_type || next.type
        prev = getReturnData(prev, next, objKey)
        return prev
    },{})
    return list
}

function groupByDepartment(data){
    requiredDel = data.required
    const list = data.data.reduce(function(prev, next){
        const objKey = next.department_id
        prev[objKey] = (prev[objKey] || []).concat(next)
        return prev
    },{})
    return list
}

function groupByTask(data){
    const reqList = requiredDel.reduce(function(prev, next){
        const objKey = next.task_id
        prev[objKey] = (prev[objKey] || []).concat(next)
        return prev
    },{})
    
    var list = data.reduce(function(prev, next){
        const objKey = next.task_id
        prev[objKey] = (prev[objKey] || []).concat(next)
        return prev
    },{})
    
    Object.keys(list).map(function(item){
        const required = reqList[item]
        const notStarted = required.filter(function(req){
            return req.status === 'Not Started'
        })
        const completed = required.filter(function(req){
            return req.status === 'Completed'
        })
        
        completed.map(function(comp){
            var isOwner = _.find(list[item], {submissionID: comp.submissionID })
                isOwner = !_.isEmpty(isOwner)
            if(!isOwner){
                var submission = _.find(submittedDel, {id: comp.submissionID})
                const shared = {...comp, submitted_by: submission.submitted_by}
                list[item] = list[item].concat(shared)
            }
        })
        
        list[item] = list[item].concat(notStarted)
    })
    
    return list
}

function groupByTaskDel(data){
    var list = data.reduce(function(prev, next){
        const objKey = next.task_id
        const withTitle = _.has(prev[objKey], 'title')
        const withItems = _.has(prev[objKey], 'items')
        prev[objKey] = {
            title: (withTitle ? prev[objKey].title : next.task_title),
            items: (withItems ? prev[objKey].items : []).concat(next),
        }
        return prev
    },{})
    return list
}

function getPageBreak(index){
    if( index === 0 && deptIndex === 0)
        return ''
    return 'page-break'
}

function checkStatus(data){
    return data.submissionID !== ' '
}

function checkKeys(keys){
    return keys.length !== 0
}

function checkIfShared(data){
    return !_.has(data, 'del_details')
    
}













