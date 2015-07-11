var React = require('react');
var Reflux = require('reflux');
var request = require('superagent');
var moment = require('moment');

var SettingsStore = require('./settings');
var EmployeeActions = require('../actions/employeeactions');
var CompanyActions = require('../actions/companyactions');
var PayrollActions = require('../actions/payrollactions');
var sortColumn = require('../components/util/sort_column');

var EmployeeStore = Reflux.createStore({

    data: {
        columns: [
            {
                property: 'employeeNum',
                header: 'Number'
            },
            {
                property: 'lastName',
                header: 'Last'
            },
            {
                property: 'firstName',
                header: 'First'
            },
            {
                property: 'employeeType',
                header: 'Emp Type'
            },
            {
                property: 'primaryEmployer',
                header: 'Primary Job',
                cell: function (property, bool) {
                    return {
                        value: bool ? 'yes' : 'no'
                    }
                }
            },
            {
                property: 'payType',
                header: 'Pay Type'
            },
            {
                property: 'payRate',
                header: 'Pay Rate'
            },
            {
                header: 'Edit',
                cell: function (property, value, rowIndex) {
                    return {
                        value: <span className='edit' style={{cursor: 'pointer'}}>
                                <i class="fa fa-edit fa-fw"></i>
                                Edit
                            </span>
                    }
                }
            }
        ],
        employees: [],
        sortIndex: 0,
        defaultEmployeeId: 5
    },

    listenables: [CompanyActions, EmployeeActions],

    init: function () {
        var settings = SettingsStore.getInitialState();
        this.data.sortIndex = settings.employeeDefaultSortIndex;
        this.getEmployees(settings.companyId, true);
    },

    onChangeCompany: function (id) {
        this.getEmployees(id, true);
    },

    // Comes from code. Pass in the name of the (one) property to sort on
    onSortEmployees: function (propName) {
        this.data.employees.sort(function (e1, e2) {
            var p1 = "" || e1[propName];
            var p2 = "" || e2[propName];
            return p1.localeCompare(p2);
        });
    },

    // Comes from user click on a column header.
    onSortEmployeeTable: function (sortedRows) {
        this.data.columns = sortedRows.columns;
        this.data.employees = sortedRows.data;
        this.data.sortIndex = sortedRows.sortIndex;
        this.trigger(this.data);
    },

    onSetDefaultEmployee: function (empId) {
        this.data.defaultEmployeeId = empId;
    },

    // Comes from modal AddTimesheetFormModal
    // TODO assumes biweekly payroll period
    onAddTimesheet: function (empId, payroll, periodId) {
        var startDates = [moment(payroll.startDate), moment(payroll.startDate).add(7, 'days')];
        var endDates = [moment(payroll.startDate).add(6, 'days'), moment(payroll.startDate).add(13, 'days')];
        var timesheet = {
            status: "NEW",
            startDate: startDates[periodId].format(DateFormats.SHORT_ISO),
            endDate: endDates[periodId].format(DateFormats.SHORT_ISO)
        };
        var self = this;
        request
            .post(Config.employeesRestEndpoint + empId + "/timesheets")
            .query({payrollId: payroll.id})
            .send(timesheet)
            .end(function (err, res) {
                if (err == null) {
                    // Timesheet added. Refresh the payroll list.
                    PayrollActions.changePayroll(payroll.id);
                }
                else {
                    // TODO some sort of error message please
                }
            });
    },

    getEmployees: function (companyId, sortTableAfterFetch) {
        var self = this;
        request
            .get(Config.companiesRestEndpoint + companyId + "/employees")
            .end(function (err, res) {
                self.data.employees = res.body.employees;
                if (sortTableAfterFetch) {
                    self.sortEmployeeTable(self.data.sortIndex);
                }
            });
    },

    sortEmployeeTable: function (sortIndex) {
        sortColumn(this.data.columns, this.data.columns[sortIndex], this.data.employees, false, this.onSortEmployeeTable);
    },
    
    getInitialState: function () {
        return this.data;
    }
    
});

module.exports = EmployeeStore;