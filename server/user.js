var fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const crypto = require("crypto");
const StatusCodes = require("http-status-codes").StatusCodes;
var jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const { sendFile } = require("express/lib/response");
const res = require("express/lib/response");
const cookieParser = require("cookie-parser");
const tokenById = require("./database/token_by_id.json");

//JS files
const message = require("./Message");

//Databases
const messages_list = require("./database/messages.json");
const posts_list = require("./database/posts.json");
const users_list = require("./database/users.json");

//**** Find User By Token *****//
const findUserByToken = async (token) => {
  const res1 = await fsPromise.readFile(
    path.resolve(__dirname, "./database/token_by_id.json"),
    "utf8"
  );
  const currentTokenById = await JSON.parse(res1);
  const map2 = new Map(Object.entries(currentTokenById));

  const tokenObject = map2.get(token);
  return tokenObject;
};

//**** Delete Post (User method) *****//
const deleteMyPost = async (req, res) => {
  if (typeof req.cookies.token != "undefined") {
    const user = await findUserByToken(req.cookies.token); //find user who sent the request
    const postID = req.body.postID; //received id of post to be deleted
    if (typeof postID != "undefined") {
      const userIdx = users_list.findIndex((aUser) => aUser.id == user.id); //find user in users' list
      if (userIdx >= 0) {
        const postIdxInUser = user.posts.findIndex(
          (aPost) => aPost.id == postID
        ); //find post in user's post list
        if (postIdxInUser < !0) {
          users_list[userIdx].posts.splice(postIdxInUser, 1);
          const stringifyUsers = JSON.stringify(users_list);
          await fsPromise.writeFile("./database/users.json", stringifyUsers);
        } else {
          res.sendStatus(400).send("Invalid post ID.");
        }
        const postIdxInPosts = posts_list.findIndex(
          (aPost) => aPost.id == postID
        ); //find post index in posts database
        if (postIdxInPosts < !0) {
          posts_list.splice(postIdxInPosts, 1); //delete post from DB
          const stringifyPosts = JSON.stringify(posts_list);
          fs.writeFile("./database/posts.json", stringifyPosts, (err) => {
            if (err) {
              res.sendStatus(500).send("Error writing to database.");
            }
          });
        } else {
          res.sendStatus(500).send("Couldnt find post in database");
        }
        res.send("Post deleted");
      } else {
        res.send("User not found");
      }
    } else {
      res.sendStatus(400).send("Missing post ID in request.");
    }
  } else {
    res.sendStatus(403).send("No token");
  }
};

//**** Set a New Encrypted Password  *****//
const setPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return { salt, hash };
};

//**** Validate Password - used to check if user login details are correct *****//
//creating a new hash using the shared salt & and the password received at login request
const validPassword = (password, salt, hash) => {
  var NewHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return NewHash === hash; //check if the hash we just created is matching the user's database hash
};

//**** Create a New User Object *****//
const getUser = (f_name, l_name, password, email) => {
  //set an encrypted password using salit & hash
  const { salt, hash } = setPassword(password);

  const user = {
    f_name: f_name,
    l_name: l_name,
    email,
    hash,
    salt,
    id: create_user_id(),
    status: "created",
    creation_date: new Date(),
    posts: [],
    mailbox: [],
    sent: [],
  };
  return user;
};

//**** Find User in DB by password & email *****//
const findUser = (email, password) => {
  let users = users_list;
  let msg = false;
  let indexOfUser = users.findIndex((user) => user.email === email);

  if (indexOfUser >= 0) {
    //user found
    if (
      validPassword(password, users[indexOfUser].salt, users[indexOfUser].hash)
    ) {
      //user found & passwords match
      msg = true;
    }
  }
  return { indexOfUser, msg };
};

