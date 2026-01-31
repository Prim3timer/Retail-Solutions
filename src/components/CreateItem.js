import reducer from "../reducer"
import initialState from "../store"
import axios from '../app/api/axios'
import { useEffect, useReducer, useRef, useState, useContext } from "react"
import useRefreshToken from "../hooks/useRefreshToken"
import { type } from "@testing-library/user-event/dist/type"
import AuthContext from "../context/authProvider"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { format } from "date-fns"
const {v4: uuid} = require('uuid')



let CreateItem = () => {
       const [state, dispatch] = useReducer(reducer, initialState)
       const itemRef = useRef()
       const [showUpdate, setShowUpdate] = useState(false)
       const [files, setFiles] = useState()
       const now = new Date()
       const [description, setDescription] = useState('')
 
    const {falseIsRotated, measurements, catArray} = useContext(AuthContext)
    console.log(catArray)
     const refresh = useRefreshToken()
 const axiosPrivate = useAxiosPrivate()

    const handleSubmit = async (e)=> {
        e.preventDefault()
        if (files){
             const theBigPics = files.filter((pic) =>  pic.size > 2000000)
        console.log(theBigPics)
        if (theBigPics.length ){
            dispatch({type: 'success', payload: true})
            dispatch({type: 'errMsg', payload: 'Please limit file sizes to 2MB. Thank you.'})
            setTimeout(()=> {
                dispatch({type: 'success', payload: false})
            }, 3000)
        }
        }
        else {
              setShowUpdate(true)
        dispatch({type: 'isMatched', payload: 'creating item...'})
        e.preventDefault()
        const {name, price, unitMeasure, image, ole, category} = state
        const formData = new FormData()
        if (files){
            files.map((file) => formData.append('images', file))

        }
        console.log(formData)

        console.log(files)
        try {
            const newItem = {
                name: `${name}`,
                price: price,
                unitMeasure: unitMeasure,
                description,
                qty: ole,
                category,
                // image: files,
                now
            }
            


        console.log(newItem)
        const theMatch = state.items && state.items.data.find((item)=> item.name.toString().toLowerCase() === newItem.name.toLowerCase()) 
        if (theMatch){

                const myError =  new Error('There cannot be two intances of the same item')
        }
        else {
            const response = await axios.post('/items', newItem)  
            const response2 = await axios.post(`/items/pic/upload/${newItem.name}`, formData)
            if (response){  
               
                dispatch({type: 'isMatched', payload: `new item, ${newItem.name} created` })
                setTimeout(()=> {
                    dispatch({type: 'isMatched', payload: '' })
                    setShowUpdate(false)
                }, 3000)
            }
            dispatch({type: 'name', payload: '' })
            dispatch({type: 'price', payload: '' })
            dispatch({type: 'unitMeasure', payload: '' })
            dispatch({type: 'piecesUnit', payload: '' })
            dispatch({type: 'IMAGE', payload: '' })
            setDescription('')
            dispatch({type: 'ole', payload: ''})
            dispatch({type: 'category', payload: ''})
           
        }  
        } catch (error) {
            dispatch({type: 'errMsg', payload: `${error.message}`})
            setTimeout(()=> {
                dispatch({type: 'errMsg', payload: ``})
                
            }, 3000)
        }finally{
            itemRef.current.focus()
        }
        }
       

    }



    const handleFile = (e) => {
        const allFiles = Object.values(e.target.files)
        setFiles(allFiles)
        console.log(files)
    }


const handleUpload = async (e) => {
    e.preventDefault()
    console.log(files)
   const formData = new FormData()
        files.map((file) => formData.append('images', file))
        console.log(formData)
    const response = await axios.post(`/item/pic/upload/${state.name}`, formData)
    console.log(response.data)
}
    return (
        <div className="create-item"
           onClick={falseIsRotated}
        >
            <h2 id="create-item-heading">Create Item</h2>
            <form onSubmit={handleSubmit}
            id="create-item-form" >
                <h4>Name:</h4>
                <input
              ref={itemRef}
                type="text"
                // required
                value={state.name}
                onChange={(e)=> dispatch({type: 'name', payload: e.target.value})}
                />

{/* <h3 id="ulu" */}
<h4>Unit Measure:</h4><input type="text"
        list="measure"
        onChange={(e)=> dispatch({type: 'unitMeasure', payload: e.target.value})}
        value={state.unitMeasure}
        />
        <datalist id="measure"
        >
            {measurements.map((measurement, i)=> {
                return (
                    
                    <option 
                    key={i}
                    className="create-item-options"
                    value={measurement}
                  
                        >
                            {measurement}
                        </option>)
                    })}
            </datalist>


                <h4>Price:</h4>
                <input
                type="text"
                // required
                value={state.price}
                onChange={(e)=> dispatch({type: 'price', payload: e.target.value})}
              
                />
                <br/>   
                <h4>in stock:</h4>
                <input
                type="text"
                required
                value={state.ole}
                onChange={(e)=> dispatch({type: 'ole', payload: e.target.value})}
              
                />
                <br/>   
                <h4>category:</h4>
                <input
                type="text"
                id="catogory"
                required
                value={state.category}
                onChange={(e)=> dispatch({type: 'CATEGORY', payload: e.target.value})}
              
                />
                <datalist>
                    {catArray.map((cat)=> {
                        return (
                           <option
                           value={cat}
                           >{cat}</option>
                        )
                    })}
                </datalist>
                <br/>   
                  <p>Description:</p>
                <textarea maxLength={300}
                className="item-description"
                value={description}
                onChange={(e)=> setDescription(e.target.value)}
                ></textarea>
                <br/>   
                <div className="create-item-image-box">
                <h4>Add Images</h4>
                <p>Maximum size of 2MB for each. Maximum of 5 can be uploaded at once</p>
                <input
                type="file"
                // required
                onChange={handleFile}
                  multiple
                />
                </div>
                <br/>
              
              
               <button type="submit" className="pop">Add Item</button>
        <h3 className={showUpdate ? "delete" : "hide-show-update"}>{state.isMatched}</h3>
       {state.success ?  <h3 className="delete">{state.errMsg}</h3> : ''}
               
            </form>
        </div>
    )
}

export default CreateItem