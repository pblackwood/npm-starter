var $ = jQuery = require('jquery');
require('bootstrap');
_ = require('lodash');
DateFormats = require('./components/util/dateformats');
Config = require('./properties/props');

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Header = require('./components/header/app-header');
var PayrollHome = require('./components/payroll/PayrollList');
var EmployeeHome = require('./components/employees/app-employee');
var CompanyHome = require('./components/company/app-company');
var CompanyStore = require('./stores/companies');
var Reflux = require('reflux');

var App = React.createClass({

    mixins: [Reflux.connect(CompanyStore)],

    render: function () {
        return (
            <div className="payroll-main">
                <Header companyName={this.state.company.name} />
                <div className="payroll container">
                    <RouteHandler />
                </div>
            </div>
        );
    }
});

var routes =
    <Route name="app" path="/" handler={App}>
        <Route name="payroll" handler={PayrollHome}/>
        <Route name="employees" handler={EmployeeHome}/>
        <Route name="company" handler={CompanyHome}/>
        <Route name="home" handler={CompanyHome}/>
        <DefaultRoute handler={CompanyHome}/>
    </Route>
;

Router.run(routes, function (Handler) {
    React.render(<Handler />, document.getElementById('main'));
});

