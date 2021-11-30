
const fs = require('fs')
const exec = require('child_process').exec

const configfile = 'config.json'

module.exports.checkConfigFile = function (){
    fs.access(configfile, fs.constants.F_OK, (err) => {
        if (err){
            const cmd = `cp ./config-example.json ./config.json`
            exec(cmd,
            function (error, stdout, stderr) {
                console.log('Made a copy of config-example.json');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
         } else{
            console.log('Config file already existst. Ready to rock!')
         }
      });
    };