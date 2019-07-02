'use strict';

let fs = require('fs');

fs.readFile('./src/router.js', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }

    console.log('=============================');
    console.log('copy index.html start!');
    console.log('=============================');
    let dataStr = data.toString();
    let routerArray = dataStr.match(/path=[\'\"][a-zA-Z]+/g);
    routerArray.forEach(function(router) {
        fs.mkdir('./dist/' + router.slice(6), function(mkdirErr) {
            if (mkdirErr) {
                throw mkdirErr;
            }
            fs.linkSync('./src/indexforpages.html', './dist/' + router.slice(6) + '/index.html');
        });
    });
    console.log('=============================');
    console.log('copy index.html success!!');
    console.log('=============================');
    fs.linkSync('./favicon.ico', './dist/favicon.ico');
});
