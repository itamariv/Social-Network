const express = require("express");
var fs = require("fs");
const user = require("./user");
const jwt = require("jsonwebtoken");
const posts = require("./post");
const message = require("./Message");
var cors = ("cors");

const cookieParser = require("cookie-parser");
const path = require("path");
const createPost = posts.createPost;

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
    //optionSuccessStatus:200,
  })
);
const port = process.env.PORT || 2718;
app.use(cookieParser());


app.use(express.json()); // to support JSON-encoded bodies
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static("public"));
//User Imports
const isAdmin = user.isAdmin;
const changeUserStatus = user.changeUserStatus;
const isActive = user.isActive;
const deleteUser = user.deleteUser;
const deletePost = user.deletePost;
const validateAdmin = user.validateAdmin;

// verifyToken function
const verifyToken = (req, res, next) => {
  const bearerHeader = req.cookies.token; //req.headers["authorization"]; //cookies['token']; //
  //   req.token = token;
  // req.authData = authData;
  const token = bearerHeader; //&& bearerHeader.split(" ")[1];
  //res.send(token)
  if (typeof token == "undefined") {
    res.status(403).send("No token ");
    return;
  }
  next();
  // jwt.verify(token, "secretToken", (err, authData) => {
  //   if (err) {
  //     res.status(403).send(token);
  //     return;
  //   }

  //   console.log("verify token");
  //   try {
  //     next();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // }
};

app.get("/isAdmin", verifyToken, (req, res) => {
  console.log("/isAdmin called");
  user.validateAdmin(req, res);
});

app.get("/isloggedin", (req, res) => {
  const result = user.findUserByToken(req.cookies.token);
  if (typeof result !== "undefined") {
    res.status(200);
  } else {
    res.status(204);
  }
});

// example
app.get("/example", (req, res) => {
  res.json({ message: "Looks good to me!" });
});

//*********************** USER ACTIONS **************/
//**** Create New Post *//
app.post("/user/post", verifyToken, isActive, (req, res) => {
  createPost(req, res);
});

//**** Delete Post (User method) *//
app.post("/user/deletepost", verifyToken, isActive, (req, res) => {
  user.deleteMyPost(req, res);
});
//**** Create New User *//
app.post("/user/create", (req, res) => {
  user.create_user(req, res);
});

//**** Login *//
app.post("/user/login", async (req, res) => {
  await user.login(req, res);
});

//*** Get User's List  */
app.get("/user/getUsers", verifyToken, (req, res) => {
  user.get_users(req, res);
});

//**** Logout *//
app.post("/user/logout", verifyToken, (req, res) => {
  user.logout(req, res);
});

//**** Send a Message *//
app.post("/user/message", verifyToken, isActive, (req, res) => {
  message.createMessage(req, res);
});

//**** Display All Posts *//
app.get("/user/showPosts", verifyToken, isActive, (req, res) => {
  posts.showAllPosts(req, res);
});

//**** Display All Received Messages *//
app.get("/user/showMailbox", verifyToken, isActive, (req, res) => {
  user.showMailbox(req, res);
});

///** get all sent messages */
app.get("/user/sentmsgs", verifyToken, isActive, (req, res) => {
  user.getSentMsgs(req, res);
});

//get info//
app.get("/user/myinfo", verifyToken, (req, res) => {
  user.getInfo(req, res);
});
//*********************** ADMIN ACTIONS **************/

//**** Activate User *//

app.post("/admin/activate", verifyToken, isAdmin, (req, res) => {
  user.activateUser(req, res);
});

//**** Delete User *//
app.post("/admin/deleteuser", verifyToken, isAdmin, (req, res) => {
  deleteUser(req, res);
});

//**** Delete Post *//
app.post("/admin/deletepost", verifyToken, isAdmin, (req, res) => {
  deletePost(req, res);
});

//**** List All Users *//
app.get("/admin/listusers", verifyToken, isAdmin, (req, res) => {
  user.get_users(req, res);
});

//**** Suspend User *//
app.post("/admin/suspend", verifyToken, isAdmin, (req, res) => {
  user.suspendUser(req, res);
});

//**** Restore User *//
app.post("/admin/restore", verifyToken, isAdmin, (req, res) => {
  user.restoreUser(req, res);
});

//**** Message All Users *//
app.post("/admin/messageAll", verifyToken, isAdmin, (req, res) => {
  user.messageAll(req, res);
});

// function saveJWTinCookie({res}){
//   saveJWTinCookie()
// }

//************** Activate Server **************//

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
