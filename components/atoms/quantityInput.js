import CommonStyle from '../../styles/commonParts.module.css'
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
    return (
    <>
     <input 
            ref={quantityRef}
            type="number"
            step="1"
            min="1"
            className={CommonStyle.shopItemQuantityBox}
            id={productId} 
            name={productId}
            defaultValue={1}
            onChange={onChange}
        />
    </>
    )
}