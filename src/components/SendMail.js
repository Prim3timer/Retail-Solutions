import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/authProvider";
import emailjs from "@emailjs/browser";
const SendMail = ({ currentTransaction }) => {
  const serviceId = "service_w6jsnfc";
  const templateId = "template_9u0s0r8";
  const publicKey = "WomkoMTNuMoQKJO0K";
  const privateKey = "f5fHgbJA_Fp-FHsdN";

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleSubmit = () => {
    console.log(currentTransaction);
    const { email, grandTotal, goods, _id } = currentTransaction;

    let templateParams = {
      email,
      order_id: _id,

      orders: goods.map((good) => {
        return {
          name: good.name,
          units: parseFloat(good.qty).toFixed(2),
          price: numberWithCommas(parseFloat(good.price).toFixed(2)),
        };
      }),
      cost: {
        shipping: 0,
        taxes: 0.7 * grandTotal,
        total: numberWithCommas(parseFloat(grandTotal).toFixed(2)),
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
