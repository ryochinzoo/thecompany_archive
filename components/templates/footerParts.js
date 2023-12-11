import { useState, useEffect, useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useTranslation, Trans} from 'next-i18next'
import CommonStyle from '../../styles/footerParts.module.css'
import Image from "next/image"
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import dynamic from 'next/dynamic'

const FormTextInput = dynamic(() => import("../atoms/formTextInput"))
export default function FooterParts ({mailInfo, isMain}) {
    const { t } = useTranslation("common")
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
                className: `${CommonStyle.toastifyCustomFooter}`
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
                <span className={CommonStyle.logoFontThin}>© 2023, The Company Berlin <Link href="impressum" passHref={true}><a style={{textDecoration: "underline"}}>Impressum</a></Link> <Trans t={t} i18nKey={"footer.and"}>and</Trans> <Link href="dsgvo" passHref={true}><a style={{textDecoration: "underline"}}><Trans t={t} i18nKey={"footer.privacyNotice"}>Datenschutzerklärung</Trans></a></Link></span>
            </div>
            :
            text=<div>
                <span className={CommonStyle.logoFontThin}>© 2023, The Company Berlin<br /><Link href="impressum" passHref={true}><a style={{textDecoration: "underline"}}>Impressum</a></Link> <Trans t={t} i18nKey={"footer.and"}>and</Trans> <Link href="dsgvo" passHref={true}><a style={{textDecoration: "underline"}}><Trans t={t} i18nKey={"footer.privacyNotice"}>Datenschutzerklärung</Trans></a></Link></span>
            </div>
        }
        setFooterAnnotation(text)
    }, [isDesktopLarge, isDesktop])
    return(
        <>  
        <div className={`${isMain ? CommonStyle.footerWrapper : CommonStyle.footerWrapperOther}`}>
            <div className={`${isMain ? CommonStyle.generalInfoContentsWrapper : CommonStyle.generalInfoContentsWrapperOther }`}>
            
                <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerFollow}`}>
                    <div className={`${CommonStyle.infoHeadline}`}>Follow</div> 
                    <div className={`${CommonStyle.infoDetail}`}>
                        <div><Link href="https://www.instagram.com/thecompanyberlin/" passHref={true}><a target='_blank'>Instagram</a></Link></div>
                        <div style={{display : "none"}}><Link href="https://www.facebook.com/thecompanyberlin" passHref={true}><a target='_blank'>Facebook</a></Link></div>
                        <div style={{display : "none"}}><Link href="https://www.tiktok.com/@thecompanyberlin" passHref={true}><a target='_blank'>TikTok</a></Link></div>
                    </div>
                </div>
                <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerContact}`}>
                    <div className={`${CommonStyle.infoHeadline}`}>Contact us</div> 
                    <div className={`${CommonStyle.infoDetail}`}>
                        <div><a href="mailto:contact@thecompanyberlin.com">contact(at)thecompanyberlin.com</a></div>
                        <div>IG: <Link href="https://www.instagram.com/thecompanyberlin/" passHref={true}><a target='_blank'>@thecompanyberlin</a></Link></div>
                    </div>
                </div>
                <div className={`${CommonStyle.footerContentsWrapper} ${CommonStyle.footerSignUp}`}>
                    <div className={`${CommonStyle.infoHeadline} ${CommonStyle.infoHeadlineFlex}`}>
                        <div className={`${CommonStyle.iMarkWrapper}`}>
                            <div className={`${CommonStyle.iMark}`}>
                            <Image
                                src={"/svg/i.svg"}
                                width={4}
                                height={12}
                                loading='lazy'
                                alt="i"
                            />
                            </div>
                        </div>
                        <div>Sign up for updates:</div></div>
                    <form action="https://thecompanyberlin.us20.list-manage.com/subscribe/post" method="POST">
                        <input type="hidden" name="u" value="c94d38fd085b70f961c3972c6" />
                        <input type="hidden" name="id" value="074950964e" />
                        <input type="hidden" name="MERGE0" value={emailSignUp} />
                        <div className={`${isMain ? CommonStyle.signupWrapper : CommonStyle.signupWrapperOther}`}>
                            <FormTextInput
                                placeholder = {"Email address"}
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
                                isMain={isMain}
                            ></FormTextInput>
                            <button type="submit" className={`${isMain ? CommonStyle.signUpFooterSubmit : CommonStyle.signUpFooterSubmitOther}`} onClick={() => {setIsClearAll(true)}}>→</button>
                            <ToastContainer />
                        </div>
                    </form>
                </div>
            </div>
            <div className={`${CommonStyle.copyrights}`}>
               {footerAnnotation}
               <div className={CommonStyle.pcTabletOnly}> | </div>
                <div className={CommonStyle.logoFontThin}>
                    Designed by <Link href="mailto:info@katsumedia.com">Katsumedia</Link>
                </div>
            </div>
            <div className={`${isMain ? CommonStyle.footerBigLogo : CommonStyle.footerBigLogoOther }`}>
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