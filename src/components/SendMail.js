import { useState, useRef, useEffect } from 'react'
import emailjs from '@emailjs/browser'
const SendMail = ({ currentTransaction }) => {
    const [cost, setCost] = useState()
    const form = useRef({})
    const mailSender = () => {

        // console.log(response.data.transaction)
        if (currentTransaction) {
            console.log(currentTransaction)
            const { email, grandTotal, goods, _id } = currentTransaction

            let params = {
                name: goods.map((item => item.name)),
                email,
                order_id: _id,
                price: goods.map(item => item.total),
                total: grandTotal
            }

            setCost(params)

        }
        // const trans = response.data.transaction
    }
    useEffect(() => {
        mailSender()
    }, [])

    return (
        <div>
            {<form ref={form}>
                <label>Name</label>
                <input type="text" name="name"
                // value={cost.name}
                />
                <label>Email</label>
                <input type="email" name="email"
                // value={cost.email}
                />
                <label>Order Id</label>
                <input type="order_id" name="order_id"
                // value={cost.order_id}
                />
                <label>Price</label>
                <input type="price" name="price"
                // value={cost.price}
                />
                <label>Cost Total</label>
                <input type="order_total" name="order_total"
                // value={cost.grandTotal}
                />
            </form>}
        </div>
    )
}

export default SendMail
