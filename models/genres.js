module.exports = (sequelize, Sequelize) => {
  const Genres = sequelize.define(
    "genres",
    {
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Genres;
};
