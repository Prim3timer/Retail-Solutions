import initialState from "../store";
import { useEffect, useContext, useReducer, useState } from "react";
import reducer from "../reducer";
import axios, { axiosPrivate } from "../app/api/axios";
import AuthContext from "../context/authProvider";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { format } from "date-fns";
// import { retry } from "@reduxjs/toolkit/query"
import { FaTrashAlt } from "react-icons/fa";

import Unauthorized from "./Unauthorized";
import { Link } from "react-router-dom";

const GenShopping = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [showOne, setShowOne] = useState(false)
  const [oneId, setOneId] = useState("");
  const { auth } = useAuth();
  const [currentUser, setCurrentUser] = useState("");
  const {
    atHome,
    getUsers,
    currentUsers,
    setIsRotated,
    falseRotated,
    currency,
    users,
    oneShow,
    bizName,
  } = useContext(AuthContext);

  // const theDay = new Date(inv.date).getDate()
  //     const aDate = format(inv.date.substring(0, 10), `${theDay} MMM, yyyy`)
  const refresh = useRefreshToken();
  const getItems = async () => {
    const userId = localStorage.getItem("memUser");
    console.log(userId);
    try {
      console.log("hello users");
      // const users = await axios.get('/users')
      console.log(users);
      const response = await axiosPrivate.get("/transactions");

      const cashierTrans = response.data.filter(
        (item) => item.cashierID === userId,
      );
      console.log(currentUser);
      // dispatch({type: 'getNames', payload: response.data})
      cashierTrans.reverse();
      dispatch({ type: "getNames", payload: cashierTrans });

      const filterate = cashierTrans.filter((inner) =>
        inner.date.substring(0, 10).includes(state.search),
      );

      dispatch({ type: "getNames", payload: filterate });
    } catch (error) {
      console.log(error);
    }
  };

  const assertain = (id) => {
    if (auth.roles.includes(5150)) {
      dispatch({ type: "cancel", payload: true });

      dispatch({ type: "id", payload: id });
      const getItem =
        state.getNames && state.getNames.find((item) => item._id === id);
      dispatch({ type: "inItem", payload: getItem });
    } else {
      dispatch({ type: "isMatched", payload: true });
    }
  };
  const handleRemove = async () => {
    dispatch({ type: "cancel", payload: false });
    const response = await axios.delete(`/transactions/${state.id}`);
    // const newGraw = state.items && state.items.filter((item)=> item._id !== state.id)
    // e.preventDefault()
    // removeInventory(id)
    // await axios.delete(`/transactions/${id}`)

    const newGraw = state.getNames.filter((item) => item._id !== state.id);

    dispatch({ type: "getNames", payload: newGraw });
  };
  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }

    // if (state.isEdit){

    //     dispatch({type: 'isEdit', payload: false})
    // }
  };
  const generalRemain = () => {
    if (state.isMatched) dispatch({ type: "isMatched", payload: false });
    setIsRotated(false);
  };

  useEffect(() => {
    console.log("current user is : ", currentUser);
    getItems();
  }, [state.search]);

  // useEffect(()=> {

  // // if (sessionId){
  //     refresh()

  // // }
  // }, [ ])

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div
      className="receipts"
      onClick={generalRemain}

      // onClick={remainDelete}
    >
      <h2>Reciepts ({state.getNames.length})</h2>
      {/* <Link to="one-receipt"> */}
      <article id="form-cont">
        <form
          className="receipt-search-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            // id="receipt-search"
            className="searcher"
            type="text"
            role="searchbox"
            placeholder="Search by date"
            value={state.search}
            onChange={(e) =>
              dispatch({ type: "search", payload: e.target.value })
            }

            // https://www.npmjs.com/package/@react-google-maps/api
          />
        </form>

        {/* <SearchItem/> */}
      </article>

      {state.getNames &&
        state.getNames.map((item) => {
          const theDay = new Date(item.date).toString().substring(4, 25);
          // const theDay = new Date(item.date).toString(0, 10)

          return (
            <section key={item._id}>
              <Link
                to="/one-receipt"
                style={{
                  textDecoration: "none",
                }}
                onClick={() => oneShow(item._id)}
              >
                <article id="receipts">
                  {/* <h5>cashierID: {item.cashierID}</h5> */}
                  <h2 className="receipt-title">{bizName}</h2>
                  <p>{theDay}</p>
                  <p>{item._id}</p>
                  {item.goods &&
                    item.goods.map((good) => {
                      return (
                        <div className="goods-container">
                          <h4>{good.name}</h4>
                          <p>
                            Qty: {parseFloat(good.qty).toFixed(2)}
                            {good.unitMeasure.split(" ")[1].slice(1, -1)}
                          </p>
                          <p>
                            Unit Price: {currency}
                            {numberWithCommas(
                              parseFloat(good.price).toFixed(2),
                            )}
                          </p>
                          {good.size && <p>size: {good.size}</p>}
                          {good.colour && <p>color: {good.colour}</p>}
                          {good.storage && (
                            <p>
                              storage: {good.storage}{" "}
                              {good.storage == 1000 ? "TB" : "GB"}
                            </p>
                          )}
                          <p>
                            Sub Total:{" "}
                            {numberWithCommas(
                              parseFloat(good.total).toFixed(2),
                            )}
                          </p>

                          {/* <br/> */}
                        </div>
                      );
                    })}
                  <p>card ending in: ...{item.last4 ? item.last4 : ""}</p>
                  <h4 className="receipts-grand-total">
                    Grand Total: {currency}
                    {numberWithCommas(parseFloat(item.grandTotal).toFixed(2))}
                  </h4>

                  <h5>Cashier: {item.cashier}</h5>
                </article>
              </Link>

              {/* <h3 onClick={(id)=> handleRemove(item._id)} */}
              <h3
                onClick={(e) => assertain(item._id, e)}
                style={{
                  textAlign: "center",
                }}
              >
                <FaTrashAlt role="button" />
              </h3>
              <br />
            </section>
          );
          //    })
        })}

      <div className={state.cancel ? "delete" : "no-delete"}>
        <h3
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >
          Delete from Receipts
        </h3>
        <article className="delete-buttons">
          <button onClick={remainDelete}>No</button>
          <button
            onClick={handleRemove}
            style={{ backgroundColor: "red", borderColor: "red" }}
          >
            Yes
          </button>
        </article>
      </div>

      <div
        className={state.isMatched ? "authorization-alert" : "authorization"}
      >
        <h2
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >
          Unauthorized!
        </h2>
        <button onClick={generalRemain}>ok</button>
      </div>
    </div>
  );
};

export default GenShopping;
