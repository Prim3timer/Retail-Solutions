import { useContext, useEffect, useReducer, useRef, useState } from "react";
import axios from "../app/api/axios";
import axiosPrivate from "../app/api/axios";
import initialState from "../store";
import reducer from "../reducer";
import { ItemContext } from "./Shop";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/authProvider";
import { format } from "date-fns";
import { Link, resolvePath } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";

const SingleItem = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const upArrow = "+";
  const downArrow = "-";
  const qtyRef = useRef("");
  // console.log(qtyRef.current.value);
  // console.log(state.transArray);
  const { auth, setAuth, users } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { falseIsRotated, currency, items, picUrl, footSize } =
    useContext(AuthContext);

  const [userId, setUserId] = useState("");
  const [index, setIndex] = useState(0);
  const [justPics, setJustPics] = useState([]);
  const [readMore, setReadMore] = useState(false);
  const [colour, setColour] = useState("");
  const [storage, setStorage] = useState("");
  const [price, setPrice] = useState("");
  const [priceIndex, setPriceIndex] = useState(0);

  const getItem = async () => {
    const useId = localStorage.getItem("memId");
    const memUser = localStorage.getItem("memUser");
    const goods = items.find((item) => item._id === useId);
    try {
      dispatch({
        type: "SINGLESHOE",
        payload: goods.availableFootSizes[0],
      });
      setColour(goods.availableColours[0]);
      setStorage(goods.availableStorage[0]);

      console.log(goods);
      if (!state.elItem) {
        throw new Error("no items found");
      }

      // console.log(response.data)
      const users = await axiosPrivate.get("/users");

      const currentUser =
        users &&
        users.data.users.find((user) => user._id === auth.picker && memUser);
      // console.log(currentUser.cart);
      setUserId(currentUser._id);

      //     const userItems = cartItems.data.filter((item) => item.userId === auth.picker)
      //     console.log(userItems)
      //   console.log('user items are: ', userItems)
      dispatch({ type: "SINGLEITEMARRAY", payload: currentUser.cart });
      // dispatch({ type: "SINGLESHOE", payload: state.elItem.size });
      setIsLoading(false);

      // console.log(goods);
      if (goods) {
        const newGoods = {
          ...goods,
          transQty: 1,
          price: goods.availablePrices[priceIndex],
          total: goods.availablePrices[priceIndex],
          // size: state.shoeSize,
        };
        const picsOnly =
          newGoods && newGoods.img.filter((item) => item.name !== "no image");
        // console.log(newGoods);
        dispatch({ type: "elItem", payload: newGoods });
        setJustPics(picsOnly);
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
      console.log(error.message);
    }
    // console.log(state.elItem);
  };

  const addToCart = async () => {
    console.log(state.shoeSize);
    dispatch({ type: "success", payload: true });
    try {
      console.log(auth);
      const { elItem } = state;
      const currentUser = users.find((user) => user._id === auth.picker);
      console.log(elItem);
      const actualItem = {
        name: elItem.name,
        id: elItem._id,
        category: elItem.category,
        quantity: elItem.qty,
        transQty: elItem.transQty,
        price: elItem.price,
        total: elItem.total,
        unitMeasure: elItem.unitMeasure,
        img: elItem.img,
        size: state.shoeSize,
        colour,
        storage,
      };

      console.log(actualItem);

      const foundItem = state.singleItemArray.find(
        (item) => item.name === actualItem.name,
      );
      if (actualItem.quantity <= 0) {
        dispatch({ type: "ALERTMSG", payload: "item is out of stock" });
      } else if (state.elItem.qty < qtyRef.current.value) {
        dispatch({
          type: "ALERTMSG",
          payload: `pls select qty less than or equal to ${numberWithCommas(Number(state.elItem.qty).toFixed(2))}`,
        });
        setTimeout(() => {
          dispatch({ type: "success", payload: false });
          // dispatch({type: 'ALERTMSG', payload: '' })
        }, 3000);
        dispatch({ type: "elItem", payload: 1 });
      } else if (foundItem) {
        dispatch({ type: "ALERTMSG", payload: "item already in cart" });
      } else {
        const response = await axiosPrivate.post(
          `/users/sessions/${auth.picker}`,
          actualItem,
        );

        dispatch({ type: "ALERTMSG", payload: response.data.message });
        setTimeout(() => {
          dispatch({ type: "success", payload: false });

          dispatch({ type: "ALERTMSG", payload: "" });
        }, 3000);
      }
    } catch (error) {
      console.log(error.message);
    }
    // finally {
    //   qtyRef.current.value = ''
    // }
  };

  const onShoeSizeChange = (e) => {
    // console.log(e.target.value);
    dispatch({ type: "SINGLESHOE", payload: e.target.value });
    // setUnitMeasure(e.target.value)
  };
  {
    console.log(state.elItem);
  }

  // Rhinohorn1#
  const now = new Date();
  const date = format(now, "dd/MM/yyyy\tHH:mm:ss");

  const doneSales = async (e) => {
    e.preventDefault();
    try {
      const { elItem } = state;
      state.singleItemArray.push(elItem);
      const goodsObject = {
        cashier: auth.user,
        cashierID: auth.picker,
        goods: state.singleItemArray,
        grandTotal: elItem.total,
        date,
      };

      const { SingleItemArray, total } = state;
      // transArray.push(elItem)
      if (goodsObject) {
        try {
          const dynamTransQty =
            state.elItem.unitMeasure === "Piece (pc)" ||
            state.elItem.unitMeasure === "Plate (Plt)" ||
            state.elItem.unitMeasure === "Dozen (dz)" ||
            state.elItem.unitMeasure === "Bottle (Btl)" ||
            state.elItem.unitMeasure === "Pair (pr)"
              ? state.elItem.transQty
              : Number(qtyRef.current.value);

          const item = [
            { userId, name: "buy now" },
            {
              id: elItem._id,
              transQty: dynamTransQty,
              name: elItem.name,
              total: elItem.total,
              unitMeasure: elItem.unitMeasure,
              size: state.shoeSize,
              colour,
              storage,
              // priceIndex,
            },
          ];

          if (
            state.elItem.qty >= qtyRef.current.value ||
            state.elItem.qty >= state.elItem.transQty
          ) {
            const response = await axios.post(
              "/sessions/create-checkout-session",
              item,
            );
            if (response) {
              window.location = response.data?.session?.url;
            }
          } else if (
            (state.elItem.qty > 0 &&
              state.elItem.qty < state.elItem.transQty) ||
            state.elItem.qty < qtyRef.current.value
          ) {
            dispatch({ type: "success", payload: true });
            dispatch({
              type: "ALERTMSG",
              payload: `pls select qty less than or equal to ${numberWithCommas(Number(state.elItem.qty).toFixed(2))}`,
            });

            // dispatch({ type: 'elItem', payload: 1 })
            setTimeout(() => {
              dispatch({ type: "success", payload: false });
              // dispatch({type: 'ALERTMSG', payload: '' })
            }, 3000);
          } else {
            dispatch({ type: "success", payload: true });
            dispatch({ type: "ALERTMSG", payload: "item is of stock" });
            setTimeout(() => {
              dispatch({ type: "success", payload: false });
            }, 3000);
          }
        } catch (error) {
          console.error(error);
        }

        dispatch({ type: "errMsg", payload: "Transactons Complete" });
        dispatch({ type: "qtyArray", payload: [] });
        setTimeout(() => {
          dispatch({ type: "errMsg", payload: "" });
        }, 1000);
      } else throw Error("no item purchased");

      state.paidAmount = 0;
      state.balance = 0;
    } catch (error) {
      dispatch({ type: "errMsg", payload: "no item purchased" });
    }
  };

  // console.log(state.elItem.description.length)

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleIndex = (i) => {
    setIndex(i);
  };

  const checkNumber = (number) => {
    if (number > justPics.length - 1) {
      return 0;
    }
    if (number < 0) {
      return justPics.length - 1;
    }
    return number;
  };

  const higher = () => {
    setIndex((index) => {
      let newIndex = index + 1;
      return checkNumber(newIndex);
    });
  };

  const lower = () => {
    setIndex((index) => {
      let newIndex = index - 1;
      return checkNumber(newIndex);
    });
  };

  const increase = (i) => {
    dispatch({ type: "INCREMENT" });
  };
  const decrease = () => {
    dispatch({ type: "SHOPDECREMENT" });
  };

  const handleColour = (e, i) => {
    setColour(e.target.value);
  };
  const handleStorage = (e, i) => {
    const strorageIndex = state.elItem.availableStorage.indexOf(e.target.value);
    setPriceIndex(strorageIndex);
    setStorage(e.target.value);
  };

  useEffect(() => {
    getItem();
  }, [state.alertMsg]);

  useEffect(() => {
    dispatch({ type: "SINGLETOTAL" });
  }, [state.elItem.transQty]);

  return isLoading ? (
    <h2 className="single-item">Loading...</h2>
  ) : (
    <div>
      {state.elItem && (
        <article className="single-item" onClick={falseIsRotated}>
          <article className="inner-single-item">
            {/* <h2>Single Item</h2> */}
            <section className="single-image-container">
              <p>{state.elItem.name}</p>
              <img
                className="single-item-image"
                src={`${picUrl}/images/${state.elItem.name}/${state.elItem.img[index].name}`}
                alt={state.elItem.name}
              />

              <article className="shop-big-img">
                <p onClick={lower}>
                  <FaChevronLeft />
                </p>
                <p onClick={higher}>
                  {" "}
                  <FaChevronRight />
                </p>
              </article>
              <div className="single-item-array">
                {justPics &&
                  justPics.map((image, i) => {
                    // console.log(image);
                    return (
                      <img
                        className={i === index ? "onview" : "no-onview"}
                        src={`${picUrl}/images/${state.elItem.name}/${image.name}`}
                        onClick={() => handleIndex(i)}
                        alt={image.name}
                      />
                    );
                  })}
              </div>
            </section>
            <p
              className={state.elItem.qty == 0 ? "invent-alarm" : "invent-info"}
            >
              {state.elItem.qty <= 0 ? "out of stock" : ""}
            </p>
            <div className="single-item-texts">
              <p className="description">
                {readMore
                  ? state.elItem.description
                  : `${state.elItem.description.substring(0, 37)}`}
                <span
                  className="show-more"
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore
                    ? " show less"
                    : state.elItem.description.length >= 36
                      ? "...read more"
                      : ""}
                </span>
              </p>
              <article className="qty-measure-size-colour-storage">
                <section className="qty-cont">
                  {state.elItem.unitMeasure === "Piece (pc)" ||
                  state.elItem.unitMeasure === "Plate (Plt)" ||
                  state.elItem.unitMeasure === "Dozen (dz)" ||
                  state.elItem.unitMeasure === "Bottle (Btl)" ||
                  state.elItem.unitMeasure === "Pair (pr)" ? (
                    <div className="single-plus-input">
                      <p onClick={decrease}>
                        <FaMinus />
                      </p>
                      <p>{state.elItem.transQty}</p>
                      <p onClick={increase}>
                        <FaPlus />
                      </p>
                      <p id="cart-unit">
                        {state.elItem.unitMeasure.split(" ")[1].slice(1, -1)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        className="qty-input"
                        type="text"
                        ref={qtyRef}
                        value={
                          state.elItem.qty === 0
                            ? state.elItem.qty
                            : state.elItem.transQty
                        }
                        // onClick={() => dispatch({ type: 'blank', payload: '' })}
                        onChange={(e) =>
                          dispatch({
                            type: "CARTFIELDCHANGE",
                            payload: e.target.value,
                          })
                        }
                      />
                      <span id="cart-unit">
                        {state.elItem.unitMeasure.split(" ")[1].slice(1, -1)}
                      </span>
                    </div>
                  )}

                  <p className="no-qty-alert">
                    {state.elItem.qty === ""
                      ? "invalid quantity"
                      : state.elItem.qty === 0
                        ? "out of stock"
                        : ""}
                  </p>
                </section>
                {state.shoeSize?.length && (
                  <div className="single-size-container">
                    <label>size</label>
                    <select
                      className="size-options"
                      size={"1"}
                      value={state.shoeSize}
                      onChange={(e) => onShoeSizeChange(e)}
                    >
                      {state.elItem.availableFootSizes.map((size) => {
                        return (
                          <option className="update-form-unit-measure">
                            {size}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                {state.elItem.availableColours?.length ? (
                  <div className="single-size-container">
                    <label>colour</label>
                    <select
                      className="size-options"
                      size={"1"}
                      value={colour}
                      onChange={(e) => handleColour(e)}
                    >
                      {state.elItem.availableColours.map((colour, i) => {
                        return <option>{colour}</option>;
                      })}
                    </select>
                  </div>
                ) : (
                  ""
                )}
                {state.elItem.availableStorage?.length ? (
                  <div className="single-size-container">
                    <label>storage</label>
                    <select
                      className="size-options"
                      size={"1"}
                      value={storage}
                      onChange={(e) => handleStorage(e)}
                    >
                      {state.elItem.availableStorage.map((store, i) => {
                        return <option>{store}</option>;
                      })}
                    </select>
                  </div>
                ) : (
                  ""
                )}
              </article>
              {/* {console.log("storage is: ", state.elItem.availableStorage)} */}
              {/* 
              {state.elItem.availableStorage.length !== 0 ? (
                <fieldset>
                  <legend>storage select</legend>
                  <ul className="storage-container">
                    {state.elItem.availableStorage.map((storage, i) => (
                      <div>
                        <li>{storage}GB</li>
                        <input
                          className="single-item-colour"
                          type="radio"
                          name="storage"
                          value={storage}
                          onClick={(e) => handleStorage(e, i)}
                        />
                      </div>
                    ))}
                  </ul>
                </fieldset>
              ) : (
                ""
              )} */}
            </div>
            <h3>
              {currency}
              {/* {console.log(state.elItem)} */}
              {numberWithCommas(parseFloat(state.elItem.total).toFixed(2))}
            </h3>
            <section className="cart-action">
              <button onClick={doneSales}>Buy Now</button>
              <button onClick={addToCart}>Add to Cart</button>
              <Link to={"/cart"} className="cart-action-link">
                {" "}
                <button className="cart-action-button"> View Cart</button>
              </Link>
            </section>
            <h3
              className={state.success ? "update-alert" : "hide-update-alert"}
            >
              {state.alertMsg}
            </h3>
          </article>
        </article>
      )}
    </div>
  );
};

export default SingleItem;
