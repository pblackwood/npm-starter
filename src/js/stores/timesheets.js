var React = require('react');
var Reflux = require('reflux');
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var request = require('superagent');
var moment = require('moment');
var SettingsStore = require('./settings');
var CompanyActions = require('../actions/companyactions');
var PayrollActions = require('../actions/payrollactions');
var TimesheetActions = require('../actions/timesheetactions');

var TimesheetsStore = Reflux.createStore({

    data: {
        columns: [

            {
                property: 'timesheetNum',
                header: 'Number',
                sort: -1
            },
            {
                property: 'employeeName',
                header: 'Employee',
                sort: -1
            },
            {
                property: 'startDate',
                header: 'Starts',
                sort: -1
            },
            {
                property: 'endDate',
                header: 'Ends',
                sort: -1
            },
            {
                property: 'totalHours',
                header: 'Total Hours',
                sort: -1
            },
            {
                property: 'status',
                header: 'Status'
            },
            {
                cell: function(property, value, rowIndex, columnIndex) {
                    var edit = function() {
                        var schema = {
                            type: 'object',
                            properties: ['Number','Employee','Starts','Ends','Total Hours','Status']
                        };

                        var onSubmit = function(data, value, errors) {
                            this.refs.modal.hide();

                            if(value === 'Cancel') {
                                return;
                            }

                            this.state.data[rowIndex] = data;

                            this.setState({
                                data: this.state.data
                            });
                        };

                        this.setState({
                            modal: {
                                title: 'Edit',
                                content: <Form
                                    buttons={['OK', 'Cancel']}
                                    schema={schema}
                                    validate={validate}
                                    values={this.state.data[rowIndex]}
                                    onSubmit={onSubmit}
                                ></Form>
                            }
                        });

                        this.refs.modal.show();
                    };

                    var remove = function() {
                        // this could go through flux etc.
                        this.state.data.splice(rowIndex, 1);

                        this.setState({
                            data: this.state.data
                        });
                    };

                    return {
                        value:
                            <Button className="btn btn-warning btn-xs"><Glyphicon glyph="pencil" /></Button>
                    };
                }
            }
        ],
        employeesByPayroll: {},
        timesheets: {},
        sortIndex: 0,
        currentPeriod: 0
    },

    listenables: [CompanyActions, PayrollActions, TimesheetActions],

    init: function() {
        var settings = SettingsStore.getInitialState();
        this.data.sortIndex = settings.timesheetsDefaultSortIndex;
        //this.getEmployeesWithTimesheets(settings.companyId, settings.payrollId, settings.timesheetsDefaultSortIndex);
    },

    onChangeCompany: function (id) {
        this.employeesByPayroll = {};
    },

    onSortTimesheets: function(sortedRows) {
        this.data.columns = sortedRows.columns;
        this.data.timesheets = sortedRows.data;
        this.data.sortIndex = sortedRows.sortIndex;
        this.trigger(this.data);
    },

    onSaveTimeEntryHours: function (timesheet, timeentry, hours) {
        this.saveHours(timesheet, timeentry, hours);
    },

    // Will be fired when the user clicks on a payroll in the payroll list
    onChangePayroll: function (payrollId) {
        this.getEmployeesWithTimesheets(SettingsStore.getSetting('companyId'), payrollId, this.data.sortIndex);
    },

    // Will be fired when the user views a timesheet in the employee list
    onChangeTimesheet: function (employeeId, timesheetId) {
        this.getExpandedTimesheet(employeeId, timesheetId);
    },

    // Will be fired when the user chooses a timesheet period from a modal
    // TODO assumes bi-weekly pay period
    onValidateTimePeriod: function (payrollId, employeeId, period) {
        this.data.validationError = "";
        var emps = this.data.employeesByPayroll[payrollId];
        var emp;
        if (emps) {
            for (var i = 0; i < emps.length; ++i) {
                if (emps[i].id == employeeId) {
                    emp = emps[i];
                    break;
                }
            }
        }
        if (emp && emp.timesheets) {
            var ts;
            for (var i = 0; i < emp.timesheets.length; ++i) {
                if (emp.timesheets[i].id == timesheetId) {
                    ts = emp.timesheets[i];
                    break;
                }
            }
            if (ts) {

                this.data.validationError = "A timesheet already exists for this employee and time period";
                this.trigger(this.data.validationError);
            }
        }
    },

    onWorkflowAction: function (actionName, timesheet) {
        console.log("Hey! Nice click on the " + actionName + " button!");
        var ts = this.data.timesheets[timesheet.id];
        switch (actionName) {
            case 'submit':
                ts.status = "SUBMITTED";
                break;
            case 'approve':
                ts.status = "APPROVED";
                break;
            case 'reject':
                ts.status = "REJECTED";
                break;
            case 'delete':
                ts.status = "DELETED";
                break;
        }
        var self = this;
        // The PUT request saves only the top-level properties of the timesheet.
        // Does not affect the time entries or the computed fields, like total hours.
        request
            .put(Config.timesheetsRestEndpoint + ts.id)
            .send(ts)
            .end(function (err, res) {
                if (err == null) {
                    self.data.timesheets[ts.id] = self.decorateTimesheet(res.body);
                    self.trigger(self.data);
                }
                else {
                    // TODO some sort of error message here please
                }
            });
    },

    // Validate the entry first for legit times
    computeTime: function(timeEntry) {
        return 4;
    },

    getEmployeesWithTimesheets: function (companyId, payrollId, sortIndex) {
        var self = this;
        request
            .get(Config.companiesRestEndpoint + companyId + "/employees")
            .query({payrollId: payrollId})
            .end(function (err, res) {
                self.data.employeesByPayroll[payrollId] = res.body.employees;
                self.trigger(self.data);
            });
    },

    getExpandedTimesheet: function (employeeId, timesheetId) {
        var self = this;
        request
            .get(Config.timesheetsRestEndpoint + timesheetId + "/timeentries")
            .end(function (err, res) {
                self.data.timesheets[timesheetId] = self.decorateTimesheet(res.body);
                self.trigger(self.data);
            });
    },

    saveHours: function (timesheet, timeentry, hours) {
        var self = this;
        timeentry.hours = hours;
        if (timeentry.id) {
            request
                .put(Config.timesheetsRestEndpoint + timesheet.id + "/timeentries/" + timeentry.id)
                .send(timeentry)
                .end(function (err, res) {
                    self.data.timesheets[timesheet.id] = self.decorateTimesheet(res.body);
                    self.trigger(self.data);
                });
        }
        else {
            request
                .post(Config.timesheetsRestEndpoint + timesheet.id + "/timeentries")
                .send(timeentry)
                .end(function (err, res) {
                    self.data.timesheets[timesheet.id] = self.decorateTimesheet(res.body);
                    self.trigger(self.data);
                });
        }
    },

    getInitialState: function () {
        return this.data;
    },

    // Is this cheating? I'm changing the way time entries are represented on the client
    // TODO assumes there are always 7 days in a timesheet
    decorateTimesheet: function (timesheet) {
        // They come from the server as a list without placeholders for zero hours
        var entryList = timesheet.timeentries;
        timesheet.timeentries = [];
        for (var day = 0; day < 7; ++day) {
            var found = false;
            for (var i in entryList) {
                if (entryList[i].day == day) {
                    timesheet.timeentries.push(entryList[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                timesheet.timeentries.push({
                    day: day,
                    date: moment(timesheet.startDate).add(day, "days").format("YYYY-MM-DD"),
                    hours: 0
                });
            }
        }
        return timesheet;
    }
});

module.exports = TimesheetsStore;

