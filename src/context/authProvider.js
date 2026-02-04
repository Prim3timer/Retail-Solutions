import { createContext, useState, useReducer, useEffect, useRef } from "react";
import reducer from "../reducer";
import initialState from "../store";
import axios from "../app/api/axios";

// import Transactions from "../components/Transactions";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useRefreshToken from "../hooks/useRefreshToken";

import { use } from "react";

const AuthContext = createContext({});
// const refresh = useRefreshToken()
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [persistor, setPersistor] = useState(
    JSON.parse(localStorage.getItem("persistor")) || false,
  );
  //    const users = await refresh().users
  const [users, setUsers] = useState([]);
  const [auth, setAuth] = useState({});
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [currentUser2, setCurrentUser2] = useState({});
  const [genTrans, setGenTrans] = useState([]);
  const [atHome, setAtHome] = useState(true);
  const [isRotated, setIsRotated] = useState(false);
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const itemRef = useRef();
  const barRef = useRef(null);
  const [showOne, setShowOne] = useState(false);

  // const currency = '₦'
  // const picUrl = 'https://mawuhi-back.onrender.com/images'
  // const picUrl = 'http://localhost:3500/images'
  // const picUrl = process.env.PUBLIC_URL
  const picUrl = process.env.REACT_APP_URL;
  console.log(picUrl);
  const currency = "$";

  const measurements = [
    "grams (g)",
    "Piece (pc)",
    "Plate (Plt)",
    "Dozen (dz)",
    "Bottle (Btl)",
    "ounce (oz)",
    "centiliter (CL)",
    "Sachet (sct)",
    "Ounce (Oz)",
    "Set (St)",
    "Bag (Bg)",
    "Pair (pr)",
    "centimiters (cm)",
    "Kilogram (kg)",
    "Kilowatthour (kWh)",
    "Kilowatt (kW)",
    "Litre (L)",
    "Pound (lbs)",
  ];

  const bizName = "Retail Tracker";

  const catArray = [
    "Cell Phones",
    "Eletronics",
    "Apparels",
    "Groceries",
    "Foot Wears",
    "Liquors",
    "Jewelries",
    "Funitures",
    "Beauty",
  ];

  const gender = ["Men", "Women"];

  const footSize = [8, 8.5, 8, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14];

  const colours = [
    "black",
    "red",
    "green",
    "blue",
    "brown",
    "dark brown",
    "yellowish brown",
    "white",
  ];

  const storage = [64, 128, 256, 512, 1000];

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  let {
    cancel,
    items,
    isEdit,
    afa,
    sales,
    price,
    unitMeasure,
    user,
    getNames,
    receipt,
    transactions,
    isHome,
  } = state;

  const oneItem = (id) => {
    localStorage.setItem("memId", id);
    localStorage.setItem("memUser", auth.picker);
  };

  const userPage = (id) => {
    localStorage.setItem("memUser", id);
  };

  const getItems = async () => {
    dispatch({ type: "clear" });
    try {
      dispatch({ type: "errMsg", payload: "loading..." });
      const response = await axios.get("/items");
      console.log(response.data.items);
      dispatch({ type: "errMsg", payload: "" });
      if (response) {
        dispatch({ type: "items", payload: response.data.items });
        console.log(response.data.items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTransaction = async () => {
    const innerArray = [];
    const graw = await axios.get("/transactions");
    setGenTrans(graw.data);
    //   try {
    //     // console.log({graw})
    //     if (graw){
    //       graw.data.map((gr)=> {
    //         return gr.goods.map((good)=> {
    //             const elements =  {
    //                 name: good.name,
    //                 qty: good.qty,
    //                 unitMeasure: good.unitMeasure,
    //                 total: good.total,
    //                 date: gr.date

    //             }
    //             innerArray.push(elements)
    //             setGenTrans(innerArray)
    //             return innerArray
    //         })
    //     })
    //     const filterate = innerArray.filter((inner)=> inner.name.toLowerCase().includes(search.toLowerCase()))
    //     const filterate2 = filterate && filterate.filter((inner)=> inner.date.substring(0, 10).includes(search2))
    //     setGenTrans(filterate)

    //     dispatch({type: 'sales', payload: filterate2})
    //     }
    //     else return
    //   }
    //    catch (error) {
    //     console.log(error)
    //   }
  };

  // const getUsers = async () => {
  //     try {
  //         const response = await axiosPrivate.get('/users')
  //         if (response)
  //             console.log(response.data.users)
  //         setUsers(response.data.users)

  //     } catch (error) {
  //         console.error(error.message)
  //     }

  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, price, unitMeasure, piecesUnit } = state;
    try {
      const newItem = {
        name: state.afa ? state.afa : response.data.name,
        price: price && price,
        unitMeasure: unitMeasure && unitMeasure,
        piecesUnit: piecesUnit,
      };
      const response = await axios.patch(`/items/${id}`, newItem);
      if (response) {
        const graw = await axios.get("/items");
        dispatch({ type: "items", payload: graw.data.items });

        dispatch({ type: "isMatched", payload: `${newItem.name} Edited` });
        setTimeout(() => {
          dispatch({ type: "isMatched", payload: "" });
          dispatch({ type: "isEdit", payload: false });
        }, 3000);
      }
    } catch (error) {
      dispatch({ type: "errMsg", payload: `${error.message}` });
      setTimeout(() => {
        dispatch({ type: "errMsg", payload: `` });
      }, 3000);
    } finally {
    }
  };

  const handleEdit = async (id, e) => {
    e.preventDefault();
    if (!auth.roles.includes(1984)) {
      dispatch({ type: "isMatched", payload: true });
    } else {
      dispatch({ type: "isEdit", payload: true });
      dispatch({ type: "id", payload: id });
      itemRef.current.value = id;
      const currentItem = state.items.find((item) => item._id === id);
      dispatch({ type: "afa", payload: currentItem.name });
      dispatch({ type: "price", payload: currentItem.price });
      dispatch({ type: "unitMeasure", payload: currentItem.unitMeasure });
      console.log(itemRef.current.value);
    }
  };

  const assertain = (id) => {
    if (!auth.roles.includes(5150)) {
      dispatch({ type: "isMatched", payload: true });
    } else {
      dispatch({ type: "cancel", payload: true });
      dispatch({ type: "id", payload: id });
      const getItem =
        state.items && state.items.find((item) => item._id === id);
      dispatch({ type: "inItem", payload: getItem });
    }
  };

  const generalRemain = () => {
    if (state.isMatched) dispatch({ type: "isMatched", payload: false });
  };

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part of the
    // page is touched.
    if (cancel) {
      dispatch({ type: "cancel", payload: false });
    }
    // if (state.isEdit){

    //     dispatch({type: 'isEdit', payload: false})
    // }
  };

  const falseIsRotated = () => {
    setIsRotated(false);
  };

  const oneShow = (id) => {
    localStorage.setItem("memTransaction", id);
    auth.picker2 = id;
    console.log(auth);
    // console.log(oneId)
    setShowOne(true);
    // setReceipts(false)
  };

  useEffect(() => {
    getTransaction();
  }, [state.search]);

  useEffect(() => {
    getItems();
  }, []);

  // useEffect(() => {
  //     getUsers()
  // }, [])
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        handleSubmit,
        handleEdit,
        assertain,
        itemRef,
        cancel,
        generalRemain,
        remainDelete,
        isEdit,
        afa,
        price,
        unitMeasure,
        getTransaction,
        search,
        setSearch,
        setSearch2,
        search2,
        sales,
        user,
        currentUser,
        setCurrentUser,
        setCurrentUser2,
        currentUser2,
        users,
        setUsers,
        transactions,
        atHome,
        setAtHome,
        currentUsers,
        setCurrentUsers,
        setIsRotated,
        isRotated,
        barRef,
        persistor,
        setPersistor,
        falseIsRotated,
        measurements,
        genTrans,
        setGenTrans,
        currency,
        items,
        oneItem,
        userPage,
        picUrl,
        getItems,
        oneShow,
        bizName,
        catArray,
        gender,
        footSize,
        colours,
        storage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
