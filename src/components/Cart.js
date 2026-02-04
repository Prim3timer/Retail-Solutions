import { useEffect, useReducer, useState, useRef, useContext } from "react";
import initialState from "../store";
import reducer from "../reducer";
import axios from "../app/api/axios";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/authProvider";

const Payment = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cartItems, setCartItems] = useState([]);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [excessQty, setExcessQty] = useState("");
  const [userId, setUserId] = useState("");
  const [itemImage, setItemImage] = useState("");
  const cartQtyRef = useRef(null);
  const { auth, setAuth } = useAuth();
  const { falseIsRotated, currency, items, picUrl, footSize } =
    useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

  const memUser = localStorage.getItem("memUser");

  const getItems = async () => {
    const currentItems = await axios.get("/items");

    console.log(cartItems);
    setCurrentCartItems(currentItems.data.items);
    console.log(auth.picker);
    console.log(memUser);
    try {
      dispatch({ type: "items", payload: items });
    } catch (error) {
      console.error(error);
    }
  };

  const getCartItems = async () => {
    try {
      const response = await axiosPrivate.get("/users");
      console.log(response.data);
      const currentUser = response.data.users.find(
        (user) => user._id === memUser,
      );
      console.log(memUser);
      setCartItems(currentUser.cart);
      console.log(currentUser);
      const newUseritems = currentUser.cart.map((item) => {
        return { ...item, amount: item.quantity };
      });
      console.log(newUseritems);
      setUserId(currentUser._id);
      if (newUseritems) {
        dispatch({ type: "CARTARRAY", payload: newUseritems });

        // state.cartArray.push(state.cart.total)
        console.log(newUseritems);
      }
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  const doneSales = async () => {
    console.log(currentCartItems);
    console.log(state.cartArray);
    const latest = cartItems.map((item) => {
      const done = currentCartItems.find(
        (currentItem) => currentItem._id === item.id,
      );
      console.log(done);
      if (done) return { ...item, quantity: done.qty };
    });
    const now = new Date();

    try {
      console.log(latest);
      console.log(state.cartArray);
      const excessCheck = latest.filter(
        (item) => item.quantity < Number(item.transQty),
      );
      console.log(excessCheck);
      const excessItem = excessCheck.map((item) => item.name);
      console.log(excessItem);
      setExcessQty(excessItem);
      if (excessItem.length) {
        dispatch({ type: "success", payload: true });
        console.log(excessCheck);
        dispatch({
          type: "ALERTMSG",

          // grammer
          payload: `${excessItem.length > 1 ? "quantities" : "quantity"} of ${excessItem.map((item) => item).join(", ")} slected ${excessItem.length > 1 ? "exceed" : "exceeds"} the quantity in stock`,
        });
        setTimeout(() => {
          dispatch({ type: "success", payload: false });
        }, 5000);
        // change back to 1 the quantities of the items whose values exceed the that in stock.
        excessCheck.map((item) =>
          dispatch({ type: "MAINCARTFIELD", payload: 1, id: item.id }),
        );
      } else {
        const oneElement = [{ userId, name: "checkout" }];
        const newerArray = [...oneElement, ...state.cartArray];
        console.log(newerArray);
        const response = await axios.post(
          `/sessions/create-checkout-session`,
          newerArray,
        );

        if (response) {
          window.location = response.data?.session?.url;
          console.log(response.data);
        }
      }
    } catch (error) {
      console.log(error.message);
      dispatch({ type: "errMsg", payload: "no item purchased" });
    }
  };

  const removeItem = async (id) => {
    console.log({ id });
    try {
      const response = await axiosPrivate.delete(
        `/users/sessions/delete?itemId=${id}&userId=${auth.picker}`,
      );
      dispatch({ type: "REMOVECARTITEM", payload: id });
      console.log(response.data);
      if (response) {
        dispatch({ type: "success", payload: true });
        dispatch({ type: "ALERTMSG", payload: response.data });
        setTimeout(() => {
          dispatch({ type: "success", payload: false });
          dispatch({ type: "ALERTMSG", payload: "" });
        }, 3000);
        dispatch({ type: "ALERTMSG", payload: response.data });
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "CLEARCART" });
      const id = auth.picker;
      if (cartItems.length) {
        const response = await axiosPrivate.delete(`/users/clear/${id}`);
        if (response) {
          setCartItems([]);
          dispatch({ type: "success", payload: true });
          dispatch({ type: "ALERTMSG", payload: response.data });
          setTimeout(() => {
            dispatch({ type: "success", payload: false });
            dispatch({ type: "ALERTMSG", payload: "" });
          }, 3000);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const increase = (id) => {
    dispatch({ type: "CARTINCREMENT", payload: id });
  };

  const decrease = (id) => {
    dispatch({ type: "CARTDECREMENT", payload: id });
  };

  const onShoeSizeChange = (e, id) => {
    console.log(id);
    console.log(e.target.value);
    dispatch({ type: "SHOESIZE", payload: e.target.value, id });
    // setUnitMeasure(e.target.value)
  };

  const options = footSize.map((size) => {
    return <option className="update-form-unit-measure">{size}</option>;
  });

  useEffect(() => {
    getItems();
  }, [state.mainCartField]);
  useEffect(() => {
    getCartItems();
  }, []);

  useEffect(() => {
    dispatch({ type: "GETCARTTOTAL" });
  }, [state.cartArray]);

  const plural = state.cartArray.length === 1 ? "" : "s";
  const plural2 = state.cartAmount.length === 1 ? "" : "s";

  return !state.cartArray ? (
    <h2>Loading</h2>
  ) : (
    <div className="checkout" onClick={falseIsRotated}>
      <div className="cart-header-status">
        <h5>Your Cart:</h5>

        {state.cartArray.length ? (
          <h4>
            {parseFloat(state.cartAmount).toFixed(2)} item{plural2},{" "}
            {state.cartArray.length} product{plural}
          </h4>
        ) : (
          "Empty"
        )}
      </div>

      <div className="cart-main-container">
        {state.cartArray &&
          state.cartArray.map((item) => {
            // console.log(item.img[0].name)
            console.log(item);
            return (
              <article className="cart-items-container">
                <p>{item.name}</p>
                {item.img ? (
                  <img
                    className="cart-item-image"
                    src={`${picUrl}/images/${item.name}/${item.img[0].name}`}
                    alt={item.name}
                  />
                ) : (
                  ""
                )}
                <section>
                  {/* <h3>price: ${item.price}</h3> */}
                  {item.unitMeasure === "Piece (pc)" ||
                  item.unitMeasure === "Plate (Plt)" ||
                  item.unitMeasure === "Dozen (dz)" ||
                  item.unitMeasure === "Bottle (Btl)" ||
                  item.unitMeasure === "Pair (pr)" ? (
                    <div className="plus-input">
                      <p onClick={() => decrease(item.id)}>
                        <FaMinus />
                      </p>
                      <p>{item.transQty}</p>
                      <p onClick={() => increase(item.id)}>
                        <FaPlus />
                      </p>
                      <p id="cart-unit">
                        {item.unitMeasure.split(" ")[1].slice(1, -1)}
                      </p>{" "}
                      <p
                        onClick={() => removeItem(item.id)}
                        className="cart-trash"
                        id="cart-trash"
                      >
                        <FaTrash role="button" />
                      </p>
                    </div>
                  ) : (
                    <div className="input-input">
                      <input
                        className="cart-qty"
                        ref={cartQtyRef}
                        value={item.transQty}
                        onChange={(e) =>
                          dispatch({
                            type: "MAINCARTFIELD",
                            payload: e.target.value,
                            id: item.id,
                          })
                        }
                      />
                      <p id="cart-unit">
                        {item.unitMeasure.split(" ")[1].slice(1, -1)}
                      </p>

                      <p
                        onClick={() => removeItem(item.id)}
                        className="cart-trash"
                        id="cart-trash"
                      >
                        <FaTrash role="button" />
                      </p>
                    </div>
                  )}
                  {item.category === "Foot Wears" ? (
                    <div className="cart-item-size">
                      <label>size</label>
                      <select
                        // className="size-options"
                        size={"1"}
                        value={item.size}
                        onChange={(e) => onShoeSizeChange(e, item.id)}
                      >
                        {options}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}{" "}
                  <h4 className="cart-colour">{item.colour}</h4>
                  {console.log(item.colour)}
                  {/* <p>size: {item.size}</p> */}
                  <h4>
                    {currency}
                    {numberWithCommas(parseFloat(item.total).toFixed(2))}
                  </h4>
                </section>
              </article>
            );
          })}
      </div>
      <h3>
        Total: {currency}
        {numberWithCommas(parseFloat(state.totalCart).toFixed(2))}
      </h3>
      {/* <hr></hr> */}
      {/* <hr></hr> */}
      <div className="cart-action">
        <button onClick={doneSales}>Checkout</button>
        <Link to={"/categories"} className="cart-shop-linker">
          {" "}
          <button className="cart-action-button2"> Shop</button>
        </Link>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
      <h3 className={state.success ? "delete" : "hide-update-alert"}>
        {state.alertMsg}
      </h3>
    </div>
  );
};

export default Payment;
