import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/esm/Form";
import { Col, Row } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { alignPropType } from "react-bootstrap/esm/types";
//import Nav_bar from "../../components/Navbar";
import { useCookies, withCookies } from "react-cookie";
import Cookie from "react-cookie";
import Nav from "../../components/Nav";
import Nav_bar from "../../components/Navbar";

// import Navbar from 'react-bootstrap/Navbar'
// import Container from 'react-bootstrap/Container'
// import Nav from 'react-bootstrap/Nav'
function Home() {
  const [numOfPosts, setNumOfPosts] = useState(10); //number of posts to be shown
  const [posts, setPosts] = useState([]); //initializing posts to empty array
  const [newPosts, setNewPosts] = useState(0);
  const [post, setPost] = useState({
    text: "",
  });
  const [cookies, setCookie] = useState(document.cookie.split("=")[1]); //document.cookie//.split("=")[1]
  //const [token,setToken]=useState(`Bearer ${cookies}`);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  const newPost = async () => {
    try {
      //const res = 
      const res= await fetch("HTTP://localhost:2718/user/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":"http://localhost:3000",
          //"Access-Control-Allow-Origin": "*",
        },
        credentials: "include",
        body: JSON.stringify(post)
      })//
      console.log("here")
      //.then(()=>console.log("ok"));
      //console.log(JSON.stringify(post))

      // if (res.status !== 200) {
      //   //console.log("mane");
      //   // fetchPosts();
      //   console.log(res);
      //   setNewPosts(0);
      // }
      console.log("done")
    } catch (error) {
      console.log(error);
    }
  };
  //fetch posts request:
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:2718/user/showPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // authorization:
          //  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZfbmFtZSI6ImFkbWluIiwibF9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluIiwiaGFzaCI6Ijk1ZjBhN2Y0MmZjZmE2MzFiNTg4ZjFiYjUyZDZlMjhkNDAxZjFhYTE4MWMyMWI5NWM0MWY1ZWE0ZmMwMTJkY2NhODlmNmFhNmQ0MjA4ZDU3ZGI4MmI4ZDQ1M2Y1OTAwMjIzNjBlZWU0YTE5OTgxN2E2YmExNjBlYTQ1ZGI4NDU1Iiwic2FsdCI6ImU4M2NkMGM1YWEwNzFmZjRlZDUxNTIxNGFmNzY3MDE2IiwiaWQiOjAsInN0YXR1cyI6ImFjdGl2ZSIsImNyZWF0aW9uX2RhdGUiOiIyMDIyLTAxLTAzVDE0OjI0OjQyLjI4OFoiLCJwb3N0cyI6W10sIm1haWxib3giOltdLCJzZW50IjpbXX0sImlhdCI6MTY0NDE2ODUxMn0.aHJV9W2f2HnC4N6buLJi1pKTewP5W64YYHHXH1kVyXo",
         // "Access-Control-Allow-Origin": "*",

        },
        credentials: "include",
      });

      let data = await res.json(); //await  res.json()//.json();

      //console.log(data.json())

      let postsNew = [];
      let j = 0;
      for (let i = data.length - 1; i >= 0; i--) {
        postsNew[j] = data[i];
        j++;
      }
      setNewPosts(0);
      setPosts(postsNew);
      // console.log(typeof arr)

      //var string1 = await JSON.stringify(res);

      // var parsed =  JSON.parse(res);
      // console.log(parsed)

      // let resArray = await res.json()//await res.json(); //await res.body//await JSON.parse(res)//res.json();
      // console.log(resArray)

      //return;
    } catch (error) {
      //console.log("Error fetching posts")
      console.log(error.message);
    }
  };

  useInterval(async () => {
    // Your custom logic here
    //console.log(posts.length)
    try {
      const res = await fetch("http://localhost:2718/user/showPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // authorization:
          //  "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZfbmFtZSI6ImFkbWluIiwibF9uYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluIiwiaGFzaCI6Ijk1ZjBhN2Y0MmZjZmE2MzFiNTg4ZjFiYjUyZDZlMjhkNDAxZjFhYTE4MWMyMWI5NWM0MWY1ZWE0ZmMwMTJkY2NhODlmNmFhNmQ0MjA4ZDU3ZGI4MmI4ZDQ1M2Y1OTAwMjIzNjBlZWU0YTE5OTgxN2E2YmExNjBlYTQ1ZGI4NDU1Iiwic2FsdCI6ImU4M2NkMGM1YWEwNzFmZjRlZDUxNTIxNGFmNzY3MDE2IiwiaWQiOjAsInN0YXR1cyI6ImFjdGl2ZSIsImNyZWF0aW9uX2RhdGUiOiIyMDIyLTAxLTAzVDE0OjI0OjQyLjI4OFoiLCJwb3N0cyI6W10sIm1haWxib3giOltdLCJzZW50IjpbXX0sImlhdCI6MTY0NDE2ODUxMn0.aHJV9W2f2HnC4N6buLJi1pKTewP5W64YYHHXH1kVyXo",
        },
        credentials: "include",
      });

      let arr = await res.json();
      let newPostsCount = arr.length - posts.length;
      if (newPostsCount >= 0) {
        setNewPosts(newPostsCount);
        //console.log(arr);
      } else {
        //posts got deleted
        fetchPosts();
      }
    } catch (error) {
      //console.log("Error fetching posts");
      console.log(error.name);
    }
  }, 5000);

  useEffect(() => {
    //console.log(cookies)
    fetchPosts();
  }, []);

  return (
    <div className="home">
      <Nav></Nav>
      {/* <div className="newPost"> */}
      <div className="newPost">
        <Form>
          <Form.Group className="mb-3" controlId="ControlTextarea1">
            <Form.Label>New Post</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              onChange={(event) => {
                setPost({ text: event.target.value });
                console.log(post.text);
              }}
            />
            <Button
              onClick={newPost}
              className="postBtn"
              variant="primary"
              type="submit"
            >
              Post
            </Button>
          </Form.Group>
        </Form>
      </div>

      <div className="postsSection">
        {/* </div> */}
        <div className="postsSlider">
          <Form.Group>
            <RangeSlider
              value={numOfPosts}
              min={1}
              max={100}
              size="lg"
              onChange={(event) => setNumOfPosts(event.target.value)}
              padding="5px"
              //onChange={changeEvent => setValue(changeEvent.target.value)}
            />
          </Form.Group>
          <div className="newPostsBadge">
            <button
              type="button"
              className="btn btn-primary"
              disabled={newPosts > 0 ? false : true}
              onClick={fetchPosts}
            >
              New Posts <span className="badge badge-light">{newPosts}</span>
            </button>
          </div>
        </div>
        {/* <div className="Posts"> */}
        {posts &&
          posts.slice(0, numOfPosts).map((post) => {
            return (
              <div
                className="post"
                key={post.id}
                style={{ alignItems: "center", margin: "20px 60px" }}
              >
                <h4>{post.text}</h4>
                <p>{post.time + " | by " + post.author}</p>
              </div>
            );
          })}
        {/* </div> */}
      </div>
    </div> //home div
  );
}

export default Home;
