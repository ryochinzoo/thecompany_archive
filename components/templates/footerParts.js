import { useState, useEffect } from 'react'
import FormTextInput from "../atoms/formTextInput"
import { useMediaQuery } from 'react-responsive'
import CommonStyle from '../../styles/commonParts.module.css'
import Image from "next/image"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function FooterParts ({mailInfo}) {
    const [emailSignUp, setEmailSignUp] = useState('')
    const [isSubmitClicked, setIsSubmitClicked] = useState(false)
    const [isClearAll, setIsClearAll] = useState(false)
    const [formValidation, setFormValidation] = useState({
        result: false,
        details: {
            emailSignUp: false,
        },
        errors: {
            emailSignUp: "",
        }
    })
    const clearAll = (newValue) => {
        setIsClearAll(newValue)
    }
    const onEMSUChange = (newValue) => {
        setEmailSignUp(newValue)
        setIsSubmitClicked(false)
    }
    function validateFieldSignUp (email) {
        const validation = {
            emailSignUp: false,
        }
        const errorMessages = {
            emailSignUp: "",
        }
        if (email.trim().length !== 0) {
            const regex = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i
            if (email.match(regex)) {
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
            await fetch(endpoint, options).then((res) => {
                setFormValidation(validation)
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
                theme: "colored",
            })
            setIsSubmitClicked(true)
            setFormValidation(validation)
        }
    }
    const isDesktopLarge = useMediaQuery({
        query: '(min-width: 1200px)'
    })
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px) and (max-width: 1199px)'
    })
    const isTablet = useMediaQuery({
        query: '(min-width: 768px) and (max-width: 1023px)'
    })
    const isMobile = useMediaQuery({
        query: '(min-width: 501px) and (max-width: 767px)'
    })
    const isMobileSmall = useMediaQuery({
        query: '(max-width: 500px)'
    })
    const [footerAnnotation, setFooterAnnotation] = useState()
    useEffect(() => {
        let text =""
        {isDesktopLarge || isDesktop ?
            text=<div>
                © 2021 2021, THECOMPANYBERLIN Powered by Shopify
            </div>
            :
            text=<div>
                © 2021 2021, THECOMPANYBERLIN<br />Powered by Shopify
            </div>
        }
        setFooterAnnotation(text)
    }, [isDesktop, isDesktopLarge])
    return(
        <>  
        <div className={`${CommonStyle.footerWrapper}`}>
            <div className={`${CommonStyle.generalInfoContentsWrapper}`}>
            <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerLegal}`}>
                    <div className={`${CommonStyle.infoHeadline}`}>Legal</div> 
                    <div className={`${CommonStyle.infoDetail} ${CommonStyle.footerLegalDetail}`}>
                        <div>Legal notice</div>
                        <div>Terms of sale</div>
                        <div>Privacy policy</div>
                    </div>
                </div>
                <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerFollow}`}>
                    <div className={`${CommonStyle.infoHeadline}`}>Follow Us</div> 
                    <div className={`${CommonStyle.infoDetail}`}>
                        <div>Instagram</div>
                        <div>Facebook</div>
                        <div>TikTok</div>
                    </div>
                </div>
                <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerContact}`}>
                    <div className={`${CommonStyle.infoHeadline}`}>Contact Us</div> 
                    <div className={`${CommonStyle.infoDetail}`}>
                        <div>contact@thecompanyberlin.com</div>
                        <div>IG: @thecompanyberlin</div>
                    </div>
                </div>
                <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerSignUp}`}>
                    <div className={`${CommonStyle.infoHeadline}`}>Sign up for updates:</div>
                    <form onSubmit={handleSubmitSignup} >
                        <div className={`${CommonStyle.signupWrapper}`}>
                            <FormTextInput
                                placeholder = {"Email Address"}
                                isRequired = {false}
                                isModal = {false}
                                isSignUp = {true}
                                keyName = {"mail"}
                                caseName = {"emailSignUp"}
                                onChange = {onEMSUChange}
                                validation = {formValidation}
                                hasError={formValidation.details["emailSignUp"]}
                                isSubmitClicked={isSubmitClicked}
                                isClearAll={isClearAll}
                            ></FormTextInput>
                            <button className={`${CommonStyle.signUpFooterSubmit}`} onClick={() => {handleSubmitSignup}}>→</button>
                            <ToastContainer />
                        </div>
                    </form>
                </div>
            </div>
            <div className={`${CommonStyle.copyrights}`}>
               {footerAnnotation}
                <div>
                    Designd by Katsu Media
                </div>
            </div>
            <div className={`${CommonStyle.footerBigLogo}`}>
                <Image
                    src={'/svg/LOGO.svg'}
                    alt={'logo'}
                    objectFit="contain"
                    layout="fill"
                    
                    priority
                />
            </div>
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