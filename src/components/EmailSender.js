import { useState } from "react";
import axios from "../app/api/axios";

const EmailSender = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const sendMail = async () => {
    const allThings = {
      email,
      subject,
      message,
    };
    try {
      const response = await axios.post(`/emailing`, allThings);
      if (response) {
        console.log("success");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h3>Email Sender</h3>
      <form class="email-form">
        <input
          type="text"
          placeholder="recipient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
        >
          {message}
        </textarea>
        <button onClick={sendMail}>Send Mail</button>
      </form>
    </div>
  );
};

export default EmailSender;
