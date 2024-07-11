const AppError = require("../error/AppError");

function parseLink(link) {

    url = new URL(link);

    const parts = url.pathname.split("/");

    if (parts.length < 3) {
        throw new AppError("Not A Valid GitHub URL", 400);
    };

    const owner = parts[1];
    const repo = parts[2];

    return { owner, repo };
}

module.exports = parseLink;