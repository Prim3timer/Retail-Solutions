import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";
import { useState, useEffect } from "react";


const useWindowSize = () => {

    const [windowSize, setWindowSize] = useState({
        height: undefined,
        width: undefined
    })
    
    useEffect(()=> {
        const handleSize = () => {
            setWindowSize({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }
    
        handleSize()
    
        window.addEventListener('resize', handleSize)
    
        const cleanUp = () => {
            window.removeEventListener('resize', handleSize)
        }
        return cleanUp;
    }, [])

    return windowSize

}    

export default useWindowSize
