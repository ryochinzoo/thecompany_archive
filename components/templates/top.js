import React, { useState, useRef, useEffect } from 'react'
import TopStyle from '../../styles/top.module.css'
import utilStyles from '../../styles/utils.module.css'

export default function Top () {
    
    const [inVisibleBoxHeightState, setInvisibleBoxHeightState] = useState()
    const [outOfBoxUpState, setOutOfBoxUpState] = useState(false)
    const [previousY, setPreviousY] = useState(0)
    const [previousRatio, setPreviousRatio] = useState(0)
    const windowHeightRef = useRef()
    const topWithVideo = useRef()
    const areYouScrollFadeOut = useRef()
    const areYou = useRef() 
    const transitionBoxOne = useRef()

    useEffect(() => {
        const options = {
            threshold: 1,
        }
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                    
                }
            })
        }, options)
        if(transitionBoxOne.current) {
            observer.observe(transitionBoxOne.current)
        }
    }, [transitionBoxOne])

    useEffect(() => {
        
        const halfHeight = Math.round(windowHeightRef.current.clientHeight / 2)
        const oneSeven = halfHeight / 2
        const options = {
            threshold: 1,
            rootMargin: `0px 0px ${halfHeight + oneSeven}px 0px`
        }

        const observer = new IntersectionObserver((entries, observer) => {
            entries.map((entry) => {
                if(entry.isIntersecting) {
                    if(!areYou.current.classList.contains(`${TopStyle.movingAreYou}`)) {
                        areYou.current.classList.add(`${TopStyle.movingAreYou}`)
                    } 
                }
            })
        }, options)
        observer.observe(windowHeightRef.current)
    }, [windowHeightRef, areYou])

    useEffect(() => {
        const halfHeight = Math.round(windowHeightRef.current.clientHeight) / 2
        const oneSeven = halfHeight / 7
        const options = {
            threshold: buildThresholdList(10),
            rootMargin: `0px 0px -${halfHeight - oneSeven}px 0px`
        }
        
        const observer = new IntersectionObserver((entries, observer) => {
            setInvisibleBoxHeightState(halfHeight)
            
            entries.map((entry) => {
                const currentY = entry.boundingClientRect.top
                const currentRatio = entry.intersectionRatio

                if(entry.isIntersecting){
                    if(!outOfBoxUpState && !areYou.current.classList.contains(`${TopStyle.fadingOutAreYou}`) && !areYou.current.classList.contains(`${TopStyle.fadingInAreYou}`)) {
                        
                        areYou.current.classList.add(`${TopStyle.fadingOutAreYou}`)
                        
                    } else if(currentY > previousY) { //up
                        if (areYou.current.classList.contains(`${TopStyle.fadingOutAreYou}`)) {
                            areYou.current.classList.remove(`${TopStyle.fadingOutAreYou}`)
                            areYou.current.classList.add(`${TopStyle.fadingInAreYou}`)    
                        }
                    } else if(currentY < previousY) { //down
                        if (areYou.current.classList.contains(`${TopStyle.fadingInAreYou}`)) {
                            areYou.current.classList.add(`${TopStyle.fadingOutAreYou}`)
                            areYou.current.classList.remove(`${TopStyle.fadingInAreYou}`)
                        }
                    }
                }
                
                setPreviousY(currentY)
                setPreviousRatio(currentRatio)
            })
        }, options)

        if (areYouScrollFadeOut.current) {
            observer.observe(areYouScrollFadeOut.current)
        }
    }, [previousY, previousRatio, areYouScrollFadeOut, areYou, outOfBoxUpState])

    useEffect(() => {
        const options = {
            threshold: 0,
        }
        const observer = new IntersectionObserver((entries, observe) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                    setOutOfBoxUpState(true)
                } else {
                    setOutOfBoxUpState(false)
                }
            })
        }, options)
        if(topWithVideo.current) {
            observer.observe(topWithVideo.current)
        }
    }, [topWithVideo, outOfBoxUpState])

    return(
        <>  
            <div ref={transitionBoxOne} className={`${TopStyle.testScrolling} sections`}>
                <div ref={areYou} className={TopStyle.areYou} >
                    <span>A</span>
                    <span>R</span>
                    <span>E&nbsp;</span>
                    <span>Y</span>
                    <span>O</span>
                    <span>U</span>
                    <span>?</span>
                </div>
                <div ref={topWithVideo} className={utilStyles.test}>
                    
                </div>
            </div>
            <div className={`${utilStyles.topTextureBackground} ${TopStyle.testScrolling}  sections`} ref={windowHeightRef}>
                <div ref={areYouScrollFadeOut} className={TopStyle.fixedInfo}>
                    SCROLL DOWN IF YOU<br />
                    DON&apos;T BELONG TO ONE<br />
                    OF THESE GROUPS<br />
                </div>
            </div>
                    
        </>
    )
}

export function buildThresholdList(num) {
    const thresholds = []
    const numSteps = num
    for(const i = 1; i <= numSteps; i++) {
        const ratio = Math.round(i / numSteps)
        thresholds.push(ratio)
    }
    return thresholds
}

export function startAnimation(height) {
    const perMoved = Math.round(height / 7)
}