import CommonStyle from '../../styles/textInput.module.css'
import FormErrors from './formErrors'
import { useRef } from 'react'

export default function FormTextInput ({ placeholder, isRequired, isModal, caseName, keyName, isSignUp, onChange, validation, hasError, isSubmitClicked, isClearAll, isMain }) {
    const placeHolderMarked = placeholder
    const inputRef = useRef()
    if (isClearAll) {
        inputRef.current.value = ""
    }
    return (
        <>
            {isSignUp ?
            <div style={{width: "100%", textAlign: "left"}} >
                <input ref={inputRef} type={"text"} id={keyName} name={keyName} placeholder={isRequired ? placeHolderMarked + " *" :placeHolderMarked} onChange={(e) => {onChange(e.target.value)}} className={`${isModal ? CommonStyle.signUp : isMain ? CommonStyle.signUpFooter : CommonStyle.signUpFooterOther}`} />
                <FormErrors isModal={isModal} hasError={hasError} errorMessage={validation.errors[caseName]} isSubmitClicked={isSubmitClicked} />
            </div>
            :
            <div style={{width: "100%", textAlign: "left"}} >
                <input ref={inputRef} type={"text"} id={keyName} name={keyName} placeholder={isRequired ? placeHolderMarked + " *" :placeHolderMarked} onChange={(e) => {onChange(e.target.value)}} required={isRequired}  className={`${(isModal) ? CommonStyle.inputTextModal : CommonStyle.inputText}`} />
                <FormErrors isModal={isModal} hasError={hasError} errorMessage={validation.errors[caseName]} isSubmitClicked={isSubmitClicked} />
            </div>
            }
        </>
    )
}