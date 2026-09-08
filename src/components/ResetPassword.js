import { useState, useEffect, useReducer, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../app/api/axios";
import {
  faTrash,
  faSave,
  faCheck,
  faTimes,
  faInfoCircle,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import reducer from "../reducer";
import initialState from "../store";
import AuthContext from "../context/authProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const EMAIL_REGEX = /^(?=.*[a-z])(?=.*[!@#$%]).{3,50}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { auth } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const axiosPrivate = useAxiosPrivate();
  const [userId, setUserId] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const now = Date.now();
  const queryParams = searchParams.get("email");
  const elapse = searchParams.get("elapse");
  const elapsed = Number(elapse) + 3600000;

   const [isPassword, setisPassword] = useState("password");
  const [isPassword2, setisPassword2] = useState("password");
  const [passwordCheck, setPasswordCheck] = useState(faEyeSlash);

  const handleParams = async () => {
    try {
      const response = await axios.get("/special-users");
      console.log(response.data);

      const user = response.data.find((user) => user.email === queryParams);
      user && setCurrentUser(user);
      console.log(user);
      console.log(queryParams);
      setEmail(queryParams);
    } catch (error) {
      console.log(error);
    }
  };

    const showPassword = () => {
    if (isPassword === "password" || isPassword2 === "password") {
      setisPassword("text");
      setPasswordCheck(faEye);
      setisPassword2("text");
    } else {
      setisPassword("password");
      setisPassword2("password");
      setPasswordCheck(faEyeSlash);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPassword = {
        password,
      };

      const v1 = EMAIL_REGEX.test(email);
      const v2 = PWD_REGEX.test(password);

      if (!v1 || !v2) {
        setShowErrMsg(true);
        dispatch({ type: "errMsg", payload: "invalid entry" });
        setTimeout(() => {
          setShowErrMsg(false);
        }, 3000);
      } else if (now > elapsed) {
        setShowErrMsg(true);
        dispatch({ type: "errMsg", payload: "link has expired" });
      } else {
        setUserId(currentUser._id);
        console.log(currentUser._id)
        const response = await axios.patch(
          `/reset-password/${currentUser._id}`,
          newPassword,
        );
        setShowErrMsg(true);
        dispatch({
          type: "errMsg",
          payload: `${response.data} proceed to home page to login`,
        });
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleParams();
  }, []);

  useEffect(() => {
    dispatch({
      type: "validEmail",
      payload: EMAIL_REGEX.test(email),
    });
  }, [email]);

  useEffect(() => {
    dispatch({ type: "validPwd", payload: PWD_REGEX.test(password) });
    dispatch({
      type: "validMatch",
      payload: password === confirmPassword,
    });
  }, [password, confirmPassword]);
  return (
    <div className="reset-password">
      <h3>{currentUser.username} Reset your Password</h3>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        {/* {<p>{currentUser.username}</p>} */}
        <p className="pwd-reset-instruction">    Password must be 8 to 24 characters.
          <br/>
              Must include uppercase and lowercase letters, a number and a
              special character.</p>
              <br />
        <label>
          password
          <FontAwesomeIcon
            icon={faCheck}
            className={state.validPwd ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={state.validPwd || !password ? "hide" : "invalid"}
          />
          <br />
          <input
            type={isPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          confirm password
          <FontAwesomeIcon
            icon={faCheck}
            className={state.validMatch && confirmPassword ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={
              state.validMatch || !confirmPassword ? "hide" : "invalid"
            }
          />
          <br />
          <input
            type={isPassword2}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
           <article className="password-check">
              <FontAwesomeIcon
                icon={passwordCheck}
                onClick={showPassword}
                className="show-password"
              />
            </article>
        </label>
        <button type="submit">Submit</button>
      </form>
        <article className={showErrMsg ? "new-pwd-alert" : "no-new-pwd-alert"}>
      <FontAwesomeIcon
            icon={faCheck}
            className="password-changed"
          /> <p >{state.errMsg}</p>
    </article>

    </div>
  );
};

export default ResetPassword;
