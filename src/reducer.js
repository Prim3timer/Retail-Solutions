import { ca } from "date-fns/locale"
import { act } from "react"

const reducer = (state, action) => {

  switch (action.type) {
    case 'items':
      return { ...state, items: action.payload }

    case 'sales':
      return { ...state, sales: action.payload }

    case 'search':
      return { ...state, search: action.payload }

    case 'inventory':
      return { ...state, inventory: action.payload }
    case 'name':
      return { ...state, name: action.payload }
    case 'price':
      return { ...state, price: action.payload }
    case 'unitMeasure':
      return { ...state, unitMeasure: action.payload }
    case 'piecesUnit':
      return { ...state, piecesUnit: action.payload }
    case 'isMatched':
      return { ...state, isMatched: action.payload }
    case 'user':
      return { ...state, user: action.payload }
    case 'validName':
      return { ...state, validName: action.payload }
    case 'validEmail':
      return { ...state, validEmail: action.payload }
    case 'userFocus':
      return { ...state, userFocus: action.payload }
    case 'pwd':
      return { ...state, pwd: action.payload }
    case 'validPwd':
      return { ...state, validPwd: action.payload }
    case 'pwdFocus':
      return { ...state, pwdFocus: action.payload }
    case 'matchPwd':
      return { ...state, matchPwd: action.payload }
    case 'validMatch':
      return { ...state, validMatch: action.payload }
    case 'matchFocus':
      return { ...state, matchFocus: action.payload }
    case 'errMsg':
      return { ...state, errMsg: action.payload }
    case 'ALERTMSG':
      return { ...state, alertMsg: action.payload }
    case 'success':
      return { ...state, success: action.payload }
    case 'qty':
      return { ...state, qty: action.payload }

    case 'getNames':
      return { ...state, getNames: action.payload }
    case 'IMAGE':
      return { ...state, image: action.payload }

    case 'marker':
      return { ...state, marker: action.payload }
    case 'isEdit':
      return { ...state, isEdit: action.payload }
    case 'ISDELETED':
      return { ...state, isDeleted: action.payload }
    case 'inItem':
      return { ...state, inItem: action.payload }
    case 'outItem':
      return { ...state, outItem: action.payload }
    case 'afa':
      return { ...state, afa: action.payload }
    case 'ole':

      return { ...state, ole: action.payload }
    case 'transArray':
      return { ...state, transArray: action.payload }
    case 'cartItem':
      return { ...state, cart: action.payload }
    case 'total':
      return { ...state, total: action.payload }
    case 'inventEdit':
      return { ...state, outItem: action.payload }
    case 'amount':
      return { ...state, amount: action.payload }
    case 'qtyArray':
      return { ...state, qtyArray: action.payload }
    case 'clear':
      return { ...state, transArray: [] }
    case 'CLEARCART':
      return { ...state, cartArray: [] }



    case 'INCREMENT':
      const item = { ...state.elItem, transQty: state.elItem.transQty + 1 }

      return { ...state, elItem: item }





    case 'SHOPDECREMENT':
      // const {elItem} = state  
      const item2 = { ...state.elItem, transQty: state.elItem.transQty < 2 ? 1 : state.elItem.transQty - 1, total: (state.elItem.transQty * state.elItem.price) }

      return { ...state, elItem: item2 }


    case 'SINGLETOTAL':
      const newTotal = state.elItem.transQty * state.elItem.price
      const newItem = { ...state.elItem, total: newTotal }
      return { ...state, elItem: newItem }

    case 'DECREMENT':
      const tempCart2 = state.transArray.map((item) => {
        if (item._id === action.payload) {
          return { ...item, qty: item.qty - 1, total: item.total - item.price }
        }
        return item
      }).filter((item) => item.qty !== 0)
      return { ...state, transArray: tempCart2 }


    case 'CARTINCREMENT':
      const tempCart6 = state.cartArray.map((item) => {
        if (item.id === action.payload) {
          return { ...item, transQty: item.transQty + 1, total: item.total + item.price }
        }
        return item
      })
      return { ...state, cartArray: tempCart6 }


    case 'CARTDECREMENT':
      const tempCart7 = state.cartArray.map((item) => {
        if (item.id === action.payload) {
          console.log(item)
          return { ...item, transQty: item.transQty - 1, total: item.total - item.price }
        }
        return item
      }).filter((item) => item.transQty !== 0)
      return { ...state, cartArray: tempCart7 }



    case 'FIELDCHANGE':
      const tempCart3 = state.transArray.map((item) => {
        //  state.qty = action.payload
        if (item._id === action.id) {
          return { ...item, qty: action.payload, total: (item.price * action.payload) }

        }
        return item
      })
      return { ...state, transArray: tempCart3 }

    case 'CARTFIELDCHANGE':
      const item3 = { ...state.elItem, transQty: Number(action.payload), total: (state.elItem.price * action.payload) }
      return { ...state, elItem: item3 }



    case "MAINCARTFIELD":
      const tempCart5 = state.cartArray.map((item) => {
        if (item.id === action.id) {

          return { ...item, transQty: action.payload, total: item.price * action.payload }
        }
        return item
      })
      return { ...state, cartArray: tempCart5 }


    case 'REMOVECARTITEM':
      const currentCart = state.cartArray.filter((item) => item.id !== action.payload)
      return { ...state, cartArray: currentCart }



    // case 'blank':
    //   const tempCart4 = state.transArray.map((item) => {
    //     if (item._id === action.id) {
    //       return { ...item, qty: action.payload, total: 0 }

    //     }
    //     return item
    //   })
    //   return { ...state, transArray: tempCart4 }
    case 'remove':
      const newArray = state.transArray.filter((item) => item._id !== action.payload)
      return { ...state, transArray: newArray }

    case 'getTotal':
      const { amount, total } = state.transArray.reduce((cartTotal, cartItem) => {
        cartTotal.total += cartItem.price * cartItem.qty
        cartTotal.amount += Number(cartItem.qty)
        return cartTotal
      },
        {
          amount: 0,
          total: 0
        })
      return { ...state, amount, total }

    case 'GETCARTTOTAL':
      const { cartAmount, totalCart } = state.cartArray.reduce((cartTotal, cartItem) => {
        cartTotal.cartAmount += Number(cartItem.transQty)
        const itemTotal = cartItem.price * cartItem.transQty
        cartTotal.totalCart += itemTotal
        return cartTotal
      },
        {
          cartAmount: 0,
          totalCart: 0
        })
      return { ...state, cartAmount, totalCart }


    case 'cartItem':
      return { ...state, cartItem: action.payload }

    case 'elItem':
      return { ...state, elItem: action.payload }

    case 'cancel':
      return { ...state, cancel: action.payload }

    case 'backendUser':
      return { ...state, backendUser: action.payload }

    case 'paidAmount':
      return { ...state, paidAmount: action.payload }
    case 'balance':
      return { ...state, balance: action.payload }

    case 'selectUser':
      return { ...state, selectUser: action.payload }
    case 'difference':
      state.paidAmount = action.payload
      const newBalance = state.paidAmount - state.total
      return { ...state, balance: newBalance }
    case 'id':
      return { ...state, id: action.payload }
    case 'RECEIPT':
      return { ...state, receipt: action.payload }
    case "CARTARRAY":
      return { ...state, cartArray: action.payload }
    case 'email':
      return { ...state, email: action.payload }

    case 'SINGLEITEMARRAY':
      return { ...state, singleItemArray: action.payload }

      case 'CATEGORY':
        return {...state, category: action.payload}

    default:
      throw new Error()
  }
}
export default reducer    