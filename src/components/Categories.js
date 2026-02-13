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

  const [filterate, setFilterate] = useState([]);
  const getDistinctCategories =
    items &&
    items.map((item) => {
      return item.category;
    });

  const [state, dispatch] = useReducer(reducer, initialState);

  const uniqueArray = [...new Set(getDistinctCategories)];
  console.log(uniqueArray);
  const filterCat = () => {
    console.log(state.search);
    const newArray = uniqueArray.filter((item) =>
      item.toLowerCase().includes(state.search.toLowerCase()),
    );
    setFilterate(newArray);
  };

  useEffect(() => {
    filterCat();
  }, [state.search]);
  return (
    <div className="shop">
      <div className="home-shop">
        <form className="searcher">
          <input
            placeholder="filter by category"
            value={state.search}
            onChange={(e) =>
              dispatch({ type: "search", payload: e.target.value })
            }
          />
        </form>
      </div>
      {getDistinctCategories.length ? (
        <article className="shop-inner-container">
          {filterate &&
            filterate.map((item, i) => {
              return <Category itemCat={item} key={i} />;
            })}
        </article>
      ) : (
        <h4>Empty List</h4>
      )}
    </div>
  );
};

export default Categories;
