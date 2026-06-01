import React from "react";

const AboutUs = () => {
  return (
    <div className="about-us">
      <h3>About Us</h3>
      <p>
        We offer web deveopment services for a diverse category of tech
        solutions.
      </p>
      <p>
        This application in an e commerce web application. It features automatic
        (or manual) inventory update, sales analytics, quick filteration of
        inventory depending on items quantity and much more.
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
