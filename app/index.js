
const path = require('path')
const http = require('http')
const express = require('express')
const basicAuth = require('express-basic-auth');

const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

const { gitClone, gitPull }  = require('./git')

const { repos, getGitLogin, pushrepo, editLogin } = require('./readconfig');
const { checkConfigFile } = require('./check-for-config');

checkConfigFile()

app.use(basicAuth({
    users: { 
        'adminuser': `${process.env.PASSWORD}`
    },
    challenge: true,
    realm: 'Imb4T3st4pp',
    unauthorizedResponse: getUnauthorizedResponse
}))
 
function getUnauthorizedResponse(req) {
    return req.auth
        ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
        : 'No credentials provided'
}

app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: '1mb'}))

app.get('/repo/:repo', (req, res) => {
    const repo = repos()
    for (let i = 0; i < repo.length; i++) {
        if (req.params.repo === repo[i].repo){
            
            res.sendFile('public/repos/repo.html', {  root: __dirname });
            
        }   
    }
    
    
})
app.get('/settings', (req, res) => {
    res.sendFile('public/settings.html', {  root: __dirname });
})

app.get('/new', (req, res) => {
    res.sendFile('public/new.html', {  root: __dirname });
})

app.get('/api/getrepos', function (req, res) {
    const repo = repos()
    res.send(repo)
})
app.get('/api/getlogin', function (req, res) {
    const logins = getGitLogin()
    res.send(logins)
})
app.post('/api/gitpull', function (req, res) {
    // console.log(req)
    const arg = req.body.repoID
    // console.log(arg)
    res.status(201).send('status 201')
    gitPull(arg)
})
app.post('/api/gitclone', function (req, res) {
    const arg = req.body
    const owner = JSON.stringify(arg.gitowner)
    const repo = JSON.stringify(arg.repo)
    const branch = JSON.stringify(arg.gitbranch)
    console.log(branch)
    pushrepo(arg)
    setTimeout(gitClone,1000, owner, repo, branch)
    
    res.status(201).send('status 201')
})
app.post('/api/changelogin', function (req, res) {
    editLogin(req.body)
    res.status(201).send('status 201')
})
// app.post('/api/addrepo', function (req, res) {
//     const arg = req.body
//     console.log(arg)
//     pushrepo(arg) 
//     res.status(201).send('status 201')
// })

app.use('/',express.static(publicDirectoryPath))

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})