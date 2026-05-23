import React, { useContext, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import AuthContext from "../context/authProvider";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { auth } = useContext(AuthContext);

  const serviceId = "service_w6jsnfc";
//   const templateId = "template_9u0s0r8";
  const publicKey = "WomkoMTNuMoQKJO0K";
  const privateKey = "f5fHgbJA_Fp-FHsdN";


  const userId = auth.picker;
  const getUserEmail = () => {
    const user = auth.users.find((user) => user._id === userId);
    console.log(user.email);
    setEmail(user.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  useEffect(() => {
    getUserEmail();
  }, []);
  return (
    <div>
      <h3>Contact Us</h3>
      <form className="contact-form">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="subject"
        />
        <textarea
          value={message}
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button>submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
