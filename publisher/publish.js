const { updateRegistry, run, publishPackage, downloadPackage, resetRegistry, gitCmd, switchToNewBranch } = require('./gitUtils');
const { isPath, mkPath, copyPackageToRegistry, clearPublish } = require('./fileUtils');
const { compilePackage } = require('./compilerUtils.js');
const parseUrl = require('../utils/parseRepoLink.js');
const path = require('path');
const AppError = require('../error/AppError.js');

function getVersion(pkgFolder) { // not sure if this is the right way to get the version
    return "0.0.5";
    const pkgJson = require(path.join(pkgFolder, 'package.json'));
    return pkgJson.version;
}


async function publish(registryPath, registryUrl, pkgRepo, downloadsFolder, author) {

    if(!pkgRepo || !registryPath || !registryUrl){
        throw new AppErrorError('Can\'t publish: Missing parameters', 400);
    }

    const git = gitCmd(registryPath);

    updateRegistry(git, registryPath, registryUrl);

    const parts = parseUrl(pkgRepo);
    const owner = parts.owner;
    const packageName = parts.repo;

    const pkgFolder = downloadPackage(pkgRepo, packageName, downloadsFolder);

    const mainfilePath = await compilePackage(pkgFolder, packageName);

    const newVersion = getVersion(pkgFolder);

    const branchName= `${author}-${packageName}-${newVersion}-${Date.now()}`;
    switchToNewBranch(git, branchName);

    copyPackageToRegistry(mainfilePath, registryPath, author, packageName, newVersion);
    publishPackage(git, newVersion, branchName);
}

module.exports = { publish };
