import reducer from "../reducer";
import initialState from "../store";
// import SearchItem from "./SearchItem";
import { useEffect, useReducer, useContext, useState } from "react";

import AuthContext from "../context/authProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Category = ({ itemCat }) => {
  const { falseIsRotated, currency, items, oneItem, picUrl } =
    useContext(AuthContext);

  const firstItem = items.filter((item) => item.category === itemCat)[0];
  //   console.log(firstItem);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const showItemCat = () => {
    localStorage.setItem("category", itemCat);
  };

  return (
    <Link
      to={"/shop"}
      className="linker"
      onClick={showItemCat}
      //   onClick={showItemCat}
    >
      <article className="shopping-items">
        {firstItem.img.length && (
          <img
            className="shop-img"
            src={`${picUrl}/images/${firstItem.name}/${firstItem.img[0].name}`}
            alt={firstItem.name}
          />
        )}
        <div className="shop-firstItem-texts">
          {/* <h4 className="shop-firstItem-price">
            {currency}
            {numberWithCommas(firstItem.price)}
          </h4> */}
          <h4
            style={
              {
                // text
              }
            }
          >
            {itemCat.includes("Foot Wears")
              ? itemCat.substring(0, 10)
              : itemCat}
          </h4>
          {/* <p className={firstItem.qty < 20 ? "invent-alarm" : "invent-info"}>{firstItem.qty > 0 ? `${firstItem.unitMeasure === 'Kilogram (kg)' || firstItem.unitMeasure === 'Kilowatthour (kWh)'
                     || firstItem.unitMeasure === 'Kilowatt (kW)' || firstItem.unitMeasure === 'Pound (lbs)' || firstItem.unitMeasure === 'Litre (L)' ? parseFloat(firstItem.qty).toFixed(2) : firstItem.qty}${firstItem.unitMeasure.split(' ')[1].slice(1, -1)} left` : 'out of stock'}</p> */}
          {/* <p className={firstItem.qty == 0 ? "invent-alarm" : "invent-info"}>
            {firstItem.qty <= 0 ? "out of stock" : ""}
          </p> */}

          {/* <p>{firstItem.description.substring(0, 30)}...</p> */}
        </div>
      </article>
    </Link>
  );
};

export default Category;
