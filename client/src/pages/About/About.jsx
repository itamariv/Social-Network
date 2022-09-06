import React, { useState, useEffect, useRef } from "react";
// import "../Homepage/Home.css";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/esm/Form";
import Nav from "../../components/Nav";
import "./About.css";

function About() {
  const [user, setUser] = useState("");

  const fetchUser = async () => {
    try {
      const res = await fetch("HTTP://localhost:2718/user/myinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const user = await res.json();
      setUser(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="AboutPage">
      <Nav></Nav>
      <div className="Card">
        <h4>{user.f_name} {user.l_name}</h4>
        <p>{"Email: "+user.email}</p>
        <p>{"ID: "+user.id}</p>
        <p>{"Status: "+user.status}</p>
        <p>{"Creation Date: "+user.creation_date}</p>
      </div>
    </div>
  );
}
export default About;
