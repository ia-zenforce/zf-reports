let groupProductivity = {}
let displayedAssignee = ""
let displayedNote = ""

const views = {
    "company_id": "Company",
    "department_id": "Department",
    "user_id": "User"
}

function getReportViewBy(viewBy){
    return `${views[viewBy].toUpperCase()} EXPENSE REPORT`
}

function getReportName(tasks){
    const { name, reportDetails } = tasks
    const label = views[reportDetails.viewBy]
    return `${label}: ${name}`
}

function checkIfWithProductivityView(viewBy){
    return viewBy === "company_id" || viewBy === "department_id"
}

function checkIfWithTask(list){
    return list.length !== 0    
}

function sortData(list){
    return _.sortBy(list, "startDate")    
}

function rate(data){
    const completed = data.reduce(function(prev,next){
       const isCompleted = next.status === 'Completed'
       prev += isCompleted ? 1 : 0
       return prev
    },0)
    
    const rate = completed == 0 ? 0 : (completed/data.length)*100
    return rate.toFixed(2)
}

function getTaskStatusSummary(data){
    const summary = data.reduce(function(prev, next){
       prev[next.status] = (prev[next.status] || 0) + 1
       return prev
    },{})
    
    return summary
}

function checkCreator(assignment){
    return assignment !== 'Creator'
}

function getTaskCategorySummary(data){
    const summary = data.reduce(function(prev, next){
        const isCompleted = next.status === 'Completed'
        const withCompleteCount = _.has(prev[next.task_category], 'completed')
        const withTotalCount = _.has(prev[next.task_category], 'total')
        prev[next.task_category] = {
            "completed": (withCompleteCount ? prev[next.task_category].completed : 0) + (isCompleted ? 1 : 0),
            "total": (withTotalCount ? prev[next.task_category].total : 0) + 1
        }
        return prev
    },{})
    
    return summary
}

function getCompleted(data){
    return data.reduce(function(prev, next){
        prev = prev + (next.status === 'Completed' ? 1: 0)
        return prev
    },0)
}


function getUserProductivity(data){
    const users = data.reduce(function(prev, next){
        next.members.map(function(item){
            if(item.user_id !== 1){
                prev[item.user_fullname] = (prev[item.user_fullname] || []).concat(next)
            }
        })
        return prev
    },{})
    const userProductivity = getUserTask(users)
    return userProductivity
}

function getUserTask(users){
    const list = Object.keys(users)
    const productivity = list.map(function(name){
        const taskCount = users[name].reduce(function(prev, next){
            const isCompleted = next.status === 'Completed'
            const withCompleteCount = _.has(prev, 'completed')
            const withTotalCount = _.has(prev, 'total')
            prev = {
                "completed": (withCompleteCount ? prev.completed : 0) + (isCompleted ? 1 : 0),
                "total": (withTotalCount ? prev.total : 0) + 1
            }
            return prev
        },{})
        return { name, productivity: productivityRate(taskCount, list.length) , taskCount }
    })
    groupProductivity = productivity
    return productivity
}

function productivityRate(taskCount, count){
    const rate = (taskCount.completed/taskCount.total)*100
    return rate.toFixed(2)
}

function getGroupProductivity(){
    const total =  groupProductivity.reduce(function(prev, next){
       prev+=parseFloat(next.productivity);
       return prev
    }, 0)
    const rate = total == 0 ? 0 : total/groupProductivity.length
    return rate.toFixed(2)
}

function groupByDay(tasks){
    var { data, reportDetails: {startDate, endDate} } = tasks
    data = sortData(data)
    var dates = []
    for (var m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, "days")) {
        var currDate = m.format("MM/DD/YYYY");
        dates = dates.concat(currDate);
    }
    
    const list = data.reduce(function(prev, next){
        const date = formatDate(next.startDate)
        prev[date] = (prev[date] || []).concat(next)
        return prev
    },{})
    
    var all = dates.reduce(function(prev, next){
        prev[next] = list[next] || []
        return prev
    }, {})
    
    return all
}

function getFirstAssignee(members){
    const list = members.filter(({user_id}) => user_id > 1)
    const {user_id, user_fullname}  = list[0] || {}
    displayedAssignee = user_id
    return user_fullname
}

function populateMultipleData(data){
    const {members, notes} = data
    
    
    const assigneesToDisplay = members.filter(({user_id}) => user_id > 1 && user_id !== displayedAssignee)
    const notesToDisplay = notes.filter(data => JSON.stringify(data) !== JSON.stringify(displayedNote))
    var memCount = (assigneesToDisplay || []).filter(({user_id}) => user_id > 1).length
    var noteCount = (notesToDisplay || []).length
    
    const rowsToFollow = memCount > noteCount ? "user" : "note"
    const dataToFollow = rowsToFollow === "user" ? assigneesToDisplay : notesToDisplay
    const dataToDisplay = dataToFollow.map((item, index) => {
        const isUserBased = rowsToFollow === "user"
        const user = assigneesToDisplay[index]
        const note = notesToDisplay[index]
        return {user, note}
    })
    return dataToDisplay
}

function getFirstNote(notes){
    const { body }  = notes[0] || {}
    displayedNote = notes[0] || {}
    return body
}

function enumerateDaysBetweenDates(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');
    dates.push(currDate.clone().toDate().toString());
    while(currDate.add(1, 'days').diff(lastDate) < 1) {
        dates.push(currDate.clone().toDate().toString());
    }

    return dates;
}

function getDefaultDisplay(reportDetails){
    const { startDate, endDate } = reportDetails
    const dates = enumerateDaysBetweenDates(startDate, endDate)
    return dates
    
}























