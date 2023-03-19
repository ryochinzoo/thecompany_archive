import CommonStyle from '../../styles/commonParts.module.css'
import FormErrors from './formErrors'
import { useRef } from 'react'

export default function FormTextArea ({ placeholder, isRequired, isModal, caseName, onChange, validation, hasError, isSubmitClicked, isClearAll }){
    const placeHolderMarked = placeholder
    const inputRef = useRef()
    if (isClearAll) {
        inputRef.current.value = ""
    }
    return (
        <>
            <div style={{width: "100%"}} >
                <div style={{display: "inline-block", width: "100%"}}>
                <textarea ref={inputRef} rows={8} placeholder={isRequired ? placeHolderMarked + " *" : placeHolderMarked}  className={`${isModal? CommonStyle.inputTextAreaModal : CommonStyle.inputTextArea} `} onChange={(e) => {onChange(e.target.value)}}></textarea>
                </div>
                <FormErrors isModal={isModal} hasError={hasError} errorMessage={validation.errors[caseName]} isSubmitClicked={isSubmitClicked} />
            </div>
        </>
    )
}