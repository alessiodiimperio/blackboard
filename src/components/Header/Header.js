import "./Header.css";

import React from "react";
import { auth } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import PersonIcon from "@material-ui/icons/Person";
import { ReactComponent as AnonIcon } from "../../icons/anonymous.svg";

function Header() {
  const [{ user }, dispatch] = useStateValue();

  const handleSignOut = () => {
    console.log(user);

    if (user.signedAsAnonymous) {
      const user = {
        username: "",
        email: "",
        id: "",
        signedAsAnonymous: false,
        signedAsUser: false,
      };
      dispatch({
        type: "SIGN_OUT",
        user: user,
      });
    } else {
      auth
        .signOut()
        .then(() => {
          const user = {
            username: "",
            email: "",
            id: "",
            signedAsAnonymous: false,
            signedAsUser: false,
          };
          dispatch({
            type: "SIGN_OUT",
            user: user,
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  return (
    <div className="header-container">
      <div className="header-text">
        <p>Posting as {user.username}</p>
      </div>
      <div className="header-avatar">
        <button className="header-btn" onClick={handleSignOut}>
          {!user.id ? (
            <AnonIcon style={{ fontSize: 70 }} className="header-icon" />
          ) : (
            <PersonIcon style={{ fontSize: 70 }} className="header-icon" />
          )}
        </button>
        <span className="sign-out-btn-txt">Leave</span>
      </div>
    </div>
  );
}

export default Header;
