const views = {
    "company_id": "Company",
    "department_id": "Department",
    "user_id": "User"
}

function getReportViewBy(viewBy){
    return `${views[viewBy].toUpperCase()} EXPENSE REPORT`
}

function getReportName(expenses){
    const { name, reportDetails } = expenses
    const label = views[reportDetails.viewBy]
    return `${label}: ${name}`
}

function sortData(list){
    return _.sortBy(list, "exp_date")    
}

function total(list){
    const total = list.reduce(function(prev,next){
       prev+=next.exp_amount 
       return prev
    },0)
    
    return total.toFixed(2)
}

function peso(amount){
    return amount.toFixed(2)
}

function groupByDepartment(data){
    return data.reduce(function(prev, next){
        const objKey = next.utaskModel.userModel.department_name
       prev[objKey] = (prev[objKey] || []).concat(next)
       return prev
    },{})
}

function groupByUser(data){
    return data.reduce(function(prev, next){
        const objKey = fullname(next.utaskModel.userModel)
       prev[objKey] = (prev[objKey] || []).concat(next)
       return prev
    },{})
}

function groupByType(data){
    return data.reduce(function(prev, next){
       prev[next.expTypeModel.exptype_name] = (prev[next.expTypeModel.exptype_name] || []).concat(next)
       return prev
    },{})
}

function getTotalByStatus(data){
    return data.reduce(function(prev, next){
        prev[next.exp_status] = (prev[next.exp_status] || 0) + next.exp_amount
        return prev
    },{})
}
function getTotal(data){
    return data.reduce(function(prev, next){
        prev += next.exp_amount
        return prev
    },0)
}

function getUserTotal(expenses){
    const userTotal = expenses.reduce((prev, next) => {
        prev+= parseFloat(next.exp_amount)
        return prev 
    },0)
    
    return peso(userTotal)
}
