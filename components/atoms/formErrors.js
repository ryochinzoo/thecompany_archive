import CommonStyle from '../../styles/formErrors.module.css'
import { useMemo } from "react"

export default function FormErrors({isModal, errorMessage, hasError, isSubmitClicked}) {
    const display = useMemo(() => { 
        if(isSubmitClicked && hasError) {
            return "none"
        } else {
            return "inline-block"
        }}, [isSubmitClicked, hasError])
    return (
        <>
            <span className={isModal ? CommonStyle.errorInModalForm : CommonStyle.errorOnFooterForm} style={{display: display }}>{errorMessage}</span>
        </>
    )
}