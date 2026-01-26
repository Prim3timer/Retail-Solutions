import { useEffect, usEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'


const usePreviousLocation = () => {
    const location = useLocation()
    const prevLocRef = useRef()

    useEffect(()=> {
        prevLocRef.current = location
    }, [location])

    return prevLocRef.current
}


export default usePreviousLocation