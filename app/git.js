
const exec = require('child_process').exec
const fs = require('fs')

module.exports.gitClone = function(gitowner, repo, branch) {
   const gitCloneCmd = require('./readconfig').gitCloneCmd(gitowner, repo)
   exec(gitCloneCmd,
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
      gitCheckoutBranch(repo, branch)
   });
}   

module.exports.gitPull = function(defineRepo) {
   const gitPullCmd = require('./readconfig').gitPullCmd(defineRepo)
   exec(gitPullCmd, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });
} 

const gitCheckoutBranch = function(repo, branch) {
   const branchCmd = `cd ${repo} && git checkout ${branch}`
   exec(branchCmd,
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });
}  