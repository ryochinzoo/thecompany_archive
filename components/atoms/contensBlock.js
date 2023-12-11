import Image from "next/image"
import { useMediaQuery } from 'react-responsive'
import utilStyles from "../../styles/contentsBlock.module.css"
import { ThreeDots } from "react-loader-spinner"
import { useImageSize } from "react-image-size"
import { useState, useEffect, useRef, useMemo } from "react"
import dynamic from 'next/dynamic'

const ReactPlayerComponent = dynamic(() => import('../atoms/dynamicReactPlayer'))
const ReactPlayerPortfolio = dynamic(() => import('../atoms/dynamicPortfolioPlayer'))

export default function ContensBlock({strapiURL, index, contentState, handleSavingData, handleIsVertical, contentsType, contentsLabel, contentsImgUrl, contentsPreviewPhotoUrl = "", contentsDescription, contentsPreviewVideoUrl = "", playingInView = false}) {
    let CLabel
    let contents
    const verifyURL = contentsPreviewPhotoUrl ? contentsPreviewPhotoUrl : contentsImgUrl
    const [dimentions, {loading, error}] = useImageSize(verifyURL)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [ratio, setRatio] = useState(16/9)
    const [fixedHeight, setFixedHeight] = useState(0)
    const imgSize = useRef(null)
    const previewVideoRef = useRef()
    const contentsVideoRef = useRef()
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
            setFixedHeight(300)
        } else if (isTablet) {
            setFixedHeight(280)
        } else {
            setFixedHeight(200)
        }
    }, [isDesktopLarge, isDesktop, isTablet, imgSize])

    const calWidth = (img, dimentions) =>  {
        if (img.naturalWidth <= 1 || img.naturalWidth === 'NaN') {
            return dimentions?.width
        } else {
            return img.naturalWidth
        }
    }
    
    const calHeight = (img, dimentions) => {
        if (img.naturalHeight <= 1 || img.naturalWidth === 'NaN') {
            return dimentions?.height
        } else {
            return img.naturalHeight
        }
    }
    const setRatioUpdate = (newValue) => {
        setRatio(newValue)
    }

    const calWidthRatio = useMemo(() => {
        return fixedHeight * ratio
    }, [fixedHeight, ratio])

    if(contentsType !== "Video" && contentsPreviewVideoUrl == "") {
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
                        <div ref={imgSize} 
                            style={{width: calWidthRatio, 
                                minWidth: calWidthRatio, 
                                maxWidth: calWidthRatio, 
                                height: fixedHeight, 
                                minHeight: fixedHeight, 
                                maxHeight: fixedHeight,
                                position: "relative",
                            }}
                            className={utilStyles.objectPositionTop}
                            >
                    <Image
                        src={contentsImgUrl}
                        alt={contentsDescription}
                        onLoadingComplete={(img) => {
                            setIsLoaded(true)
                            const naturalWidth = calWidth(img, dimentions)//img.naturalWidth ? img.naturalWidth : 569
                            const naturalHeight = calHeight(img, dimentions)//img.naturalHeight ? img.naturalHeight : 320
                            setRatio(naturalWidth/naturalHeight)
                            handleSavingData({state: contentState, id: index, width: naturalWidth, height: naturalHeight})
                        }}
                        layout="fill"
                        objectFit="contain"
                        loading='lazy'
                        decoding="async"
                        sizes={"100vw"}
                        quality={50}
                    /></div></div>
    } else if(contentsPreviewVideoUrl) {
        contents = <div className={utilStyles.imagePreviewWrapper}
                        style={{width: calWidthRatio, 
                            minWidth: calWidthRatio, 
                            maxWidth: calWidthRatio, 
                            height: fixedHeight, 
                            minHeight: fixedHeight, 
                            maxHeight: fixedHeight,
                        }}
        >
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
                    <div className={utilStyles.arrowWrapper} >
                            <div style={{position : "relative"}}>
                                <div className={utilStyles.arrowUpRight}></div>
                                <div className={utilStyles.arrowDownLeft}></div>
                            </div>
                        </div>
                    <div ref={imgSize} 
                        style={{width: calWidthRatio, 
                            minWidth: calWidthRatio, 
                            maxWidth: calWidthRatio, 
                            height: fixedHeight, 
                            minHeight: fixedHeight, 
                            maxHeight: fixedHeight,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 2,
                        }}
                        onMouseEnter={() => {
                            imgSize.current.style.opacity = 0
                            setIsPlaying(true)
                        }}
                        onMouseOver={() => {
                            //imgSize.current.style.opacity = 0
                            //setIsPlaying(true)
                        }}
                        onMouseLeave={() => {
                            imgSize.current.style.opacity = 1
                            setIsPlaying(false)

                        }}
                        className={utilStyles.objectPositionTop}
                        >
                        <Image
                            src={contentsPreviewPhotoUrl}
                            alt={contentsDescription}
                            onLoadingComplete={(img) => {
                                setIsLoaded(true)
                                const naturalWidth = calWidth(img, dimentions)//img.naturalWidth ? img.naturalWidth : 569
                                const naturalHeight = calHeight(img, dimentions)//img.naturalHeight ? img.naturalHeight : 320
                                setRatio(naturalWidth/naturalHeight)
                                handleSavingData({state: contentState, id: index, width: naturalWidth, height: naturalHeight})
                            }}
                            layout="fill"
                            objectFit="contain"
                            decoding="async"
                            priority
                        />
                </div>
                <div className={utilStyles.playerWrapper}
                    style={{width: calWidthRatio, 
                        minWidth: calWidthRatio, 
                        maxWidth: calWidthRatio, 
                        height: fixedHeight, 
                        minHeight: fixedHeight, 
                        maxHeight: fixedHeight,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                >   
                        <div className={utilStyles.videoWrapper}></div>
                        <ReactPlayerPortfolio
                            src= {contentsPreviewVideoUrl}
                            imgSrc={contentsPreviewPhotoUrl}
                            playerRef={previewVideoRef}
                            isPlaying={isPlaying}
                        />
                    </div>
                </div>
    } else {
        contents = <div className={utilStyles.imagePreviewWrapper}
                        style={{width: calWidthRatio, 
                            minWidth: calWidthRatio, 
                            maxWidth: calWidthRatio, 
                            height: fixedHeight, 
                            minHeight: fixedHeight, 
                            maxHeight: fixedHeight,
                        }}
                ><div className={utilStyles.playerWrapper} 
                        style={{width: calWidthRatio, 
                            minWidth: calWidthRatio, 
                            maxWidth: calWidthRatio, 
                            height: fixedHeight, 
                            minHeight: fixedHeight, 
                            maxHeight: fixedHeight,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            zIndex: 1,
                        }}
                        onMouseEnter={()=>{
                            //setIsPlaying(true)
                        }}
                        onMouseLeave={()=>{
                            //setIsPlaying(false)
                        }}
                    >   
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
                        <ReactPlayerComponent
                            src= {contentsImgUrl}
                            playerRef={contentsVideoRef}
                            playingInView={playingInView}
                            handleSavingData={handleSavingData}
                            contentState={contentState}
                            index={index}
                            setRatioUpdate={setRatioUpdate}
                        />
                    </div>
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
            {CLabel}
        </div>
    )
}
