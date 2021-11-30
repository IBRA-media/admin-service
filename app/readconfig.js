
const fs = require('fs')

const configfile = "config.json"

module.exports.pushrepo = function(newrepo) {
    const obj = JSON.parse(fs.readFileSync(configfile));
    obj.repos.push(newrepo)
    fs.writeFile(configfile, JSON.stringify(obj), err => {
        // error checking
        if(err) throw err;
        
        console.log("New data added");
    });
    return obj
}

module.exports.editLogin = function(newUser) {
    var obj = JSON.parse(fs.readFileSync(configfile));
    obj.gituser = newUser.gituser
    obj.accesstoke = newUser.accesstoke
    fs.writeFile(configfile, JSON.stringify(obj), err => {
        // error checking
        if(err) throw err;
        
        console.log("Git User or access token has been changed");
    }); 
    return obj
}

module.exports.repos = function() {
    var obj = JSON.parse(fs.readFileSync(configfile));
    const data = obj.repos
    return data
}

module.exports.getGitLogin = function() {
    var obj = JSON.parse(fs.readFileSync(configfile));
    const user = obj.gituser
    const token = obj.accesstoke
    const data = {gituser: user, accesstoken: token}
    return data
}

module.exports.gitCloneCmd = function(gitowner, repo) {
    var obj = JSON.parse(fs.readFileSync(configfile));
    const data = `cd /root && git clone https://${obj.gituser}:${obj.accesstoke}@github.com/${gitowner}/${repo}`
    const cmd = `echo "${data}" > /mypipe`
    // echo "cd /root/admin-service && git pull" > /mypipe 
    return cmd
}

module.exports.gitPullCmd = function(defRepo) {
    var obj = JSON.parse(fs.readFileSync(configfile));
    const data = `cd /root${obj.repos[defRepo].repo} && git pull https://${obj.gituser}:${obj.accesstoke}@github.com/${obj.repos[defRepo].gitowner}/${obj.repos[defRepo].repo} ${obj.repos[defRepo].gitbranch}`

    const cmd = `echo "${data}" > /mypipe`
    return cmd
}
