function formatDeliverableBySubmission(deliverables){
    var x = deliverables.reduce((prev, next) => {
      var objKey = next._id
      var userDel = []
      next.userDeliverables.filter(({src}) => src === 'barcode-scanner')
      .map(del => {
        var userSubmitted = del.submitted.filter(item => {
            var brand = del.type.split('-')[1]
            item.username = next.user_name
            item.store = next.department_name
            item.brand = brand
            return objKey === item.submitted_by
        })
        userDel = userDel.concat(userSubmitted)
      })
      
      prev[objKey] = prev[objKey] = (prev[objKey] || []).concat(userDel)
      return prev
    },{})
    
    var a = []
    Object.keys(x).map(item => {
      a = a.concat(x[item])
    })
    
    return a

}
