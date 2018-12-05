var deptIndex = 0
var rowCells = 0
var delKeys = []
let displayedField = ""

const views = {
    "company_id": "Company",
    "department_id": "Department",
    "user_id": "User"
}

function getReportViewBy(viewBy){
    return `${views[viewBy].toUpperCase()} DELIVERABLE REPORT`
}

function getReportName(deliverables){
    const { name, reportDetails } = deliverables
    const label = views[reportDetails.viewBy]
    return `${label}: ${name}`
}

function getDeptIndex(index){
    deptIndex =  index 
    return index !== 0 ? 'page-break' : ''
}

function sortData(data){
    return _.sortBy(data, 'due_date')
}

function getKeys(currentKeys, next){
    var keys = currentKeys
    if(next.submitted.length !== 0){
        keys = Object.keys(next.submitted[0].del_details)
        Object.keys(next.submitted[0].del_details).map(item => {
            if(!keys.includes(item)){
                keys.push(item)
            }
        })
    }
    
    return keys
}

function groupByDepartment(data){
    var deliverables = []
    data.map(item => {
        const { _id, user_name, userDeliverables } = item
        var del = userDeliverables.map(i => {
            return {...i, user_name, _id}
        })
        deliverables = deliverables.concat(del)
    })
    
    const list = deliverables.reduce(function(prev, next){
        const objKey = next.department_id
        const withTitle = _.has(prev[objKey], 'title')
        const withItems = _.has(prev[objKey], 'items')
        prev[objKey] = {
            title: (withTitle ? prev[objKey].title : next.department_name),
            items: (withItems ? prev[objKey].items : []).concat(next),
        }
        return prev
    },{})
    
    return list
}

function groupByUser(data){
    const a = data.reduce((prev, next) => {
        const objKey = next._id
        const withItems = _.has(prev[objKey], 'userDeliverables')
        prev[objKey] = {
            user_name: (next.user_name),
            userDeliverables: (withItems ? prev[objKey].userDeliverables : []).concat(next),
        }
        return prev
    }, {})
    
    return a
}

function getReturnData(prev, next, objKey){
    const withKeys = _.has(prev[objKey], 'keys')
    const withItems = _.has(prev[objKey], 'items')
    const withType = _.has(prev[objKey], 'type')
    const currentKeys = withKeys ? prev[objKey].keys : []
    prev[objKey] = {
        keys: getKeys(currentKeys, next),
        items: (withItems ? prev[objKey].items : []).concat(next),
        type: withType ? prev[objKey].type : next.type,
    }
    return prev
}

function groupByType(data){
    data = sortData(data)
    const list = data.reduce(function(prev, next){
        const objKey = next.type
        prev = getReturnData(prev, next, objKey)
        return prev
    },{})
    return list
}

function groupByTask(data){
    data = sortData(data)
    const list = data.reduce(function(prev, next){
        const objKey = next.task_id
        prev[objKey] = (prev[objKey] || []).concat(next)
        return prev
    },{})
    return list
}

function getPageBreak(index){
    if(index === 0 && deptIndex === 0){
        return ''
    }else if(index === 0){
        return ''
    }else{
        return 'page-break'
    }
}

function checkIfSubmitted(data){
    return !_.isEmpty(data)
}

function checkKeys(keys){
    delKeys=keys
    rowCells = keys.length
    return keys.length !== 0
}

function checkIfCompleted(key){
    return key === 'Completed'
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

function getSpan(){
    const span = rowCells - 1
    return span === 0 ? '1' : span
}

function checkIfB64(text){
    const a = (text||"").toString()
    var x = a.split(":")
    if(x[0] == 'data')
        return true
    return false
}

function getDeptTotalSubmitted(list){
    var total = 0
    list.map( item => {
        total += getTotalSubmitted(item.userDeliverables)
    })
    
    return total
}

function getDeptTotalPIS(list){
    var total = 0
    list.map( item => {
        total += getTotalPIS(item.userDeliverables)
    })
    
    return total
}

function getTotalSubmitted(list){
    const completed = list.filter( item => item.status === 'Completed')
    const count = _.isEmpty(completed) ? 0 : completed.reduce(function(prev, next){
        prev+= next.submitted.length
        return prev
    },0)
    
    return count
}

function getTotalPIS(list){
    const completed = _.isEmpty(list) ? [] : list.filter( item => item.status === 'Completed' && item.type === "Personal Information Sheet")
    if(_.isEmpty(completed)){
        return 0
    }else{
        var total = 0
        var counted = []
        completed.map(item=> {
            const amt = item.submitted.reduce(function(prev, next){
                prev += next.del_details.maximumLoanValue
                return prev
            },0)
            total+= amt
        })
        return total
    }
}

function checkIfNull(val){
    if(val === null || val === undefined){
        return ""
    }
    return typeof val === "object" ? Array.isArray(val) ? val[0] : "" : val
}

function getColumns(data){
    const x = delKeys.reduce((prev, next) => {
        prev[next] = checkIfNull(data[next])
       return prev 
    },{}) 
    
    return x
}

function getRowSpanBasedOnDel(data){
    data = Object.keys(data).filter(field => {
        return field !== "isManualEntry" && field !== "sync"
    })
    
    return(data.length + 1).toString()
}

function getFields(data){
    var fieldValues = []
    Object.keys(data).map(field => {
        if(field !== "isManualEntry" && field !== "sync" && field !== displayedField){
            const fieldName = field.toUpperCase()
            // fieldValues = fieldValues.concat(`${fieldName}: ${data[field]}`)
            fieldValues = fieldValues.concat({fieldName, value: data[field]})
        }
    })
    
    return fieldValues
}

function getFieldValue(data){
    return JSON.stringify(data)
}









