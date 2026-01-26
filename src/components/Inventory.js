import reducer from "../reducer"
import initialState from "../store"
import axios from "../app/api/axios"
import { useEffect, useReducer, useState, useRef, createContext, useContext } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../hooks/useAuth"
// import SearchItem from "./SearchItem"
import { Link } from "react-router-dom"
import Edit from "./EditItem"
import { type } from "@testing-library/user-event/dist/type"
import AuthContext from "../context/authProvider"
import useRefreshToken from "../hooks/useRefreshToken"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns"
const {v4: uuid} = require('uuid')


// export const idContext = createContext()
// console.log(idContext)


const Inventory = ({mark, setMark})=> {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {auth, setAuth} = useAuth()
  const [search2, setSearch2] = useState('')
    const invRef = useRef()
    const {setIsRotated, setCurrentUsers, items} = useContext(AuthContext)
    const axiosPrivate = useAxiosPrivate()

     const navigate = useNavigate();
    const location = useLocation();


       const falseIsRotated = ()=> {
        setIsRotated(false)
    }
    const getTrans = async ()=> {

          try {
            


            //   const graw = await axiosPrivate.get('/items')

              const filterate = items.filter((inner)=> inner.name.toLowerCase().includes(state.search.toLowerCase()))
              dispatch({type: 'items', 
                  payload: filterate})

                   if (search2){
  const stockFilter = filterate && filterate.filter((item)=> item.qty <= search2)
  dispatch({type: 'items', payload: stockFilter && stockFilter})

}
          } catch (error) {
            dispatch({type: 'errMsg', payload: error.Message})
          }
        }
        useEffect(()=> {
            getTrans()
            
    }, [state.search, search2])


     const showEdit = (id, e)=> {
        if (!auth.roles.includes(1984)){
            dispatch({type: 'isMatched', payload: true})
        } else {
            dispatch({type: 'isEdit', payload: true})    
            const currentItem =   items.find((item) => item._id === id)
            dispatch({type: 'afa', payload: currentItem.name})
            dispatch({type: 'ole', payload: currentItem.qty})
            dispatch({type: 'id', payload: id})

        }
            }


        const handleEdit = async (e, name, qty )=> {
                e.preventDefault()     
                const inventory = {
                    // id,
                      name: state.afa ? state.afa : name,
                    //   name: state.name,
                      qty: state.ole ? state.ole : qty,
                    //   qty: state.qty,
                    date:   new Date()
            
                  }
                  const response = await axiosPrivate.patch(`/items/inventory/${state.id}`, inventory) 
                  if (response){
                    const updatedItems = items.map((item) => {
                        if (item._id === state.id){
                            return {...item, name: inventory.name, qty: inventory.qty, date: inventory.date}
                        }
                        return item
                    })
                  
                      dispatch({type: 'items', payload: updatedItems})
                      dispatch({type: 'success', payload: 'inventory edited'})
                      setTimeout(()=> {
                          dispatch({type: 'success', payload: ''})
          
                          dispatch({type: 'isEdit', payload: false})    
                      }, 1000)
                      console.log(response)
                  }        
    
     
     
}

    const remainEdit = () => {
       if (state.isMatched) dispatch({type: 'isMatched', payload: false})

}


 
    return (
       
    !state.items ? <h2 className="inventory-spec">...Loading</h2> : <section
        className="inventory-spec"
        onClick={falseIsRotated}
        style={{ 
            // minWidth: '100vw',
            // minHeight: '100vh',
            // background: 'blue'
        }}
        >


<div
            className={state.isMatched ? 'authorization-alert' : 'authorization'}
     >
         <h2
      id="verify-header"
     
      >Unauthorized!</h2>
      <button onClick={remainEdit} >ok</button>
            </div> 

       

            {/* <h2>Edit Inventory</h2> */}
            <form onSubmit={(e)=> e.preventDefault()}
             className={state.isEdit ? "edit" : "no-edit"}
          id="invent-update-form"
                >
                    <h3
                    
                    id="name"
                    >

             {state.afa}
                    </h3>
                 {/* <input
                type="text"
                value={state.afa}
                onChange={(e)=> dispatch({type: 'afa', payload: e.target.value})}
                /> */}
                {/* <h3> */}
                <label htmlFor="qty">qty:</label>
                {/* </h3> */}
                <input
                type="text" 
                id="ole"
                value={state.ole}
                onChange={(e)=> dispatch({type: 'ole', payload: e.target.value})}
                />
                <div className="edit-action">
              <button 
              className="clear-invent-edit"
              onClick={e => dispatch({type: 'isEdit', payload: false})}>Cancel</button>
                <button 
                id="update-button"
                onClick={handleEdit}
                // onClick={checkForUnitMeasurValues}
                type="submit">Update</button>
                </div>
                <h3>{state.success}</h3>
            </form>
    
  

        <div 
        className="inventory"
        > 
        <article id="form-cont">

    <form  className="sales-search-form" 
     //   onSubmit={(e)=> e.preventDefault()}
     >
             <h2 
             className="invent-header"
    
     >Inventory</h2> 
 <input 
 id="invent-search"
 type="text"
 role="searchbox" 
 placeholder="Search by name"
 value={state.search}
 onChange={(e)=> dispatch({type: 'search', payload: e.target.value})}
 
 // https://www.npmjs.com/package/@react-google-maps/api
 
 />
 <article>
 <h3>
      <label>Search by stock level</label>
</h3>
     <input
 id="invent-search"
      placeholder="pick a number"
       role="searchbox" 
      value={search2}
      onChange={(e)=> setSearch2(e.target.value)}
      />
      </article>
   </form>
   
 </article>
 <table 
 className="inventory-table"
>
 <tbody>
 <tr className="invent-header-trow">
     <th>NAME</th>
     <th>IN-STOCK</th>
     <th> LAST UPDATED</th>
     {/* <th>ACTION</th> */}
     </tr>
{state.items && state.items.map((inv, index)=> {
    console.log(inv.date)
    const invReg = inv.qty < 1 ? inv.qty = 0 : inv.qty
    // console.log(correctFormat)
    // const theDay = new Date(inv.date).getDate()
    // const aDate = format(inv.date.substring(0, 10), `${theDay} MMM, yyyy`)
return (
   <tr className="sales-items-cont"
   key={uuid()}
 style={{backgroundColor: index % 2 === 0 ?
     'white' : 'palegreen'}}
     >
        
     <td className="sales-items">{`${inv.name}`}</td>
     <th className="sales-items" style={{color: inv.qty < 20 ? 'red' : ''}}>{inv.unitMeasure === 'Kilogram (kg)' || inv.unitMeasure === 'Kilowatthour (kWh)' 
                    || inv.unitMeasure === 'Kilowatt (kW)'  || inv.unitMeasure === 'Pound (lbs)' ||  inv.unitMeasure === 'Litre (L)' ? parseFloat(invReg).toFixed(2) : invReg} {inv.unitMeasure.split(' ')[1].slice(1, -1)}</th>
     <td className="sales-items" >{new Date(inv.date).toString().substring(4, 25)}</td>
     {/* <td 
     ref={invRef}
     className="sales-items">
         <a
         onClick={(e) => showEdit(inv._id, e)}
     >
      <FontAwesomeIcon icon={faPenToSquare} />
     </a>
     </td> */}
 </tr>
)
})}
   </tbody>
</table>
<h3>{state.errMsg}</h3>
</div>
</section>
)
 
    

}

export default Inventory