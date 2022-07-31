module.exports = (sequelize, Sequelize) => {
  const Genre_film = sequelize.define(
    "genre_film",
    {
      genre_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Genres",
          key: "id",
        },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
      },
      film_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Film",
          key: "id",
        },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Genre_film;
};
