
import useAuth from "../hooks/useAuth"
import { Link } from "react-router-dom"
import axios from "../app/api/axios"
import { useEffect, useState, useContext, useRef } from "react"
import AuthContext from "../context/authProvider";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { tr } from "date-fns/locale";
import emailjs from '@emailjs/browser'
import SendMail from "./SendMail";

const Thanks = () => {
    const [currentTtransaction, setCurrentTransaction] = useState()
    const { currentUsers } = useContext(AuthContext)
    const [transId, setTransId] = useState()

    // const [name, setName] = useState()
    // const [email, setEmail] = useState()
    // const [orderId, setOrderId] = useState()



    const sendMail = async () => {
        try {
            const getTransactions = await axios.get('/transactions')
            const memTrans = localStorage.getItem('memTransaction')
            // const currentTtransaction = getTransactions.data.find(transaction => transaction._id === transId)
            // console.log(currentTtransaction)
            // let params = {
            //     email: 
            // }

        } catch (error) {
            console.error(error.message)
        }
    }
    // useEffect(() => {
    //     sendMail()
    // }, [])

    const getRecipt = async () => {
        // e.preventDefault()
        const queryParams = new URLSearchParams(window.location.search)
        let sessionId = queryParams.get("session_id")
        const cusomer = queryParams.get("customer")
        console.log({ currentUsers })
        console.log({ sessionId })

        const now = new Date()
        const date = format(now, 'yyyy-MM-dd HH:mm:ss')
        const dateOjb = { date }
        console.log({ date })
        try {

            const res = await axios.get(`/sessions/thanks/old-session/${sessionId}`)
            console.log(res)

            const oldSession = res.data ? res.data : ''

            console.log({ oldSession })
            console.log(oldSession === sessionId)

            console.log({ sessionId })

            if (oldSession === sessionId) {
                return

            } else if (!oldSession || oldSession !== sessionId) {
                const response = await axios.post(`/sessions/thanks/${sessionId}`, dateOjb)
                console.log(response.data.transaction)
                if (response?.data) {
                    setCurrentTransaction(response.data.transaction)
                    setTransId(response.data.transaction._id)

                }



            }


        } catch (error) {
            console.error(error)
        }
    }


    // const sendEmail = async () => {
    //     await emailjs.sendForm('service_3birv1u', 'template_hnz033q', form.current, 'template_hnz033q')
    //     alert('message sent successfully')
    // }

    // useEffect(() => {
    //     if (cost) sendEmail()
    // }, [])
    useEffect(() => {
        console.log(currentTtransaction && currentTtransaction)
        console.log(transId && transId)
        // if (sessionId){
        getRecipt()

        // }
    }, [])


    return (
        <div className="thanks">
            {/* <h3>{alert}</h3> */}
            <h2>Thank you for your order</h2>
            {currentTtransaction && <SendMail currentTtransaction={currentTtransaction} />}
            <article>
                <Link to={'/shop'}><button>Shopping</button></Link>
                {/* <Link to={'/home'}><button>Home</button></Link> */}
                <Link to={'/one-receipt'} onClick={localStorage.setItem('memTransaction', transId && transId)}><button>Get Receipt</button></Link>
            </article>
        </div>
    )
}

export default Thanks
