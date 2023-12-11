import { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import AOS from 'aos'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'
import { useTranslation, Trans} from 'next-i18next'

import AboutStyle from '../../styles/about.module.css'
import "swiper/css"
import "swiper/css/navigation"
import 'aos/dist/aos.css'

export default function AboutIntro () {
    const typeWriteAreaRef = useRef()
    const [typeWriterState, setTypeWriterState] = useState(false)
    const [aboutImageObjectFit, setAboutImageObjectFit] = useState("cover")
    const { t } = useTranslation("common")
    const isDesktopLarge = useMediaQuery({
        query: '(min-width: 1200px)'
    })
    const [aboutTopImage, setAboutTopImage] = useState("/images/AboutTop.png")
    const [aboutTopTextImage, setAboutTopTextImage] = useState("/images/About_THECOMPANY.png")
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
    useEffect(() => {
        AOS.init({
            delay: 50,
            duration: 1000,
            easing: 'ease-in-out',
            disable: 'mobile',
        })
    }, [])
    
    return(
        <>
            <div>
                <div style={{position : 'relative'}}>
                    <div className={`${AboutStyle.aboutHeadlineWrapper} ifSafariAboutHead`} data-aos="fade-up">
                        <div className={`${AboutStyle.aboutHeadlineBold}`}>THECOMPANY</div>
                        <div className={`${AboutStyle.aboutHeadlineBold}`}>
                            <span>Dance Education, Entertainment and Production. </span>
                            <span className={`${AboutStyle.aboutHeadlineGray}`}>
                                <Trans t={t} i18nKey={"about.headline"}>Eine Institution für Tanz und Choreographie mit dem Fokus auf Individualität.</Trans></span>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}