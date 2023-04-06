//import logo from "./logo.svg";
import "./App.css";

//import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Homepage/Home";
import Mailbox from "./pages/Mailbox/Mailbox";
import About from "./pages/About/About";
import AdminPage from "./pages/Admin/AdminPage";

function App() {
  async function isLoggedIn() {
    try {
      const res = await fetch("HTTP://localhost:2718/isloggedin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("res" + res.status);
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      //console.log("Error fetchingg");

      return false;
    }
  }

  async function GetComp() {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
