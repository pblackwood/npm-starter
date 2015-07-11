var React = require('react');
var Reflux = require('reflux');
var request = require('superagent');
var SettingsStore = require('./settings');
var PayrollActions = require('../actions/payrollactions');
var CompanyActions = require('../actions/companyactions');
var sortColumn = require('../components/util/sort_column');

var PayrollStore = Reflux.createStore({

    data: {
        columns: [
            {
                property: 'payrollNum',
                header: 'Number',
                sort: -1
            },
            {
                property: 'year',
                header: 'Year',
                sort: -1
            },
            {
                property: 'payrollPeriod',
                header: 'Period'
            },
            {
                property: 'startDate',
                header: 'Period Start',
                sort: -1
            },
            {
                property: 'endDate',
                header: 'Period End',
                sort: -1
            },
            {
                property: 'paycheckDate',
                header: 'Paycheck Date',
                sort: -1
            },
            {
                property: 'totalPayroll',
                header: 'Total Payroll'
            },
            {
                property: 'federalTaxLiability',
                header: 'Fed Liab'
            },
            {
                property: 'stateTaxLiability',
                header: 'State Liab'
            },
            {
                property: 'localTaxLiability',
                header: 'Local Liab'
            },
            {
                property: 'totalTaxLiability',
                header: 'Total Liab'
            }
        ],
        payrolls: [],
        sortIndex: 0,
        timesheets: [],
        defaultPayrollId: 213
    },

    listenables: [CompanyActions, PayrollActions],

    init: function() {
        var settings = SettingsStore.getInitialState();
        this.data.sortIndex = settings.payrollDefaultSortIndex;
        this.getPayrolls(settings.companyId, settings.payrollDefaultSortIndex);
    },

    onChangeCompany: function(id) {
        this.getPayrolls(id, this.data.sortIndex);
    },

    onSortPayrolls: function(sortedRows) {
        this.data.columns = sortedRows.columns;
        this.data.payrolls = sortedRows.data;
        this.data.sortIndex = sortedRows.sortIndex;
        this.trigger(this.data);
    },

    onSetDefaultPayroll: function (payrollId) {
        this.data.defaultPayrollId = payrollId;
    },

    getPayrolls: function(companyId, sortIndex) {
        var self = this;
        request
            .get(Config.companiesRestEndpoint + companyId + "/payrolls")
            .query({payrollCount: 10})
            .end(function (err, res) {
                //sortColumn(self.data.columns, self.data.columns[self.data.sortIndex], res.body.payrolls, false, self.onSortPayrolls);
                // Default sort is payroll number descending
                self.data.payrolls = res.body.payrolls.sort(function (a, b) {
                    return (b.payrollNum - a.payrollNum);
                });

                self.trigger(self.data);
            });
    },

    getInitialState: function () {
        return this.data;
    }

});

module.exports = PayrollStore;