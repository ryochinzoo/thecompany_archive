import CommonStyle from '../../styles/commonParts.module.css'
import utilStyles from "../../styles/utils.module.css"
import Modal from 'react-modal'
import { useState } from 'react'
import FormTextInput from '../atoms/formTextInput'
import FormTextArea from '../atoms/formTextArea'
import SubmitButton from '../atoms/submitButton'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function FormAtTop ({isFlipped, mailInfo, handleScrollLock}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [emailSignUp, setEmailSignUp] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)
    const [isClearAll, setIsClearAll] = useState(false)
    const [formModalShowState, setFormModalShowState] = useState (false)
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
    const onEMSUChange = (newValue) => {
        setEmailSignUp(newValue)
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
            emailSignUp: "",
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

    function validateFieldSignUp (emailSignUp) {
        const validation = {
            emailSignUp: false,
        }
        const errorMessages = {
            emailSignUp: "",
        }
        if (emailSignUp.trim().length !== 0) {
            const regex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
            if (emailSignUp.match(regex)) {
                validation.emailSignUp = true
            } else {
                validation.emailSignUp = false
                errorMessages.emailSignUp = "Email is invalid"
            }
        } else {
            validation.emailSignUp = false
            errorMessages.emailSignUp = "Email is required"
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
            newMailInfo
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
                        className: `${CommonStyle.toastifyCustom}`
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
                theme: "light",
                className: `${CommonStyle.toastifyCustom}`
            })
            setIsSubmitClicked(true)
            setFormValidation(validation)
        }
    }
    const handleSubmitSignup = async (e) => {
        e.preventDefault()
        console.log('Sending')
        const newMailInfo = createNewObj(mailInfo, "MailingList")
        let data = {
            emailSignUp,
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
        const validation = validateFieldSignUp(emailSignUp)
        if (validation.result) {
            setFormValidation(validation)
            await fetch(endpoint, options).then((res) => {
                console.log('Response Received')
                if(res.status === 200) {
                    console.log('Response Succeeded')
                    toast.success('Your E-Mail address has been sent successfully', {
                        position: "bottom-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        className: `${CommonStyle.toastifyCustom}`
                    })
                    clearAll(true)
                    setIsSubmitClicked(true)
                    setEmailSignUp('')
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
                theme: "light",
                className: `${CommonStyle.toastifyCustom}`
            })
            setIsSubmitClicked(true)
            setFormValidation(validation)
        }
    }
    return(
        <>  
            <div className={CommonStyle.flipCard}
                onClick={() => {
                    setFormModalShowState(true)
                    handleScrollLock(true)
                }}>
                <div className={`${CommonStyle.flipInner} ${isFlipped ? CommonStyle.flippingAnimation : ""} ${CommonStyle.pcOnly}`}>
                    <div className={`${CommonStyle.flipFront}`}>
                        <span className={`${CommonStyle.flipText}`}>Get in Touch</span>
                    </div>
                    <div className={`${CommonStyle.flipBack}`}>
                    <span className={`${CommonStyle.flipText}`}>Booking request</span>
                    </div>
                </div>
            </div>
            
            <div className={utilStyles.flipCardTablet}
                onClick={() => {
                    setFormModalShowState(true)
                }}>
                    <div className={`${utilStyles.formButtonInner} ${utilStyles.formButtonInnerTablet}`}>
                        <div>
                            Get in Touch
                        </div>
                    </div>
                </div>
            <Modal
                style={{overlay:{zIndex:10000, backgroundColor: "#FA5253"}, contents:{}}} 
                className={`${CommonStyle.formTopStyle}`}
                isOpen={formModalShowState}
                ariaHideApp={false}
            >
                <div style={{backgroundColor: '#fff'}} className={utilStyles.headerLogoInModal}></div>
                <div className={CommonStyle.modalCloseButton} onClick={() => {
                    setFormModalShowState(false)
                    handleScrollLock(false)
                }}></div>
                <div className={`${CommonStyle.modalFormHeadline}`}>
                    {isFlipped?
                    "Booking"
                    :
                    "Hello.."
                    }
                </div>
                <div className={`${CommonStyle.modalWrapper}`}>
                    <div className={`${CommonStyle.inputArea}`}>
                        <form onSubmit={handleSubmit} >
                            <FormTextInput
                                placeholder={"First Name"}
                                isRequired={true}
                                isModal={true}
                                isSignUp={false}
                                keyName={"first"}
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
                                isModal={true}
                                isSignUp={false}
                                keyName={"last"}
                                caseName={"lastName"}
                                onChange={onLNChange}
                                validation={formValidation}
                                hasError={formValidation.details["lastName"]}
                                isSubmitClicked={isSubmitClicked}
                                isClearAll={isClearAll}
                            ></FormTextInput>
                            <FormTextInput
                                placeholder={"E-mail"}
                                isRequired={true}
                                isModal={true}
                                isSignUp={false}
                                keyName={"mail"}
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
                                isModal={true}
                                isSignUp={false}
                                keyName={"phone"}
                                caseName={"phoneNumber"}
                                onChange={onPNChange}
                                validation={formValidation}
                                hasError={formValidation.details["phoneNumber"]}
                                isSubmitClicked={isSubmitClicked}
                                isClearAll={isClearAll}
                            ></FormTextInput>
                            <FormTextArea
                                placeholder={"A few sentences about your project..."}
                                isRequired={true}
                                isModal={true}
                                isSignUp={false}
                                keyName={"message"}
                                caseName={"message"}
                                onChange={onMSGChange}
                                validation={formValidation}
                                hasError={formValidation.details["message"]}
                                isSubmitClicked={isSubmitClicked}
                                isClearAll={isClearAll}
                            ></FormTextArea>
                            <SubmitButton
                                isModal={true}
                                handleSubmit={handleSubmit}
                            ></SubmitButton>
                            <ToastContainer />
                        </form>
                    </div>
                    <div className={`${CommonStyle.generalInfo}`}>
                        <div className={`${CommonStyle.infoHeadline}`}>Contact Us</div> 
                        <div className={`${CommonStyle.infoDetail}`}>
                            contact@thecompanyberlin.com <br />
                            IG: @thecompanyberlin
                        </div>
                        
                        <div className={`${CommonStyle.infoHeadline}`}>Follow Us</div> 
                        <div className={`${CommonStyle.infoDetail}`}>
                            Instagram <br />
                            Facebook <br />
                            TikTok
                        </div>
                        <div className={`${CommonStyle.infoHeadline}`}>Sign up for updates:</div>
                            <form onSubmit={handleSubmitSignup} >
                                <div className={`${CommonStyle.signupWrapper}`}>
                                    <FormTextInput
                                        placeholder = {"Email Address"}
                                        isRequired = {false}
                                        isModal = {true}
                                        isSignUp = {true}
                                        keyName = {"mailSignUp"}
                                        caseName = {"emailSignUp"}
                                        onChange = {onEMSUChange}
                                        validation={formValidation}
                                        hasError={formValidation.details["emailSignUp"]}
                                        isSubmitClicked={isSubmitClicked}
                                        isClearAll={isClearAll}
                                    ></FormTextInput>
                                    <button className={`${CommonStyle.signUpSubmit}`} onClick={()=>{handleSubmitSignup}}>→</button>
                                    <ToastContainer />
                                </div>
                            </form>
                    </div>
                </div>
            </Modal>
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