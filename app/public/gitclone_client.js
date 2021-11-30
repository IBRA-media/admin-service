const gitClone = function (){
    const owner = document.getElementById("GITURL").value.split('/')[3]
    const repo = document.getElementById("GITURL").value.split('/')[4].split('.')[0]
    const branch = document.getElementById("BRANCH").value
    
    repoID = { 
        gitowner: owner,
        repo: repo,
        gitbranch: branch
    } 
    
    fetch('/api/gitclone', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(repoID),
    });
}