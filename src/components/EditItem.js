import { useReducer, useEffect, useContext, useState  } from "react"
import reducer from "../reducer"
import initialState from "../store"  
import axios, { axiosPrivate } from "../app/api/axios"
import AuthContext from "../context/authProvider"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes, faPlus, faTrash, faSave } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { type } from "@testing-library/user-event/dist/type"



const EditItem = ()=> {
    const [state, dispatch] = useReducer(reducer, initialState)
    const {items, picUrl, measurements} = useContext(AuthContext)
    const [item, setItem] = useState({})
    const [picArray, setPicArray] = useState([])
   const [firstName, setFirstName] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')
    const [id, setId] = useState()
    const [file, setFile] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [index, setIndex] = useState()
    const [success, setSuccess] = useState(false)
    const [initialPic, setInitialPic] = useState()
    const [msgBackup, setMsgBackup] = useState(false)
      const {afa, unitMeasure, ole} = state
       const now = new Date()

const navigate = useNavigate()

            let fiveArray = []

    const handleDeletePic = async (pic, id, index) => {

        try {
             const getPic = picArray.find((pic) => pic.id === id)
        console.log(getPic.name)
        setInitialPic(getPic.name)
    
        console.log(getPic)
       const currentPics = picArray.map((pic) => {
        if (pic.id === id){
            return {...pic, name: 'no image'}
        }
        return pic
       })
       setPicArray(currentPics)
       const response = await axiosPrivate.delete(`/delete-pic/${getPic.name}?name=${item.name}&id=${item._id}`)
       if (response){
           dispatch({type: 'success', payload: true})   
            dispatch({type: 'errMsg', payload: response.data})
            setTimeout(()=> {
                
                dispatch({type: 'errMsg', payload: ''})
                dispatch({type: 'success', payload: false})   
            }, 3000)
            //    dispatch({type: 'success', payload: true})
    }
    } catch (error) {
            dispatch({type: 'errMsg', payload: error.message})
            
        }
       
    }

    const getItem = () => {
        const currentItem = items && items.find((item) => item._id === localStorage.getItem('memId'))
        if (currentItem){
            setFirstName(currentItem.name)
         dispatch({type: 'unitMeasure', payload: currentItem.unitMeasure})
            setPrice(currentItem.price)
            dispatch({type: 'ole', payload: currentItem.price})
            dispatch({type: 'afa', payload: currentItem.name})
            setQuantity(currentItem.qty)
            setDescription(currentItem.description)
         setPicArray(currentItem.img)
            
            setItem(currentItem)
        }
    }

    const options = measurements.map((measurement) => {
        return (
            <option
            className="update-form-unit-measure"
            >{measurement}</option>
        )
    })

       const hanldeImageId = (ide) => {
        setId(ide)
        console.log(ide)
        setSuccess(false)
      
      }
    //      const instantHandleFile = (e, id) => {
    //     setInstantFile(e.target.files[0])
    //     console.log(e.target.files[0])
    //      setInstantId(id)
    // }


    const onUnitMeasureChange = (e) => {
        console.log(e.target.value)
        dispatch({type: 'unitMeasure', payload: e.target.value})
        // setUnitMeasure(e.target.value)
    }

     const handleFile = (e, ide) => {
        e.preventDefault()
    
        setFile(e.target.files[0])
        const newArray= picArray.map((pic)=>{
            if (pic.id === ide){
                return {...pic, name: e.target.files[0].name}
            }
            return pic
        })
        if (file && file.size <= 2000000){
            setSuccess(true)
            setId(ide)
            setPicArray(newArray)
         
            setId(ide)
        }
        console.log(e.target.files[0])
      }





// to add a single image to a particular canvas
      const handleUpload = async (id) => {
        console.log(file.size)
        setIsLoading(true)
        if (file && file.size > 2000000){
               dispatch({type: 'success', payload: true})
            dispatch({type: 'errMsg', payload: 'Please limit file sizes to 2MB. Thank you.'})
            setTimeout(()=> {
                dispatch({type: 'success', payload: false})
            }, 3000)
        }else {
            setIsLoading(true)
            const formData = new FormData()
          try {
               const imgObj =  {id, name: file.name}
      formData.append('image', file)
      console.log(item.img)
            
               item.img.map((item, i) => {
      fiveArray.splice(item.id -1, 1, item)
    })
               fiveArray.splice(id - 1, 1, imgObj) 
               console.log(fiveArray)
               const response = await axios.patch(`/items/pic/${item.name}?fiveArray=${JSON.stringify(fiveArray)}&initialPic=${initialPic}&id=${item._id}`, formData)
               if(response){
                console.log(response.data.message)
                  dispatch({type: 'success', payload: true})   
                //   setMsgBackup(true)
                  setIsLoading(false)                        
                  dispatch({type: 'errMsg', payload: response.data.message})
                  setTimeout(()=> {
                        setMsgBackup(false)
                        setSuccess(false)
                        dispatch({type: 'errMsg', payload: ''})
                        dispatch({type: 'success', payload: false})   
                   }, 3000)
                   
                  }
                  
                } catch (error) {
                    dispatch({type: 'errMsg', payload: error.message})
                }finally {
                    
                    setFile('')
          }
   
               
        }
      }
      


// the purpose of this function is to make the image render once its uploaded
const imageFunc = async () => {
    
    
    try {
      if (file && file.size > 2000000){
           console.log(file.name)
             dispatch({type: 'success', payload: true})
             dispatch({type: 'errMsg', payload: 'Please limit file sizes to 2MB. Thank you.'})
             setTimeout(()=> {
                 dispatch({type: 'success', payload: false})
                 
                }, 3000)
            } else {
                dispatch({type: 'errMsg', payload: ''})
                dispatch({type: 'success', payload: false})
                
              const backendItems = await axiosPrivate.get('/items')
              const currentBackItem = backendItems.data.items.find((it) => it._id === item._id)
              if (currentBackItem){
                  console.log(currentBackItem.img)
                  setPicArray(currentBackItem.img)
                 
              }
          }
          
    
  } catch (error) {
    
  }
}

    const handleEdit = async (ide) => {
         
        console.log(fiveArray)
        setId(ide)
        console.log(state.afa)
        console.log(firstName)
        try {
               const newItem = {
                name: afa,
                price: ole,
                quantity,
                unitMeasure,
                description,
                // image: files,
                now
            }
             console.log(fiveArray)
            console.log(newItem)
           
             const response2 = await axios.patch(`/items/texts/${JSON.stringify(newItem)}?id=${item._id}&firstName=${firstName}&index=${id}`)
            dispatch({type: 'success', payload: true})
            dispatch({type: 'errMsg', payload: response2.data.message})
        } catch (error) {
            dispatch({type: 'errMsg', payload: error.message})
        }
        finally {
            setTimeout(()=> {
                dispatch({type: 'success', payload: false})
                dispatch({type: 'errMsg', payload: ''})
            }, 3000 )
        }
    }

    const handleDescription = (e) => {
        setDescription(e.target.value)
    }


    const handleItemDelete = async () => {
        console.log(item._id, item.name)
        try {
            const response = await axiosPrivate.delete(`/items/delete/${item._id}?name=${item.name}`)
              if (response){
                navigate('/item-list')
              }
        } catch (error) {
            dispatch({type: 'errMsg', payload: error.message})
        }
        console.log('deleted')
    }

        const remainDelete = () => {
        // this condition statement is to enable the removal of the confirm window once any part
        // of the 
        // page is touched.
        if (state.cancel) {

            dispatch({ type: 'cancel', payload: false })
        }

    }

        const generalRemain = () => {
        if (state.isMatched) dispatch({ type: 'isMatched', payload: false })

    }

      const assertain = () => {
        dispatch({ type: 'cancel', payload: true })
    }

    useEffect(()=> {
        getItem()
    }, [])

    useEffect(()=> {
        imageFunc()
    }, [file])

 
    return (
        <div className="edit-an-item"
        onClick={remainDelete}
        >
            <h2>Edit {item.name}</h2>
            <section className="edit-item-colage">
        {picArray && picArray.map((pic)=> {
         return (
            <div className="edit-item-image" key={pic.id}>
                   {isLoading && pic.name === file.name ?  <p className="loading">Loading...</p> : ''}
       
                {pic.name === 'no image' ?  '':   <div className="the-icons"><label
     
        onClick={() => handleDeletePic(pic, pic.id, index)}
        > <FontAwesomeIcon
           className="del-icon-inner"
        icon={faTimes} /> </label></div>}
                
          {pic.name === 'no image' ? <div className="input-icon">{id === pic.id && file ? <p
  className={file.size <= 2000000 ? 'pic-name' : 'pic-no-name'}
  >{ file.size <= 2000000 ? file.name : '' }</p> : ''}<br/> {id !== pic.id || !file || file.size > 2000000  ? <label  className="plus"
    htmlFor="addImage"
  ><FontAwesomeIcon icon={faPlus}/></label> : ''}
  {/* to get the file input to remain active as long as a valid image is not yet selected */}
 {state.errMsg === 'Please limit file sizes to 2MB. Thank you.' || !file  ? <input type="file"
   className={'add-pic-edit'}  
   onChange={(e) => handleFile(e, pic.id)}  
   onClick={() => hanldeImageId(pic.id)}
   htmlFor="addImage"
   /> : ''}
 </div> : 
 <img className="edit-item-image" src={`${picUrl}/images/${item.name}/${pic.name}`} alt={pic.name}/>}
 {/* if file has a value and id = id of the element  in picArray and  both success and isLoading is false */}
         {file && file.size <= 2000000 && !isLoading ? <button className={id === pic.id && file.size <= 2000000 ? 'show-button': 'hide-button'} onClick={() => handleUpload(pic.id)}
//   

   >upload image</button> : ''}
   {isLoading && id === pic.id  ? <p className="uploading-image">uploading...</p> : ''}
            </div>
         )

        })}

        </section>
            <form onSubmit={(e)=> e.preventDefault()}
                className="item-update-form"  
                >
                <label htmlFor="name">name

                <input
                type="text"
                id="name"
                className="update-form-name"
                value={state.afa}
                onChange={(e)=> dispatch({type: 'afa', payload: e.target.value})}
                />
                </label>
                <label htmlFor="qty">in stock
                <input
                type="text" 
                className="update-form-quantity"
                id="ole"
                value={quantity}
                onChange={(e)=> setQuantity(e.target.value)}
                />
                </label>
                <label>unit measure
                 <select
                className="unit-measure-options"
                size={"1"}
                    value={unitMeasure}
                    onChange={(e)=> onUnitMeasureChange(e)}
                >
                 {options}
                </select>
                </label>
              
                <label htmlFor="qty">price
                <input
                type="text" 
                id="ole"
                value={state.ole}
                onChange={(e)=> dispatch({type: 'ole', payload: e.target.value})}
                />
                </label>
                <label>description:</label>
                <textarea className="item-description"
                maxLength={300}
                value={description}
                onChange={(e) => handleDescription(e)}
                ></textarea>
              
                <section className="edit-delete-text">
               <button  className="user-action"
               onClick={assertain}
               > <FontAwesomeIcon icon={faTrash}/></button>
                <button 
                className="user-action"
                onClick={handleEdit}
                type="submit"><FontAwesomeIcon icon={faSave}/></button>
                </section>
                {state.success || msgBackup ?<h2 className="delete">{state.errMsg}</h2> : ''}
            </form>

                <div
                    className={state.cancel ? 'delete' : 'no-delete'}
                >
                    <h3
                        id="verify-header"
                        style={{
                            margin: '.5rem auto',
                            //   display: 'flex',
                        }}
                    > Delete  {item.name && item.name} from items</h3>
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
                            onClick={handleItemDelete}
                            style={{
                                backgroundColor: 'red',
                                borderColor: 'red'
                            }}
                        >Yes</button></article></div>

                <div
                    className={state.isMatched ? 'unauthorization-alert' : 'authorization'}

                >
                    <h2
                        id="verify-header"
                        style={{
                            margin: '.5rem auto',
                            //   display: 'flex',
                        }}
                    >Unauthorized!</h2>
                    <button
                        onClick={generalRemain}
                    >
                        ok</button>

                </div>
        </div>
    )
}

export default EditItem
