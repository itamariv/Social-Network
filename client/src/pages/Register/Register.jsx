import React, { useState } from "react";
import "./Register.css";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/esm/Form";
import { Navigate, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    f_name: "",
    l_name: "",
    email: "",
    password: "",
  });
  
  const navigate=useNavigate();
  const errorPopup = () => {
    toast("Wow so easy!");
  };

  const updateValue = ({ name, event }) => {
    const currentValue = event.target.value;
    setForm((oldForm) => {
      return { ...oldForm, [name]: currentValue };
    });
  };

  const submit = async () => {
    try {
      const res = await fetch("http://localhost:2718/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.status === 500) {
        errorPopup();
      }
      
    } catch (error) {
      errorPopup();
    }
    navigate("/", { replace: true });
    
  };
  return (
    <div className="register">
      <Form className="form">
        <Form.Group className="mb-3" >
          <Form.Label>First name</Form.Label>
          <Form.Control
            value={form.f_name}
            onChange={(event) => {
              updateValue({ event, name: "f_name" });
            }}
            type="text"
            placeholder="Enter first name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            value={form.l_name}
            onChange={(event) => {
              updateValue({ event, name: "l_name" });
            }}
            type="text"
            placeholder="Enter last name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={form.email}
            onChange={(event) => {
              updateValue({ event, name: "email" });
            }}
            type="text"
            placeholder="Enter email"
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={form.password}
            onChange={(event) => {
              updateValue({ event, name: "password" });
            }}
            type="password"
            placeholder="Password"
          />
        </Form.Group>

        <Button onClick={submit} variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default Register;

//first name
//last name
//email
//password
