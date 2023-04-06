import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

function Nav_bar() {
  async function logOut() {
    try {
      const res = await fetch("HTTP://localhost:2718/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //deleting cookie
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <Navbar
      sticky="top"
      bg="light"
      variant="light"
      style={{ borderRadius: "5", overflow: "hidden" }}
      className="nav"
    >
      <Container className="nav_box" style={{}}>
        <Navbar.Brand href="/home">Bookface</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/mailbox">Messages</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>

          <Nav.Link href="/" onClick={logOut}>
          
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Nav_bar;