//**** Login *****//
const login = async (req, res) => {
  const { email, password } = req.body;
  if (typeof email == "undefined" || typeof password == "undefined") {
    res.sendStatus(400);
  }
  const users = users_list;
  const { indexOfUser, msg } = findUser(email, password);
  if (indexOfUser >= 0 && msg == true) {
    try {
      //user exists & passwords match

      //create a new token using Jason Web Token:
      // const token = jwt.sign({ user: users[indexOfUser] }, "secretToken");
      const token = uuid();

      res.cookie("token", token);
      //set new pair of [token,user] in map:
      const token_arr = tokenById;
      const map2 = new Map(Object.entries(token_arr));
      map2.set(token, users[indexOfUser]);
      //add new data to map database
      const toObject = Object.fromEntries(map2);
      const stringifyData = JSON.stringify(toObject);

      await fsPromise
        .writeFile(
          path.resolve(__dirname, "database/token_by_id.json"),
          stringifyData
        )
        .catch((err) => {
          console.log(err);
        });
      console.log("WRITING TO FILE!!!!");

      //fs.writeFileSync("./database/token_by_id.json", stringifyData);
      //const tt=map2.get(token);
      //res.json({ res.cookies });
      console.log("SET COOKIE");
      res.send("Set cookie");
      return;
    } catch (error) {
      console.log(error);
      console.log("COOKIE ERROR");
    }
  } else if (indexOfUser < 0) {
    //user not found by email
    res.status(StatusCodes.BAD_REQUEST);
    res.send("User not found.");
    return;
  } else {
    //passwords didn't match
    res.status(StatusCodes.BAD_REQUEST);
    res.send("Wrong password.");
  }
};

//**** Find User Index in user.json by ID *****//
const findUserIndexByID = (id) => {
  const users_arr = users_list;
  const idx = users_arr.findIndex((user) => user.id == id);
  return idx;
};

const findUserByID = (id) => {
  const idx = findUserIndexByID(id);
  if (idx >= 0) {
    let data = users_list;
    return data[idx];
  } else {
    return "not found";
  }
};

//**** Find Post Index in posts.json by ID *****//
const findPostIndex = (id) => {
  const idx = posts_list.findIndex((post) => (post.id = id));
  return idx;
};

const emailExists = (email) => {
  const data = users_list;
  data.forEach((user) => {
    if (user.email == email) {
      return true;
    }
  });
  return false;
};
//**** Create New User by Request *****//
const create_user = (req, res) => {
  const { f_name, l_name, email, password } = req.body;

  if (!f_name) {
    res.status(StatusCodes.BAD_REQUEST);
    res.send("Missing first name in request");
    return;
  }
  if (!l_name) {
    res.status(StatusCodes.BAD_REQUEST);
    res.send("Missing last name in request");
    return;
  }
  if (!password) {
    res.status(StatusCodes.BAD_REQUEST);
    res.send("Missing password in request");
    return;
  }
  if (!email) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    res.send("Missing email in request");
    return;
  }
  if (emailExists(email)) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send("User with this email already exists.");
  }

  let user = getUser(f_name, l_name, password, email);
  if (typeof user != "undefined") {
    saveUserToDB(user); //create function
    // res.json({ user });
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
  return user;
};

//**** Save User to user.json DB *****//
const saveUserToDB = (user) => {
  let data = users_list;
  data.push(user);
  const stringifyData = JSON.stringify(data);
  console.log(stringifyData);
  fs.writeFile("./database/users.json", stringifyData, () => {
    console.log("GREAT SUCCESS");
  });
};
//**** Display All Users *****//
function get_users(req, res) {
  res.send(users_list);
}
//***get my info */
async function getInfo(req, res) {
  const user = await findUserByToken(req.cookies.token);
  if (typeof user != "undefined") {
    res.send(user);
  } else {
    res.status(400).send("User not found");
  }
}

//**** Generate a New User ID *****//
function create_user_id() {
  let max_id = 0;
  users_list.forEach(
    //get next available id
    (item) => {
      max_id = Math.max(max_id, item?.id);
    }
  );
  const newID = max_id + 1;
  return newID.toString();
}

//**** Logout *****//
function logout(req, res) {
  const token = req.cookies.token; //req.token;
  if (typeof token != "undefined") {
    const token_arr = tokenById;
    const token_map = new Map(Object.entries(token_arr)); //convert tokenById to a map data structure
    const user_name = token_map.get(token).f_name;
    token_map.delete(token); //delete token from map
    //add new data to map database
    const toObject = Object.fromEntries(token_map); //convert to js object
    const stringifyData = JSON.stringify(toObject); //convert to json
    fs.writeFile("./database/token_by_id.json", stringifyData, (err) => {
      if (err) {
        res.send("Error while writing to database.");
      }
    });

    res.send(user_name + " has logged out");
  } else {
    res.sendStatus(403).send("No token");
  }
}

