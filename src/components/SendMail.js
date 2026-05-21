import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
const SendMail = ({ currentTransaction }) => {
  const serviceId = "service_d1lfnf9";
  const templateId = "template_62lkg69";
  const publicKey = "6I6Qx4fjEW_mAYlFD";

  const handleSubmit = () => {
    console.log(currentTransaction);
    const { email, grandTotal, goods, _id } = currentTransaction;
    console.log(_id, goods[0].name);
    const taxes = grandTotal * 0.07;

    let templateParams = {
      name: goods[0].name,
      email,
      order_id: _id,
      price: goods[0].price,
      cost: {
        shipping: 0,
        taxes,
        total: grandTotal,
      },
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending mail: ", error);
      });

    if (currentTransaction) {
    }
    // const trans = response.data.transaction
  };
  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <div className="emailing">
      <p>Thank you for your order</p>
      <p>We will send you tracking details as soon as your order ships</p>
    </div>
  );
};

export default SendMail;
