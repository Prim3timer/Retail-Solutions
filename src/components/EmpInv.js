import reducer from "../reducer"
import initialState from "../store"
import axios from "../app/api/axios"
import { useEffect, useReducer, useState, useRef, createContext     } from "react"
// import SearchItem from "./SearchItem"
import { Link } from "react-router-dom"
import Edit from "./EditItem"
import { type } from "@testing-library/user-event/dist/type"
const {v4: uuid} = require('uuid')

const EmpInv = ()=> {
    const [state, dispatch] = useReducer(reducer, initialState)
    // const [mark, setMark] = useState('')  


    const invRef = useRef()
    const getTrans = async ()=> {
        const graw = await axios.get('/inventory')
        // console.log(graw.data)
        
        const filterate = graw.data.filter((inner)=> inner.name.toLowerCase().includes(state.search.toLowerCase()))
        dispatch({type: 'inventory', 
            payload: filterate})
        }
        console.log(state.isEdit)
        useEffect(()=> {
            getTrans()
            
    }, [state.search])

    const handleEdit = async (id, e )=> {
        e.preventDefault()     
        dispatch({type: 'isEdit', payload: true})    
        invRef.current.value = id
        console.log(invRef.current.value)
      
    }
    // useEffect(()=> {
    //     handleEdit()
    //     console.log('hello edit')
    // }, [state.isEdit])
 
  return  (

        <div className="inventory-two">  
        <article id="form-cont">
     <form  className="search-form" 
     //   onSubmit={(e)=> e.preventDefault()}
     >
 <input 
 id="invent-search"
 type="text"
 role="searchbox" 
 placeholder="Search items by name"
 value={state.search}
 onChange={(e)=> dispatch({type: 'search', payload: e.target.value})}

     // https://www.npmjs.com/package/@react-google-maps/api
 
 />
   </form>
     <h2 id="invent-header">Inventory</h2>
 </article>
 <table className="emp-inventory"

>
 <tbody>
 <tr>
     <th>name</th>
     <th>qty</th>
     <th> last udated</th>
     </tr>
{state.inventory && state.inventory.map((inv, index)=> {
    console.log(inv.name)
return (
   <tr className="sales-items-cont"
   key={uuid()}
 style={{backgroundColor: index % 2 === 0 ?
     'white' : 'aqua'}}
     >
        
     <td className="sales-items">{inv.name}</td>
     <th className="sales-items" style={{color: inv.qty < 20 ? 'red' : ''}}>{parseFloat(inv.qty).toFixed(2)}</th>
     <td className="sales-items">{inv.date.substring(0, 10)}</td>
    
 </tr>
)
})}
   </tbody>
</table>
{/* <Edit mark={invRef}/>  */}
</div>

    )
}

export default EmpInv