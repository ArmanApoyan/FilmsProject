module.exports = (sequelize, Sequelize) => {
  const Film = sequelize.define(
    "film",
    {
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      producer: {
        type: Sequelize.STRING,
      },
      actors: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      translation: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
      },
      video: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Film;
};
