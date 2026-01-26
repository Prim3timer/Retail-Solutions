import Users from "./Users";
import { Link } from "react-router-dom";
import UserSelect from "./UserSelect";
import useAuth from "../hooks/useAuth"
import { useState, useEffect, useContext } from "react";
import axios from "../app/api/axios";
import AuthContext from "../context/authProvider";



const Admin = () => {
    const {users,  setAtHome, atHome, setIsRotated} = useContext(AuthContext)
    const {auth} = useAuth()
//    console.log({atHome})
      const [currentPerson, setCurrentPerson] = useState()
      const [showSettings, setShowSettings] = useState(false)

       const falseIsRotated = ()=> {
        setIsRotated(false)
    }
      const falseHome = ()=> {

          setAtHome(false)
      }
console.log(users)



   useEffect(()=> {
    falseHome()
   }, [])
    return (
        <div
        className="admin"
        onClick={falseIsRotated}
      >
        
           <h1
           className="admin-header"
         
            >Admin</h1>
         
            <Link to={'/order'}>Orders</Link>
         
      <section>                   
            {!showSettings ? <h4
            className="users-header"
            style={{textAlign: 'center'}}
            >Users ({auth.users && auth.users.length})</h4> : ''}
            <div className="admin-links">
            
            </div>
            {<h2>Loading...</h2> && 
             
             <Users/>}
            <br/>
            <div className="flexGrow"
            style={{
                textAlign: 'center'
            }}
            >
               
                <button
                className="admin-home-button"
                >

                <Link to="/home"
                  className="admin-home-link"
                >Home</Link>
                </button>
            </div>
        </section>
        </div>
        
    )
}

export default Admin