module.exports = (sequelize, DataTypes) => {
  const Investors = sequelize.define(
    "Investors",
    {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "firstName can not be empty" },
          len: [1],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "lastName can not be empty" },
          len: [2],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "email should be unique" },
        validate: {
          isEmail: { msg: "please enter proper email" },
          notEmpty: { msg: "email can not be empty" },
        },
      },
      country: {
        type: DataTypes.STRING,
        // allowNull: false,
        validate: {
          notEmpty: { msg: "country can not be empty" },
          len: [1],
        },
      },
      city: {
        type: DataTypes.STRING,
        // allowNull: false,
        validate: {
          notEmpty: { msg: "city can not be empty" },
          len: [2],
        },
      },
      pnum: {
        type: DataTypes.BIGINT,
        // allowNull: false,
        unique: { msg: "phnoe number should be unique" },
        validate: {
          notEmpty: { msg: "phone number can not be empty" },
          isNumeric: { msg: "phone number should be numeric" },
        },
      },
      password: {
        type: DataTypes.STRING,
        // allowNull: false,
        validate: {
          notEmpty: { msg: "password can not be empty" },
          len: [5],
        },
      },
      RoleId: {
        type: DataTypes.UUID,
        // allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
      linkedinName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: { msg: "linkedin name cannot be empty" },
          len: [2],
        },
      },
      linkedinId: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: { msg: "linkedin id can not be null" },
        },
      },
    },
    {
      freezeTableName: true,
      initialAutoIncrement: 10,
      paranoid: true,
    }
  );
  return Investors;
};
