import React, { useState, useEffect, useRef } from "react";
// import "../Homepage/Home.css";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/esm/Form";
import RangeSlider from "react-bootstrap-range-slider";
import { alignPropType } from "react-bootstrap/esm/types";
import Nav_bar from "../../components/Navbar";
import "./Mailbox.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from "../../components/Nav";


// import TabContainer from 'react-bootstrap/TabContainer'
function Mailbox() {
  const [Mailbox, setMailbox] = useState([]);
  const [newMessages, setNewMessages] = useState(0);
  const [sentMessages, setSentMsgs] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    receiverID: "",
  });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("HTTP://localhost:2718/user/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const arr = await res.json();
      //console.log(arr)
      setUsers(arr);

    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchMailbox = async () => {
    const res = await fetch("HTTP://localhost:2718/user/showMailbox", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (res.status !== 500) {
      let resArray = await res.json();
      let postsNew = [];
      let j = 0;
      for (let i = resArray.length - 1; i >= 0; i--) {
        postsNew[j] = resArray[i];
        j++;
      }

      setNewMessages(0);
      setMailbox(postsNew);
      return;
    } else {
      console.log("error shit");
      return;
      //    return res.json()
    }
  };

  const fetchSentMessages = async () => {
    try {
      const res = await fetch("HTTP://localhost:2718/user/sentmsgs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status !== 500) {
        let resArray = await res.json();
        let sentNew = [];
        let j = 0;
        for (let i = resArray.length - 1; i >= 0; i--) {
          sentNew[j] = resArray[i];
          j++;
        }
        setSentMsgs(sentNew);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const newMessage = async () => {
    try {
      const res = await fetch("http://localhost:2718/user/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(message),
      });
      //console.log(JSON.stringify(post))
      if (res.status !== 200) {
        //console.log("mane");
        // fetchPosts();
        console.log(res);
        // setNewPosts(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateValue = ({ name, event }) => {
    const currentValue = event.target.value;
    setMessage((oldMessage) => {
      return { ...oldMessage, [name]: currentValue };
    });
    console.log(message);
  };

    const updateID = ({ name, id }) => {
    const currentValue =id;
    setMessage((oldMessage) => {
      return { ...oldMessage, [name]: currentValue };
    });
    console.log(message);
  };
  

  useEffect(() => {
    fetchMailbox();
    fetchSentMessages();
    fetchUsers();
  }, []);

  return (
    <div className="mailboxPage">
      <Nav></Nav>
      <div className="newMessage">
        <Form>
          <Form.Group className="mb-3" controlId="ControlTextarea1">
            <Form.Label>New Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              onChange={(event) => {
                updateValue({ event, name: "text" });
              }}
            />
            ID:
            <input
              type="text"
              name="name"
              value={message.receiverID}
              onChange={(event) => {
                updateValue({ event, name: "receiverID" });
              }}
              style={{ width: "40px", margin: "2vh" }}
            />

            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Users
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {users &&
              users.map(user => <Dropdown.Item key={user.id} onClick={(event)=>updateID({ id:user.id, name: "receiverID" })}>{user.f_name} {user.l_name}</Dropdown.Item>     )}
                

              </Dropdown.Menu>
            </Dropdown>
            <Button
              onClick={newMessage}
              className="postBtn"
              variant="primary"
              type="submit"
            >
              Send
            </Button>
          </Form.Group>
        </Form>
      </div>
      <div className="msgSection">
        <Tabs
          defaultActiveKey="Mailbox"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Mailbox" title="Mailbox">
            {Mailbox &&
              Mailbox.slice(0, 5).map((msg) => {
                return (
                  <div
                    className="msg"
                    key={msg.id}
                    style={{ alignItems: "center", margin: "20px 60px" }}
                  >
                    <h4>{msg.text}</h4>
                    <p>{msg.creation_date + " | By " + msg.senderName}</p>
                  </div>
                );
              })}
          </Tab>
          <Tab eventKey="profile" title="Sent">
            {sentMessages &&
              sentMessages.slice(0, 5).map((msg) => {
                return (
                  <div
                    className="msg"
                    key={msg.id}
                    style={{ alignItems: "center", margin: "20px 60px" }}
                  >
                    <h4>{msg.text}</h4>
                    <p>{msg.creation_date + " | To " + msg.receiverName}</p>
                  </div>
                );
              })}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Mailbox;
