import { useState, useRef, useEffect, useContext } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLeftLong, faBars } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout";
import SideBar from "./SideBar"
import AuthContext from "../context/authProvider"
import multiLinks from "./multiLinks"
import useWindowSize from "../hooks/useWindowSize"
const NavBar = ()=> {
  
  //  const [isRotated, setIsRotated] = useState(false)
  const {isRotated, setIsRotated, barRef} = useContext(AuthContext)
  const [currentWidth, setCurrentWidth] = useState()
     const navigate = useNavigate();
const location = useLocation()
  const { auth} = useAuth()
const navRef = useRef()
const {width} = useWindowSize()

// console.log(width)

  const workBar = ()=> {
      const navWidth = navRef.current.getBoundingClientRect().width
      // setCurrentWidth(navWidth)
      console.log(navWidth)
  if (isRotated == false){
    
    
    setIsRotated(true)
  } else {

    setIsRotated(false)

  }
}




const logout = useLogout()

     const pix = 1200

    return (
      // making the class name dynamic because of the 'retail tracker' text conflicing with the first element, 'transaction' in
      // the header list of items
         <div  className={location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'  ? 'plain-header' : 'header'}
         ref={navRef}
         >
 
             {location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' ? <h4> Retail Tracker</h4>  : width < 739 ? <p><FontAwesomeIcon ref={barRef} className={
                    !isRotated ? "home-icon rotate-icon" : "home-icon"} onClick={workBar} icon={faBars}/></p> : ''}
               { auth.accessToken &&  <div className="head-home">
                    </div>}

                <div
                className={width > 739 ? 'show-home-links' : 'hide-home-links'}>
            {auth.accessToken && multiLinks.map((link)=> {
                    const {id, name, path} = link
                return (
                  // <div className="link-names">
                    <Link 
                    onClick={() => localStorage.setItem('memUser', auth.picker)}
                    to={path} className={location.pathname === path ? "current-path" : "home-links"} key={id}>{name}</Link>
                 
                    // </div>
               
                      
                    )
                })}
                {auth.accessToken && <Link to="/login" className="home-links" onClick={logout}>logout</Link>}
                </div>
            



           
             
          
                      
            </div>
    )
}

export default NavBar