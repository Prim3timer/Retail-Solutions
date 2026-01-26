
import Cancel from "./Cancel"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useReducer, useState, useContext} from "react"
import { useLocation } from "react-router-dom"
import usePreviousLocation from "../hooks/usePreviousLocation"
import initialState from "../store"
import reducer from "../reducer"
import { FaTrashAlt } from "react-icons/fa";
// import SearchItem from "./SearchItem"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import axios from "../app/api/axios"
import AuthContext from "../context/authProvider"
import useRefreshToken from "../hooks/useRefreshToken"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

// import { type } from "@testing-library/user-event/dist/type"
// import { current } from "@reduxjs/toolkit";
const {v4: uuid} = require('uuid')


// import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";


const ItemList = ()=> {

    const location = useLocation()

    const [image, setImage] = useState('')

const previousLocation = usePreviousLocation()
const previouPath = previousLocation ? previousLocation : 'N/A'

 console.log(location.pathname)
 console.log(previouPath.pathname)

    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const axiosPrivate = useAxiosPrivate()
    const {user, getNames,  measurements,  isRotated, setIsRotated, currency, items} = useContext(AuthContext)
    const refresh = useRefreshToken()
const {auth, getTrans, itemRef, 

} = useAuth()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [taskComplete, setTaskComplete] = useState(false)

       const getItems = async ()=> {
               dispatch({type: 'clear'})
               try {
                   // dispatch({type: 'errMsg', payload: 'loading...'})
                //    const response = await axiosPrivate.get('/items')
                   dispatch({type: 'errMsg', payload: ''})
                 const filterate =items.filter((item)=> item.name.toLowerCase().includes(state.search.toLowerCase()))
                //  console.log(response.data.items ) 
                 console.log(filterate)
                 if (filterate){
                       dispatch({type: 'getNames', payload: filterate})   
        
                       
                       // dispatch({type: 'user', payload: state.getNames[0].name})
                      console.log(state.getNames)
                    //    console.log(response.data)
                    //    setImage(response.newData)
                       
                    } 
                } catch (error) {
                    console.log(error)
                }
           }
       

            const handleSubmit = async (e)=> {
                console.log('set')
               e.preventDefault()
               const {id, name, price, unitMeasure, piecesUnit, image} = state
                   try {
                       const newItem = {
                           name:  state.afa && state.afa,
                           price: price && price,
                           unitMeasure: unitMeasure && unitMeasure,
                           piecesUnit: piecesUnit && piecesUnit,
                           img: state.image && state.image
                           
                       }
                       const response = await axiosPrivate.patch(`/items/${id}`, newItem)  
                       if (response){  
                        //    const graw = await axiosPrivate.get('/items')
                           dispatch({type: 'getNames', payload: graw.data.items})
               
                           dispatch({type: 'ALERTMSG', payload: `${newItem.name} Edited` })
                           setTimeout(()=> {
                               dispatch({type: 'ALERTMSG', payload: '' })
                               dispatch({type: 'isEdit', payload: false})    
                           }, 3000)
                       }
                   }  
                  catch (error) {
                       dispatch({type: 'errMsg', payload: `${error.message}`})
                       setTimeout(()=> {
                           dispatch({type: 'errMsg', payload: ``})
                           
                       }, 3000)
                   }
                   finally {
                   }
           
               }

               const handleEdit = async (id, e )=> {
                // console.log
                    e.preventDefault()    
                    if (!auth.roles.includes(1984)){
                        dispatch({type: 'isMatched', payload: true})
                    } 
                    else {
          
                        
                        dispatch({type: 'isEdit', payload: true})    
                        dispatch({type: 'id', payload: id})
                        itemRef.current.value = id
                        const currentItem =  state.getNames.find((item) => item._id === id)
                        
                        dispatch({type: 'afa', payload: currentItem.name})
                        dispatch({type: 'price', payload: currentItem.price})
                        dispatch({type: 'unitMeasure', payload: currentItem.unitMeasure})
                        dispatch({type: 'IMAGE', payload: currentItem.img})
                        console.log(itemRef.current.value)
                    }
                    
                }

        const handleRemove = async ()=> {
            const item = state.getNames && state.getNames.find((item)=> item._id === state.id)
            console.log(item)
                const response = await axiosPrivate.delete(`/items/delete/${state.id}?name=${item.name}`)
            if (response) {

                const newGraw = state.getNames && state.getNames.filter((item)=> item._id !== state.id)
                dispatch({type: 'getNames', payload: newGraw})
                dispatch({type: 'cancel', payload: false})
            }
            }

    const assertain = (id) => {
        console.log({auth})
        if (!auth.roles.includes(5150)){
            dispatch({type: 'isMatched', payload: true})
        }
        else {
            dispatch({type: 'cancel', payload: true})
            dispatch({type: 'id', payload: id})
            const getItem = state.items && state.items.find((item)=> item._id === id)
            // console.log(getItem)
            dispatch({type: 'inItem', payload: getItem})

        }
    }

        const remainDelete = ()=> {
        // this condition statement is to enable the removal of the confirm window once any part of the 
        // page is touched.
        setIsRotated(false)
        if (state.cancel){

            dispatch({type: 'cancel', payload: false})
        }
        setIsRotated(false)

    }

           const generalRemain = () => {
       dispatch({type: 'isMatched', payload: false})

    } 

    const negateEdit = (e) => {
        e.preventDefault()
                      setTimeout(()=> {

                          dispatch({type:'isEdit', payload: false})
                        }, 50)
    }
                

                useEffect(()=> {
                    getItems()
                }, [state.search])


                useEffect(()=> {
                    refresh()
                }, [])

  return  (
      
             !state.getNames.length ? <h2 className="item-list">Loading...</h2> :<div className="item-list"
           
              onClick={remainDelete}
              >  
              <article id="form-cont">
         




  <form onSubmit={(e)=> e.preventDefault()}
                id="update-form"
                className={state.isEdit ? "edit" : "no-edit"}
                >
                    <h3>

                <label htmlFor="name">name:</label>
                    </h3>
                 <input
                type="text"
                id="name"
                value={state.afa}   
                onChange={(e)=> dispatch({type: 'afa', payload: e.target.value})}
                />
                <h3>
                <label htmlFor="price">price:</label>
                </h3>
                <input
                type="text" 
                id="price"
                // value={numberWithCommas(parseFloat(state.price).toFixed(2))}
                value={state.price}
                onChange={(e)=> dispatch({type: 'price', payload: e.target.value})}
                />
           <h3>
            <label>unit measure:</label></h3><input type="text"
        list="measure"
        onChange={(e)=> dispatch({type: 'unitMeasure', payload: e.target.value})}
        value={state.unitMeasure}
        />
        {/* </h3> */}
        {/* <label>unitMeasure:</label> */}
        <datalist id="measure"
        >
            {measurements.map((measurement, index)=> {
                return (
                    
                    <option 
                    key={index}
                    value={measurement}
                    style={{
                            position: 'relative',
                            color: 'brown',
                        }}
                        >
                            {measurement}
                        </option>)
                    })}
            </datalist>
             <h3>
                <label htmlFor="image">image:</label>
                </h3>
               <input
                type="file"
                // required
                // value={state.image}
                onChange={(e)=> dispatch({type: 'IMAGE', payload: e.target.value})}
                />
               <button type="submit" className="pop">Upload</button>
                <br/>
                <button onClick={e => negateEdit(e)}>Cancel</button>
                <button 
                id="update-button"
                onClick={handleSubmit}
                type="submit">Update</button>
                <h3>{state.alertMsg}</h3>
        
       


         </form>
        
       </article>
          <section className="item-table-top">
           <h2 className="invent-header"
           //   
              >Items ({state.getNames.length})</h2>   <br/>
          <input 
          id="invent-search"
          type="text"
          role="searchbox" 
          placeholder="Search items by name"
          value={state.search}
          onChange={(e)=> dispatch({type: 'search', payload: e.target.value})}
         
              // https://www.npmjs.com/package/@react-google-maps/api
          
          />
          </section>
       <table 
       className="item-table-inventory"
      style={{
    //   position: 'absolute',
    // padding: '0 4rem',
    // width: '95vw',
    fontSize: '1.5rem',
      }}
      >
       <tbody
       >
       <tr>
           <th>NAME</th>
           <th>PRICE ({currency})</th>
           <th>UNIT MEASURE</th>
           {/* <th>P/U</th> */}
           <th colSpan={2}>ACTIONS</th>
           {/* <th>action</th> */}
           </tr>
          {  state.getNames.map((item, index)=> {
        return (
         <tr className="sales-items-cont"
         key={uuid()}
       style={{backgroundColor: index % 2 === 0 ?
        'white' : 'lavender',
     
        // minWidth: '120vw'
    }}
        >
           <th className="sales-items">{item.name}</th>
           <td className="sales-items">{ numberWithCommas(parseFloat(item.price).toFixed(2))}</td>
           <td className="sales-items">{item.unitMeasure.split(' ')[0]}</td>
           {/* <td className="items"> {item.piecesUnit ? item.piecesUnit: 'N/A' } </td> */}
           <td 
           ref={itemRef}
           className="items">
               <a
               onClick={(e) => handleEdit(item._id, e)}
        //    style={{color: 'blue'}}
        //    href={'/edit-item'}
           >
              <FontAwesomeIcon icon={faPenToSquare} />
           </a></td>
           <td 
           className="items"
       
           onClick={(e)=> assertain(item._id, e)}
           >
            {/* remove */}
           <FaTrashAlt 
           
           role='button'
           
           /> 
           </td>
          
       </tr>
      )
      })}

         </tbody>
      </table>
 <div
 className={state.cancel ? 'delete' : 'no-delete'}
           
         >
             <h3
          id="verify-header"
          style={{
              margin: '.5rem auto',
            //   display: 'flex',
          }}
          >Delete {state.inItem.name} from items ?</h3>
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

                 
<div

  className={state.isMatched ? 'authorization-alert' : 'authorization'}
     >
         <h2
      id="verify-header"
      >Unauthorized!</h2>
      <button onClick={generalRemain} >ok</button>
            </div> 
      </div>
      
    //   </div>
          )
    
}

export default ItemList
