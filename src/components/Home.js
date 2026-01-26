    import { useNavigate, Link, useLocation } from "react-router-dom";
import {useEffect, useReducer, useContext, useState } from "react";
import axios from "../app/api/axios";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/authProvider";
import reducer from "../reducer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLeftLong, faBars } from "@fortawesome/free-solid-svg-icons"
// import { init } from "create-react-app/createReactApp";
import initialState from "../store";
import { type } from "@testing-library/user-event/dist/type";
import useRefreshToken from "../hooks/useRefreshToken";
import useLogout from "../hooks/useLogout";
import { axiosPrivate } from "../app/api/axios";

const Home = ()=> {
    const [state, dispatch] = useReducer(reducer, initialState)
   const {auth} = useAuth()
const refresh = useRefreshToken()
const logout = useLogout()
    const {  setAtHome, getUsers, atHome } = useContext(AuthContext);
   
    const navigate = useNavigate();
    const location = useLocation();
    const trueHome = ()=> {

        setAtHome(true)
    }


    const preserveName = async () =>{
    
        try {
            
            // const data = await refresh()
            // console.log({data})
            // if (username) setNewName(username)
        } catch (error) {
            console.error(error)
        }

}

    const signOut = async () => {
       
            // if used in more components, this should be in context 
            // axios to /logout endpoint 
            const response = await logout()
            console.log(response)
            navigate('/login');
            if (response){

            }
        }

useEffect(()=> {
    trueHome()
}, [])
  
         useEffect(()=> {
           preserveName()
         }, [])
    return (
        <div  className="home-cont">
            
            <div 
            className="outer-home" 
            >
                
            <h3
          >  {auth.user ?  `Hi, ${auth.user}`: ''} 
    
             </h3>
          
            </div>
        <section
      className={"home"}
        >
       

        <Link 
    
        to="/transactions">transaction</Link>
      
     
      
        <Link
       
        to="/create-item">add item</Link>
      
   
        <Link to="/item-list">items</Link>
        
   
        <Link to="/inventory">inventory</Link>

        {/* <Link to="/emp-inv">Inventory2</Link> */}
      
       
        <Link to="/admin">admin</Link>
       

        <Link 
        // onClick={showDem}
        
        to="/sales">sales</Link>
        {/* <Link         
        to="/editor">bars</Link>
        <br/> */}
     
        <Link
        to="/shopping">reciepts</Link>
      
        <Link
        to="/shop">shop</Link>
       
        <Link to="/cart">
        cart
        </Link>
        <Link to="/cancel">
        cancel
        </Link>
        
        {/* <br /> */}
        {/* <Link to="/linkpage">link page</Link> */}
      
        {/* <Link to="/shopping">Shopping</Link> */}
        {/* Your <FontAwesomeIcon icon={faLeftLong} /> is hot and ready! */}
    </section>
        
        <div 
        className="flexGrow"
        // style={{textAlign: 'center'}}
        >
        </div>

        
    </div>
    )
}
export default Home