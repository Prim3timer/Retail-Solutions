import reducer from "../reducer"
import initialState from "../store"
import axios from "../app/api/axios"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { format } from 'date-fns'
import useAuth from '../hooks/useAuth';
import { Link } from "react-router-dom";
import AuthContext from "../context/authProvider";
import useRefreshToken from "../hooks/useRefreshToken";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

{/* $ */ }


const Transactions = () => {


    const [state, dispatch] = useReducer(reducer, initialState)
    const [cash, setCash] = useState(false)
    const [card, setCard] = useState(false)
    const [checkout, setCheckout] = useState(false)
    const now = new Date()
    const { auth, setAtHome, falseIsRotated, currency, items, picUrl } = useContext(AuthContext)
    const inputRef = useRef()
    const qtyRef = useRef()
    const cashPaidRef = useRef(null)
    const [firstRedChecker, setFirstRedChecker] = useState('')
    const [success, setSuccess] = useState(false)
    const [noShow, setNoShow] = useState(false)
    const [recipt, setReceipt] = useState({})
    console.log(items)
    const axiosPrivate = useAxiosPrivate()

    localStorage.setItem('memUser', auth.picker)
    const refresh = useRefreshToken()


    const handleAdd = (e) => {
        e.preventDefault()

        try {

            if (inputRef.current.value) {

                setFirstRedChecker('')
                if (state.success === false) state.success = true
                else state.success = false

                const currentItem = items.find((name) => `${name.name}` === inputRef.current.value)
                if (!currentItem) dispatch({ type: 'errMsg', payload: 'filtering...' })
                // setFirstRedChecker('tamgible')
                currentItem.total = currentItem.price
                dispatch({ type: 'name', payload: inputRef.current.value })
                const acutalItem = { ...currentItem, qty: 1 }
                const match = state.transArray.find((item) => item.name === acutalItem.name)
                if (!match) {
                    inputRef.current.focus()
                    setNoShow(true)

                    state.transArray.push(acutalItem)
                    inputRef.current.value = ''
                    inputRef.current.focus()
                    dispatch({ type: 'errMsg', payload: `${acutalItem.name} added` })
                    setTimeout(() => {
                        setNoShow(false)
                        dispatch({ type: 'errMsg', payload: `` })
                    }, 3000)
                    state.transArray.reverse()

                } else if (match) {
                    setFirstRedChecker(match)
                    dispatch({ type: 'errMsg', payload: 'item already in list' })
                    inputRef.current.value = ''
                    setTimeout(() => {
                        dispatch({ type: 'errMsg', payload: `` })
                        setFirstRedChecker('')
                        setNoShow(false)


                    }, 3000)

                }
            } else {
                // setFirstRedChecker('tamgible')
                // dispatch({type: 'errMsg', payload: 'Please select an item'})

            }

        } catch (error) {
            console.log(error.message)
        }



    }

    const removeItem = async (id) => {

        dispatch({ type: 'remove', payload: id })

    }


    const clearer = () => {
        dispatch({ type: 'clear' })
        // console.log('CLEARED!')
        dispatch({ type: 'cancel', payload: false })
        setNoShow(true)
        dispatch({ type: 'errMsg', payload: 'list cleared' })
        setTimeout(() => {
            setNoShow(false)
            dispatch({ type: 'errMsg', payload: `` })
        }, 3000)
        state.paidAmount = 0
        state.balance = 0
    }



    const trueCash = () => {
        const emptyQty = state.transArray.filter((item) => item.qty === "")
        // if (emptyQty.length) {

        // }
        console.log(emptyQty.length)
        console.log(emptyQty.length === 0)
        console.log(state.transArray)
        if (state.transArray.length && emptyQty.length === 0) {

            setCash(true)
        }

    }

    useEffect(() => {
        if (cash) {
            cashPaidRef.current.focus()

        }
    }, [cash])

    useEffect(() => {
        dispatch({ type: 'getTotal' })

    }, [state.transArray, state.success])


    const closeCashWindow = () => {
        setCash(false)
    }

    const doneSales = async () => {

        try {

            const { transArray, total } = state

            if (state.transArray.length) {
                const transItems = {
                    cashier: auth.user,
                    cashierID: auth.picker,
                    goods: transArray,
                    grandTotal: total,
                    status: 'shipped',
                    date: now

                }
                console.log(transItems.goods)
                const response = await axios.post('/transactions', transItems)
                const response2 = await axiosPrivate.get('/items')
                console.log(response.data)

                if (response) {
                    setCash(false)
                    dispatch({ type: 'cancel', payload: false })
                    // so i can effect change in color of the errMsg
                    dispatch({ type: 'qty', payload: response })
                    dispatch({ type: 'clear' })
                    dispatch({ type: 'ALERTMSG', payload: response.data.message })
                    dispatch({ type: 'transArray', payload: [] })
                }

                transItems.goods.map((good) => {
                    const invs = items.map(async (inv) => {
                        console.log(inv.name)
                        console.log(good.name)
                        if (inv.name === good.name) {
                            const goodObj = {
                                name: inv.name,
                                qty: inv.qty - good.qty < 1 ? 0 : inv.qty - good.qty,
                                // date: now            
                            }
                            await axiosPrivate.put(`items/dynam`, goodObj)

                        }
                    })

                })

                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                }, 5000)
                dispatch({ type: 'qtyArray', payload: [] })
                setTimeout(() => {
                    dispatch({ type: 'errMsg', payload: '' })

                }, 1000)
            }

            else {

                // console.log(state.transArray)
                throw Error('no item purchased')
                // dispatch({type: 'qtyArray', payload: []})
            }
            // state.paidAmount = 0
            state.balance = 0
        } catch (error) {
            dispatch({ type: 'errMsg', payload: error.message })
        }
        finally {
            //    dispatch({type: 'transArray', payload: []})
        }

    }


    const cardCheckout = async () => {
        // console.log('on the card')
        try {
            if (state.transArray.length) {
                const transItems = {
                    cashier: auth.user,
                    cashierID: auth.picker,
                    goods: state.transArray,
                    status: 'shipped',
                    grandTotal: state.total,
                    date: now

                }
                const response = await axios.post('/transactions/create-checkout-session', transItems)
                if (response) {
                    window.location = response.data.session.url
                    console.log(response.data)
                } else console.log("no checkout")

            }
        } catch (error) {
            console.error(error.message)
        }
    }



    const assertain = () => {
        if (state.transArray.length) {
            dispatch({ type: 'cancel', payload: true })
        }
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const remain = () => {
        dispatch({ type: 'cancel', payload: false })
    }


    const [alert, setAlert] = useState('')
    const { setAuth } = useAuth()
    //  const refresh = useRefreshToken()


    const getRecipt = async () => {
        const transes = await axios.get(`/transactions`)
        console.log(transes.data)
        const reverseTranses = transes.data.reverse()
        console.log(reverseTranses[0])
        localStorage.setItem('memTransaction', reverseTranses[0]._id)
        dispatch({ type: 'transArray', payload: [] })
        // const queryParams = new URLSearchParams(window.location.search)
        // let sessionId = queryParams.get("session_id")
        let sessionId = window.location.href.split('=')[1]
        // const cusomer = queryParams.get("customer")
        console.log({ sessionId })

        const date = new Date()
        // const date = format(now, 'dd/MM/yyyy HH:mm:ss')
        const dateOjb = { date }
        // console.log({date})
        try {
            if (sessionId) {

                const res = await axios.get(`/sessions/thanks/old-session/${sessionId}`)
                const oldSession = res.data ? res.data : ''

                if (oldSession === sessionId) {
                    return
                } else if (!oldSession || oldSession !== sessionId) {
                    const response = await axios.post(`/transactions/sessions/${sessionId}`, dateOjb)

                    if (response) {
                        setSuccess(true)
                        dispatch({ type: 'ALERTMSG', payload: response.data.message })
                        setTimeout(() => {
                            setSuccess(false)
                        }, 5000)
                        setAuth(prev => {

                            return {
                                ...prev, users: response.data.users
                            }

                        })
                    }


                }
            }
        } catch (error) {
            // console.error(error)
        }
    }

    const trueSuccess = () => {
        setSuccess(true)
    }

    const falseSuccess = () => {
        setSuccess(false)
    }

    const trueHome = () => {

        setAtHome(true)
    }
    useEffect(() => {
        trueHome()
    }, [])
    useEffect(() => {

        // if (sessionId){
        getRecipt()

        // }
    }, [success])

    useEffect(() => {
        console.log(inputRef.current.value)
    }, [])



    return (
        <div className="trans-cont"
            onClick={falseIsRotated}

        >

            <h2
                id="tans-title"

            >Transactions</h2>
            {/* <SideBar/> */}
            <section>
                <fieldset
                    id="field"
                >
                    {/* <div
                id="field-grid-container"
                > */}


                    <form
                        className="tran-form"
                    >

                        <article className="trans-add">
                            <input type="text"
                                id="trans-search"
                                placeholder="select item"
                                ref={inputRef}
                                onChange={handleAdd}
                                list="edulevel"
                            /></article>

                        <datalist id="edulevel"

                        >
                            {items && items.map((user) => {

                                return (
                                    <option key={user._id}
                                        value={`${user.name}`}
                                        className="transaction-items-list"

                                    >
                                    </option>)
                            })}
                        </datalist>



                    </form>

                    <fieldset className="field2">
                        <legend>Checkout</legend>
                        <button onClick={trueCash}>Cash</button>
                        <button onClick={cardCheckout}>Card</button>
                    </fieldset>

                </fieldset>
                {state.transArray.length ? <h3 className="item-counter">{state.transArray.length} item{state.transArray.length === 1 ? '' : 's'}</h3> : ''}
            </section>

            <h3
                className={noShow ? 'delete' : firstRedChecker ? 'trans-list-alert' : 'hide-err-msg'}

            >
                {state.errMsg}</h3>

            <div
                id="trans-item-cont"
            >

                {!state.transArray.length ? <p>empty list</p> : state.transArray.map((item, index) => {
                    //  console.log(item.unitMeasure)
                    return (

                        <section
                            key={index}
                            id="trans-item"

                        >


                            <section className="trans-name-and-img">

                                <img className="trans-img" src={`${picUrl}/images/${item.name}/${item.img[0].name}`} alt={item.name.substring(0, 10)} />
                                <h5
                                    className="trans-item-name"
                                >

                                    {item.name}

                                </h5>
                            </section>

                            <article

                                id="flex-article"
                            >
                                
                                {/* <section> */}
                                <input
                                    type="text"
                                    ref={qtyRef}
                                    onFocus={e => e.target.select()}
                                    className="in-person-qty"
                                    value={item.qty}

                                    // onClick={() => dispatch({ type: 'blank', payload: '', id: item._id })}
                                    onChange={(e) => dispatch({ type: 'FIELDCHANGE', payload: e.target.value, id: item._id })}
                                />
                                <span
                                > {item.unitMeasure.split(' ')[1].slice(1, -1)}</span>

                                {/* </section>  */}

                            </article>

                            <article>
                                <h4
                                    style={{ display: `${state.getAllTotals ? 'none' : 'block'}` }}
                                // >N{parseFloat(item.total).toFixed(2)}</h3>
                                >{currency}{numberWithCommas(parseFloat(item.total).toFixed(2))}</h4>

                            </article>

                            {/* <article
                    
                    > */}
                            {/* <p>price/{item.unitMeasure.split(' ')[1].slice(1, -1)}:</p>
                    <p>${item.price}</p> */}

                            {/* </article> */}

                            <h2
                                onClick={() => removeItem(item._id)}
                            >
                                <FaTrashAlt role='button'
                                    tableIndex='0' />
                            </h2>
                        </section>
                    )
                })}
            </div>



            <section

                className={cash ? 'cash-payment' : 'non-payment'}
            // style={{
            //     display: 'flex',
            //     columnGap: '1rem',

            // }}
            >
                <h2
                    id="grand-total-one"

                >Total: {currency}{numberWithCommas(parseFloat(state.total).toFixed(2))}</h2>
                <form

                >
                    <h4>Cash Paid:</h4>
                    <input
                        ref={cashPaidRef}
                        className="cash-amount2"
                        value={state.paidAmount}
                        onChange={(e) => dispatch({ type: 'difference', payload: e.target.value })}
                    />
                </form>
                <section
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <h4
                    >Balance: {currency}{state.paidAmount > state.total ? parseFloat(state.balance).toFixed(2) : 0}</h4>
                </section>
                <article className="cash-confirm">
                    <button onClick={closeCashWindow}>Cancel</button>
                    <button onClick={doneSales}>Done</button>
                </article>
            </section>

            <section
                id="trans-verify-section"

            >
                <div
                    className={state.cancel ? 'display-veryfier' : 'hide-veryfier'}

                >
                    <h3
                        id="verify-header"
                        style={{
                            margin: '.5rem'
                        }}
                    >Are you sure you want to cancel
                        the transaction?</h3>
                    <article
                        className="inside-veryfier"

                    ><button
                        onClick={remain}
                    >No</button><button
                        onClick={clearer}
                        style={{
                            backgroundColor: 'red',
                            borderColor: 'red'
                        }}
                    >Yes</button></article></div>  <div
                        className="cancel-complete"

                    >
                    <button onClick={assertain}

                    // onClick={assertain}
                    >Cancel</button>

                </div>

            </section>

            <article className={success ? 'success' : 'non-success'}>
                <h3>{state.alertMsg}</h3>
                {state.alertMsg ? <div>

                    <h4>Receipt?</h4>
                    <div className="cash-confirm">
                        <button onClick={falseSuccess}>No</button>
                        <button><Link to='/one-receipt' className="cash-confirm-link">Yes</Link></button>
                    </div>
                </div> : ''}
            </article>

        </div>

    )
}

export default Transactions
