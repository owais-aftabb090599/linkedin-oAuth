const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const Db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

Db.authenticate()
  .then(() => {
    console.log(`Connected To Db successsfully`);
  })
  .catch((error) => {
    console.log(`error connecting to db`, error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = Db;
db.Users = require("../models/UserModel")(Db, DataTypes);

db.sequelize
  .sync()
  .then(() => {
    console.log(`yes re-sunc`);
  })
  .catch((error) => {
    console.log(`error creating database`, error);
  });

module.exports = db;
