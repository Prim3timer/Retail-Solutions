import initialState from "../store"
import { useEffect, useContext, useReducer, useState } from "react"
import reducer from "../reducer"
import axios from "../app/api/axios"
import useAuth from '../hooks/useAuth';
import AuthContext from "../context/authProvider";
import { FaTrashAlt } from "react-icons/fa";

import Unauthorized from "./Unauthorized";
import { Link } from "react-router-dom";

const AllTransactions = () => {
const {auth} = useAuth()
const [state, dispatch] = useReducer(reducer, initialState)
const [showOne, setShowOne] = useState(false)
const [oneId, setOneId] = useState('')
const [allTransi, setAllTransi] = useState([])

const {falseIsRotated, currency} = useContext(AuthContext)

    const getItems = async ()=> {
        console.log('picker3 is : ', auth.picker3)
        console.log('picker is: ', auth.picker)
        try {
            const response = await axios.get('/transactions')
            if (response){
                // const newRes = response.data.map((item)=> {
                //     if (!item.cashierID){
                //         item.cashierID = 'unavailable'
                //         item.cashier = 'unavailable'
                //     }
                //     return item
                // })
                
                // const cashierTrans = newRes.filter((item) => item.cashierID === picker)
                console.log({responseDate: response.data})
                dispatch({type: 'getNames', payload: response.data})
                // dispatch({type: 'getNames', payload: cashierTrans})
                setAllTransi(response.data)
                console.log(allTransi)
    console.log(state.getNames)
                const filterate = response.data.filter((inner)=> inner.date.substring(0, 10).includes(state.search))
                console.log(filterate)
            
                filterate.reverse()
             setAllTransi(filterate)
                    
                }
        } catch (error) {
            console.log(error)
        }
       
        
    }




console.log(state.cancel)

const assertain = (id) => {
    if (auth.roles.includes(5150)){
        console.log("deleted")
        
        dispatch({type: 'cancel', payload: true})
        console.log(state.cancel)
        dispatch({type: 'id', payload: id})
        const getItem = allTransi && allTransi.find((item)=> item._id === id)
        if (getItem){

            dispatch({type: 'inItem', payload: getItem})
            console.log(getItem)
        }
    }
    else {
        dispatch({type: 'isMatched', payload: true})
    }
}


const handleRemove = async ()=> {
    dispatch({type: 'cancel', payload: false})
    const response = await axios.delete(`/transactions/${state.id}`)
    // const newGraw = state.items && state.items.filter((item)=> item._id !== state.id)
    console.log(response)


    // e.preventDefault()     
    // removeInventory(id)
        // await axios.delete(`/transactions/${id}`)
        
        const newGraw = response && allTransi.filter((item)=> item._id !== state.id)
        console.log('removed')
    setAllTransi(newGraw)
}

const oneShow = (id) => {
    dispatch({type: 'id', payload: id})
    auth.picker2 = id
   setOneId(id)
//    dispatch({type: 'id', payload: id})
    console.log(oneId)
    // setShowOne(true)
    // setReceipts(false)
}

const remainDelete = ()=> {
    // this condition statement is to enable the removal of the confirm window once any part of the 
    // page is touched.
    if (state.cancel){

        dispatch({type: 'cancel', payload: false})
    }
    // if (state.isEdit){

    //     dispatch({type: 'isEdit', payload: false})
    // }
}

useEffect(()=> {
    getItems()
}, [state.search])


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}





    return (
        !state.getNames.length ? <h2
        style={{
            display: 'flex',
            margin: ' 0 0 0 1rem',
           textAlign: 'center',
           alignItems: 'center',  
           height: '100vh',
           justifyContent: 'center',
        }}
        >Loading...</h2> : <div
        onClick={falseIsRotated}
        style={{
            display: 'flex',
        //   backgroundColor: 'blue',
            margin: ' 2rem 1rem 0',
           textAlign: 'center',
           minHeight: '100vh',
           justifyContent: 'center',
        //    backgroundColor: 'blue'
        }}
        // onClick={remainDelete}
        >

            {<div
           onClick={remainDelete}
                    >
            
            <article id="form-cont">
                        <form  className="search-form"   onSubmit={(e)=> e.preventDefault()}>
                    <input 
                    id="gen-receipt-invent-search"
                    type="text"
                    role="searchbox" 
                    placeholder="Search by date"
                    value={state.search}
                    onChange={(e)=> dispatch({type: 'search', payload: e.target.value})}
                    
                    // https://www.npmjs.com/package/@react-google-maps/api
                    
                    />
                      </form>
            
            
                      {/* <SearchItem/> */}
                    </article>
                        <h2
                        style={{
                            margin: '1rem 0'   
                        }}
                        >All Reciepts {allTransi.length}</h2>
                        {allTransi.map((item)=> {
                            // console.log(item.goods)
                            // console.log(item)
                            return (
                                <section>
                                    <Link to={"/one-receipt"}
                                    style={{ textDecoration: 'none',
                                      
                                    }}
                                    >
                             <article
                             id="receipts"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifySelf: 'flex-start',
                                    // justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    textAlign: 'center',
                                    // backgroundColor: 'green'
                                }}
                                onClick={() => oneShow(item._id)}
                                >
                                    {/* <h5>cashierID: {item.cashierID}</h5> */}
                                    <p>{new Date(item.date).toDateString().substring(4, 15)}</p>
                                    <p>{item._id}</p>
                                    {item.goods.map((good)=> {
                                        return (
                                            <div
                                            style={{
                                                 textAlign: 'left'
                                            }}
                                            >
                                                <h4>{good.name}</h4>
                                                <p>Qty: {good.qty}{good.unitMeasure.split(' ')[1].slice(1, -1)}</p>
                                                <p>Unit Price: {currency}{numberWithCommas(parseFloat(good.price).toFixed(2))}</p>
                                                <p
                                               
                                                >Sub Total: {numberWithCommas(parseFloat(good.total).toFixed(2))}</p>
                                           
                                                <br/>
                                            </div>
                                        )
                                    })}
                                  <p>card ending in: ...{item.last4 ? item.last4 : ''}</p>
                                    <h4
                                     style={{
                                        textAlign: 'left',
                                        // margin: '0 0 0 4rem',
                                        // color: 'green'
                                    }}
                                    >Grand Total: {currency}{ numberWithCommas(parseFloat(item.grandTotal).toFixed(2))}</h4>
                                    
                               
                       <h5>Cashier: {item.cashier}</h5>
                                 
                                </article>
                                </Link>
                                {/* <h3 onClick={(id)=> handleRemove(item._id)} */}
                                <h3 onClick={(e)=> assertain(item._id, e)}
                                        style={{
                                            textAlign: 'center',
                                        }}
                                        >
                                    <FaTrashAlt role='button'
                       
                       /> 
                                    </h3>
                                    <br/>
                                </section>
                            )
                        //    })
                        })}
                        
                        <div
                        style={{
                            display: `${state.cancel ? 'block' : 'none'}`,
                            position: 'fixed',
                        textAlign: 'center',
                        top: '35%',
                        left: '5%',
                        width: '90%',
                         padding: '1rem',
                           backgroundColor: '#DBBFDB',
                           borderRadius: '5px',
                           opacity: '.85'
                     }}
                     >
                         <h3
                      id="verify-header"
                      style={{
                          margin: '.5rem auto',
                        //   display: 'flex',
                      }}
                      >Delete from Receipts?</h3>
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
                             style={{backgroundColor: 'red',
                                 borderColor: 'red'
                             }}
                             >Yes</button></article></div>
            
                    </div>}
            
        </div>
    )
}

export default AllTransactions