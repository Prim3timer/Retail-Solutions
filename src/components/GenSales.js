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
  console.log({ atHome });
  const [state, dispatch] = useReducer(reducer, initialState);
  const [search, setSearch] = useState("");
  const [specArray, setSpecArray] = useState([]);
  const [currentUser, setCurrenUser] = useState("");
  const [search2, setSearch2] = useState("");
  const [username, setUsername] = useState("");
  const { auth } = useAuth();

  // const auth.picker3 = atHome === true ? auth.picker : auth.picker3

  //     const getAUser = ()=>{
  //     try {

  //         const user = auth.users.find((user) => user._id === auth.picker3)
  //         if (user){

  //             // setCurrentUser2(user)
  //             setUsername(user.username)
  //             console.log({username})
  //         }
  //     } catch (error) {
  //         console.error(error.message)
  //     }
  // }

  const falseIsRotated = () => {
    setIsRotated(false);
  };

  const getTrans = async () => {
    const innerArray = [];
    console.log(auth.picker);
    console.log({ authUsers: auth.users });
    //   setAtHome(false)
    try {
      const response = await axios.get("/transactions");
      // const response2 = await axiosPrivate.get('/users')
      // console.log(response2)
      console.log(response);
      const newArray = response.data.filter(
        (item) => item.cashierID == auth.picker,
      );
      console.log(newArray);

      const person =
        auth.user && auth.users.find((person) => person._id == auth.picker);
      setCurrenUser(person);
      console.log(person);

      if (newArray) {
        console.log(currentUser);
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
        console.log(filterate);
        const filterate2 = filterate.filter((inner) =>
          inner.date.substring(0, 10).includes(search2),
        );
        // setLast(filterate)

        console.log(innerArray);
        dispatch({ type: "sales", payload: filterate2 });
        setSpecArray(filterate2);
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: error.message });
    }
    console.log(auth.picker);
    console.log(auth.picker3);
    console.log(state.sales);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    getTrans();
    console.log("current user is : ", currentUser);
  }, [search, search2]);

  //           useEffect(()=> {
  //     getAUser()
  //   }, [])

  return !specArray ? (
    <div>Loading...</div>
  ) : (
    <div className="main-sale" onClick={falseIsRotated}>
      {/* <h2 className="heading"> Sales ({specArray.length}) rows</h2> */}
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
            <th>NAME</th>
            <th>QTY</th>
            <th>TOTAL</th>
            <th>DATE</th>
          </tr>
          {specArray &&
            specArray.map((sale, index) => {
              const theDay = new Date(sale.date)
                .toDateString()
                .substring(4, 15);
              console.log(theDay);
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
