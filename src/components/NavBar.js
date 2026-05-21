import { useState, useRef, useEffect, useContext, useReducer } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLeftLong,
  faBars,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import SideBar from "./SideBar";
import AuthContext from "../context/authProvider";
import multiLinks from "./multiLinks";
import useWindowSize from "../hooks/useWindowSize";
import NavCat from "./NavCat";
import reducer from "../reducer";
import initialState from "../store";
import { use } from "react";
import axios from "../app/api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const NavBar = () => {
  //  const [isRotated, setIsRotated] = useState(false)
  const {
    isRotated,
    setIsRotated,
    barRef,
    items,
    cartLength,
    setCartLength,
    getCartLength,
    newCartLength,
    setNewCartLength,
  } = useContext(AuthContext);
  const [currentWidth, setCurrentWidth] = useState();
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const navRef = useRef();
  const { width } = useWindowSize();
  const [state, dispatch] = useReducer(reducer, initialState);

  const memUser = localStorage.getItem("memUser");
  const axiosPrivate = useAxiosPrivate();

  const workBar = () => {
    const navWidth = navRef.current.getBoundingClientRect().width;
    // setCurrentWidth(navWidth)
    console.log(navWidth);
    if (isRotated == false) {
      setIsRotated(true);
    } else {
      setIsRotated(false);
    }
  };

  console.log(cartLength);

  const getNewCartLength = () => {};

  useEffect(() => {
    setNewCartLength(cartLength);
  }, [cartLength]);

  const noGroceries =
    items && items.filter((item) => item.category !== "Groceries");
  const getDistinctCategories =
    noGroceries &&
    noGroceries.map((item) => {
      return item.category;
    });

  const uniqueArray = [...new Set(getDistinctCategories)];

  const logout = useLogout();

  const pix = 1200;

  return (
    // making the class name dynamic because of the 'retail tracker' text conflicing with the first element, 'transaction' in
    // the header list of items
    <div
      className={
        location.pathname === "/login" ||
        location.pathname === "/" ||
        location.pathname === "/register"
          ? "plain-header"
          : "header"
      }
      ref={navRef}
    >
      {location.pathname === "/admin" && (
        <article className="top-admin-links">
          {multiLinks.map((link) => {
            const { id, name, path } = link;
            return (
              // <div className="link-names">
              <Link
                onClick={() => localStorage.setItem("memUser", auth.picker)}
                to={path}
                className={
                  location.pathname === path ? "current-path" : "home-links"
                }
                key={id}
              >
                {name}
              </Link>
              // </div>
            );
          })}
        </article>
      )}

      {location.pathname === "/" ||
      location.pathname === "/login" ||
      location.pathname === "/register" ? (
        <h4> Retail Tracker</h4>
      ) : width < 739 ? (
        <p>
          {/* <FontAwesomeIcon
            ref={barRef}
            className={!isRotated ? "home-icon rotate-icon" : "home-icon"}
            onClick={workBar}
            icon={faBars}
          /> */}
        </p>
      ) : (
        ""
      )}

      {/* {auth.accessToken && <div className="head-home"></div>} */}
      {/* <div className={width > 739 ? "show-home-links" : "hide-home-links"}> */}
      {location.pathname !== "/" ||
      location.pathname !== "/login" ||
      location.pathname !== "/register" ? (
        <div className="show-home-links">
          {uniqueArray.map((item) => {
            return (
              <article>
                <NavCat itemCat={item} />
              </article>
            );
          })}
          {location.pathname !== "/login" &&
            location.pathname !== "/" &&
            location.pathname !== "/register" && (
              <article className="second-navbar-links">
                |
                <Link to="/gen-sales" className="home-links">
                  purchases
                </Link>
                <Link to="/gen-shopping" className="home-links">
                  receipts
                </Link>
                <Link to="/delete-account" className="home-links">
                  delete account
                </Link>
                <Link to="/admin" className="home-links">
                  admin
                </Link>
                <Link to="/about-us" className="home-links">
                  about us
                </Link>
                <Link to="/email-sender" className="home-links">
                  send email
                </Link>
                <Link to="/login" className="home-links" onClick={logout}>
                  logout
                </Link>
              </article>
            )}
          {
            // location.pathname !== "/login" &&
            location.pathname !== "/" &&
            location.pathname !== "/login" &&
            location.pathname !== "/register" ? (
              <Link to={"/cart"} className="nav-cart-link">
                <p className="cart-length">{newCartLength}</p>
                <FontAwesomeIcon icon={faShoppingCart} role="button" />
              </Link>
            ) : (
              ""
            )
          }
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NavBar;
