import { useState, useEffect, useReducer, useContext } from "react";
import initialState from "../store";
import reducer from "../reducer";
import axios, { axiosPrivate } from "../app/api/axios";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/authProvider";
import { format } from "date-fns";
const { v4: uuid } = require("uuid");

const GenSales = () => {
  const { atHome, setAtHome, setIsRotated, currency } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState("");
  const [specArray, setSpecArray] = useState([]);
  const [currentUser, setCurrenUser] = useState("");
  const [search2, setSearch2] = useState("");
  const [username, setUsername] = useState("");
  const { auth } = useAuth();

  const falseIsRotated = () => {
    setIsRotated(false);
  };

  const getTrans = async () => {
    const innerArray = [];
    try {
      const response = await axios.get("/transactions");
      const newArray = response.data.filter(
        (item) => item.cashierID == auth.picker,
      );

      const person =
        auth.user && auth.users.find((person) => person._id == auth.picker);
      setCurrenUser(person);
      if (newArray) {
        newArray.map((gr) => {
          return gr.goods.map((good) => {
            const elements = {
              name: good.name,
              qty: good.qty,
              unitMeasure: good.unitMeasure,
              total: good.total,
              date: gr.date,
            };
            innerArray.push(elements);
            // setTransactions(innerArray)
            return innerArray;
          });
        });
        const filterate =
          innerArray &&
          innerArray.filter((inner) =>
            inner.name.toLowerCase().includes(search.toLowerCase()),
          );
        const filterate2 = filterate.filter((inner) =>
          inner.date.substring(0, 10).includes(search2),
        );
        dispatch({ type: "sales", payload: filterate2 });
        setSpecArray(filterate2);
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getTrans();
  }, [search, search2]);

  return !specArray ? (
    <div>Loading...</div>
  ) : (
    <div className="main-sale" onClick={falseIsRotated}>
      <h3 className="heading">Purchase History</h3>
      <form className="searcher" onSubmit={(e) => e.preventDefault()}>
        <input
          // id="invent-search"
          type="text"
          role="searchbox"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}

          // https://www.npmjs.com/package/@react-google-maps/api
        />
        {/* <p className='injunction'>AND / OR</p > */}
        <input
          //   id="invent-search"
          type="text"
          role="searchbox"
          placeholder="Search by date"
          value={search2}
          onChange={(e) => setSearch2(e.target.value)}

          // https://www.npmjs.com/package/@react-google-maps/api
        />
      </form>
      <table className="sales">
        <tbody>
          <tr className="theader-row">
            <th className="gen-sales-theader">NAME</th>
            <th className="gen-sales-theader">QTY</th>
            <th className="gen-sales-theader">TOTAL</th>
            <th className="gen-sales-theader">DATE</th>
          </tr>
          {specArray &&
            specArray.map((sale, index) => {
              const theDay = new Date(sale.date)
                .toDateString()
                .substring(4, 15);
              return (
                <tr
                  className="sales-items-cont"
                  key={uuid()}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "khaki",
                  }}
                >
                  <th className="sales-items">{`${sale.name.split(" ").join(" ")} ${sale.unitMeasure.split(" ")[1]}`}</th>
                  <td className="sales-items">{sale.qty}</td>
                  <th className="sales-items">
                    {parseFloat(sale.total).toFixed(2)}
                  </th>
                  <td className="sales-items">{theDay}</td>
                </tr>
              );
            })}
        </tbody>
        <tr>
          <th>Total</th>
          <th
            style={{
              textAlign: "left",
              overflowY: "auto",
            }}
          >
            {state.sales &&
              numberWithCommas(
                state.sales
                  .reduce((a, b) => {
                    return a + parseFloat(b.qty);
                  }, 0)
                  .toFixed(2),
              )}
          </th>
          <th
            style={{
              textAlign: "left",
            }}
            colSpan={2}
          >
            {currency}
            {state.sales &&
              numberWithCommas(
                state.sales
                  .reduce((a, b) => {
                    return a + parseFloat(b.total);
                  }, 0)
                  .toFixed(2),
              )}
          </th>
        </tr>
      </table>

      {/* <div className="sales-total">
        <h3>Total:</h3>
        <h3>
          {state.sales &&
            numberWithCommas(
              state.sales
                .reduce((a, b) => {
                  return a + parseFloat(b.qty);
                }, 0)
                .toFixed(2),
            )}
        </h3>
        <h3 className="sales-grand-total">
          {currency}
          {state.sales &&
            numberWithCommas(
              state.sales
                .reduce((a, b) => {
                  return a + parseFloat(b.total);
                }, 0)
                .toFixed(2),
            )}
        </h3>
      </div> */}
    </div>
  );
};

export default GenSales;
