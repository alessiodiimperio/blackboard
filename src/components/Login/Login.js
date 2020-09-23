import "./Login.css";
import { useState } from "react";
import { useStateValue } from "../../StateProvider";
import React from "react";
import firebase from "firebase";

function Login() {
  const auth = firebase.auth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userAPIUrl =
    "https://us-central1-wall-of-tags.cloudfunctions.net/posts/user/";

  const [{ user }, dispatch] = useStateValue();

  const startSpinner = () => {
    dispatch({ type: "START_LOADING" });
  };
  const stopSpinner = () => {
    dispatch({ type: "STOP_LOADING" });
  };

  const handleCreateUser = (request, response) => {
    if (!username || !email || !password) {
      displayError("All fields are required to create a new user.");
      return;
    }
    try {

      startSpinner();
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          const user = {
            username: username,
            email: email,
            id: result.user.uid,
            signedAsAnonymous: false,
            signedAsUser: true,
          };
          fetch(userAPIUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          })
            .then((response) => {
              stopSpinner();
              if (response.ok) {
                dispatch({
                  type: "INIT_USER",
                  user: user,
                });
              } else {
                displayError("Unknown error");
              }
            })
            .catch((error) => {
              stopSpinner();
              displayError(error.message);
            })
          })
            .catch(error => {
            stopSpinner();
            displayError(error.message)
          });
      } catch(error){
        displayError(error.message);
      }
  }

  const handleSignInUser = async () => {
    if (!email || !password) {
      displayError("Email and password are required for signing in.");
      return;
    }
    try {
      startSpinner();
      const result = await auth.signInWithEmailAndPassword(email, password);
      const data = await fetch(userAPIUrl + result.user.uid);
      const userObject = await data.json();
      console.log("userobject ", userObject);

      const user = {
        username: userObject.username,
        email: userObject.email,
        id: userObject.id,
        signedAsAnonymous: false,
        signedAsUser: true,
      };
      //User create success add to state
      stopSpinner();

      dispatch({
        type: "SIGN_IN",
        user: user,
      });
    } catch (error) {
      //Oh shit something went wrong. stop spinner and show errorMSG
      stopSpinner();
      displayError(error.message);
    }
  };
  const tryLogin = (e) => {
    console.log('in function try login')
    if(e.key === 'Enter'){
      handleSignInUser()
    }
  }
  const displayError = (error) => {
    //Unhide div with errorMessage
    const errorText = document.querySelector(".error-message");
    errorText.style.display = "block";
    errorText.textContent = error;
  };
  const handleUsernameChange = (element) => {
    setUsername(element.target.value);
  };
  const handleEmailChange = (element) => {
    setEmail(element.target.value);
  };
  const handlePasswordChange = (element) => {
    setPassword(element.target.value);
  };
  const handleAnonLogIn = () => {
    startSpinner();

    const user = {
      username: "Anonymous",
      email: "",
      id: "",
      signedAsAnonymous: true,
      signedAsUser: false,
    };
    stopSpinner();

    dispatch({
      type: "INIT_USER",
      user: user,
    });
  };
  return (
    <div className="login-container">
      <div className="welcome-container">
        <h1 className="welcome-text">Welcome to Blackboard</h1>
      </div>
      <div className="login-box">
        <input
          onChange={handleUsernameChange}
          className="login-username"
          type="text"
          placeholder="Username..."
        />
        <input
          onChange={handleEmailChange}
          className="login-email"
          type="text"
          placeholder="Email..."
        />
        <input
          onChange={handlePasswordChange}
          className="login-password"
          type="password"
          placeholder="Password..."
          onKeyPress={tryLogin}
        />
        <div className="buttons">
          <button className="btn-secondary" onClick={handleCreateUser}>
            Create
          </button>
          <button className="btn-primary" onClick={handleSignInUser}>
            Sign In
          </button>
          <button className="btn-dark" onClick={handleAnonLogIn}>
            Post Anonymously
          </button>
        </div>
        <p className="warning-text error-message"></p>
      </div>
    </div>
  );
}

export default Login;
