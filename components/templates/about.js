import { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useParallax } from 'react-scroll-parallax'
import AOS from 'aos'
import { useInView } from "react-intersection-observer"

import AboutStyle from '../../styles/about.module.css'
import "swiper/css"
import "swiper/css/navigation"
import 'aos/dist/aos.css'

import IOGradient from '../../foundations/IOGradient'
import MovingToMove from '../../foundations/movingToMove'
import AboutAtEnd from '../../foundations/aboutAtEnd'

export default function About () {

    const { ref: imageFirstFade, inView: imageFirstFadeVisible } = useInView({rootMargin: "50px", triggerOnce: true, })
    const { ref: imageSecondFade, inView: imageSecondFadeVisible } = useInView({rootMargin: "250px", triggerOnce: true, })
    const { ref: imageThirdFade, inView: imageThirdFadeVisible } = useInView({rootMargin: "-50px", triggerOnce: true, })

    const [firstTextOfAbout, setFirstTextOfAbout] = useState()

    const aboutJouanaRef = useParallax({ 
        speed : 20,
        translateY: [0, -40],
    })
    const scrollDownToNextSection = useRef()
    const clippedRef = useParallax({ 
        speed : 8,
    })
    const startTypeWritingRef = useRef()
    const imageParallax = useParallax({ 
        speed : 8,
    })
    const videoParallax = useParallax({ 
        speed : 16,
    })
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
    useEffect(() => {
        isDesktopLarge || isDesktop ? 
        setFirstTextOfAbout(<div className={AboutStyle.introductionAbout}>Jouana Samia came up<br />with the idea for<br /><span style={{color :"#000"}} ><span className={AboutStyle.logoFontThin}>THE</span><span>COMPANY</span></span><br />in 2017.
        </div>)
        :
        setFirstTextOfAbout(<div className={AboutStyle.introductionAbout}>Jouana Samia came up with the idea for <span style={{color :"#000"}} ><span className={AboutStyle.logoFontThin}>THE</span><span>COMPANY</span></span> in 2017.
        </div>)
    }, [isDesktop, isDesktopLarge])
    useEffect(() => {
        AOS.init({
            delay: 50,
            duration: 1000,
            easing: 'ease-in-out',
            disable: 'mobile',
        })
    })

    useEffect(() => {
        const windowHeight = Math.round(scrollDownToNextSection.current.clientHeight)
        const options = {
            threshold: buildThresholdList(10),
            rootMargin: `0px 0px ${windowHeight}px 0px`
        }
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                   /* window.scrollBy({top: windowHeight, 
                                    left: 0,
                                    behavior: 'smooth'            
                    })*/
                }
            })
        }, options)
        if (scrollDownToNextSection.current) {
            observer.observe(scrollDownToNextSection.current)
        } else {
            observer.unobserve(scrollDownToNextSection.current)
        }
    }, [scrollDownToNextSection])
      
    return(
        <>
            <div className={AboutStyle.aboutContainer}>
            {firstTextOfAbout}
                <div className={AboutStyle.AboutFlexWrapperMargins}>
                    <div className={AboutStyle.AboutFlexWrapper}>
                        <div ref={imageFirstFade}>
                            <div ref={clippedRef.ref} className={`${AboutStyle.clipPathAnimation} ${AboutStyle.fadeInElement} ${imageFirstFadeVisible ? AboutStyle.isFadeIn : ""}`}>
                                <div ref={aboutJouanaRef.ref} className={[AboutStyle.aboutJouanaBg].join(" ")}>
                                    <Image
                                        src="/images/AboutJouana.JPG"
                                        alt="test"
                                        width={400}
                                        height={600}
                                        objectFit="contain"
                                        priority
                                    />
                                    
                                </div>
                            </div>
                        </div>
                        <div className={AboutStyle.marginTopLeft} data-aos="fade-up">
                            <div className={AboutStyle.AboutSizeRegular}>
                                Her plan was initially to<br />
                            </div>
                            
                            <div className={[AboutStyle.AboutSizeBold, AboutStyle.AboutLineSpacing].join(" ")}>
                                Encourage<br />
                                young<br />
                                woman<br />
                            </div>

                            <div className={AboutStyle.AboutSizeLight}>
                                from a wide variety of dance<br />
                                areas in regular training<br />
                            </div>
                        </div>
                    </div>
                    <div className={[AboutStyle.AboutFlexWrapperReverse, AboutStyle.AboutContentsZIndexOne, AboutStyle.PushUpPosition].join(" ")}>
                        <div ref={imageSecondFade}>
                            <div ref={imageParallax.ref} className={`${AboutStyle.AboutLayeredMiddle} ${AboutStyle.fadeInElement} ${imageSecondFadeVisible ? AboutStyle.isFadeIn : ""}`}>
                                <Image
                                    src="/images/aboutPhotoExample.jpg"
                                    alt="test"
                                    width={500}
                                    height={700}
                                    objectFit="cover"
                                    priority
                                />
                            </div>
                        </div>
                        <div className={AboutStyle.marginTopRight} data-aos="fade-up" data-aos-offset="-120">
                            <div className={AboutStyle.AboutSizeBold}>
                                As she<br />
                                herself<br />
                            </div>
                            <div className={[AboutStyle.AboutSizeRegular, AboutStyle.AboutLineSpacing].join(" ")}>
                                began dancing in<br />
                                urban dance<br />
                            </div>

                            <div className={AboutStyle.AboutSizeLight}>
                                and years later expanded<br />
                                her knowledge in the field of<br />
                                classical stage dance.<br />
                            </div>
                        </div>
                    </div>
                    <div className={[AboutStyle.AboutFlexWrapper, AboutStyle.AboutContentsZIndexOne, AboutStyle.PushUpPositionVideo].join(" ")}>
                        <div ref={imageThirdFade} style={{width: "60%"}}>
                            <div ref={videoParallax.ref} className={`${AboutStyle.AboutLayeredVideo} ${AboutStyle.fadeInElement} ${imageThirdFadeVisible ? AboutStyle.isFadeIn : ""}`}>
                                <Image
                                    src="/images/aboutPhotoExample.jpg"
                                    alt="test"
                                    width={500}
                                    height={500}
                                    objectFit="cover"
                                    priority
                                />
                            </div>
                        </div>
                        <div className={AboutStyle.marginTopLeftVideo} data-aos="fade-up">
                            <div className={AboutStyle.AboutSizeRegular}>
                                Jouana Samia<br />
                            </div>
                            <div className={[AboutStyle.AboutSizeBold, AboutStyle.AboutLineSpacing].join(" ")}>
                                quickly<br />
                                noticed<br />
                            </div>

                            <div className={AboutStyle.AboutSizeLight}>
                                that the mixture and<br />
                                exchange of these different<br />
                                areas of dance did not yet<br />
                                exist.<br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={AboutStyle.scrollGradation}>
                <IOGradient></IOGradient>
            </div>
            <MovingToMove></MovingToMove>
            <div ref={scrollDownToNextSection}>
                <AboutAtEnd></AboutAtEnd>
            </div>
        
        
        </>
    )
}

export function buildThresholdList(num) {
    const thresholds = []
    for(let i = 1; i <= num; i++) {
        const ratio = i / num
        thresholds.push(ratio)
    }
    return thresholds
}

export function triggeringTypeWriterEffect () {
    return
}