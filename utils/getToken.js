const axios = require("axios");


const getToken = async (code) => {

    let token_url = "https://github.com/login/oauth/access_token?";
    token_url += `client_id=${process.env.CLIENT_ID}`;
    token_url += `&client_secret=${process.env.CLIENT_SECRET}`;
    token_url += `&code=${code}`;

    const result = await axios({
        method: 'post',
        url: token_url,
    });

    const token = result.data.split("&")[0].split("=")[1];

    return token;
};


module.exports = getToken;