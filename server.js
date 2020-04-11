const compute = require('@google-cloud/compute')({
    projectId: 'YOUR_PROJECT_ID',
    keyFilename: 'YOUR_KEY_FILENAME'
});

const fs = require('fs');

const startupScript = new Promise((resolve, reject) => {
    fs.readFile('startup.sh', 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
    });
});

function startServer(reply) {
    const IP = x => x.networkInterfaces[0].accessConfigs[0].natIP;
    const vm = compute.zone('us-central1-c').vm('instance-1');
    const waitForComplete = ([operation, apiResponse]) => new Promise((resolve, reject) => {
        operation.on('complete', resolve);
        operation.on('error', reject);
    });
    const setMetadata = data => vm.setMetadata(data).then(waitForComplete);
    const startVM = () => vm.start().then(waitForComplete);
    const getMetadata = () => vm.getMetadata().then(([metadata, apiResponse]) => metadata);
    startupScript
        .then(script => setMetaData({'startup-script': script}))
        .then(startVM)
        .then(getMetadata)
        .then(IP)
        .then(ip => reply('Game is Ready: ' + ip))
        .catch(console.error);
}

module.exports = { startServer };