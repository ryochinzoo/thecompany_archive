import React, { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import utilStyles from '../styles/utils.module.css'
import { useTranslation, Trans} from 'next-i18next'

export default function IOGradient({ children }) {
    const { t } = useTranslation("common")
    const observingRef = useRef()
    const gradationTarget = useRef()
    const windowSize = useWindowSize()
    const [gradationText, setGradationText] = useState()
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
        let text = <><Trans t={t} i18nKey={"about.gradation.before_company"}>The awareness of this came from the original idea for  </Trans>
        <span className={utilStyles.logoFontThin}>THE</span><span>COMPANY</span>, <Trans t={t} i18nKey={"about.gradation.after_company"}>
        especially the exchange of different ethnic backgrounds and dance styles. The goal was to create something bigger for the next generation - from a pure women&apos;s collective to an open space for every dance-loving person, regardless of their gender, origin, religion or age.
        </Trans></>
        
        setGradationText(text)
    }, [t])

    useEffect (() => {
        
        const rootMargin = 0
        const options = {
            threshold: buildThresholdList(10),
            rootMargin: `0px 0px -${rootMargin}px 0px`,
        }
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                    const gradientTargetHeight = Math.round(entry.intersectionRect.height)
                    const intersectionRectTop = Math.round(entry.intersectionRect.top)
                    const browserHeightHalf = Math.round(windowSize.height / 2)
                    const ratio = Math.round(((browserHeightHalf - intersectionRectTop) / gradientTargetHeight) * 100)//Math.round(entry.intersectionRatio * 100)
                   
                    gradationTarget.current.style.backgroundImage = `
                        linear-gradient(
                            0deg,
                            rgb(127, 127, 127) ${0 - ratio}%,
                            rgb(127, 127, 127) ${75 - ratio}%,
                            rgb(255, 0, 0) ${100 - ratio}%,
                            rgb(127, 127, 127) ${125 - ratio}%,
                            rgb(127, 127, 127) ${200 - ratio}%
                        )
                    `
                }
            });
        }, options)
        if (gradationTarget.current){
            observer.observe(gradationTarget.current)
        }
    }, [gradationTarget, windowSize.height])
    
    return (
        <>
        <div>
            <div ref={gradationTarget} className={utilStyles.gradientText}>
                <div className={utilStyles.gradientAlign}>
                {gradationText}<br />
                </div>
            </div>
            <div ref={observingRef} className={utilStyles.blindBox300}></div>
        </div>
    </>
    )
}

export function buildThresholdList(num) {
    const thresholds = []
    const numSteps = num
    for(let i = 1; i <= numSteps; i++) {
        const ratio = i / numSteps
        thresholds.push(ratio)
    }
    return thresholds
}

function useWindowSize () {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })
    useEffect(() => {
        if(typeof window !== "undefined") {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                })
            }
            window.addEventListener("resize", handleResize)
            handleResize()
            return () => window.removeEventListener("resize", handleResize)
        } else {
            return
        }
    }, [])
    return windowSize
}