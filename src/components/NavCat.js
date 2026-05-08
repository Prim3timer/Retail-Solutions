import { useContext, useState } from "react";
import AuthContext from "../context/authProvider";
import { Link } from "react-router-dom";
const NavCat = () => {
  const { items } = useContext(AuthContext);
  const [filterate, setFilterate] = useState([]);
  const noGroceries = items.filter((item) => item.category !== "Groceries");
  const getDistinctCategories =
    noGroceries &&
    noGroceries.map((item) => {
      return item.category;
    });

  //   const showItemCat = () => {
  //     localStorage.setItem("category", itemCat);
  //   };

  const uniqueArray = [...new Set(getDistinctCategories)];
  console.log(items);
  return (
    <div className="navcat">
      {uniqueArray.map((item) => {
        return (
          <Link className="navcat-link" to={"/shop"} onClick={showItemCat}>
            <article>
              <p>
                {item.includes("Foot Wears")
                  ? item.substring(0, 10)
                  : item}{" "}
              </p>
            </article>
          </Link>
        );
      })}
    </div>
  );
};

export default NavCat;
