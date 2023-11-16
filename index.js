require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expressSession = require("express-session");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const { default: axios } = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
const Users = db.Users;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

const Authorization = () => {
  return encodeURI(
    `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.LINKEDIN_CLIENT_ID}&response_type=code&scope=${process.env.SCOPES}&redirect_uri=${process.env.REDIRECT_URL}`
  );
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/auth/linkedin", (req, res) => {
  res.redirect(Authorization());
});

app.get("/auth/linkedin/callback", async (req, res) => {
  const authorizationCode = req.query.code;
  console.log("authorizationCode", authorizationCode);
  // making payload for accessToken api:
  try {
    const payload = {
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URL,
      grant_type: "authorization_code",
      code: authorizationCode,
    };

    // hitting accessToken api and sending payload in responce:
    const tokenResponse = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // getting accessToken from the api hitted above:
    const accessToken = tokenResponse.data.access_token;
    console.log("accessToken", accessToken);

    // now hitting linkedin userinfo api and sending Bearer token init to get user information
    const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("User Profile:", response.data);
    const existingUser = await Users.findOne({
      where: {
        email: response.data.email,
      },
    });

    if (existingUser) {
      // User already exists, redirect to dashboard
      return res.redirect("/dashboard");
    }

    // User does not exist, create a new user in the database
    const newUser = await Users.create({
      firstName: response.data.given_name,
      lastName: response.data.family_name,
      email: response.data.email,
      image: response.data.picture,
    });

    if (newUser) {
      // User created successfully, redirect to login
      return res.redirect("/login");
    } else {
      // Handle the case where user creation failed, redirect to dashboard
      return res.redirect("/dashboard");
    }
  } catch (error) {
    console.log(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    return res.redirect("/login");
  }
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
