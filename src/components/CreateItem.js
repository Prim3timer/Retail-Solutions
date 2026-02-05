import reducer from "../reducer";
import initialState from "../store";
import axios from "../app/api/axios";
import { useEffect, useReducer, useRef, useState, useContext } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { type } from "@testing-library/user-event/dist/type";
import AuthContext from "../context/authProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { format } from "date-fns";
const { v4: uuid } = require("uuid");

let CreateItem = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const itemRef = useRef();
  const [showUpdate, setShowUpdate] = useState(false);
  const [files, setFiles] = useState();
  const now = new Date();
  const [description, setDescription] = useState("");
  const [availableColours, setAvailableColours] = useState([]);
  const [availableStorage, setAvailableStorage] = useState([]);
  const [availableFootSizes, setAvailableShoesizes] = useState([]);
  const [availablePrices, setAvailablePrices] = useState([]);
  const [firstPrice, setFirstPrice] = useState("");
  const [secondPrice, setSecondPrice] = useState("");
  const [thirdPrice, setThirdPrice] = useState("");
  const [fourthPrice, setFouthPrice] = useState("");

  const {
    falseIsRotated,
    measurements,
    catArray,
    gender,
    colours,
    storage,
    footSize,
  } = useContext(AuthContext);
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const theBigPics = files.filter((pic) => pic.size > 2000000);
    console.log(theBigPics);
    if (theBigPics.length) {
      dispatch({ type: "success", payload: true });
      dispatch({
        type: "errMsg",
        payload: "Please limit file sizes to 2MB. Thank you.",
      });
      setTimeout(() => {
        dispatch({ type: "success", payload: false });
      }, 3000);
    } else {
      setShowUpdate(true);
      dispatch({ type: "isMatched", payload: "creating item..." });
      e.preventDefault();
      const { name, unitMeasure, image, ole, category, sex } = state;
      const formData = new FormData();
      if (files) {
        files.map((file) => formData.append("images", file));
      }
      console.log(formData);

      console.log(files);
      const prices = [
        Number(firstPrice),
        Number(secondPrice),
        Number(thirdPrice),
        Number(fourthPrice),
      ];
      const withValue = prices.filter((item) => item !== 0);
      console.log(withValue);
      try {
        const newItem = {
          name: `${name}`,
          prices: withValue,
          unitMeasure: unitMeasure,
          description,
          qty: ole,
          category,
          gender: sex,
          availableColours,
          availableStorage,
          availableFootSizes,
          // image: files,
          now,
        };

        console.log(newItem);
        const theMatch =
          state.items &&
          state.items.data.find(
            (item) =>
              item.name.toString().toLowerCase() === newItem.name.toLowerCase(),
          );
        if (theMatch) {
          const myError = new Error(
            "There cannot be two intances of the same item",
          );
        } else {
          const response = await axios.post("/items", newItem);
          const response2 = await axios.post(
            `/items/pic/upload/${newItem.name}`,
            formData,
          );
          if (response) {
            dispatch({
              type: "isMatched",
              payload: `new item, ${newItem.name} created`,
            });
            setTimeout(() => {
              dispatch({ type: "isMatched", payload: "" });
              setShowUpdate(false);
            }, 3000);
          }
          dispatch({ type: "name", payload: "" });
          dispatch({ type: "price", payload: "" });
          dispatch({ type: "unitMeasure", payload: "" });
          dispatch({ type: "piecesUnit", payload: "" });
          dispatch({ type: "IMAGE", payload: "" });
          setDescription("");
          dispatch({ type: "ole", payload: "" });
          dispatch({ type: "CATEGORY", payload: "" });
          dispatch({ type: "SEX", payload: "" });
        }
      } catch (error) {
        dispatch({ type: "errMsg", payload: `${error.message}` });
        setTimeout(() => {
          dispatch({ type: "errMsg", payload: `` });
        }, 3000);
      } finally {
        itemRef.current.focus();
      }
    }
  };

  const handleFile = (e) => {
    const allFiles = Object.values(e.target.files);
    setFiles(allFiles);
    console.log(files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    console.log(files);
    const formData = new FormData();
    files.map((file) => formData.append("images", file));
    console.log(formData);
    const response = await axios.post(
      `/item/pic/upload/${state.name}`,
      formData,
    );
    console.log(response.data);
  };

  const onColourChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setAvailableColours(values);
  };

  const onStorageChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    console.log(values);
    setAvailableStorage(values);
  };

  const onFootSizeChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setAvailableShoesizes(values);
  };

  const handleFirstPrice = (e) => {
    setFirstPrice(e.target.value);
  };
  const handleSecondPrice = (e) => {
    setSecondPrice(e.target.value);
  };

  const handleThirdPrice = (e) => {
    setThirdPrice(e.target.value);
  };

  const handleFouthPrice = (e) => {
    setFouthPrice(e.target.value);
  };
  return (
    <div className="create-item" onClick={falseIsRotated}>
      <h2 id="create-item-heading">Create Item</h2>
      <form onSubmit={handleSubmit} id="create-item-form">
        <h4>Name:</h4>
        <input
          ref={itemRef}
          type="text"
          required
          value={state.name}
          onChange={(e) => dispatch({ type: "name", payload: e.target.value })}
        />

        {/* <h3 id="ulu" */}
        <h4>Unit Measure:</h4>
        <input
          type="text"
          list="measure"
          onChange={(e) =>
            dispatch({ type: "unitMeasure", payload: e.target.value })
          }
          required
          value={state.unitMeasure}
        />
        <datalist id="measure">
          {measurements.map((measurement, i) => {
            return (
              <option
                key={i}
                className="create-item-options"
                value={measurement}
              >
                {measurement}
              </option>
            );
          })}
        </datalist>

        <h4>Price:</h4>
        {/* <input
          type="text"
          required
          value={state.price}
          onChange={(e) => dispatch({ type: "price", payload: e.target.value })}
        /> */}
        <br />
        <section className="create-item-price-header"></section>
        <div className="create-item-price-cont">
          <h4>Abailbale Prices</h4>
          <form>
            <input
              type="text"
              value={firstPrice}
              onChange={(e) => handleFirstPrice(e)}
            />
            <input
              type="text"
              value={secondPrice}
              onChange={(e) => handleSecondPrice(e)}
            />
            <input
              type="text"
              value={thirdPrice}
              onChange={(e) => handleThirdPrice(e)}
            />
            <input
              type="text"
              value={fourthPrice}
              onChange={(e) => handleFouthPrice(e)}
            />
          </form>
        </div>
        <article className="colours-cont">
          <h4>Foot Sizes</h4>
          <select
            size={3}
            name="storage"
            value={availableFootSizes}
            multiple={true}
            onChange={(e) => onFootSizeChange(e)}
          >
            {footSize.map((item) => {
              return <option>{item}</option>;
            })}
          </select>
        </article>
        <article className="colours-cont">
          <h4>Storage</h4>
          <select
            size={3}
            name="storage"
            value={availableStorage}
            multiple={true}
            onChange={(e) => onStorageChange(e)}
          >
            {storage.map((item) => {
              return <option>{item}</option>;
            })}
          </select>
        </article>
        <h4>in stock:</h4>
        <input
          type="text"
          required
          value={state.ole}
          onChange={(e) => dispatch({ type: "ole", payload: e.target.value })}
        />
        <br />
        <h4>category:</h4>
        <input
          type="text"
          //   id="catogory"
          list="category"
          required
          value={state.category}
          onChange={(e) =>
            dispatch({ type: "CATEGORY", payload: e.target.value })
          }
        />
        <datalist id="category">
          {catArray.map((cat) => {
            return <option value={cat}>{cat}</option>;
          })}
        </datalist>
        <div className="colours-cont">
          <h4>Colours</h4>
          <select
            size={3}
            name="colour"
            value={availableColours}
            multiple={true}
            onChange={(e) => onColourChange(e)}
          >
            {colours.map((colour) => {
              return <option>{colour}</option>;
            })}
          </select>
        </div>
        <h4>gender:</h4>
        <input
          type="text"
          //   id="catogory"
          list="gender"
          value={state.sex}
          onChange={(e) => dispatch({ type: "SEX", payload: e.target.value })}
        />
        <datalist id="gender">
          {gender.map((cat) => {
            return <option value={cat}>{cat}</option>;
          })}
        </datalist>
        <br />
        <p>Description:</p>
        <textarea
          maxLength={300}
          className="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <br />
        <div className="create-item-image-box">
          <h4>Add Images</h4>
          <p>
            Maximum size of 2MB for each. Maximum of 5 can be uploaded at once
          </p>
          <input
            type="file"
            // required
            onChange={handleFile}
            multiple
          />
        </div>
        <br />

        <button type="submit" className="pop">
          Add Item
        </button>
        <h3 className={showUpdate ? "delete" : "hide-show-update"}>
          {state.isMatched}
        </h3>
        {state.success ? <h3 className="delete">{state.errMsg}</h3> : ""}
      </form>
    </div>
  );
};

export default CreateItem;
