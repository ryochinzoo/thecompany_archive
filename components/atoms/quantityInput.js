import CommonStyle from '../../styles/quantityInput.module.css'
import { useEffect, useRef } from 'react'

export default function QuantityInput({shopEvents, productId, quantityInBag, isReset, onQuantityChange}) {
    const quantityRef = useRef()
    useEffect(() => {
        if(isReset) {
            if (quantityInBag) {
                quantityRef.current.value = quantityInBag
                onQuantityChange(quantityRef.current.value)
            } else {
                quantityRef.current.value = 1
                onQuantityChange(quantityRef.current.value)
            }
        }
    }, [isReset, quantityInBag, quantityRef, onQuantityChange])
    const onChange = () => {
        onQuantityChange(quantityRef.current.value)
    }
    const handleKeyPress = (event) => {
        if(event.which  === 13) {
            const el = document.activeElement
            if (el && el.tagName !== "TEXTAREA") {
                el.blur()
            }
        }
    }
    
    
    return (
    <>
     <input 
            ref={quantityRef}
            type="number"
            step="1"
            min="0"
            className={CommonStyle.shopItemQuantityBox}
            id={productId} 
            name={productId}
            defaultValue={1}
            onChange={onChange}
            onKeyDown={(e) => {handleKeyPress(e)}}
        />
    </>
    )
}