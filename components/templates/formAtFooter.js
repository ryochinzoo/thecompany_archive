import CommonStyle from '../../styles/commonParts.module.css'
import utilStyles from "../../styles/utils.module.css"
import { useState } from 'react'
import FormTextInput from '../atoms/formTextInput'
import FormTextArea from '../atoms/formTextArea'
import SubmitButton from '../atoms/submitButton'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function FormAtFooter ({mailInfo}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)
    const [isClearAll, setIsClearAll] = useState(false)
    const [formValidation, setFormValidation] = useState({
        result: false,
        details: {
            firstName: false,
            lastName: false,
            email: false,
            phoneNumber: true,
            message: false
        },
        errors: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            message: ""
        }
    })
    const clearAll = (newValue) => {
        setIsClearAll(newValue)
    }
    const onFNChange = (newValue) => {
        setFirstName(newValue)
        setIsSubmitClicked(false)
    }
    const onLNChange = (newValue) => {
        setLastName(newValue)
        setIsSubmitClicked(false)
    }
    const onEMChange = (newValue) => {
        setEmail(newValue)
        setIsSubmitClicked(false)
    }
    const onPNChange = (newValue) => {
        setPhoneNumber(newValue)
        setIsSubmitClicked(false)
    }
    const onMSGChange = (newValue) => {
        setMessage(newValue)
        setIsSubmitClicked(false)
    }
    function validateField (firstName, lastName, email, phoneNumber, message) {
        const validation = {
            firstName: false,
            lastName: false,
            email: false,
            phoneNumber: true,
            message: false
        }
        const errorMessages = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            message: ""
        }

        if (firstName.trim().length !== 0) {
            validation.firstName = true
        } else {
            validation.firstName = false
            errorMessages.firstName = "First Name is required"
        }

        if (lastName.trim().length !== 0) {
            validation.lastName = true
        } else {
            validation.lastName = false
            errorMessages.lastName = "Last Name is required"
        }

        if (phoneNumber.trim().length !== 0) {
            const regex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
            if (phoneNumber.match(regex)) {
                validation.phoneNumber = true
            } else {
                validation.phoneNumber = false
                errorMessages.phoneNumber = "Phone Number is invalid"
            }
        }

        if (email.trim().length !== 0) {
            const regex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
            if (email.match(regex)) {
                validation.email = true
            } else {
                validation.email = false
                errorMessages.email = "Email is invalid"
            }
        } else {
            validation.email = false
            errorMessages.email = "Email is required"
        }

        if (message.trim().length !== 0) {
            validation.message = true
        } else {
            validation.message = false
            errorMessages.message = "Message is required"
        }

        const result = {result: !Object.values(validation).includes(false), details: validation, errors: errorMessages}
        return result
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Sending')
        const newMailInfo = createNewObj(mailInfo, "BookingRequest")
        let data = {
            firstName,
            lastName,
            email,
            phoneNumber,
            message,
            newMailInfo,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = 'api/contact'
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            body: JSONdata,
        }
        
        const validation = validateField(firstName, lastName, email, phoneNumber, message)
        if (validation.result) {
            setFormValidation(validation)
            await fetch(endpoint, options).then((res) => {
                console.log('Response Received')
                if(res.status === 200) {
                    console.log('Response Succeeded')
                    toast.success('Your message has been sent successfully', {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    })
                    clearAll(true)
                    setIsSubmitClicked(true)
                    setFirstName('')
                    setLastName('')
                    setEmail('')
                    setPhoneNumber('')
                    setMessage('')
                    clearAll(false)
                }
            })
        } else {
            clearAll(false)
            toast.error('Oops, please input form correctly', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            setIsSubmitClicked(true)
            setFormValidation(validation)
        }
    }
    
    return (
        <>
        <div className={`${CommonStyle.inputAreaFooter}`}>
                <form onSubmit={handleSubmit} >
                    <div className={`${CommonStyle.flexTextInput}`}>
                        <FormTextInput
                            placeholder={"First Name"}
                            isRequired={true}
                            isModal={false}
                            isSignUp={false}
                            keyName={"first_onFooter"}
                            caseName={"firstName"}
                            onChange={onFNChange}
                            validation={formValidation}
                            hasError={formValidation.details["firstName"]}
                            isSubmitClicked={isSubmitClicked}
                            isClearAll={isClearAll}
                        ></FormTextInput>
                        <FormTextInput
                            placeholder={"Last Name"}
                            isRequired={true}
                            isModal={false}
                            isSignUp={false}
                            keyName={"last_onFooter"}
                            caseName={"lastName"}
                            onChange={onLNChange}
                            validation={formValidation}
                            hasError={formValidation.details["lastName"]}
                            isSubmitClicked={isSubmitClicked}
                            isClearAll={isClearAll}
                        ></FormTextInput>
                    </div>
                    <div className={`${CommonStyle.flexTextInput}`}>
                        <FormTextInput
                            placeholder={"E-mail"}
                            isRequired={true}
                            isModal={false}
                            isSignUp={false}
                            keyName={"mail_onFooter"}
                            caseName={"email"}
                            onChange={onEMChange}
                            validation={formValidation}
                            hasError={formValidation.details["email"]}
                            isSubmitClicked={isSubmitClicked}
                            isClearAll={isClearAll}
                        ></FormTextInput>
                        <FormTextInput
                            placeholder={"Phone Number"}
                            isRequired={false}
                            isModal={false}
                            isSignUp={false}
                            keyName={"phone_onFooter"}
                            caseName={"phoneNumber"}
                            onChange={onPNChange}
                            validation={formValidation}
                            hasError={formValidation.details["phoneNumber"]}
                            isSubmitClicked={isSubmitClicked}
                            isClearAll={isClearAll}
                        ></FormTextInput>
                    </div>
                    <div className={`${CommonStyle.textAreaWrapper}`}>
                        <FormTextArea
                            placeholder={"A few sentences about your project..."}
                            isRequired={true}
                            isModal={false}
                            isSignUp={false}
                            keyName={"message_onFooter"}
                            caseName={"message"}
                            onChange={onMSGChange}
                            validation={formValidation}
                            hasError={formValidation.details["message"]}
                            isSubmitClicked={isSubmitClicked}
                            isClearAll={isClearAll}
                        ></FormTextArea>
                    </div>
                    <div style={{textAlign:"left"}}>
                        <SubmitButton
                            isModal={false}
                            handleSubmit={handleSubmit}
                        ></SubmitButton>
                        <ToastContainer />
                    </div>
                </form>
            </div>
        </>
    )
}

export function createNewObj(array, key) {
    let newObj
    array.map((v) => {
        if(v.usage === key) {
            newObj = v
        }
    })
    return newObj
}