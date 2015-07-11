var Reflux = require('reflux');

var PayrollActions = Reflux.createActions([
        "sortPayrolls",
        "changePayroll",
        "setDefaultPayroll"
    ]
);

module.exports = PayrollActions;

