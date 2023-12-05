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
const UsersModel = db.Users;
const InvestorModel = db.Investor;

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

const UserAuthorization = (type) => {
  return encodeURI(
    `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.USER_CLIENT_ID}&response_type=code&scope=${process.env.SCOPES}&redirect_uri=${process.env.USER_REDIRECT_URL}`
  );
};
const InvestorAuthorization = () => {
  return encodeURI(
    `https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.INVESTOR_CLIENT_ID}&response_type=code&scope=${process.env.SCOPES}&redirect_uri=${process.env.INVESTOR_REDIRECT_URL}`
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

app.get("/auth/linkedin/user", (req, res) => {
  res.redirect(UserAuthorization());
});

app.get("/auth/linkedin/investor", (req, res) => {
  res.redirect(InvestorAuthorization());
});
app.get("/auth/linkedin/callback/user", async (req, res) => {
  const authorizationCode = req.query.code;
  console.log("authorizationCode", authorizationCode);

  try {
    const payload = {
      client_id: process.env.USER_CLIENT_ID,
      client_secret: process.env.USER_CLIENT_SECRET,
      redirect_uri: process.env.USER_REDIRECT_URL,
      grant_type: "authorization_code",
      code: authorizationCode,
    };

    const tokenResponse = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`
    );

    const access_token = tokenResponse.data.access_token;

    const user_info_url = `https://api.linkedin.com/v2/userinfo`;

    const response = await axios.get(user_info_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = response.data;
    const existingUser = await UsersModel.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      const token = jwt.sign(
        { _id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.redirect(
        `http://127.0.0.1:5173/UserDashboard?authToken=${token}`
      );
    }

    const newUser = await UsersModel.create({
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
      profile_pic: user.picture,
      linkedin_name: user.name,
      linkedin_id: user.sub,
    });

    if (newUser) {
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.redirect(
        `http://127.0.0.1:5173/UserDashboard?authToken=${token}`
      );
    } else {
      return res.redirect("http://127.0.0.1:5173/login");
    }
  } catch (error) {
    console.log(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    return res.json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/auth/linkedin/callback/investor", async (req, res) => {
  const authorizationCode = req.query.code;
  console.log("authorizationCode", authorizationCode);

  try {
    const payload = {
      client_id: process.env.INVESTOR_CLIENT_ID,
      client_secret: process.env.INVESTOR_CLIENT_SECRET,
      redirect_uri: process.env.INVESTOR_REDIRECT_URL,
      grant_type: "authorization_code",
      code: authorizationCode,
    };

    const tokenResponse = await axios.post(
      `https://www.linkedin.com/oauth/v2/accessToken?${qs.stringify(payload)}`
    );

    const access_token = tokenResponse.data.access_token;

    const user_info_url = `https://api.linkedin.com/v2/userinfo`;

    const response = await axios.get(user_info_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const investor = response.data;
    const existingInvestor = await InvestorModel.findOne({
      where: {
        email: investor.email,
      },
    });

    if (existingInvestor) {
      const token = jwt.sign(
        { _id: existingInvestor._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.redirect(
        `http://127.0.0.1:5173/InvestorDashboard?authToken=${token}`
      );
    }

    const newInvestor = await InvestorModel.create({
      firstName: investor.given_name,
      lastName: investor.family_name,
      email: investor.email,
      country: investor.locale.country,
      linkedinName: investor.name,
      linkedinId: investor.sub,
    });

    if (newInvestor) {
      const token = jwt.sign({ _id: newInvestor._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.redirect(
        `http://127.0.0.1:5173/InvestorDashboard?authToken=${token}`
      );
    } else {
      return res.redirect("http://127.0.0.1:5173/login");
    }
  } catch (error) {
    console.log(
      "Error fetching investor profile:",
      error.response?.data || error.message
    );
    return res.json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/getUserInfo", async (req, res) => {
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log(decoded);
    const UserData = await UsersModel.findOne({
      _id: decoded._id,
    });
    if (!UserData) {
      return res.json({
        message: "user not found",
      });
    }
    return res.json({
      user: UserData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});
app.get("/getUserInfo2", async (req, res) => {
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log(decoded);
    const InvestorData = await InvestorModel.findOne({
      _id: decoded._id,
    });
    if (!InvestorData) {
      return res.json({
        message: "user not found",
      });
    }
    return res.json({
      user: InvestorData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});


app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
