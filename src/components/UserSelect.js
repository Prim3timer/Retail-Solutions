import { useEffect, useReducer, useState, useContext } from "react"
import useAuth from "../hooks/useAuth"
import axios from "../app/api/axios"
import initialState from "../store"
import reducer from "../reducer"
import Sales from "./Sales"
import Shopping from "./Reciepts"
import AuthContext from "../context/authProvider"
import { Link } from "react-router-dom"
import AllTransactions from "./AllTransactions"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const UserSelect = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
//    const {users, currentUsers} = useContext(AuthContext)
const [username, setUsername] = useState('')
const {auth} = useAuth()
console.log({auth})
const {users, setCurrentUser2, currentUser2, currentUser, currentUsers} = useContext(AuthContext)
console.log('picker3 is : ', auth.picker3)
console.log({users})
    console.log('picker is: ', auth.picker)
    // const {indSales} = initialState 
 console.log({currentUsers})

      auth.picker = auth.picker3

    console.log('current user 2: ', currentUser2)
 
    const [allTransactons, setAllTransactions] = useState(false)
    const [picker, setPicker] = useState('')
    const [reciepts, setReceipts] = useState(false)
    const axiosPrivate = useAxiosPrivate()

const showMe = () => {
    // dispatch({type: 'indSales', payload: true})
    // setPicker(auth.picker3)
   
  
}
const getAUser = async ()=>{
    try {
               const response = await axiosPrivate.get('/users')
               console.log(response.data)
               console.log(localStorage.getItem('memId'))
               const user = response.data.users.find((user) => user._id === localStorage.getItem('memUser'))
               console.log(user)
        if (user){
    
            setCurrentUser2(user)
            setUsername(user.username)
            console.log({username})
        }
    } catch (error) {
        console.error(error.message)
    }
}



    console.log(state.indSales)

      useEffect(()=> {
    getAUser()
  }, [])


    return (
   !username ? <h2
   className="user-select"
   >Loading...</h2> : <div

        className="user-select"
    >
            <h2
          className="user-select-header"
            >{username}{"'s"} activity</h2>
            {console.log(currentUser)}
            <article
            className="userselect-buttons-container"
         
            >
               <Link
               to={'/sales'}
               > <button
               onClick={showMe}
                >Sales</button></Link>
               <Link
               to='/all-sales'
               > <button
            //    onClick={showMe}
                >All Sales</button></Link>
               <Link 
               onClick={showMe}
               to='/receipts'> <button
              
                >Reciepts</button></Link>

                <Link to={'/all-transactions'}><button
            
                >All Receipts</button></Link>
                     {/* <Link to="/admin"><button>Admin</button></Link> */}
            </article>
          {/* {salesReciecpts} */}
     
        </div>
    )
}

export default UserSelect