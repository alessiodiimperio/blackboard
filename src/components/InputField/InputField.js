import "./InputField.css";
import { useState } from "react";
import React from "react";
import { useStateValue } from "../../StateProvider";
import {auth} from '../../firebase';

const apiUrl = "https://us-central1-wall-of-tags.cloudfunctions.net/posts";

function InputField() {
  const [input, setInput] = useState(""); //Local state for input
  const [{ posts, user }, dispatch] = useStateValue();

  const handleInput = (element) => {
    setInput(element.target.value);
  };

  const handleSubmitPost = async () => {

    if(!input){
      alert('Please type something in the textfield.')
    }

    const timestamp = new Date();

    const date = new Date(timestamp).toISOString().split("T")[0];
    const time = new Date(timestamp).toISOString().split('T')[1].split('.')[0]

    let postObject = {
      author: user.username,
      authorId: user.authorId,
      title: input,
      date: date,
      time:time,
    };
    console.log(postObject);

    await fetch(apiUrl, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postObject),
    })
      .then((response) => response.json())
      .then((data) => {
        postObject = { ...postObject, id: data.id };
        dispatch({
          type: "ADD_POST",
          post: postObject,
        });
      });
  };

  return (
    <div className="input-field-container">
      <input
        value={input}
        onChange={handleInput}
        className="text-input"
        type="text"
        placeholder="What do you want to post?"
      />
      <button className="btn-primary button-submit" onClick={handleSubmitPost}>
        Submit
      </button>
      
    </div>
  );
}

export default InputField;
