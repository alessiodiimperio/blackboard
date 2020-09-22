import "./Post.css";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useStateValue } from "../../StateProvider";
import ContentEditable from "react-contenteditable";
import ReactDOM from "react-dom";
function Post({ title, author, authorId, date, time, id, onDelete, onEdit }) {
  const [{ posts, user }, dispatch] = useStateValue();
  const [newTitle, setTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [editBtnText, setEditBtnText] = useState("Edit");

  const elementRef = useRef(null);

  const toggleEditBtnClick = (e) => {
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };
  const getEditBtnClass = isEditing
    ? "btn btn-success edit-btn"
    : "btn btn-primary edit-btn";
  const getBtnContainerClass =
    authorId === user.id && !user.signedAsAnonymous
      ? "buttons-container"
      : "buttons-container-hidden";

  useEffect(() => {
    console.log("in effect");
    if (isEditing) {
      setEditBtnText("Done");
      ReactDOM.findDOMNode(elementRef.current).focus();
    } else {
      setEditBtnText("Edit");
      const newPost = {
        title: newTitle,
        author: author,
        authorId: authorId,
        date: date,
        time: time,
        id: id,
      };
      onEdit(newPost);
    }
  }, [isEditing]);

  return (
    <div className="post-container">
      <div className="post-object">
        <div className="post-title">
          <h1 className="title-text">"</h1>
          <h1 className="title-innertext">
            <ContentEditable
              ref={elementRef}
              onChange={handleInputChange}
              disabled={!isEditing}
              html={`${newTitle}`}
            />
          </h1>
          <h1 className="title-text">"</h1>
        </div>
        <div className="post-info">
          <p className="author-text">{author}-</p>
          <p className="date-text">{date}</p>
        </div>
        <div className={getBtnContainerClass}>
          <button
            className="btn btn-danger delete-btn"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
          <button className={getEditBtnClass} onClick={toggleEditBtnClick}>
            {editBtnText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
