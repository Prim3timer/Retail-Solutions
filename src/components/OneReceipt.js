import { useEffect, useState, useReducer, useContext } from 'react'
import useAuth from '../hooks/useAuth'
import axios from '../app/api/axios'
import initialState from '../store'
import reducer from '../reducer'
import AuthContext from '../context/authProvider'
import { useNavigate, useLocation, router} from 'react-router-dom'
import { format } from "date-fns";



const OneReceipt = ({setOneReceipt}) => {
const [receipts, setReceipts] = useState({})
const [currentUser, setCurrentUser] = useState()
const [currentTrans, setCurrentTrans] = useState()
const [state, dispatch] = useReducer(reducer, initialState)
const {auth, setAuth} = useAuth()
const {currentUsers, setIsRotated, falseRotated, currency} = useContext(AuthContext)
const navigate = useNavigate()
setOneReceipt(true)

const location = useLocation()
// window.history.pushState(null, null, '/shop');
// window.history.pushState(null, null, '/transactions');
const quitDetector = ()=>{
// if (OneReceipt){
    console.log('unloaded')
    // }
}
// window.addEventListener('onbeforunload', quitDetector)
// window.onpopstate = function () {
    //     console.log('unloaded')
    //   setOneReceipt(false)
    
    
    // };
    
    // to detect route change
    useEffect(()=> {
    console.log('unloaded')
    setOneReceipt(false)
}, [location])

const getItems = async ()=> {
    try {
        console.log(currentUsers)

        const response = await axios.get('/transactions')
        if (response){
            const newRes = response.data.map((item)=> {
                if (!item.cashierID){
                    item.cashierID = 'unavailable'
                    item.cashier = 'unavailable'
                }
                // const reverseReceipt = response.data.reverse()
const latestReceipt = response.data.filter((receipt) => receipt.cashierID === auth.picker )
const reverseReceipt = latestReceipt.reverse()
console.log(auth.picker)
                const oneTrans = response.data.find((item) => item._id === localStorage.getItem('memTransaction'))
                // dispatch({type: 'getNames', payload: response.data})
                setCurrentTrans(oneTrans)
                // console.log(currentTrans)
                // dispatch({type: 'getNames', payload: cashierTrans})
                return item
            })
            }
    } catch (error) {
        console.log(error)
    }
   
}
console.log(auth.picker3)

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


useEffect(()=> {
    getItems()
    console.log(currentTrans)
}, [])

   const theDay = new Date(currentTrans && currentTrans.date).toString().substring(4, 25)
//    console.log(theDay)



    return (
       !currentTrans ? <h2
       className='one-receipt'
   onClick={falseRotated}
       style={{
        // backgroundColor: 'yellow',
        textWrap: 'wrap'
      
       }}
       >Loading...</h2> : <div
       className='one-receipt'
       onClick={() => setIsRotated(false)}
    >
         {currentTrans && <article

style={{
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.5rem',
    // backgroundColor: 'yellow',
    textWrap: 'wrap',

         margin: '0 1rem'
    
   }}
  
   >
       {/* <h5>cashierID: {item.cashierID}</h5> */}
                                           <h2 className="receipt-title">{currentTrans.title}</h2>
       {/* <p>{new Date(currentTrans.date).toDateString().substring(4, 15)}</p> */}
       <p>{theDay}</p>
       <p>{currentTrans._id}</p>
       {currentTrans.goods.map((good)=> {
           return (
               <div
               style={{
                    textDecoration: 'none'
               }}
               >
                   <h4>{good.name}</h4>
                   <p>Qty: {parseFloat(good.qty).toFixed(2)}{good.unitMeasure.split(' ')[1].slice(1, -1)}</p>
                   <p>Unit Price: {numberWithCommas(parseFloat(good.price).toFixed(2))}</p>
                   <p
                  
                   >Sub Total: {currency}{numberWithCommas(parseFloat(good.total).toFixed(2))}</p>
              
                   {/* <br/> */}
               </div>
           )
       })}
    <p>card ending in: ...{currentTrans.last4 ? currentTrans.last4 : ''}</p>
       <h4
        style={{
           textAlign: 'left',
           // margin: '0 0 0 4rem',
           // color: 'green'
       }}
       >Grand Total: {currency}{ numberWithCommas(parseFloat(currentTrans.grandTotal).toFixed(2))}</h4>
       
  
<h5>Operator: {currentTrans.cashier}</h5>
    
   </article>}
           
        </div>
    )

}

export default OneReceipt