const express = require("express");
const cors = require("cors");
const { UserController } = require("./controllers/UserController");
const app = express();
const { User, Message, sequelize } = require("./models");
const passport = require("passport");
const multer = require("multer");
const upload = require("./lib/upload");
const LocalStrategy = require("passport-local").Strategy;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Op } = require("sequelize");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static(__dirname));

app.post("/addUser", UserController.addUser);
app.post("/login", UserController.Login);
app.post("/getUser", UserController.GetUser);
app.post("/Logout", UserController.Logout);
app.post("/getGenres", UserController.getGenres);
app.post("/AddFilm", upload.any(), UserController.AddFilm);
app.post("/getFilms", UserController.getFilms);
app.post("/getFilm", UserController.getFilm);
app.post("/deleteFilm", UserController.deleteFilm);
app.post("/addComment", UserController.addComment);
app.post("/getComments", UserController.getComments);
app.post("/sortFilms", UserController.sortFilms);
app.post("/setRating", UserController.setRating);
app.post("/getProfile", UserController.getProfile);
app.post("/search", UserController.search);
app.post("/getUsers", UserController.getUsers);
app.post("/getMessages", UserController.getMessages);

passport.use(new LocalStrategy(UserController.LoginCheck));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let user = await User.findByPk(id);
  done(null, user);
});

io.on("connection", async (socket) => {
  console.log("a user connected");
  let admin = await User.findOne({ where: { admin: 1 } });
  socket.join("user" + admin.id);

  socket.on("new_message", async (data) => {
    console.log(data);
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let time = hours + ":" + minutes;
    if (data.sender == 1){
      await Message.create({
        text: data.text,
        time: time,
        from_id: admin.id,
        to_id: data.id,
      });
    }
    else {
      await Message.create({
      text: data.text,
      time: time,
      from_id: data.id,
      to_id: admin.id,
    });
    }
    let messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_id: data.id, to_id: admin.id },
          { to_id: data.id, from_id: admin.id },
        ],
      },
    });
    socket.emit("get_messages", messages);
    socket.broadcast.to("user" + data.id).emit("get_messages", messages);
    socket.broadcast.to("user" + admin.id).emit("get_messages", messages);
  });
  socket.on("messages", async (id) => {
    let admin_id = admin.id;
    let messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_id: id, to_id: admin_id },
          { to_id: id, from_id: admin_id },
        ],
      },
    });

    socket.join("user" + id);
    console.log("start", io.sockets);
    socket.emit("get_messages", messages);
  });
});

const connect = app.listen(5000, () => {
  console.log("Started...");
});
io.listen(connect);
