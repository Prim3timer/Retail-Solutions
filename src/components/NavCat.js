import { useContext, useState } from "react";
import AuthContext from "../context/authProvider";
import { Link, useLocation } from "react-router-dom";
const NavCat = ({ itemCat }) => {
  const { items, cat, setCat } = useContext(AuthContext);
  const [filterate, setFilterate] = useState([]);
  const noGroceries = items.filter((item) => item.category !== "Groceries");
  const getDistinctCategories =
    noGroceries &&
    noGroceries.map((item) => {
      return item.category;
    });
  const location = useLocation();
  const showItemCat = (e) => {
    // e.preventDefault();
    localStorage.setItem("category", itemCat);
  };

  const uniqueArray = [...new Set(getDistinctCategories)];
  // console.log(items);
  return (
    location.pathname !== "/login" && (
      <Link className="navcat-link" to={"/shop"} onClick={showItemCat}>
        <div className="navcat">
          <article>
            <p className="navcat-items">
              {itemCat.includes("Foot Wears")
                ? itemCat.substring(0, 10)
                : itemCat}{" "}
            </p>
          </article>
        </div>
      </Link>
    )
  );
};

export default NavCat;
