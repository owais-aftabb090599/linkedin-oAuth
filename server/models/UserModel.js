module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Firstname can not be empty" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Lastname can not be empty" },
          len: [2],
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
        validate: {
          isEmail: { msg: "Invalid Email Address" },
          notEmpty: { msg: "Email address can not be empty" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      RoleId: {
        type: DataTypes.UUID,
      },
      linkedin_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedin_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      initialAutoIncrement: 10,
    }
  );
  return Users;
};
