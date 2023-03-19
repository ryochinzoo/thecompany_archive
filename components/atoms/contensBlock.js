import Image from "next/image"
import { useMediaQuery } from 'react-responsive'
import utilStyles from "../../styles/utils.module.css"
import { ThreeDots } from "react-loader-spinner"
import ReactPlayer from "react-player/lazy"
import { useState, useEffect, useRef } from "react"

export default function ContensBlock({index, contentState, handleSavingData, handleIsVertical, contentsType, contentsLabel, contentsImgUrl, contentsGifImgUrl, contentsDescription}) {
    let CLabel
    let contents
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [ratio, setRatio] = useState(16/9)
    const [fixedHeight, setFixedHeight] = useState(0)
    const imgSize = useRef(null)
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
        if (isDesktop || isDesktopLarge) {
            setFixedHeight(310)
        } else if (isTablet) {
            setFixedHeight(280)
        } else {
            setFixedHeight(200)
        }
    }, [isDesktopLarge, isDesktop, isTablet, imgSize])

    if(contentsType !== "Video") {
        contents = <div className={utilStyles.imageWrapper} >
            <div className={isLoaded ? utilStyles.removeDots : utilStyles.loaderWrapper }><ThreeDots 
                            wrapperStyle={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                            color="#C93D38"
                            radius={9}
                            height={100}
                            width={100}
                        /></div>
                        <div ref={imgSize} onClick={() => {
                            const w = imgSize.current.children[0].children[1].offsetWidth
                            const h = imgSize.current.children[0].children[1].offsetHeight
                            if (w < h) {
                                handleIsVertical(true)
                            } else {
                                handleIsVertical(false)
                            }
                        }}>
                    <Image
                        src={contentsGifImgUrl ? contentsGifImgUrl : contentsImgUrl}
                        alt={contentsDescription}
                        onLoadingComplete={(img) => {
                            setIsLoaded(true)
                            const naturalWidth = img.naturalWidth ? img.naturalWidth : 569
                            const naturalHeight = img.naturalHeight ? img.naturalHeight : 320
                            setRatio(naturalWidth/naturalHeight)
                            handleSavingData({state: contentState, id: index, width: img.naturalWidth, height: img.naturalHeight})
                        }}
                        height={fixedHeight}
                        width={fixedHeight * ratio}
                        objectFit="contain"
                    /></div></div>
    } else {
        contents = <div className={utilStyles.playerWrapper} 
                        onMouseEnter={()=>{
                            setIsPlaying(true)
                        }}
                        onMouseLeave={()=>{
                            setIsPlaying(false)
                        }}
                    >   
                        <div className={utilStyles.videoWrapper}></div>
                        <div className={utilStyles.arrowWrapper} >
                            <div style={{position : "relative"}}>
                                <div className={utilStyles.arrowUpRight}></div>
                                <div className={utilStyles.arrowDownLeft}></div>
                            </div>
                        </div>
                        <div className={utilStyles.loaderWrapper}><ThreeDots 
                            wrapperStyle={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                            color="#C93D38"
                            radius={9}
                            height={100}
                            width={100}
                        /></div>
                        <ReactPlayer
                            url= {contentsImgUrl}
                            className={utilStyles.reactPlayer} 
                            playing={isPlaying}
                            muted
                            width="100%"
                            height="100%"
                            config={{
                                vimeo: {
                                    width: "100%",
                                    responsive: true,
                                    controls: true,
                                }
                            }}
                        />
                    </div>
                
    }

    if (contentsLabel) {
        CLabel = <span className={utilStyles.projectLabel}>{contentsLabel}</span>
    } else {
        CLabel = <span className={utilStyles.projectBlankLabel}>{contentsLabel}</span>
    }
    return(
        <div className={[utilStyles.clickable, utilStyles.positionRelative].join(" ")}>
            {contents}
            <br />
            {CLabel}
        </div>
    )
}