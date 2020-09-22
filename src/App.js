import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Wall from "./components/Wall/Wall";
import InputField from "./components/InputField/InputField";
import Login from "./components/Login/Login";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";

const auth = firebase.auth();

function App() {
  const [{ user }, dispatch] = useStateValue();

  
  if (user.signedAsAnonymous || user.signedAsUser) {
    return (
      <div className="app-container">
        <Header />
        <Wall />
        <InputField />
      </div>
    );
  } else {
    return (
      <div className="app-container">
        <Login />
      </div>
    );
  }
}

export default App;
