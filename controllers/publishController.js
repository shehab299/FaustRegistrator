const path = require('path');
const asyncDec = require('../error/asyncDec.js');
const AppError = require('../error/AppError.js');
const getToken = require('../utils/getToken');
const {publish} = require('../publisher/publish');
const getUser = require('../utils/getUser');
const checkCollaborators = require("../utils/checkCollaborators");
const parseLink = require('../utils/parseRepoLink');

function getPublisher(req,res){
    const p = path.join(__dirname ,'..', 'views', 'index.html');
    res.sendFile(p);
}

async function publishCont(req, res){

    if (!req.query || !req.query.code || !req.query.state) 
        throw new AppError("Invalid Request", 400);

    const code = req.query.code;
    const pkgurl = req.query.state;

    if(!pkgurl)
        throw new AppError("Invalid Request", 400);    

    const { owner, repo } = parseLink(pkgurl);

    const token = await getToken(code);
    const user = await getUser(token);

    const isCollab = await checkCollaborators(user.login, owner, repo, token);

    if(!isCollab){
        throw new AppError("You Are Not A collaborator", 400);
    }

    const username = user.login;
    const pkgUrl = pkgurl;
    const registryUrl = process.env.REGISTRY_URL;
    const registryPath = process.env.REGISTRY_PATH;
    const downloadsFolder = process.env.DOWNLOADS_FOLDER;

    await publish(registryPath, registryUrl, pkgUrl, downloadsFolder, username);

    res.redirect('/success');
}

async function success(req,res){
    res.sendFile(path.join(__dirname, '..', 'views', 'sucess.html'));
}


module.exports = {
    getPublisher,
    success,
    publish: asyncDec(publishCont)
}




