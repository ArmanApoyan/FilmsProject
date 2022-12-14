module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      "users",
      {
        name: {
          type: Sequelize.STRING,
        },
        surname: {
          type: Sequelize.STRING,
        },
        login: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
        verify: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        token: {
          type: Sequelize.STRING,
        },
        admin: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
    return User
}