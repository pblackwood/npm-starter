var Reflux = require('reflux');

var TimesheetActions = Reflux.createActions([
        "sortTimesheets",
        "saveTimeEntryHours",
        "changeTimesheet",
            "validateTimePeriod",
            "workflowAction"
    ]
);

module.exports = TimesheetActions;

