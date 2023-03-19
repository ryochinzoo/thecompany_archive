import React, { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import utilStyles from '../styles/utils.module.css'

export default function IOGradient({ children }) {
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
        let text = ""
        {isDesktopLarge || isDesktop ? 
            text = <>The awareness for this <br />
            arose from the initially <br />
            mere idea of <br />
            <span className={utilStyles.logoFontThin}>THE</span><span>COMPANY</span>, i.e. an <br />
            exchange of ethnic and <br />
            dance cultures to create <br />
            something bigger for the <br />
            offspring and from a <br />
            pure women&apos;s collective<br />
            the scene for every <br />
            dance-loving person of <br />
            every gender, origin, <br />
            religion and any age to <br />
            expand.<br /></>
            :
            text = <><span>The awareness for this arose from the initially mere idea of <span className={utilStyles.logoFontThin}>THE</span><span>COMPANY</span>, i.e. an exchange of ethnic and dance cultures to create something bigger for the offspring and from a pure women&apos;s collective the scene for every dance-loving person of every gender, origin, religion and any age to expand.</span><br /></>
        }
        setGradationText(text)
    }, [isDesktop, isDesktopLarge])

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
                {gradationText}
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