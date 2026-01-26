// import { format } from "date-fns";
const numbers = [2, 4, 6]

const sumation =  numbers.reduce((total, number) => {
    return total + number
}, 0)

console.log(sumation)