import { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'

import AboutStyle from '../../styles/about.module.css'
import "swiper/css"
import "swiper/css/navigation"
import 'aos/dist/aos.css'

export default function AboutIntro () {
    const typeWriteAreaRef = useRef()
    const [typeWriterState, setTypeWriterState] = useState(false)
    const [aboutImageObjectFit, setAboutImageObjectFit] = useState("cover")
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
        if(isDesktop || isDesktopLarge || isTablet) {
            setAboutTopImage("/images/AboutTop.png")
            setAboutTopTextImage("/images/About_THECOMPANY.png")
            setAboutImageObjectFit("cover")
        } else {
            setAboutTopImage("/images/AboutTopSP.png")
            setAboutTopTextImage("/images/About_THECOMPANY_SP.png")
            setAboutImageObjectFit("contain")

        }

    }, [isDesktop, isDesktopLarge, isTablet])
    useEffect(() => {
        const options = {
            threshold: 1,
            rootMargin: "0px 0px 230px 0px"
        }
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                    if (isDesktop || isDesktopLarge || isTablet)
                    setTypeWriterState(true)
                }
            })
        }, options)
        if (typeWriteAreaRef.current) {
            observer.observe(typeWriteAreaRef.current)
        } else {
            observer.unobserve(typeWriteAreaRef.current)
        }
    }, [typeWriteAreaRef, typeWriterState, isDesktop, isDesktopLarge, isTablet])

      
    
    return(
        <>
            <div>
                <div style={{position : 'relative'}}>
                    <div ref={typeWriteAreaRef} className={AboutStyle.aboutHeadline}>
                        <div className={`${typeWriterState ? AboutStyle.typeWriter : AboutStyle.displayNoneTypeWriter}`}>
                            <span>&bdquo;To have company&ldquo; =</span>
                            <span>= Gesellschaft haben</span>
                        </div>
                    </div>
                    
                </div>
                <div>
                    <div className={AboutStyle.aboutHeadImage}>
                        <Image
                            src={aboutTopImage}
                            alt="test"
                            layout="fill"
                            objectFit={aboutImageObjectFit}
                            priority
                        />
                        <div className={AboutStyle.aboutTheCompanyTextImg}>
                            <Image
                                src={aboutTopTextImage}
                                alt="test"
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function triggeringTypeWriterEffect () {
    return
}