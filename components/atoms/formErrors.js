import CommonStyle from '../../styles/commonParts.module.css'

export default function FormErrors({isModal, errorMessage, hasError, isSubmitClicked}) {
    return (
        <>
            <span className={isModal ? CommonStyle.errorInModalForm : CommonStyle.errorOnFooterForm} style={{display: isSubmitClicked && hasError ? "none": "inline-block"}}>{errorMessage}</span>
        </>
    )
}