//**** Add Message to User's sent list *****//
function addMessageToUser(user, message) {
  //const userID = user.id;
  const idx = findUserIndexByID(user.id);
  if (idx >= 0) {
    const tempList = users_list;
    tempList[idx].sent.push(message); //add message to sender's sent list
    const stringifyData = JSON.stringify(tempList);
    fs.writeFile("./database/users.json", stringifyData, (err, authData) => {
      if (err) {
        res.send("Error saving data");
      } else {
        res.send("data saved successfully");
      }
    });
  } else {
    console.log("Error: user not found.");
  }
}
//**** Delete Post *****//
const deletePost = (req, res) => {
  const userID = req.body.userID;
  if (userID < 0) {
    res.sendStatus(400).send("Please enter a valid ID.");
  }
  const postID = req.body.postID;
  if (postID < 0) {
    res.sendStatus(400).send("Please enter a valid post ID.");
  }
  const users = users_list;
  //delete from posts database
  const postsIndex = findPostIndex(postID);
  if (postsIndex < 0) {
    res.sendStatus(400);
  }
  const posts = posts_list;
  posts.splice(postsIndex, 1);
  const stringifyPosts = JSON.stringify(posts);
  fs.writeFile("./database/posts.json", stringifyPosts, (err) => {
    if (err) {
      console.log("Error");
    }
  });
  //delete from user.posts[]
  const userIndex = findUserIndexByID(userID);
  if (userIndex < 0) {
    res.sendStatus(400).send("User not found.");
  }
  const userPostsIndex = users[userIndex].posts.findIndex(
    (post) => post.id == postID
  );
  users[userIndex].posts.splice(userPostsIndex, 1);
  const stringifyUsers = JSON.stringify(users);
  fs.writeFile("./database/users.json", stringifyUsers, (err) => {
    if (err) {
      console.log("Error");
    }
  });
  res.send("Post deleted");
};
//**** Show Mailbox *****//
const showMailbox = async (req, res) => {
  const token = req.cookies.token; //req.token;
  if (typeof token != "undefined") {
    let current_user = await findUserByToken(token);
    if (typeof current_user != "undefined") {
      const id = current_user.id;
      const idx = findUserIndexByID(id);
      res.send(users_list[idx].mailbox);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(401).send("No token");
  }
};
//**** Add Message to User's mailbox (messages received) *****//
function addMessageToReceiver(receiverID, message) {
  const idx = findUserIndexByID(receiverID);
  if (idx >= 0) {
    const tempList = users_list;
    tempList[idx].mailbox.push(message);
    const stringifyData = JSON.stringify(tempList);
    fs.writeFile("./database/users.json", stringifyData, (err, authData) => {
      if (err) {
        res.sendStatus(500).send("Error saving data");
      } else {
        res.send("data saved successfully");
      }
    });
  } else {
    console.log("Error: user not found.");
  }
  //add message to receiver's mailbox
}
//////////////////////////////////////////////////////////////////////////////
//                              ADMIN ACTIONS
//////////////////////////////////////////////////////////////////////////////

//**** User Status Actions:

//**** Change User's status *****//
const changeUserStatus = (id, new_status) => {
  if (id == 0) {
    res.sendStatus(403).send("Cannot change admin's status.");
  }
  if (id < 0) {
    res.sendStatus(400).send("Please enter a valid ID.");
  }
  const idx = findUserIndexByID(id);
  if (idx < 0) {
    res.sendStatus(400).send("User not found.");
  }
  if (new_status == "active" || new_status == "suspended") {
    const data = users_list;
    data[idx].status = new_status;
    //update database
    const stringifyData = JSON.stringify(data);
    fs.writeFile("./database/users.json", stringifyData, (err) => {
      if (err) {
        console.log("Error updating database.");
      }
    });
    return true;
  } else {
    return false;
  }
};

//**** Suspend User *****//
const suspendUser = (req, res) => {
  if (typeof req.body.userID != "undefined") {
    const userID = req.body.userID;
    const flag = changeUserStatus(userID, "suspended");
    if (flag) {
      res.send(`User #${userID} is now suspended`);
    } else {
      res.send("Please enter a valid status");
    }
  } else {
    res.sendStatus(400).send("Target ID not mentioned in request.");
  }
};

//**** Activate User *****//
const activateUser = (req, res) => {
  if (typeof req.body.userID != "undefined") {
    const userID = req.body.userID;
    const flag = changeUserStatus(userID, "active");
    if (flag) {
      res.sendStatus(200).send(`User #${userID} is now activated`);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400).send("Target ID not mentioned in request.");
  }
};

//**** Delete User *****//
const deleteUser = (req, res) => {
  const userID = req.body.userID;
  if (userID == 0) {
    //cant delete admin
    res.sendStatus(403).send("Cannot delete admin.");
  }
  if (userID < 0) {
    res.sendStatus(400);
  }
  const users = users_list;
  const idx = findUserIndexByID(userID);
  if (idx < 0) {
    res.sendStatus(400);
  }
  users.splice(idx, 1);
  const stringifyData = JSON.stringify(users);
  fs.writeFile("./database/users.json", stringifyData, (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send("User deleted successfully");
    }
  });
};
//**** Restore User *****//
const restoreUser = (req, res) => {
  if (typeof req.body.userID != "undefined") {
    const userID = req.body.userID;
    changeUserStatus(userID, "active");
    res.send(`User #${userID} is now restored`);
  } else {
    res.sendStatus(400).send("Target ID not mentioned in request.");
  }
};

