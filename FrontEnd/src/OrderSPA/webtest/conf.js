exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['order-spec.js'],
    framework: 'jasmine2',
    // Options to be passed to Jasmine-node.
    onPrepare: function () {
        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            filePrefix: 'guitest-xmloutput',
            savePath: './results'
        }));
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 450000
    }
};