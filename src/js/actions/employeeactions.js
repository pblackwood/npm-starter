var Reflux = require('reflux');

var EmployeeActions = Reflux.createActions([
        "sortEmployees",
        "sortEmployeeTable",
        "changeEmployee",
        "setDefaultEmployee",
        "addTimesheet"
    ]
);

module.exports = EmployeeActions;

