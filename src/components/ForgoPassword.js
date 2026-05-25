import React, { useState, useContext } from "react";
import emailjs from "@emailjs/browser";
import AuthContext from "../context/authProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [link, setLink] = useState("");
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const publicKey = "WomkoMTNuMoQKJO0K";
  const serviceId = "service_w6jsnfc";
  const templateId = "template_zexwf7h";
  console.log(window);
  console.log(`${window.location.host} /${window.location.hash}`);
  console.log(auth.users);
  const verifyEmail = async () => {
    try {
      const userEmail = auth.users.find(
        (user) => user.email === email && user._id === auth.picker,
      );

      let templateParams = {
        email,
        link: `https://${window.location.host}/#user-settings`,
      };
      if (userEmail) {
        setIsEmailSent(true);
        const response = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          publicKey,
        );
        console.log(response);
      } else return;
    } catch (error) {}
    // console.log(userEmail);
    setLink(`${window.location.host}/use-settings`);
  };

  return (
    <div>
      {isEmailSent ? (
        <article>
          <p>we have an email to '' head over there to reset your password</p>
        </article>
      ) : (
        <form>
          <label>What is your email address?</label>
          <br />
          <input
            placeholder="your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
      )}
      <button onClick={verifyEmail}>Submit</button>
    </div>
  );
};

export default ForgotPassword;
