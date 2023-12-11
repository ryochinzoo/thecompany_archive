import AboutStyle from '../styles/about.module.css'
import { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useTranslation, Trans} from 'next-i18next'

export default function MovingToMove() {
    const { t } = useTranslation("common")
    const movingToMoveTagRef = useRef()
    const movingToMoveImageRef = useRef()
    const movingToMoveParagraphRef = useRef()
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
    const [aboutTextAtEnd, setAboutTextAtEnd] = useState()
    useEffect(() => {
        {isDesktopLarge || isDesktop ?
            setAboutTextAtEnd(<Trans t={t} i18nKey={"about.movingtomove"}>
                is the guiding principle of our Philosophy. We want to move people, both physically and emotionally.
            </Trans>)
            : 
            setAboutTextAtEnd(<Trans t={t} i18nKey={"about_sp.movingtomove"}>is the guiding principle of our Philosophy. We want to move people, both physically and emotionally.</Trans>)
                
        }
    }, [isDesktop, isDesktopLarge, t])
    useEffect(() => {
        const rootMarginBottom = 300
        
        const options = {
            threshold: buildThresholdList(10),
            rootMargin: `0px 0px -${rootMarginBottom}px 0px`
        }
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map((entry) => {

                if (entry.intersectionRatio > 0.35){
                    movingToMoveTagRef.current.classList.add(`${AboutStyle.movingTagAnimation}`)
                }
            })
        }, options)

        if(movingToMoveImageRef.current){
            observer.observe(movingToMoveParagraphRef.current)
            observer.observe(movingToMoveTagRef.current)
        } else {
            observer.unobserve(movingToMoveParagraphRef.current)
            observer.unobserve(movingToMoveTagRef.current)
        }

    }, [movingToMoveParagraphRef, movingToMoveTagRef])

    return(
        <>
            <div ref={movingToMoveImageRef} className={`${AboutStyle.movingToMoveImage} ${AboutStyle.clipPathAnimationMtoM}`}>
                <Image
                    src="/images/about_MtoM.gif" /* aboutPhotoExample.jpg*/
                    alt="test"
                    width={400}
                    height={600}
                    objectFit="cover"
                    priority
                />  
            </div>
            <div ref={movingToMoveParagraphRef} className={AboutStyle.movingToMoveTagAndParagraph}>
                <div ref={movingToMoveTagRef} className={`${AboutStyle.movingToMoveTag}`}>#movingtomove</div>
                <div className={[AboutStyle.introductionAbout, AboutStyle.movingToMoveParagraph, AboutStyle.movingToMoveDescription].join(" ")}>
                    {aboutTextAtEnd}<br />
                </div>
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