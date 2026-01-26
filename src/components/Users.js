import { useState, useEffect, useContext, Component } from "react";

import UserSelect from "./UserSelect";
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom";
import initialState from "../store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import reducer from "../reducer";
import { useReducer } from "react";
import { use } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import UserSettings from "./UserSettings";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/authProvider";



const Users = ()=> {
    const { users, setAtHome, setUsers, currentUsers, setCurrentUsers, userPage} = useContext(AuthContext)
    const {auth, setAuth} = useAuth()
// setAtHome(false)
        // const [currentUsers, setCurrentUsers] = useState()
        const [madu, setMadu] = useState()
        const [brand, setBrand] = useState()
        const [state, dispatch] = useReducer(reducer, initialState)
        const [currentPerson, setCurrentPerson] = useState()
        
        //   const [users, setUsers] = useState([])
        const axiosPrivate = useAxiosPrivate()
 const navigate = useNavigate();
    const location = useLocation();

 useEffect(()=> {
    // console.log(auth)
        let isMounted = true
        // to cancel our request if the Component unmounts
        const controller = new AbortController()
    
        const getUsers = async ()=> {
            const cookieMap = {}
           const allCookies = cookieMap['jwt']
               console.log(allCookies)
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                
                })
                console.log(response.data.users)
             
                    isMounted && setCurrentUsers(response.data.users)
                    setUsers(response.data.users)
                    
                   setAuth(prev => {

            return {...prev, users: response.data.users
            }
        })
            } catch (error) {
                console.error(error)
           

                  navigate('/login', { state: { from: location }, replace: true });
           
            }
        }
        
        getUsers()
        // clean up function
        return ()=> {
            isMounted = false
    
                    controller.abort()
       
        }
    }, [])
// getUsers()
// Rhinohorn1#

// useEffect(()=>{
//     getUsers()
// })

return (
 <article
 className="users-cont"
 
    >
        {/* <h4>{auth.user}</h4> */}
        {currentUsers?.length
        ? (

            <table
            className="users"
            style={{
                // marginLeft: '1rem'
            }}
            >
           <tbody>
            <tr className="user-header-trow">
                <th>Activity</th>
                <th className="roles-header">Roles</th>
                <th>Settings</th>
            </tr>
          
                {currentUsers && currentUsers.map((madu, index)=> {
                    return <tr key={index}
                   className="header-trow"
                    style={{backgroundColor: index % 2 === 0 ?
                        'white' : 'powderblue'}}       
                        >

                        <th 
                        className="activity-values"
                        ><Link to="/user-select"
                        onClick={() => userPage(madu._id)}
                        
                        >{madu?.username}</Link></th>

                           <td
                           className="roles"
                                        
                                            >
                                           
                                            {(Object.keys(madu.roles)).join(', ')}.
                                            </td>

                        <td
                        >
                            <Link to={'/user-settings'}
                            onClick={() => userPage(madu._id)}
                            >
                            <FontAwesomeIcon icon={faPenToSquare} />
                            </Link>
                          
                            {/* {madu?._id} */}
                            </td>
                      
                                    
                    </tr>
                }
                
                
               )}
                </tbody>
           </table>
        ) : <p>no user to display</p>}
     
    </article>
)
}

export default Users