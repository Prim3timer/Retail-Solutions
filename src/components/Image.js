import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/authProvider";

const Image = () => {
  const [item, setItem] = useState("");
  const { items, picUrl } = useContext(AuthContext);
  const memId = localStorage.getItem("memId");
  const index = localStorage.getItem("largeIndex");
  const getItem = () => {
    const item = items.find((item) => item._id === memId);
    console.log(item);
    setItem(item);
  };
  useEffect(() => {
    getItem();
  }, []);
  return (
    <div className="image">
      {/* <h4>Image</h4> */}
      {item && (
        <img
          className={"single-image"}
          src={`${picUrl}/images/${item.name}/${item.img[index].name}`}
          // onClick={() => handleIndex(i)}
          alt={item.img[index].name}
        />
      )}
    </div>
  );
};

export default Image;