//**** Message All  *****//
const messageAll = (req, res) => {
  const text = req.body.text;
  if (typeof text != "undefined") {
    const msg = message.getMessage(text); //creating message object
    msg.senderName = "admin";
    msg.senderID = "0";
    //add to messages.json
    messages_list.push(msg);
    const stringifyMessages = JSON.stringify(messages_list);
    fs.writeFile("./database/messages.json", stringifyMessages, (err) => {
      if (err) {
        res.sendStatus(500).send("Error writing to database.");
      }
    });
    //add to admin's sent box
    users_list[0].sent.push(msg);
    //add to all users' mailbox
    users_list.forEach((user) => {
      if (user.id != 0) {
        user.mailbox.push(msg);
      }
    });
    const stringifyUsers = JSON.stringify(users_list);
    fs.writeFile("./database/users.json", stringifyUsers, (err) => {
      if (err) {
        res.sendStatus(500).send("Error writing to database.");
      }
    });
    res.json({ response: "message sent to all users", msg });
  } else {
    res.sendStatus(400).send("Please enter a valid text");
  }
};

//**** Get sent messages */
const getSentMsgs = async (req, res) => {
  const token = req.cookies.token; //req.token;
  if (typeof token != "undefined") {
    let current_user = await findUserByToken(token);
    if (typeof current_user != "undefined") {
      const id = current_user.id;
      const idx = findUserIndexByID(id);
      res.send(users_list[idx].sent);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(401).send("No token");
  }
};
//Middleware

//**** Check if Admin  *****//
const isAdmin = async (req, res, next) => {
  if (typeof req.cookies.token != "undefined") {
    const data = await findUserByToken(req.cookies.token);
    if (data.id == 0) {
      next();
    } else {
      res.status(401).send("not admin");
    }
  } else {
    res.status(403).send("No token");
  }
};

//****validate admin */
const validateAdmin = async (req, res) => {
  console.log("Validate Admin");
  if (typeof req.cookies.token != "undefined") {
    const data = await findUserByToken(req.cookies.token);
    if (typeof data == "undefined") {
      res.send("not found shit");
    }
    if (data.id === 0) {
      res.send(true);
      return;
    } else {
      res.send(false);
      return;
    }
  } else {
    res.status(403).send("No token");
    return;
  }
};

//**** Check if Active  *****//
const isActive = async (req, res, next) => {
  console.log("IS ACTIVE!!!!!!!!");
  if (req.cookies.token) {
    const data = await findUserByToken(req.cookies.token);
    if (typeof data != "undefined") {
      const idxInUsers = users_list.findIndex((user) => {
        return user.id == data.id;
      });
      if (idxInUsers >= 0) {
        const user_status = users_list[idxInUsers].status;
        if (user_status === "active") {
          next();
        } else {
          res.send("not active"); //status(403).send("User not active");
        }
      }
    } else {
      res.send("no user"); //sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

//Exports
exports.login = login;
exports.create_user = create_user;
exports.get_users = get_users;
exports.logout = logout;
exports.findUserByToken = findUserByToken;
exports.findUser = findUser;
exports.changeUserStatus = changeUserStatus;
exports.isActive = isActive;
exports.isAdmin = isAdmin;
exports.deleteUser = deleteUser;
exports.deletePost = deletePost;
exports.deleteMyPost = deleteMyPost;
exports.showMailbox = showMailbox;
exports.addMessageToUser = addMessageToUser;
exports.addMessageToReceiver = addMessageToReceiver;
exports.messageAll = messageAll;
exports.suspendUser = suspendUser;
exports.activateUser = activateUser;
exports.restoreUser = restoreUser;
exports.findUserByID = findUserByID;
exports.getSentMsgs = getSentMsgs;
exports.getInfo = getInfo;
exports.validateAdmin = validateAdmin;
