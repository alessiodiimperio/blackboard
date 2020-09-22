import "./Wall.css";
import React from "react";
import { useStateValue } from "../../StateProvider";
import { useEffect } from "react";
import Post from "../../components/Post/Post";
import {auth} from '../../firebase';
const apiUrl = "https://us-central1-wall-of-tags.cloudfunctions.net/posts/";

function Wall() {
  const [{ posts }, dispatch] = useStateValue();

  //Component did load - initialize state with db fetch
  useEffect(() => {
    startSpinner();
    const fetchData = async () => {
      const data = await fetch(apiUrl);
      if(!data.ok) { return }
      const json = await data.json();
      const fetchedPosts = [...json];

      //Sort posts by date/time // NEEDS TO BE EDITED TO TIMESTAMP SERVERSIDE
      fetchedPosts.sort((first, second) => {
        const firstTimeStamp =
          first.date.replace(/-/g, "") + first.time.replace(/:/g, "");
        const secondTimeStamp =
          second.date.replace(/-/g, "") + second.time.replace(/:/g, "");
          console.log(firstTimeStamp, secondTimeStamp)
        return parseInt(firstTimeStamp) < parseInt(secondTimeStamp);
      });
      //send to reducer for state management
      stopSpinner();
      dispatch({
        type: "INIT_WALL",
        posts: fetchedPosts,
      });
    };
    fetchData();
  }, []);

  //Handle delete sent from Post object
  const handleDelete = async (id) => {
    startSpinner();
    await fetch(apiUrl + id, { method: "DELETE" }).then((result) => {
    stopSpinner();
      if (result.ok) {
        dispatch({
          type: "DELETE_POST",
          id: id,
        });
      }
    }).catch(error => {
      stopSpinner();
      console.log(error.message)
    })
  };
  //Handle edit sent from Post object
  const handleSubmit = async (post) => {
    startSpinner();
    const originalPost = {...post};
    const result = await fetch(apiUrl + post.id, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    stopSpinner();
    if (result.ok) {
      dispatch({
        type: "EDIT_POST",
        post: post,
      });
    }
  };
  //Spinner functions
  const startSpinner = () => {
    dispatch({ type: "START_LOADING" });
  };
  const stopSpinner = () => {
    dispatch({ type: "STOP_LOADING" });
  };
  return (
    <div className="wall-container">
      <div className="wall-content">
        {posts.map((post) => (
          <Post
            key={post.id}
            id={post?.id}
            title={post?.title}
            author={post?.author}
            authorId={post?.authorId}
            date={post?.date}
            time={post?.time}
            onDelete={handleDelete}
            onEdit={handleSubmit}
          />
        ))}
      </div>
    </div>
  );
}

export default Wall;
