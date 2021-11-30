const ul = document.getElementById("id_ul");

const gitPull = function (){
    fetch('/api/gitpull', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
        body: 'foo=bar&blah=1'
    });
    // socket.emit('gitPull', { defineRepo: 0 })  
}

const gitClone = function (){
    socket.emit('gitClone', { defineRepo: 0 })  
}

fetch('/api/getrepos').then((res) =>{
    res.json().then((arg) => {
        for (let i = 0; i < arg.length; i++) {
            const li = document.createElement("li");
            var newAnchor = document.createElement("a");
            newAnchor.textContent = arg[i].repo;
            newAnchor.setAttribute('href', "/repo/"+arg[i].repo);
            li.appendChild(newAnchor);
            ul.appendChild(li);
                
        }
    })
})