const userBox = document.getElementById("GITUSER");
const tokenBox = document.getElementById("ACCESSTOKEN");

const gitPull = function (){
    fetch('/api/gitpull', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(repoID),
    });
}

fetch('/api/getlogin').then((res) =>{
    res.json().then((arg) => {
        userBox.value = arg.gituser
        tokenBox.value = arg.accesstoken
    })
})

const editLogin = function (){
    const user = document.getElementById("GITUSER").value
    const token = document.getElementById("ACCESSTOKEN").value
    
    obj = { 
        gituser: user,
        accesstoke: token
    } 
    
    fetch('/api/changelogin', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj),
    });
}