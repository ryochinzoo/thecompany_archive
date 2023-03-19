import CommonStyle from '../../styles/commonParts.module.css'

export default function SubmitButton ({ isModal, data, handleSubmit }) {

    return (
        <>
            <button type="submit" className={`${isModal? CommonStyle.submitButton : CommonStyle.submitButtonFooter}`} onClick={(e)=>{handleSubmit(e)}}>Send Message</button>
        </>
    )
}