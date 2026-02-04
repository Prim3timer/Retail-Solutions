import { useEffect, useReducer, useRef, useState, useContext } from "react";
import { ROLES } from "../config/roles";
import { Link, useNavigate } from "react-router-dom";
import axios from "../app/api/axios";
import { FaTrashAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSave,
  faCheck,
  faTimes,
  faInfoCircle,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import initialState from "../store";
import reducer from "../reducer";
import AuthContext from "../context/authProvider";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ACTION = {
  USER: "user",
  PWD: "pwd",
  VALIDNAME: "validName",
  VALIDPWD: "validPwd",
  VALIDMATCH: "validMatch",
  ERRMSG: "errMsg",
  SUCCESS: "success",
  MATCHPWD: "matchPwd",
  USERFOCUS: "userFocus",
  PWDFOCUS: "pwdFocus",
  MATCHFOCUS: "matchFocus",
  SELECTUSER: "selectUser",
};

const UserSettings = () => {
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const { auth, setAuth } = useAuth();
  const [username, setUsername] = useState();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [shadow, setShadow] = useState(false);
  const [isPassword3, setisPassword3] = useState("password");
  const [passwordCheck3, setPasswordCheck3] = useState(faEyeSlash);
  const axiosPrivate = useAxiosPrivate();
  const { getUsers } = useContext(AuthContext);
  const [ID, setID] = useState("");
  const saveRef = useRef(null);
  const pwdRef = useRef();
  const [users, setUsers] = useState("");
  console.log(users);
  // picker3 is the not the current user.  It is the user in question.
  // console.log({ auth })
  const [active, setActive] = useState("");
  console.log(auth.picker);
  // const theRole = users && users.find((user) => user._id === localStorage.getItem('memUser'))
  const [roles, setRoles] = useState(Object.keys(""));
  // const [roles, setRoles] =  useState({})
  const navigate = useNavigate();
  // dispatch({type: ACTION.SUCCESS, payload: false})

  const shadowing = () => {
    setShadow(true);
  };

  // const userPage = (e) => {

  //     const theRole = auth.users.find((user) => user._id === auth.picker3)
  //     console.log({theRole})
  //      const newRole =  Object.keys(theRole.roles)
  //         setRoles(newRole)

  //     }

  //     useEffect(()=> {
  //         console.log('pager')
  //         userPage()
  //     }, [])

  const showPassword = () => {
    if (isPassword3 === "password") {
      setisPassword3("text");
      setPasswordCheck3(faEye);
    } else {
      setisPassword3("password");
      setPasswordCheck3(faEyeSlash);
    }
  };

  const getAUser = async () => {
    const response = await axiosPrivate.get("/users");
    console.log(response.data.users);
    setUsers(response.data.users);
    const person = response.data.users.find(
      (user) => user._id === localStorage.getItem("memUser"),
    );
    console.log(person);
    // const theRole = users && users.find((user) => user._id === localStorage.getItem('memUser'))
    if (person) {
      setCurrentUser(person);

      setRoles(Object.keys(person.roles));

      setUsername(person.username);

      // setRoles(person.roles)
      setActive(person.active);
      console.log({ auth });
    }
  };

  useEffect(() => {
    getAUser();
    console.log(currentUser);
  }, []);

  const assertain = () => {
    dispatch({ type: "cancel", payload: true });
  };

  const handleRemove = async () => {
    console.log(auth.picker3);
    const response = await axiosPrivate.delete(
      `/users/delete/${currentUser._id}`,
    );
    dispatch({ type: "cancel", payload: false });
    dispatch({ type: "success", payload: true });
    navigate("/admin");
    console.log(state.success);
    setTimeout(() => {
      dispatch({ type: "success", payload: false });
    }, 3000);
    if (response) {
      dispatch({ type: "selectUser", payload: response.data });

      // const newGraw =  users.filter((item)=> item._id !== auth.picker3)

      // setUsers(newGraw)
    } else {
      console.log("nothing for you");
    }
  };

  const remainDelete = () => {
    // this condition statement is to enable the removal of the confirm window once any part
    // of the
    // page is touched.
    if (state.cancel) {
      dispatch({ type: "cancel", payload: false });
    }
  };
  const generalRemain = () => {
    if (state.isMatched) dispatch({ type: "isMatched", payload: false });
  };

  // useEffect(()=> {
  //     getUsers()
  // }, [])

  useEffect(() => {
    dispatch({ type: ACTION.VALIDNAME, payload: USER_REGEX.test(username) });
  }, [username]);

  useEffect(() => {
    dispatch({ type: ACTION.VALIDPWD, payload: PWD_REGEX.test(password) });
  }, [
    password,
    // state.matchPwd
  ]);

  useEffect(() => {
    dispatch({ type: ACTION.ERRMSG, payload: "" });
  }, [
    username,
    password,
    // state.matchPwd
  ]);

  useEffect(() => {
    // pwdRef.current.value = ''
  }, []);

  const onRolesChanged = (e) => {
    // shadowing()
    // setShadow(true)
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    if (!values.includes("Employee")) {
      return;
    }
    if (values.length > 1 && !values.includes("Manager")) {
      return;
    } else {
      setRoles(values);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      console.log("shadow is ", shadow);
      const newRoles = {
        Employee: 2001,
      };
      let newest = {};
      const userChange = roles.map((role) => {
        if (role === "Manager") newest = { ...newRoles, Manager: 1984 };
        else if (role === "Admin")
          newest = { ...newRoles, Manager: 1984, Admin: 5150 };
        else newest = newRoles;

        return newest;
      });

      console.log({ userChange });

      const currentRole = userChange.pop();
      const updatedPerson = {
        username: username,
        roles: currentRole,
        password: password,
        active: active,
      };

      const response = await axiosPrivate.patch(
        `/users/update/${currentUser._id}`,
        updatedPerson,
      );
      console.log(response.data);
      if (response) {
        dispatch({ type: ACTION.SELECTUSER, payload: response.data });
        dispatch({ type: ACTION.SUCCESS, payload: true });
        setTimeout(() => {
          dispatch({ type: ACTION.SUCCESS, payload: false });
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onActiveChanged = () => {
    shadowing();
    setActive((prev) => !prev);
  };

  const options = Object.keys(ROLES).map((role) => {
    return <option className="assigned-roles-options"> {role}</option>;
  });

  return !currentUser ? (
    <h2 className="edit-user">Loading...</h2>
  ) : (
    <div className="edit-user">
      <h2 id="user-edit-header">Edit User Settings</h2>

      <form
        className="usersetting-first-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="username">
          Username:
          <FontAwesomeIcon
            icon={faCheck}
            className={state.validName ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={state.validName || !username ? "hide" : "invalid"}
          />
        </label>
        <input
          type="text"
          id="settings-username"
          value={username}
          onChange={(e) => {
            shadowing();
            setUsername(e.target.value);
          }}
          aria-invalid={state.validName ? "false" : "true"}
          aria-describedby="uidnote"
          onFocus={() => dispatch({ type: ACTION.USERFOCUS, payload: true })}
          onBlur={() => dispatch({ type: ACTION.USERFOCUS, payload: false })}
        />
        <p
          id="uidnote"
          className={
            !state.validName && state.userFocus ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          3 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>
        <label htmlFor="password">
          Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={state.validPwd ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={state.validPwd || !password ? "hide" : "invalid"}
          />
        </label>
        <div
        // className="field-eye"
        >
          <input
            type={isPassword3}
            id="password"
            value={password}
            ref={pwdRef}
            onChange={(e) => {
              setPassword(e.target.value);
              shadowing();
            }}
            aria-invalid={state.validMatch ? false : true}
            aria-describedby="confirmnote"
            onFocus={() => dispatch({ type: ACTION.PWDFOCUS, payload: true })}
            onBlur={() => dispatch({ type: ACTION.PWDFOCUS, payload: false })}
          />{" "}
          <FontAwesomeIcon
            icon={passwordCheck3}
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
          Must include uppercase and lowercase letters, a number and a spe cial
          character.
          <br />
          Allowed special characters:{" "}
          <span aria-label="exclamation mark">!</span>{" "}
          <span aria-label="at symbol">@</span>{" "}
          <span aria-label="hashtag">#</span>{" "}
          <span ari a-label="dollar sign">
            $
          </span>{" "}
          <span aria-label="percent">%</span>
        </p>
      </form>
      <br />

      <label
        className="form-label"
        htmlFor="user-active"
        style={{
          justifyContent: "center",
          // marginLeft: '2rem'
        }}
      >
        ACTIVE:
        <input
          className="form__checkbox"
          id="user-active"
          name="user-active"
          type="checkbox"
          checked={active}
          onChange={onActiveChanged}
        />
      </label>
      <br />

      <section className="roles-actions-cont">
        <form
          onSubmit={(e) => e.preventDefault()}
          id="roles"
          //   style={{float: 'left',

          //   }}
        >
          <div className="asinged-roles-cont">
            <label
            // style={{
            //     fontSize: '1.5rem',

            // }}
            >
              ASSINGED ROLES:
            </label>

            <select
              name="roles"
              size="3"
              multiple={true}
              //  ref={selectRef}

              value={roles}
              onChange={(e) => onRolesChanged(e)}
              className="roles-select"
            >
              {options}
            </select>
          </div>

          <article className="usersetting-actions">
            <button
              onClick={(e) => updateUser(e)}
              className="user-action"
              ref={saveRef}
              //   className={'icon-button'}
              title="Save"
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="user-action">
              <FontAwesomeIcon
                icon={faTrash}
                onClick={assertain}
                tableindex="0"
              />{" "}
            </button>
          </article>
        </form>
      </section>

      <div className={state.cancel ? "delete" : "no-delete"}>
        <h3
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >
          {" "}
          Delete {username && username} from users
        </h3>
        <article
          style={{
            display: "flex",
            //  flexDirection: 'row',
            columnGap: "4vw",
            justifyContent: "center",
          }}
        >
          <button onClick={remainDelete}>No</button>
          <button
            onClick={handleRemove}
            style={{
              backgroundColor: "red",
              borderColor: "red",
            }}
          >
            Yes
          </button>
        </article>
      </div>

      <div
        className={state.isMatched ? "unauthorization-alert" : "authorization"}
      >
        <h2
          id="verify-header"
          style={{
            margin: ".5rem auto",
            //   display: 'flex',
          }}
        >
          Unauthorized!
        </h2>
        <button onClick={generalRemain}>ok</button>
      </div>
      <div
        style={{
          display: state.success ? "block" : "none",
          position: "fixed",
          margin: "1rem 0",
          top: "40%",
          left: "30%",
          width: "40%",
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "lightpink",
          borderRadius: "5px",
          fontSize: "1.5rem",
          opacity: ".85",
        }}
      >
        <h4>{state.selectUser}</h4>
      </div>
    </div>
  );
};

export default UserSettings;
