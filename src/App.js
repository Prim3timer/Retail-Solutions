import Register from "./components/register";
import Login from "./components/Login";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

import Editor from "./components/Editor";
import Transactions from "./components/Transactions";
import Inventory from "./components/Inventory";
import RequireAuth from "./components/RequireAuth";
import CreateItem from "./components/CreateItem";
import Admin from "./components/Admin";
import LinkPage from "./components/LinkPage";
import EditItem from "./components/EditItem";
import Sales from "./components/Sales";
import ItemList from "./components/ItemList";
import Reciepts from "./components/Reciepts";
import EmpInv from "./components/EmpInv";
import { useEffect, useState, useReducer, useRef, useContext } from "react";
import useAuth from "./hooks/useAuth";
import UserSelect from "./components/UserSelect";
import OneReceipt from "./components/OneReceipt";
import AllTransactions from "./components/AllTransactions";
import AllSales from "./components/AllSales";
import axios from "./app/api/axios";
import reducer from "./reducer";
import initialState from "./store";
import { FaPaypal } from "react-icons/fa";
import UserSettings from "./components/UserSettings";
import Cart from "./components/Cart";
import Shop from "./components/Shop";
import SingleItem from "./components/SingleItem";
import Thanks from "./components/Thanks";
import Public from "./components/Public";
import PersistLogin from "./components/PersistLogin";
import LocalThanks from "./components/LocalThanks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLeftLong, faBars } from "@fortawesome/free-solid-svg-icons";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import AuthContext from "./context/authProvider";
import GenSales from "./components/GenSales";
import GenShopping from "./components/GenReceipt";
import Orders from "./components/Order";
import DeleteAccount from "./components/DeleteAccount";
import Categories from "./components/Categories";

// import SearchItem from "./SearchItem";

// service_3birv1u

// const ROLES = {
//   'User': 2001,
//   'Editor': 1984,
//   'Admin': 5150
// }

const App = () => {
  const [afa, setAfa] = useState("");
  const [userId, setUserId] = useState("");
  const year = new Date().getFullYear();
  const { auth } = useAuth();
  const [oneReceipt, setOneReceipt] = useState(false);
  const location = useLocation();
  console.log(location.pathname);
  const { isRotated, setIsRotated, workbar } = useContext(AuthContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  //   const trueHome = ()=> {
  // setHome(true)

  //   }

  //   useEffect(()=> {
  //     trueHome()
  //     console.log(home)
  //   }, [])

  return (
    <main className="App">
      {console.log(location.pathname)}

      <NavBar isRotated={isRotated} setIsRotated={setIsRotated} />

      <h5
        className={
          auth.accessToken &&
          location.pathname !== "/one-receipt" &&
          location.pathname !== "/login"
            ? `greeting`
            : "no-greeting"
        }
        // show greeting if we are logged in (access token present) and we are not in the one receipt page.
      >
        {" "}
        {auth.accessToken &&
        location.pathname !== "/one-receipt" &&
        location.pathname !== "/login"
          ? `Hi, ${auth.user}`
          : ""}
      </h5>
      {location.pathname === "/register" || location.pathname === "/login" ? (
        ""
      ) : (
        <SideBar isRotated={isRotated} setIsRotated={setIsRotated} />
      )}
      <article className="main">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Layout />}>
            <Route path="/" index element={<Login />} />
            <Route path="/login" element={<Login />} />

            <Route path="/cart/thanks" element={<Thanks />} />
            <Route
              path="/transactions/local-thanks"
              element={<LocalThanks />}
            />
            {/* <Route path="/thanks" element={<Thanks />}/> */}
            <Route path="shopping" element={<Reciepts />} />
            <Route path="gen-shopping" element={<GenShopping />} />
            {/* <Route path="one-shop" element={<OneShop/>} /> */}
            <Route path="register" element={<Register />} />
            <Route path="linkpage" element={<LinkPage />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="user-select" element={<UserSelect />} />

            <Route path="user-settings" element={<UserSettings />} />

            {/* protected routes */}
            <Route element={<PersistLogin />}>
              <Route path="single-item" element={<SingleItem />} />
              <Route element={<RequireAuth allowedRoles={[2001]} />}>
                <Route path="item-list" element={<ItemList />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="transactions" element={<Transactions />} />
                {/* <Route path="/home" element={<Home home={home}/> } /> */}
                <Route path="categories" element={<Categories />} />
                <Route path="/shop" element={<Shop />} />
                <Route
                  path="one-receipt"
                  element={<OneReceipt setOneReceipt={setOneReceipt} />}
                />
                <Route path="cart" element={<Cart />} />
                <Route path="order" element={<Orders />} />
                <Route path="delete-account" element={<DeleteAccount />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={[1984]} />}>
                <Route path="editor" element={<Editor />} />

                <Route path="all-sales" element={<AllSales />} />
                <Route path="sales" element={<Sales />} />
                <Route path="gen-sales" element={<GenSales />} />
                <Route
                  path="receipts"
                  element={
                    <Reciepts
                    //  foucuser={auth.picker2}
                    />
                  }
                />
              </Route>

              {/* <Route element={<RequireAuth allowedRoles={[1984, 5150]}/>}>
 
 </Route> */}

              <Route element={<RequireAuth allowedRoles={[5150]} />}>
                <Route path="admin" element={<Admin />} />
                <Route path="edit-item" element={<EditItem />} />
                <Route path="all-transactions" element={<AllTransactions />} />
                <Route path="create-item" element={<CreateItem />} />
                {/*  */}
              </Route>
            </Route>

            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </article>
      <p className="footer">&copy; {year} Amalu Productions.</p>
    </main>
  );
};
export default App;
