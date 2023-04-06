import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/esm/Form";
import { Col, Row } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { alignPropType } from "react-bootstrap/esm/types";
import Nav_bar_admin from "../../components/NavbarAdmin";
import { useCookies, withCookies } from "react-cookie";
import Cookie from "react-cookie";
import Dropdown from "react-bootstrap/Dropdown";
import "./AdminPage.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

function AdminPage() {
  const [userID, setUserID] = useState(0);
  const [action, setAction] = useState("");
  const [users, setUsers] = useState([]);
  const [postID,setPostID]=useState(-1);
  const [posts,setPosts]=useState([])
const [message,setMessage]=useState("");
const [url,setURL]=useState("");

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
      setUsers(arr.slice(1));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
      const newUrl="http://localhost:2718/admin/"+action;
    setURL(newUrl)
  }, [action]);

  const updateValue = ( event ) => {
    const currentValue = event.target.value;
    setMessage(currentValue);
   };
  
//fetch functions
const changeStatus = async () => {
    if (url!=""){
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({userID:userID})
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
    }
    else{
        console.log("No url")
    }
  };


const deletePost=async()=>{
     if (url!=""){
    try {
      const res = await fetch("http://localhost:2718/admin/deletepost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({userID:userID,postID:postID}),
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
    }
    else{
        console.log("No url")
    }
  };
const messageAll=async()=>{
     if (url!=""){
    try {
      const res = await fetch("http://localhost:2718/admin/messageall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({text:message}),
      });
      if (res.status !== 200) {
      }
    } catch (error) {
      console.log(error);
    }
    }
    else{
        console.log("No url")
    }
  };

  return (
    <div className="adminPage">
      <Nav_bar_admin></Nav_bar_admin>
      <div className="adminSection">
          <h3>User Actions</h3>
       
        <Tabs onSelect={(k) => setAction(k)}
          defaultActiveKey="Mailbox"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="activate" title="Activate User" >
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" >
                Users
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {users &&
                  users.map((user) => {
                    if (user.status != "active") {
                      return (
                        <Dropdown.Item
                          key={user.id}
                          onClick={(event) => setUserID(user.id)}
                        >
                          {user.f_name} {user.l_name}
                        </Dropdown.Item>
                      );
                    }
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Tab>
          <Tab eventKey="suspend" title="Suspend User" >
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" >
                Users
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {users &&
                  users.map((user) => {
                    if (user.status != "suspended") {
                      return (
                        <Dropdown.Item
                          key={user.id}
                          onClick={(event) => setUserID(user.id)}
                        >
                          {user.f_name} {user.l_name}
                        </Dropdown.Item>
                      );
                    }
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Tab>
          <Tab eventKey="restore" title="Restore User" >
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" >
                Users
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {users &&
                  users.map((user) => {
                    if (user.status == "suspended") {
                      return (
                        <Dropdown.Item
                          key={user.id}
                          onClick={(event) => setUserID(user.id)}
                        >
                          {user.f_name} {user.l_name}
                        </Dropdown.Item>
                      );
                    }
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Tab>
           <Tab eventKey="deleteuser" title="Delete User" >
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" >
                Users
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {users &&
                  users.map((user) => {
                    
                      return (
                        <Dropdown.Item
                          key={user.id}
                          onClick={(event) => setUserID(user.id)}
                        >
                          {user.f_name} {user.l_name}
                        </Dropdown.Item>
                      );
                    
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Tab>
        </Tabs>
        <Button
              onClick={changeStatus}
              className="postBtn"
              variant="primary"
              type="submit"
              disabled={action!="activate"&&action!="suspend"&&action!="restore"&&action!="deleteuser"}
            >
              {(action!="activate"&&action!="suspend"&&action!="restore"&&action!="deleteuser"? "OK":action)}
            </Button>
        
      </div>

      <div className="adminSection">
        <h3>Delete User's Post</h3>
        <Dropdown>
              <Dropdown.Toggle variant="success" size="lg" id="dropdown-basic">
                Users
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {users &&
              users.map(user => <Dropdown.Item key={user.id} onClick={(event)=>{setUserID(user.id); setPosts(user.posts); setAction("deletepost")}}>{user.f_name} {user.l_name}</Dropdown.Item>     )}
              </Dropdown.Menu>
            </Dropdown>

            <div className="postsDropdown">
            <Dropdown className="postsDropdown" >
              <Dropdown.Toggle variant="success" size="lg" id="dropdown-basic">
                Posts
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {posts &&
              posts.map(post => <Dropdown.Item key={post.id} onClick={(event)=>{setPostID(post.id);}}>{post.text}</Dropdown.Item>     )}
              </Dropdown.Menu>
            </Dropdown>
            </div>
            <Button
              onClick={deletePost}
              className="postBtn"
              variant="primary"
              type="submit"
              disabled={action!="deletepost"||postID==-1}
            >
              {(action!="deletepost" ? "OK":"Delete Post")}
            </Button>
      </div>
{/*  */}
       <div className="adminSection">
        <h3>Message All Users</h3>
        <Form>
          <Form.Group className="mb-3" controlId="ControlTextarea1">
            <Form.Label>New Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              onChange={(event) => {
                updateValue(event);
              }}
            />
    
            <Button
              onClick={messageAll}
              className="postBtn"
              variant="primary"
              type="submit"
              disabled={message==""}
            >
              Send
            </Button>
          </Form.Group>
        </Form>
      </div>

      <div className="adminSection">
          <h3> Users List</h3>
           {users &&
          users.map((user) => {
            return (
              <div
                className="user"
                key={user.id}
                style={{ alignItems: "center", margin: "20px 60px" }}
              >
                <h4>{user.f_name}{user.l_name}</h4>
                <p>{"ID: "+user.id + " |  Status: " + user.author}</p>
                <p>{"Email: "+user.email}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AdminPage;
