var React = require('react');
var Reflux = require('reflux');
var CompanyActions = require('../actions/companyactions');
var PayrollActions = require('../actions/payrollactions');

var SettingsStore = Reflux.createStore({

    settings: {
        companyId: 100,
        payrollId: 208,
        payrollDefaultSortIndex: 0,
        employeeDefaultSortIndex: 0,
        timesheetsDefaultSortIndex: 0
    },

    listenables: [CompanyActions, PayrollActions],

    init: function() {
        // So this is where we would read all the setting in from Mongo
    },

    onChangeCompany: function(id) {
        this.settings.companyId = id;
        // Save company id to Mongo
        //this.trigger(this.settings.companyId);
    },

    onSortPayrolls: function(sortedRows) {
        this.settings.payrollDefaultSortIndex = sortedRows.sortIndex;
        // Save index to Mongo
        //this.trigger(this.settings.payrollDefaultSortIndex);
    },

    getInitialState: function () {
        return this.settings;
    },

    getSetting: function (name) {
        return this.settings[name];
    }
});

module.exports = SettingsStore;