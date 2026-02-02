import { useRef, useState, useEffect, useReducer } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../app/api/axios";
import initialState from "../store";
import reducer from "../reducer";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const EMAIL_REGEX = /^(?=.*[a-z])(?=.*[!@#$%]).{3,50}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const ACTION = {
  USER: "user",
  PWD: "pwd",
  VALIDNAME: "validName",
  VALIDPWD: "validPwd",
  VALIDEMAIL: "validEmail",
  VALIDMATCH: "validMatch",
  ERRMSG: "errMsg",
  SUCCESS: "success",
  MATCHPWD: "matchPwd",
  USERFOCUS: "userFocus",
  PWDFOCUS: "pwdFocus",
  MATCHFOCUS: "matchFocus",
  EMAIL: "email",
};
const Register = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const userRef = useRef();
  const errRef = useRef();
  const [isPassword, setisPassword] = useState("password");
  const [isPassword2, setisPassword2] = useState("password");
  const [passwordCheck, setPasswordCheck] = useState(faEyeSlash);
  const [passwordCheck2, setPasswordCheck2] = useState(faEyeSlash);
  const showPassword = () => {
    if (isPassword === "password") {
      setisPassword("text");
      setPasswordCheck(faEye);
    } else {
      setisPassword("password");
      setPasswordCheck(faEyeSlash);
    }
  };

  const showPassord2 = () => {
    if (isPassword2 === "password") {
      setisPassword2("text");
      setPasswordCheck2(faEye);
    } else {
      setisPassword2("password");
      setPasswordCheck2(faEyeSlash);
    }
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    dispatch({ type: ACTION.VALIDNAME, payload: USER_REGEX.test(state.user) });
  }, [state.user]);

  useEffect(() => {
    dispatch({
      type: ACTION.VALIDEMAIL,
      payload: EMAIL_REGEX.test(state.email),
    });
  }, [state.email]);

  useEffect(() => {
    dispatch({ type: ACTION.VALIDPWD, payload: PWD_REGEX.test(state.pwd) });
    dispatch({
      type: ACTION.VALIDMATCH,
      payload: state.pwd === state.matchPwd,
    });
  }, [state.pwd, state.matchPwd]);

  useEffect(() => {
    dispatch({ type: ACTION.ERRMSG, payload: "" });
  }, [state.user, state.pwd, state.matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(state.email);
    console.log("email");
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(state.user);
    const v2 = PWD_REGEX.test(state.pwd);
    const v3 = EMAIL_REGEX.test(state.email);
    if (!v1 || !v2 || !v3) {
      dispatch({ type: ACTION.ERRMSG, payload: "Invalid Entry" });
      return;
    }
    try {
      const { user, pwd, email } = state;
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      // setSuccess(true);
      dispatch({ type: ACTION.SUCCESS, payload: true });
      //clear state and controlled inputs
      //need value attrib on inputs for this
      dispatch({ type: ACTION.USER, payload: "" });
      dispatch({ type: ACTION.PWD, payload: "" });
      dispatch({ type: ACTION.EMAIL, payload: "" });
    } catch (err) {
      if (!err?.response) {
        dispatch({ type: ACTION.ERRMSG, payload: "No Server Response" });
      } else if (err.response?.status === 409) {
        dispatch({ type: ACTION.ERRMSG, payload: "Username Taken" });
      } else {
        dispatch({ type: ACTION.ERRMSG, payload: "Registration Failed" });
      }
      errRef.current.focus();
    }
  };
  // Rhinohorn1#
  return (
    <div className="register">
      {state.success ? (
        <section className="success">
          <h1>Success!</h1>
          <p>
            <Link to="/#login">Sign In</Link>
          </p>
        </section>
      ) : (
        <section className="reg-cont">
          <p
            ref={errRef}
            className={state.errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {state.errMsg}
          </p>
          <h1
            style={{
              textAlign: "center",
              margin: "1rem 0",
            }}
          >
            Register
          </h1>
          <form onSubmit={handleSubmit} id="username-form">
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={state.validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={state.validName || !state.user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) =>
                dispatch({ type: ACTION.USER, payload: e.target.value })
              }
              value={state.user.username}
              required
              aria-invalid={state.validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() =>
                dispatch({ type: ACTION.USERFOCUS, payload: true })
              }
              onBlur={() =>
                dispatch({ type: ACTION.USERFOCUS, payload: false })
              }
            />
            <p
              id="uidnote"
              className={
                state.userFocus && state.user && !state.validName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              3 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens are allowed.
            </p>

            <label htmlFor="email">
              email:
              <FontAwesomeIcon
                icon={faCheck}
                className={state.validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  state.validEmail || !state.email ? "hide" : "invalid"
                }
              />
            </label>
            <input
              type="text"
              id="email"
              autoComplete="off"
              onChange={(e) =>
                dispatch({ type: ACTION.EMAIL, payload: e.target.value })
              }
              value={state.email}
              required
              // aria-invalid={state.validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() =>
                dispatch({ type: ACTION.USERFOCUS, payload: true })
              }
              onBlur={() =>
                dispatch({ type: ACTION.USERFOCUS, payload: false })
              }
            />

            {/* <article className="passwords"> */}
            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={state.validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={state.validPwd || !state.pwd ? "hide" : "invalid"}
              />
            </label>
            <div className="field-eye">
              <input
                type={isPassword}
                className="password"
                onChange={(e) =>
                  dispatch({ type: ACTION.PWD, payload: e.target.value })
                }
                value={state.pwd}
                required
                aria-invalid={state.validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() =>
                  dispatch({ type: ACTION.PWDFOCUS, payload: true })
                }
                onBlur={() =>
                  dispatch({ type: ACTION.PWDFOCUS, payload: false })
                }
              />
              {/* <span onClick={showPassord} className='show-password'>show</span> */}
              <FontAwesomeIcon
                icon={passwordCheck}
                onClick={showPassword}
                className="show-password"
              />
            </div>
            <p
              id="pwdnote"
              className={
                state.pwdFocus && !state.validPwd ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={
                  state.validMatch && state.matchPwd ? "valid" : "hide"
                }
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  state.validMatch || !state.matchPwd ? "hide" : "invalid"
                }
              />
            </label>
            <div className="field-eye">
              <input
                type={isPassword2}
                id="confirm_pwd"
                onChange={(e) =>
                  dispatch({ type: ACTION.MATCHPWD, payload: e.target.value })
                }
                value={state.matchPwd}
                required
                aria-invalid={state.validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() =>
                  dispatch({ type: ACTION.MATCHFOCUS, payload: true })
                }
                onBlur={() =>
                  dispatch({ type: ACTION.MATCHFOCUS, payload: false })
                }
              />
              <FontAwesomeIcon
                icon={passwordCheck2}
                onClick={showPassord2}
                className="show-password"
              />
            </div>
            <p
              id="confirmnote"
              className={
                state.matchFocus && !state.validMatch
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            {/* </article> */}

            <button
              className="register-button"
              disabled={
                !state.validName || !state.validPwd || !state.validMatch
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>Already registered? </p>

          {/*put router link here*/}
          <Link
            style={{
              color: "blue",
            }}
            to={"/login"}
          >
            Sign In
          </Link>
        </section>
      )}
    </div>
  );
};

export default Register;
