const cluster = require('cluster');

if (cluster.isMaster) {
    // Count the machine's CPU
    var cpu = require('os').cpus().length;

    console.log('Master cluster setting up ' + cpu + ' workers...');

    // Create a worker for each CPU
    for (let i = 0; i < cpu; i++) {
        cluster.fork();
    }

    // When a worker is online
    cluster.on('online', (worker) => {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // Listen for dying workers
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    require('./server');
}