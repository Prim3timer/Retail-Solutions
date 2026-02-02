import reducer from "../reducer";
import initialState from "../store";
// import SearchItem from "./SearchItem";
import { useEffect, useReducer, useContext, useState } from "react";

import AuthContext from "../context/authProvider";
import { useNavigate, useLocation } from "react-router-dom";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import Shop from "./Shop";
import Category from "./Category";

const Categories = () => {
  const { falseIsRotated, currency, items, oneItem, picUrl } =
    useContext(AuthContext);
  const getDistinctCategories = items.map((item) => {
    return item.category;
  });

  const uniqueArray = [...new Set(getDistinctCategories)];
  console.log(uniqueArray);
  return (
    <div>
      <div className="home-shop">
        <h2>Shop</h2>
      </div>
      <article className="shop-inner-container">
        {uniqueArray.map((item) => {
          return <Category itemCat={item} />;
        })}
      </article>
    </div>
  );
};

export default Categories;
