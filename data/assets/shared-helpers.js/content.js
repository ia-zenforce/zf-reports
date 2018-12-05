const moment = require('moment')
const _ = require('lodash')

function fullname(data){
    const fullName = data.user_firstname.concat(' ' + data.user_lastname)
    return capitalize(fullName)
}

function formatDate(date){
    return moment(date).format("MM/DD/YYYY")
}

function getDateOnly(date){
    return moment(date).format("DD")
}

function getDate(date){
    return moment(date).format("MMMM DD, YYYY")
}

function numberWithCommas(amount) {
    return amount ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '---';
}

function capitalize(text){
    return _.startCase(text)
}

function upperCase(text){
    return _.upperCase(text)
}

function getDay(date){
    const day = moment(date).format("dddd")
    return _.upperCase(day).substring(0,3)
}

function checkIndex(index){
    return index !== 0 ? 'page-break' : ''
}

function checkIfNumber(data){
    return typeof(data) === 'number'
}

function parseToInt(data){
    return parseInt(data)
}

function checkIfWithResult(data){
    return !_.isEmpty(data)
}

function getClass(data){
    if(checkIfNumber(data)){
        return {'mso-number-format' : 'General' }
    }
    return ''
}

function checkIfEndOfWeek(day){
    return day.toLowerCase().includes("sun")
}

function getRowSpan(data){
    const {members, notes} = data
    const membersCount = (members || []).filter(({user_id}) => user_id > 1).length
    const notesCount = (notes || []).length
    const count = membersCount > notesCount ? membersCount : notesCount
    return count.toString() 
}

function checkIfCompanyView(viewBy){
    return viewBy === "company_id"
}

function checkIfDepartmentView(viewBy){
    return viewBy === "department_id"
}

function checkIfUserView(viewBy){
    return viewBy === "user_id"
}