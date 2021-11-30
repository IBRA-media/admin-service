const siteArray = window.location.pathname.split('/')
const site = siteArray[2]
window.document.title = site.toUpperCase()

const gitPull = function (){
    fetch('/api/gitpull', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(repoID),
    });
}

fetch('/api/getrepos').then((res) =>{
    res.json().then((arg) => {
        for (let i = 0; i < arg.length; i++) {
            if (site === arg[i].repo){
                repoID = {repoID: i} 
            }        
        }
    })
})
