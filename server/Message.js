
const messages_list = require('./database/messages.json');
const user = require('./user');
var fs = require('fs');
const users_list = require('./database/users.json')


//creates message object
const getMessage = (text) => {
    const message = {
        text,
        id: create_message_id(),
        creation_date: new Date(),
        senderID:"",
        senderName:"",
        receiverID:"",
        receiverName:""
    }
    return message;
}

//main message creation function
const createMessage = (req, res) => {
    let text = req.body.text;
    if (typeof(text)=='undefined'){
        res.sendStatus(400);
    }
    let token = req.cookies.token; //of sender
    if (typeof(token)=='undefined'){
        res.sendStatus(403);
    }
    let receiverID = req.body.receiverID;
    if (typeof(receiverID)=='undefined'){
        res.sendStatus(400);
    }
    const users = users_list
    const current_user = user.findUserByToken(token);//find sender by token

    const message = getMessage(text); //create message object

    message.senderID=current_user.id;
    
    message.senderName=current_user.f_name+" "+current_user.l_name;
    message.receiverID=receiverID;
    
    let receiver=user.findUserByID(receiverID);
    message.receiverName=receiver.f_name+" "+receiver.l_name;

    user.addMessageToUser(current_user, message); //add message to sender's sent messages list
    user.addMessageToReceiver(receiverID, message); //add message to receiver's mailbox
    addMessageToDB(message); //add message to messages DB
//    res.send("Message created")
        res.send(receiver.mailbox)

}
//generate an id for new message
const create_message_id = () => {
    let max_id = 0;
    messages_list.forEach( //get next available id
        message => { max_id = Math.max(max_id, message?.id) }
    )
    const newID = max_id + 1;
    return newID.toString();
}
//update database with new message
const addMessageToDB = (message) => {
    const messages = messages_list;
    messages.push(message);
    const stringifyData = JSON.stringify(messages);
    fs.writeFile('./database/messages.json', stringifyData, (err) => {
        if (err) { res.sendStatus(500) }
    })
}

exports.createMessage = createMessage;
exports.getMessage = getMessage