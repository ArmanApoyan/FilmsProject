const passport = require("passport");
const {
  User,
  Genres,
  Film,
  Genre_film,
  sequelize,
  Comment,
  Rating,
  Message
} = require("../models");
const bcrypt = require("bcrypt");
const genres = require("../models/genres");
const fs = require("fs");


class UserController {
  static async addUser(req, res) {
    req.body.data.password = await bcrypt.hash(req.body.data.password, 10);
    let result = await User.create({ ...req.body.data });
    res.send({ status: "OK" });
  }

  static async GetUser(req, res) {
    res.send({ user: req.user });
  }

  static async LoginCheck(username, password, done) {
    let user = await User.findOne({ where: { login: username } });

    if (!user) {
      return done(null, false);
    }

    let result = await bcrypt.compare(password, user.password);
    if (!result) {
      return done(null, false);
    }

    return done(null, user);
  }
  static Login(req, res, next) {
    passport.authenticate("local", function (err, user, info) {
      if (user) {
        req.logIn(user, (err) => {
          if (err) {
            res.send({ error: "Something went wrong" });
          }
          res.send({ verify: true, user: req.user });
        });
      } else {
        res.send({ error: "User Not Found" });
      }
    })(req, res, next);
  }
  static Logout(req, res) {
    req.logout();
    res.send({ status: "OK" });
  }
  static async getGenres(req, res) {
    let genres = await Genres.findAll();
    res.send({ genres });
  }
  static async AddFilm(req, res) {
    let data = JSON.parse(req.body.data);
    console.log(data);
    console.log(req.files);
    let genres = data.genres;
    let film = await Film.create({
      ...data,
      photo: req.files[0].filename,
      video: req.files[1].filename,
    });
    for (let i = 0; i < genres.length; i++) {
      await Genre_film.create({ genre_id: genres[i], film_id: film.id });
    }
    res.send({ status: "OK" });
  }
  static async getFilms(req, res) {
    let films = await Film.findAll({ include: { all: true, nested: true } });
    res.send({ films });
  }
  static async getFilm(req, res) {
    let id = req.body.id;
    let film = await Film.findByPk(id, {
      include: { all: true, nested: true },
    });
    res.send({ film });
  }
  static async deleteFilm(req, res) {
    let id = req.body.id;
    let film = await Film.findByPk(id)
    console.log(film);
    await Film.destroy({ where: { id: id } });
    fs.unlink(`static/images/${film.photo}`, (err) => {
      if (err) {
        console.error(err)
      }
      else {
        console.log("Succesfully Deleted");
      }
    })
    fs.unlink(`static/images/${film.video}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Succesfully Deleted");
      }
    });
    let films = await Film.findAll({ include: { all: true, nested: true } });
    res.send({ films });
  }
  static async addComment(req, res) {
    let id = req.body.id;
    let comment = req.body.data.comment;
    let user_name = req.user.name;
    let user_surname = req.user.surname;
    await Comment.create({
      text: comment,
      film_id: id,
      user_name: user_name,
      user_surname: user_surname,
    });
    let comments = await Comment.findAll({ where: { film_id: id } });
    res.send({ comments });
  }
  static async getComments(req, res) {
    let { id } = req.body;
    let comments = await Comment.findAll({ where: { film_id: id } });
    res.send({ comments });
  }
  static async sortFilms(req, res) {
    for (let i in req.body.data) {
      if (req.body.data[i].length < 1 || req.body.data[i] == false) {
        delete req.body.data[i];
      }
    }
    if (Object.keys(req.body.data).length == 0) {
      let films = await Film.findAll({ include: { all: true, nested: true } });
      res.send({ films });
    } else {
      let category = [];
      if (req.body.data.category) {
        category = [...req.body.data.category];
        delete req.body.data.category;
      }
      let films = await Film.findAll({
        where: { ...req.body.data },
        include: [
          {
            model: Genre_film,
            where: {
              genre_id: category.length > 0 ? category?.map((el) => el) : "1=1",
            },
            include: [{ model: Genres }],
          },
        ],
      });
      res.send({ films });
    }
  }
  static async setRating(req, res) {
    let rating = await Rating.findOne({
      where: { user_id: req.user.id, film_id: req.body.film_id },
    });
    if (rating) {
      return
    }
    await Rating.create({ rating: req.body.id, film_id: req.body.film_id, user_id:req.user.id });
  }
  static async getProfile(req, res) {
    let profile = req.user
    res.send({ profile });
  }
  static async search(req, res) {
    let search = req.body.data.search
    console.log(search);
    let films = await sequelize.query(`
    SELECT * FROM film WHERE name LIKE '%${search}%'
    `)
    res.send({films:films[0]})
  }
  static async getUsers(req, res) {
    let users = await User.findAll({
      where: { admin: 0 },
    });
    res.send({users})
  }
  static async getMessages(req, res) {
    let { id } = req.body
    let messages = await Message.findAll({ where: { from_id: id } })
    res.send({messages})
  }
}
module.exports = { UserController };
