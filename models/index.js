const { Sequelize } = require("sequelize");
const config = { DB: "testing", USER: "root", PASSWORD: "" };
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

const User = require("./user")(sequelize, Sequelize);
const Genres = require("./genres")(sequelize, Sequelize);
const Film = require("./film")(sequelize, Sequelize);
const Genre_film = require("./genre_film")(sequelize, Sequelize);
Genre_film.belongsTo(Film, { foreignKey: "film_id" });
Genre_film.belongsTo(Genres, { foreignKey: "genre_id" });
Film.hasMany(Genre_film, { foreignKey: "film_id" })
const Comment = require("./comment")(sequelize, Sequelize);
Film.hasMany(Comment, { foreignKey: "film_id" });
const Rating = require("./rating")(sequelize, Sequelize);
Film.hasMany(Rating, { foreignKey: "film_id" });
const Message = require("./Message")(sequelize, Sequelize);

sequelize.sync();

module.exports = {
  sequelize,
  User,
  Genres,
  Film,
  Genre_film,
  Comment,
  Rating,
  Message,
};
