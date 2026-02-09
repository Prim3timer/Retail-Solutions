import reducer from "../reducer";
import initialState from "../store";
// import SearchItem from "./SearchItem";
import { useEffect, useReducer, useContext, useState } from "react";

import AuthContext from "../context/authProvider";
import { useNavigate, useLocation } from "react-router-dom";
// import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import axios from "../app/api/axios";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
const { v4: uuid } = require("uuid");

const Shop = () => {
  // window.history.pushState(null, null, '/home');
  const [state, dispatch] = useReducer(reducer, initialState);
  const { falseIsRotated, currency, items, oneItem, picUrl } =
    useContext(AuthContext);
  const [shopItems, setShopItems] = useState([]);
  const [search2, setSearch2] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [readMore, setReadMore] = useState(true);
  const cat = localStorage.getItem("category");
  const getItems = async () => {
    console.log(items);
    dispatch({ type: "clear" });
    try {
      // dispatch({type: 'errMsg', payload: 'loading...'})
      // const response = await axiosPrivate.get('/items')
      dispatch({ type: "errMsg", payload: "" });

      // dispatch({type: 'items', payload: items})
      // console.log(response.data.items )

      const classifiedItems = items.filter((item) => item.category === cat);
      console.log(classifiedItems);

      const filterItems = classifiedItems.filter((item) =>
        item.name.toLowerCase().includes(state.search.toLowerCase()),
      );

      const secondFilterate = filterItems.filter((item) => item.gender !== "");

      const finalProduct = filterItems.filter((item) =>
        item.gender.includes(search2),
      );

      // console.log(secondFilterate);
      setShopItems(finalProduct);
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  useEffect(() => {
    getItems();
  }, [state.search, search2]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return !items ? (
    <h2 className="shop">Loading...</h2>
  ) : (
    <div className="shop" onClick={falseIsRotated}>
      {/* <button onClick={handleGender}>gendered</button> */}
      <div className="home-shop">
        <h4> {cat.includes("Foot Wears") ? cat.substring(0, 10) : cat}</h4>
      </div>
      <form className="searcher">
        <input
          placeholder="search items"
          value={state.search}
          onChange={(e) =>
            dispatch({ type: "search", payload: e.target.value })
          }
        />
        <input
          placeholder="filter by gender eg 'ladies'"
          value={search2}
          onChange={(e) => setSearch2(e.target.value)}
        />
      </form>
      <section className="shop-inner-container">
        {shopItems &&
          shopItems.map((item, i) => {
            console.log(item);
            return (
              <Link to={"/single-item"} className="linker" key={item._id}>
                <article
                  className="shopping-items"
                  onClick={() => oneItem(item._id)}
                >
                  {item.img.length && (
                    <img
                      className="shop-img"
                      src={`${picUrl}/images/${item.name}/${item.img[0].name}`}
                      alt={item.name}
                    />
                  )}
                  <div className="shop-item-texts">
                    <h4 className="shop-item-price">
                      {currency}
                      {numberWithCommas(item.availablePrices[0])}
                    </h4>
                    <h4
                      style={
                        {
                          // text
                        }
                      }
                    >
                      {item.name}
                    </h4>
                    {/* <p className={item.qty < 20 ? "invent-alarm" : "invent-info"}>{item.qty > 0 ? `${item.unitMeasure === 'Kilogram (kg)' || item.unitMeasure === 'Kilowatthour (kWh)'
                    || item.unitMeasure === 'Kilowatt (kW)' || item.unitMeasure === 'Pound (lbs)' || item.unitMeasure === 'Litre (L)' ? parseFloat(item.qty).toFixed(2) : item.qty}${item.unitMeasure.split(' ')[1].slice(1, -1)} left` : 'out of stock'}</p> */}
                    <p
                      className={item.qty == 0 ? "invent-alarm" : "invent-info"}
                    >
                      {item.qty <= 0 ? "out of stock" : ""}
                    </p>

                    <p>{item.description.substring(0, 30)}...</p>
                  </div>
                </article>
              </Link>
            );
          })}
        <h2>{state.errMsg}</h2>
      </section>
    </div>
  );
};
export default Shop;
