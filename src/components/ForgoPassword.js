import React, { useState, useContext, useEffect, useReducer } from "react";
import emailjs from "@emailjs/browser";
import AuthContext from "../context/authProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../app/api/axios";
import reducer from "../reducer";
import initialState from "../store";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [link, setLink] = useState("");
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const publicKey = "WomkoMTNuMoQKJO0K";
  const serviceId = "service_w6jsnfc";
  const templateId = "template_zexwf7h";
  const axiosPrivate = useAxiosPrivate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const now = Date.now();
  const getUsers = async () => {
    // console.log(response.data);
  };
  const verifyEmail = async (e) => {
    e.preventDefault();
    console.log(email)
    const response = await axios.get("/special-users");

    try {
      const userEmail = response.data.find(
        (user) => user.email === email && user.email === email,
      );

      let templateParams = {
        email,
        link: `https://${window.location.host}/#reset-password?email=${email}&elapse=${now}`,
        biz: "Retail Solutions"
      };
      if (userEmail) {
        const response2 = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey,
        );  
        console.log(response)
        if (response2){
          setIsEmailSent(true);

        }
      } else {
        dispatch({ type: "cancel", payload: true });
        dispatch({
          type: "errMsg",
          payload: "email entered does not match any in our database",
        });
        setTimeout(() => {
          dispatch({ type: "cancel", payload: false });
          dispatch({ type: "errMsg", payload: "" });
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
    setLink(`${window.location.host}/use-settings`);
  };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  return (
    <div className="forgot-password">
      {isEmailSent ? (
        // <article>
        <p className="delete">
          We have sent an email to "{email}" head over there to reset your
          password.
        </p>
      ) : (
        // </article>
        <form className="forgot-password-form">
          <label>What is your email address?</label>
          <input
            placeholder="your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
          />
          <br />
          <button onClick={verifyEmail}>Submit</button>
        </form>
      )}
      {state.cancel && <p className="delete">{state.errMsg}</p>}
    </div>
  );
};

export default ForgotPassword;
