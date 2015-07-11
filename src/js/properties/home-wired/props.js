var host = '192.168.1.164';
var port = ':8080';

module.exports = {
    environment: 'dev',
    localhost: true,
    companiesRestEndpoint: "http://" + host + port + "/payroll/companies/",
    payrollsRestEndpoint: "http://" + host + port + "/payroll/payrolls/",
    employeesRestEndpoint: "http://" + host + port + "/payroll/employees/",
    timesheetsRestEndpoint: "http://" + host + port + "/payroll/timesheets/",
    settingsRestEndpoint: "http://" + host + port + "/payroll/settings/"
};

