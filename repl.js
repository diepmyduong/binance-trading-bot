const { ServiceBroker } = require('moleculer');
const broker = new ServiceBroker();
broker.loadServices(folder = "dist/services", fileMask = "**/*.service.js");
broker.start().then(() => {
    // Start REPL
    broker.repl();
    // broker.call('ESMS.brandNames').then(console.log);
});node