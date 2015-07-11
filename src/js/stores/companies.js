var React = require('react');
var Reflux = require('reflux');
var request = require('superagent');
var CompanyActions = require('../actions/companyactions');
var SettingsStore = require('./settings');

var CompanyStore = Reflux.createStore({

    data: {
        company: {
        }
    },

    listenables: [CompanyActions],

    init: function() {
        var settings = SettingsStore.getInitialState();
        this.data.company.id = settings.companyId;
        this.getCompany(settings.companyId);
    },

    onChangeCompany: function(id) {
        this.getCompany(id);
    },

    getCompany: function(id) {
        var self = this;
        request
            .get(Config.companiesRestEndpoint + id)
            .end(function (err, res) {
                self.data.company = res.body;
                self.trigger(self.data);
            })
    },

    getInitialState: function () {
        return this.data;
    }
});

module.exports = CompanyStore;

