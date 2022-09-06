import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import "./Login.css";
import Form from "react-bootstrap/esm/Form";
import { ToastContainer, toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  //const [redirect,setRedirect]=useState("/");
  const updateValue = ({ name, event }) => {
    const currentValue = event.target.value;
    setForm((oldForm) => {
      return { ...oldForm, [name]: currentValue };
    });
  };
  const navigate = useNavigate();

  const errorPopup = () => {
    toast("Wow so easy!");
  };

  async function PrivateRoute() {
    let res = await submit();
    console.log(res);
    if (res === true) {
      return <Navigate to="/home" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  // const submit = async () => {
  //   try {
  //     const res = await fetch("http://localhost:2718/user/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(form),

  //       credentials: "include",
  //     });
  //     if (res.status !== 200) {
  //       console.log("Error while trying to sign in");
  //       //redirect="/"//false;
  //       //return false;
  //     } else {
  //       console.log("logged in");
  //       //console.log("ggoood");
  //      // return true;
  //       //redirect="/home"//true;
  //     }
  //   } catch (error) {
  //     console.log("failed");
  //    // return false;
  //     //redirect="/"; //false;
  //   }
  // };

  const submit = async () => {
    try {
      const res = await fetch("HTTP://localhost:2718/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),

        credentials: "include",
      });
      if (res.status !== 200) {
        navigate("/", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      navigate("/", { replace: true });
    }
  };
  return (
    <div className="login">
      <Form className="form">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={form.f_name}
            onChange={(event) => {
              updateValue({ event, name: "email" });
            }}
            type="email"
            placeholder="Enter email"
          />
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
        <Button
          onClick={submit}
          variant="primary"
          size="lg"
          className="btn-lg"
          type="submit"
        >
          Login
        </Button>

        <p>or </p>
        <Link to="/register">
          <Button variant="primary" className="btn-lg">
            Register
          </Button>
        </Link>
        {/* Edit <code>src/App.js</code> and save to poop. */}
      </Form>
    </div>
  );
}

export default Login;
