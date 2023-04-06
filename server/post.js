const posts_list = require('./database/posts.json')
var jwt = require('jsonwebtoken');
const tokenById = require('./database/token_by_id.json')
const user = require('./user');
const users_list = require('./database/users.json');
var fs = require('fs');
const res = require('express/lib/response');

//generate id for new post
function create_post_id() { //get new post id
    let max_id = 0;
    posts_list.forEach( //get next available id
        item => { max_id = Math.max(max_id, item.id) }
    )
    return max_id + 1;
}
//create a post object
const getPost = (text) => { //get post object
    const post = {
        text: text,
        id: create_post_id(),
        time: new Date()
    }
    return post;
}
//update databases with new post
const postUpdate = (creator, post) => {
    const users_arr = users_list;
    const idx = users_arr.findIndex(user => user.id === creator.id)
    users_arr[idx].posts.push(post);
    const stringifyData = JSON.stringify(users_arr);
    fs.writeFile('./database/users.json', stringifyData, (err) => {
        if (err) { res.send("error1") }
    })

    const posts_arr = posts_list
    posts_arr.push(post);
    const stringPosts = JSON.stringify(posts_arr)
    fs.writeFile('./database/posts.json', stringPosts, (err) => {
        if (err) { res.send("error2") }
    })
    return;
}
//main function for post creation
const createPost = (req, res) => {
    if (typeof (req) != 'undefined') {
        const text = req.body.text;
        const token = req.token;
        if (typeof (token) != 'undefined') {
            const PostObj = getPost(text);
            const creator = user.findUserByToken(token);
            PostObj.author=creator.f_name+" "+creator.l_name
            postUpdate(creator, PostObj);
           // res.status(200);
            res.send({PostObj}) //send post as response
        }
    }
    else {
        res.sendStatus(400)
    }
}
//display all posts
const showAllPosts = (req,res) =>{
    res.status(200).send(posts_list);
}

exports.createPost = createPost;
exports.showAllPosts=showAllPosts;