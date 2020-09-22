import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Wall from "./components/Wall/Wall";
import InputField from "./components/InputField/InputField";
import Login from "./components/Login/Login";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import { CircularProgress } from '@material-ui/core';

const auth = firebase.auth();

function App() {
  const [{ user, isLoading }, dispatch] = useStateValue();

  const getProgressClass = isLoading ? 'loading-icon loading-visible' : 'loading-icon loading-hidden';
  
  if (user.signedAsAnonymous || user.signedAsUser) {
    return (
      <div className="app-container">
        <CircularProgress size={100} className={getProgressClass} />
        <Header />
        <Wall / >
        <InputField />
      </div>
    );
  } else {
    return (
      <div className="app-container">
        <CircularProgress size={100} className={getProgressClass}/>
        <Login />
      </div>
    );
  }
}

export default App;
