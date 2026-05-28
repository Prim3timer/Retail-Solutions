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

  const handleParams = async () => {
    try {
      const response = await axios.get("/special-users");
      console.log(response.data);
      const queryParams = searchParams.get("email");

      const user = response.data.find((user) => user.email === queryParams);
      user && setCurrentUser(user);
      console.log(user);
      console.log(queryParams);
      setEmail(queryParams);
    } catch (error) {
      console.log(error);
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
      } else {
        setUserId(currentUser._id);
        const response = await axios.patch(
          `/reset-password/${userId}`,
          newPassword,
        );
        setShowErrMsg(true);
        dispatch({
          type: "errMsg",
          payload: `${response.data} proceed to home page`,
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
    <div>
      <h3>Reset Password</h3>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        {<p>{currentUser.username}</p>}
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
            type="password"
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
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <p className={showErrMsg ? "delete" : "no-delete"}>{state.errMsg}</p>
    </div>
  );
};

export default ResetPassword;
