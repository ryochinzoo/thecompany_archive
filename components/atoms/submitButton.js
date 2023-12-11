import CommonStyle from '../../styles/submitButton.module.css'

export default function SubmitButton ({ isModal, data, handleSubmit }) {

    return (
        <>
            <button type="submit" className={`${isModal? CommonStyle.submitButton : CommonStyle.submitButtonFooter}`} onClick={(e)=>{handleSubmit(e)}}>Send message</button>
        </>
    )
}