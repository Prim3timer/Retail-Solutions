import useAuth from "../hooks/useAuth"
import axios from "../app/api/axios"
import reducer from "../reducer"
import initialState from "../store"
import {useContext, useEffect, useReducer, useState } from "react";
import AuthContext from "../context/authProvider";
const {v4: uuid} = require('uuid')
// import SearchItem from "./SearchItem";


const AllSales = ()=> {
 const [state, dispatch] = useReducer(reducer, initialState)
    const [search, setSearch] = useState('')
        // const [trueSearh, setTrueSearch] = useState('')
        const {currency} = useContext(AuthContext)
      const [search2, setSearch2] = useState('')
         const [transactions, setTransactions] = useState([])
    const getTransactions = async ()=> {
          const innerArray = []
        try {
            const response = await axios.get(('/transactions'))
            
          
               if (response){
                       response.data.map((gr)=> {
                            return gr.goods.map((good)=> {
                                const elements =  {
                                    name: good.name,
                                    qty: good.qty,
                                    unitMeasure: good.unitMeasure,
                                    total: good.total,
                                    date: gr.date
                    
                                }
                                innerArray.push(elements)
                                setTransactions(innerArray)
                                return innerArray
                            })
                        })     
                    }
                    const filterate = innerArray && innerArray.filter((inner)=> inner.name.toLowerCase().includes(search.toLowerCase()))
                    const filterate2 = filterate.filter((inner)=> inner.date.substring(0, 10).includes(search2))
                    // setLast(filterate)

                    dispatch({type: 'sales', 
                     payload: filterate2})

                } catch(error){
                    dispatch({type: 'errMsg', payload: error.message})
                }
            }

              function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
useEffect(()=> {
    getTransactions()
}, [search, search2])
    return (
        <div className="main-sale">
            <h2 className="heading">All Sales ({state.sales.length} rows)</h2>
               <form  className="sales-search-form"   onSubmit={(e)=> e.preventDefault()}>
        <input 
        id="invent-search"
        type="text"
        role="searchbox" 
        placeholder="Search by name"
        value={search}
        onChange={(e)=> setSearch(e.target.value)}
        
        // https://www.npmjs.com/package/@react-google-maps/api
        
        />
        {/* <h3>AND / OR</h3> */}
        <input 
        id="invent-search"
        type="text"
        role="searchbox" 
        placeholder="Search by date"
        value={search2}
        onChange={(e)=> setSearch2(e.target.value)}
        
        // https://www.npmjs.com/package/@react-google-maps/api
        
        />
          </form>

            <table className="sales">
                <tbody>
                          <tr
        className="theader-row"
        >
            <th>NAME</th>
            <th>QTY</th>
            <th>TOTAL</th>
            <th>DATE</th>
            </tr>
             {state.sales && state.sales.map((sale, index)=> {
    return (
        <tr className="sales-items-cont"
        key={uuid()}
        style={{backgroundColor: index % 2 === 0 ?
            'white' : 'khaki'}}
        >
            <th className="sales-items">{`${sale.name.split(' ').join(' ')} ${sale.unitMeasure.split(' ')[1]}`}</th>
            <td className="sales-items">{sale.qty}</td>
            <th className="sales-items">{parseFloat(sale.total).toFixed(2)}</th>
            <td className="sales-items">{sale.date.substring(0, 10)}</td>
        </tr>
    )
})}
                </tbody>
            </table>
            <div
    className="sales-total"
    >
        <h3>Total:</h3>
    <h3>
 {state.sales && numberWithCommas(state.sales.reduce((a, b)=> {
    return  a + parseFloat( b.qty)
}, 0).toFixed(2))}
</h3>
    <h3>

{currency}{state.sales && numberWithCommas(state.sales.reduce((a, b)=> {
    return  a + parseFloat( b.total)
}, 0).toFixed(2))}
    </h3>
    </div>

        </div>
        
    )
}

export default AllSales