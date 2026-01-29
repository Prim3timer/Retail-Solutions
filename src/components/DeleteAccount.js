import { useEffect, useReducer, useRef, useState, useContext } from "react"
import { ROLES } from "../config/roles"
import { Link, useNavigate, useLocation} from "react-router-dom"
import axios from "../app/api/axios"
import { FaTrashAlt } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSave, faCheck, faTimes, faInfoCircle, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons"
import initialState from "../store"
import reducer from "../reducer"
import AuthContext from "../context/authProvider";
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ACTION = {
    USER: 'user',
    ERRMSG: 'errMsg',
    SUCCESS: 'success',
    SELECTUSER: 'selectUser'
}

const DeleteAccount = () => {
    const { auth, setAuth } = useAuth()
    const [state, dispatch] = useReducer(reducer, initialState)
    const axiosPrivate = useAxiosPrivate()
    const {setIsRotated} = useContext(AuthContext)
    const [users,   setUsers] = useState('')
    const location = useLocation()
    console.log(users)
    console.log(auth.picker)
    const navigate = useNavigate()

    const assertain = () => {
        dispatch({ type: 'cancel', payload: true })
    }


    const handleRemove = async () => {
     
        console.log(auth.picker)
        const response = await axiosPrivate.delete(`/users/delete/${auth.picker}`)
        dispatch({ type: 'cancel', payload: false })
        dispatch({ type: 'success', payload: true })
        navigate('/login')
        console.log(state.success)
        setTimeout(() => {
            dispatch({ type: 'success', payload: false })
        }, 3000)
        if (response) {
               console.log(location.pathname)
            setIsRotated(false)
            setAuth(prev => {
                return {...prev, accessToken: ''}
            })
            dispatch({ type: 'selectUser', payload: response.data })

        }
        else {
            console.log('nothing for you')
        }
    }

    const remainDelete = () => {
        // this condition statement is to enable the removal of the confirm window once any part
        // of the 
        // page is touched.
        if (state.cancel) {

            dispatch({ type: 'cancel', payload: false })
        }

    }

    return ( 
            <div className="edit-user"
            onClick={remainDelete}
            >
                <h2 id="user-edit-header">Delete Your Account</h2>        
        <section className="roles-actions-cont">
            <form onSubmit={(e) => e.preventDefault()}
                id="roles"
            >
                <article className="usersetting-actions">
                    
                    <button
                        className="user-action"

                    ><FontAwesomeIcon icon={faTrash}
                        onClick={assertain}
                        tableindex='0'
                        /> </button>
                </article>
            </form>
        </section>

                <div
                    className={state.cancel ? 'delete' : 'no-delete'}
                >
                    <h3
                        id="verify-header"
                        style={{
                            margin: '.5rem auto',
                            //   display: 'flex',
                        }}
                    > Delete  Account?</h3>
                    <article
                        style={{
                            display: 'flex',
                            //  flexDirection: 'row',
                            columnGap: '4vw',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            onClick={remainDelete}
                        >No</button><button
                            onClick={handleRemove}
                            style={{
                                backgroundColor: 'red',
                                borderColor: 'red'
                            }}
                        >Yes</button></article></div>

             
                <div
                 className={ACTION.SUCCESS ? 'deleted-promt' : 'no-deleted-promt'}
                >
                    <h4>{state.selectUser}</h4>
                </div>
            </div>
    )

}


export default DeleteAccount