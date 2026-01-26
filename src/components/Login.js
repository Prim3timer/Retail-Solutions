
import { useRef, useState, useEffect, useReducer, useContext } from 'react';
import AuthContext from '../context/authProvider';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useRefreshToken from '../hooks/useRefreshToken';
import { faCheck, faTimes, faInfoCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from '../app/api/axios';
import reducer from '../reducer';
import initialState from '../store';


const LOGIN_URL = '/auth';

const Login = () => {
    const { auth, setAuth, persistor, setPersistor } = useContext(AuthContext);

    const [state, dispatch] = useReducer(reducer, initialState)


    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.pathname)
    const from = location.state?.from?.pathname || "/shop";
    const [isPassword, setisPassword] = useState('password')
    const [passwordCheck2, setPasswordCheck2] = useState(faEyeSlash)
    const [isPassword2, setisPassword2] = useState('password')

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');


    const showPassord = () => {
        if (isPassword === 'password') {
            setisPassword('text')
            setPasswordCheck2(faEye)
        }
        else {

            setisPassword('password')
            setPasswordCheck2(faEyeSlash)
        }
    }



    // const showPassord = () => {
    //     if (isPassword === 'password') setisPassword('text')
    //     else setisPassword('password')
    // }

    // const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, pwd)

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            // console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            const picker = response?.data?.id;


            setAuth({ user, roles, accessToken, picker });

            setUser('');
            setPwd('');
            // get the user to where they wanted to go before they were kicked out to 
            // the login page

            navigate(from, { replace: true });
            // dispatch({type: 'success', payload: true})
        } catch (err) {
            if (!err?.response) {
                dispatch({ type: 'errMsg', payload: 'No server Response' });

            } else if (err.response?.status === 400) {

                dispatch({ type: 'errMsg', payload: 'Missing Username or Password' });
            }
            else if (err.response?.status === 401) {

                dispatch({ type: 'errMsg', payload: 'Unauthorized' });
            }
            else {

                dispatch({ type: 'errMsg', payload: 'Login Failed' });
            }
            // set the focus on error display so the screen reader can read that info
            errRef.current.focus();
        }
        dispatch({ type: 'user', payload: user })
    }

    const togglePersist = () => {
        setPersistor(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem("persistor", persistor)
    }, [persistor])

    return (

        <section className='login'>
            <p ref={errRef} className={state.errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{state.errMsg}</p>
            <h1
                className='login-header'

            >Sign In</h1>
            <form onSubmit={handleSubmit}
                className='login-form'
            >
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    // id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required

                />

                <label htmlFor="password">Password:</label>
                <article>
                    <input
                        type={isPassword}
                        className="login-password"
                        //  placeholder='password'
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    ></input>
                    <section className='password-icon-container'>  <FontAwesomeIcon icon={passwordCheck2} onClick={showPassord} className='show-password' /></section>
                    {/* <span onClick={showPassord} className='show-password'>show</span> */}
                </article>
                {/* Rhinohorn1# */}
                <button
                    className='sign-in'

                >Sign In</button>
            </form>
            <article className='sign-up-cont'>
                <p>
                    Need an Account?
                </p>
                <Link
                    className='sign-in-link'
                    to="/register">Sign Up</Link>
                <div className='persistCheck'>
                    <input
                        type='checkbox'
                        id='persist'
                        onChange={togglePersist}
                        checked={persistor}
                    />
                    <label htmlFor='persist'>trust this device</label>
                </div>
            </article>
        </section>
    )
}

export default Login
