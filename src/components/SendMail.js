import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "../context/authProvider";
import emailjs from "@emailjs/browser";
const { useLocation } = "react-router-dom ";
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
      email: "dikeekwelie@gmail.com",
      order_id: _id,

      orders: goods.map((good) => {
        return {
          name: good.name,
          units: good.qty,
          price: numberWithCommas(parseFloat(good.price * good.qty).toFixed(2)),
        };
      }),
      cost: {
        shipping: 0,
        tax: parseFloat(0.07 * grandTotal).toFixed(2),
        total: numberWithCommas(
          parseFloat(grandTotal + grandTotal * 0.07).toFixed(2),
        ),
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
      <p>Am email with your order details has been sent to you.</p>
    </div>
  );
};

export default SendMail;
