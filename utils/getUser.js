const axios = require("axios");


const getUser = async (token) => {

    const user = await axios({
        method: "get",
        url: "https://api.github.com/user",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return user.data;
}


module.exports = getUser;