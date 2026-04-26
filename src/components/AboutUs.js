import React from "react";

const AboutUs = () => {
  return (
    <div className="about-us">
      <h3>About Us</h3>
      <p>
        This application assists in day to day retail activities for
        supermarkets and other kinds of stores.
      </p>
      <p>
        It is quite extensive as it is applicable to both physical and online
        transactions.
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>To contact us:</span>
        <ul className="contact-us">
          <li> phone: +18028578325</li>
          <li> email: majicmethod@gmail.com</li>
        </ul>
      </p>
      <p>Thank You.</p>
    </div>
  );
};

export default AboutUs;
