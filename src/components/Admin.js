import Users from "./Users";
import { Link, useLocation } from "react-router-dom";
import UserSelect from "./UserSelect";
import useAuth from "../hooks/useAuth";
import { useState, useEffect, useContext, useReducer } from "react";
import axios from "../app/api/axios";
import AuthContext from "../context/authProvider";
import multiLinks from "./multiLinks";
import reducer from "../reducer";
import initialState from "../store";

const Admin = () => {
  const { users, setAtHome, atHome, setIsRotated } = useContext(AuthContext);
  const { auth } = useAuth();
  const location = useLocation();
  const [currentPerson, setCurrentPerson] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const falseIsRotated = () => {
    setIsRotated(false);
  };
  const falseHome = () => {
    setAtHome(false);
  };

  useEffect(() => {
    falseHome();
  }, []);
  return (
    <div className="admin" onClick={falseIsRotated}>
      <h3 className="admin-header">Admin</h3>

      {/* <Link to={"/order"}>Orders</Link> */}

      <section className="admin-links"></section>
      {!showSettings ? (
        <h4 className="users-header" style={{ textAlign: "center" }}>
          Users ({auth.users && auth.users.length})
        </h4>
      ) : (
        ""
      )}
      <div className="admin-links"></div>
      {<h2>Loading...</h2> && <Users />}
      <br />
      <div
        className="flexGrow"
        style={{
          textAlign: "center",
        }}
      >
        <button className="admin-home-button">
          <Link to="/home" className="admin-home-link">
            Home
          </Link>
        </button>
      </div>
      {/* </section> */}
    </div>
  );
};

export default Admin;
