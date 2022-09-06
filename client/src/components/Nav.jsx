import React, { useState, useEffect, useRef } from "react";
import Nav_bar from "./Navbar";
import Nav_bar_admin from "./NavbarAdmin";

function Nav() {
  //const [admin,setAdmin]=useState(false)
  const [nav, setNav] = useState(<Nav_bar></Nav_bar>);
  async function isAdmin() {
    console.log("IS ADMIN");
    try {
      const cookiemaybe = document.cookie;
      const result = await fetch("http://localhost:2718/isAdmin?client=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookiemaybe,
        },
        credentials: "include",
      });
      const data = await result.json();
      if (data == true) {
        setNav(<Nav_bar_admin></Nav_bar_admin>);
      } else {
        setNav(<Nav_bar></Nav_bar>);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    isAdmin();
  }, []);

  return nav;
}

export default Nav;
