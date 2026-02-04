import React, { useContext, useEffect, useReducer, useState } from "react";
import initialState from "../store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import reducer from "../reducer";
import axios from "../app/api/axios";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { addDays, subDays } from "date-fns";
import AuthContext from "../context/authProvider";
import { format } from "date-fns";

const Order = () => {
  const { genTrans, setGenTrans, users } = useContext(AuthContext);

  console.log(users);
  const axiosPrivate = useAxiosPrivate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [incompletedTrans, setIncompletedTrans] = useState();
  const [completedTrans, setCompletedTrans] = useState();
  const [allTransactions, setAllTransactions] = useState();
  const [allOrders, setAllOrders] = useState(false);
  const [search, setSearch] = useState("pending");
  const [search2, setSearch2] = useState("");
  const [status, setStatus] = useState();
  const [cat, setCat] = useState("all");

  const setTransArray = () => {
    console.log(genTrans);
    const filterate = genTrans.filter((item) =>
      item.status.toLowerCase().includes(search.toLowerCase()),
    );
    const filterate2 = filterate.filter((item) => item.date.includes(search2));
    setAllTransactions(filterate2);
  };
  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };

  const assertain = (id, status) => {
    setStatus(status);
    console.log(status);
    dispatch({ type: "id", payload: id });
    const foundTransacton = allTransactions.find((item) => item._id === id);
    dispatch({ type: "cancel", payload: true });
    dispatch({ type: "inItem", payload: foundTransacton });
  };

  const hanldeShipped = async (e) => {
    e.preventDefault();
    const dynamStatus = status === "pending" ? "shipped" : "pending";
    console.log(dynamStatus);
    setStatus(dynamStatus);
    const completed = {
      status: dynamStatus,
    };

    try {
      const response = await axios.put(
        `/transactions/status-update/${state.id}`,
        completed,
      );
      if (response) {
        const foundTransacton = allTransactions.find(
          (item) => item._id === state.id,
        );
        console.log(foundTransacton);
        const currentTrans = { ...foundTransacton, status: dynamStatus };
        const latestTrans = allTransactions.map((item) => {
          if (item._id === currentTrans._id) return currentTrans;
          return item;
        });

        setAllTransactions(latestTrans);
        console.log(response.data);
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const forAddress =
    allTransactions && allTransactions.filter((item) => item.address).length;
  const forPhone =
    allTransactions && allTransactions.filter((item) => item.phone).length;
  console.log(allTransactions && forPhone);
  useEffect(() => {
    setTransArray();
  }, [search, search2]);
  return (
    <div className="orders" onClick={remainDelete}>
      <h2 className="order-header">
        {search.toLowerCase().includes("pen")
          ? "Pending"
          : search.toLowerCase().includes("s")
            ? "Shipped"
            : ""}{" "}
        Orders ({allTransactions && forAddress + forPhone})
      </h2>
      <form className="search-form">
        {/* <h5> orders </h5> */}
        <label>
          Filter By Status
          <input
            // id="invent-search"
            type="text"
            role="searchbox"
            placeholder="pending / shipped"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Filter By Date
          <input
            // id="invent-search"
            type="text"
            role="searchbox"
            placeholder="yyyy-MM-dd"
            value={search2}
            onChange={(e) => setSearch2(e.target.value)}
          />
        </label>
      </form>
      {allTransactions &&
        allTransactions.map((tran, i) => {
          const theDay = new Date(tran.date).toString().substring(0, 10);
          const theDay2 = new Date(tran.date).toString().substring(11, 25);
          return tran.address || tran.phone ? (
            <section className="order-details" key={tran._id}>
              <article className="inner-order-dets">
                {/* <p className='order-index'>{i + 1}</p> */}
                <div className="name-date">
                  <p>{tran._id}</p>
                  <p>
                    {theDay}, {theDay2}
                  </p>
                </div>
                <section>
                  <h4 className="order-h4">email</h4>
                  <div className="email">
                    <p>{tran.email}</p>
                  </div>
                  <div>
                    <p className="order-h4">phone</p>
                    <p className="phone">{tran.phone}</p>
                  </div>
                </section>
                <article>
                  <h4 className="order-h4">item details</h4>
                  <section className="item-dets">
                    {tran.goods.map((good, i) => {
                      return (
                        <div key={i} className="order-qty-cont">
                          <p>{good.name}: </p>
                          <p>
                            qty: {good.qty}
                            {good.unitMeasure.split(" ")[0]}
                            {good.qty > 1 ? "s" : ""},
                          </p>
                          {good.size && <p>size: {good.size},</p>}
                          {good.colour && <p>colour: {good.colour}</p>}
                          {good.storage && (
                            <p>
                              storage: {good.storage}
                              {good.storage == 1000 ? "T" : "GB"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </section>
                </article>

                <section>
                  <h4 className="order-h4">shipping address</h4>
                  <div>
                    {
                      <div className="shipping-address">
                        <p>{tran.name}</p>
                        <p>{tran.address.line1}</p>
                        <p>{tran.address.line2}</p>
                        <p>{tran.address.city}</p>
                        {/* i counld't detructure state. looks like it's a keyword */}
                        <p>{tran.address.state}</p>
                        <p>{tran.address.country}</p>
                        <p>{tran.address.postal_code}</p>
                      </div>
                    }
                  </div>
                </section>
                <section>
                  <h4 className="order-h4">status</h4>
                  <div className="main-status">
                    <p
                      className={
                        tran.status === "pending" ? "status" : "done-status"
                      }
                    >
                      {tran.status === "shipped" ? "shipped" : "pending"}
                      {tran.status === "shipped" ? (
                        <div>
                          <FaCheck />
                        </div>
                      ) : (
                        <div>
                          <FaExclamationTriangle />
                        </div>
                      )}
                    </p>
                  </div>
                </section>
                <section className="shipped">
                  <button
                    onClick={() => assertain(tran._id, tran.status)}
                  >{`${tran.status === "pending" ? "ship" : "reverse"}`}</button>
                </section>
              </article>
            </section>
          ) : (
            ""
          );
        })}

      <div className={state.cancel ? "delete" : "no-delete"}>
        <h3
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >{`${state.inItem && state.inItem.status === "pending" ? "are you sure this order has shipped?" : 'do you want to reverse order status to "pending"?'}`}</h3>
        <article
          style={{
            display: "flex",
            //  flexDirection: 'row',
            columnGap: "4vw",
            justifyContent: "center",
          }}
        >
          <button onClick={remainDelete}>No</button>
          <button
            onClick={hanldeShipped}
            style={{
              backgroundColor: "red",
              borderColor: "red",
            }}
          >
            Yes
          </button>
        </article>
      </div>
    </div>
  );
};

export default Order;
