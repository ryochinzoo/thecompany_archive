import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'

import AboutStyle from '../styles/about.module.css'

export default function AboutAtEnd() {
    const monotonePictureRef = useRef()
    const windowHeightRef = useRef()
    const showAfterAnimationRef = useRef()
    const bufferMobileRef = useRef()
    const [responsiveRootMargin, setResponsiveRootMargin] = useState(0)
    const [scrollPictureAmount, setScrollPictureAmount] = useState(500)
    const [scrollPicturePreviousAmount, setScrollPicturePreviousAmount] = useState(500)
    const [thresholdValue, setThresholdValue] = useState(0.8)

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
        const windowWidth = monotonePictureRef.current.clientWidth
        const windowHeight = windowHeightRef.current.clientHeight
        const imageWidth = bufferMobileRef.current.clientWidth

        if (isMobileSmall || isMobile || isTablet) {
            const scrollAmount = (imageWidth - windowWidth) / 2
            setScrollPictureAmount(scrollAmount)
            setScrollPicturePreviousAmount(scrollAmount)
        } else {
            setScrollPictureAmount(500)
        }
        monotonePictureRef.current.scrollTo({
            behavior: 'smooth',
            left: scrollPictureAmount
        })
        if (isMobileSmall || isMobile) {
            setResponsiveRootMargin(windowHeight / 2)
            setThresholdValue(0.8)
        } else if (isTablet) {
            setResponsiveRootMargin(windowHeight / 2)
            setThresholdValue(0.2)
        } else {
            setResponsiveRootMargin(windowHeight - 160)
            setThresholdValue(0.8)
        }
        const options = {
            threshold: thresholdValue,
            rootMargin: `0px 0px -${responsiveRootMargin}px 0px`
        }
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map((entry) => {
                if (entry.isIntersecting) {
                    monotonePictureRef.current.classList.add(`${AboutStyle.BlackPictureAnimation}`)
                    showAfterAnimationRef.current.classList.add(`${AboutStyle.PhrasesAtTheEndAnimation}`)
                }
            })
        }, options)
        if (monotonePictureRef.current) {
            observer.observe(monotonePictureRef.current)
        } else {
            observer.unobserve(monotonePictureRef.current)
        }
    }, [thresholdValue, monotonePictureRef, showAfterAnimationRef, isMobile, isTablet, isMobileSmall, responsiveRootMargin, scrollPictureAmount])
    /*
    function handlePictureAnimation(e) {
        const windowWidth = monotonePictureRef.current.clientWidth
        const imageWidth = bufferMobileRef.current.clientWidth

        if (isMobileSmall || isMobile) {
            const scrollAmount = (imageWidth - windowWidth) / 2
            setScrollPictureAmount(scrollAmount)
        }
    }
    */
    return (
        <>
        <div ref={windowHeightRef} className={AboutStyle.AboutEndBase}>
            <div ref={monotonePictureRef} className={AboutStyle.BlackPicture}>
                <div ref={bufferMobileRef} className={AboutStyle.swipeBufferForMobile}>
                    <Image
                        src="/images/AboutEndColor.jpg"
                        alt="sorry, there is some error, please reload it again"
                        layout='fill'
                    />
                </div>
            </div>
            
            <div ref={showAfterAnimationRef} className={[AboutStyle.ShowAfterChanged].join(" ")}>
                <div className={[AboutStyle.AboutBold, AboutStyle.graycolor, AboutStyle.aboutAtEndLeft].join(" ")}>
                    We can now<br />
                    look forward<br />
                    to the fact
                </div>
                <div className={[AboutStyle.aboutAtEndSmall].join(" ")}>
                    <div className={[AboutStyle.AboutRegular, AboutStyle.aboutAtEndRight].join(" ")}>
                        that numerous young talents<br />
                        trust our trip and contribute<br />
                        to the history of German<br />
                        dance culture.
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}