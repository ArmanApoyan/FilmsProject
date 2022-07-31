module.exports = (sequelize, Sequelize) => {
  const Rating = sequelize.define(
    "rating",
    {
      rating: {
        type: Sequelize.STRING,
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
      user_id: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Rating;
};
