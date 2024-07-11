const publishBtn = document.getElementById('publishBtn');
const linkInput = document.getElementById('repolink');

function parseLink(link) {
    let url;
    try {
        url = new URL(link);
    } catch (e) {
        throw new Error("Invalid URL format");
    }

    const parts = url.pathname.split("/");

    if (parts.length < 3) {
        throw new Error("Not A Valid GitHub URL");
    };

    const owner = parts[1];
    const repo = parts[2];

    return { owner, repo };
}

async function checkRepo(owner, repo) {

    try {
        let response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            method: 'HEAD',
        });

        if (!response.ok) {
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}

async function publish() {
    let owner, repo;

    try {
        ({ owner, repo } = parseLink(linkInput.value));
    } catch (e) {
        alert(e.message);
        return;
    }

    if (!await checkRepo(owner, repo)) {
        alert("Invalid Repository");
        return;
    }

    window.location.href = getOAuthLink(linkInput.value, owner, repo);
    
}

function getOAuthLink(repolink ,repo, owner) {

    let oauth_link = "https://github.com/login/oauth/authorize?";

    oauth_link += `client_id=Ov23liqZr7tHgzYreUKw`;
    oauth_link += `&redirect_uri=http://localhost:3000/publish`;
    oauth_link += `&scope=repo,user`;
    oauth_link += `&state=${repolink}`

    return oauth_link;
}


publishBtn.addEventListener('click', publish);
