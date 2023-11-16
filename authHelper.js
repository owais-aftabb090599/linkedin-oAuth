// const { default: axios } = require("axios");
// const qs = require("querystring");

// const Authorization = () => {
//   return encodeURI(
//     `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&response_type=code&scope=${process.env.SCOPES}&redirect_uri=${process.env.REDIRECT_URL}`
//   );
// };

// const Redirect = async (code) => {
//   const payload = {
//     client_id: process.env.LINKEDIN_CLIENT_ID,
//     client_secret: process.env.LINKEDIN_CLIENT_SECRET,
//     redirect_uri: process.env.REDIRECT_URL,
//     grant_type: "authorization_code",
//     code: code,
//   };

//   try {
//     const { data } = await axios({
//       url: `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(
//         payload
//       )}`,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     console.log("Response", data);
//     return data;
//   } catch (error) {
//     console.error("Error", error);
//     return error;
//   }
// };

// module.exports = {
//   Authorization,
//   Redirect,
// };
