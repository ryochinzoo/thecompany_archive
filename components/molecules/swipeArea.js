import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from 'react-responsive'
import { useInView } from "react-intersection-observer"
import Modal from "react-modal"
import { useModalShowContext } from "../../context/modalContext"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import { ThreeDots } from "react-loader-spinner"
import utilStyles from "../../styles/swipeArea.module.css"

import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
const SoundButton = dynamic(() => import('../atoms/soundButton'))
const ContentsBlock = dynamic(() => import('../atoms/contensBlock'))


export default function SwipeArea({isMenuClicked, handleChange, brandState, listedContents, isContentChanged, handleSwiperUpdate, allData}) {
    const { contactModalShowState, setContactModalShowState } = useModalShowContext()
    const [ modalImageState, setModalImageState ] = useState("")
    const [ modalDescriptionState, setModalDescriptionState] = useState("")
    const [ modalMediaTypeState, setModalMediaTypeState] = useState("")
    const [ showModalDescriptionState, setShowModalDescriptionState ] = useState(false)
    const [ navArrowFadeOutState, setNavArrowFadeOutState ] = useState(false)
    const [ logoImgSize, setLogoImgSize ] = useState(100)
    const [ perViewNum, setPerViewNum] = useState(3)
    const [fixedHeight, setFixedHeight] = useState(0)
    const [ slideOffsetLeft, setSlideOffsetLeft] = useState(230)
    const [ slideOffsetRight, setSlideOffsetRight] = useState(444)
    const [ spaceBetweenSlides, setSpaceBetweenSlides ] = useState(20)
    const [ clickedIndexState, setClickedIndexState] = useState(0)
    const [ touchStart, setTouchStart ] = useState(null)
    const [ touchEnd, setTouchEnd ] = useState(null)
    const [ currentSlidePosition, setCurrentSlidePosition] = useState(0)
    const [ swiper, setSwiper ] = useState()
    const [ isVertical, setIsVertical ] = useState()
    const { ref: brandModalNavInViewRef, inView: brandModalNavIsVisible } = useInView()
    const [ imgSizeData, setImgSizeData ] = useState(initImageSizeData(allData))
    const [isMuted, setIsMuted] = useState(true)
    const handleSoundSwitch = (newValue) => {
        setIsMuted(prev => {return newValue})
    }
    const handleSavingData = (newValue) => {
        const width = newValue.width
        const height = newValue.height
        const newId = newValue.id
        const newState = newValue.state
        if(newState === 0) {
            if(newId === 0) {
                setImgSizeData(imgSizeData.map((img, index) => (index === 0 ?
                                {id: 0, 
                                    components: [{
                                        id: 0, 
                                        width: width, 
                                        height: height
                                    }]
                                } : img)))
            } else {
                const result = imgSizeData.some(t => t.id === newId)
                if(result) {
                    setImgSizeData(imgSizeData.map((img, index) => (index === newId ?
                        {id: newId, 
                            components: [{
                                id: 0, 
                                width: width, 
                                height: height
                            }]
                        } : img)))
                }
            }
        } else {
            imgSizeData.map((img, index) => {
                if (index === newState - 1) {
                    let tempArray = img.components
                    const result = tempArray.some(t => t.id === newId)
                    if (!result) {
                        tempArray.push({ id: newId, width: width, height: height })
                        tempArray.sort((a, b) => {
                            return a.id - b.id
                        })
                        setImgSizeData(imgSizeData.map((img, idx) => (idx === newState - 1) ? {id: idx, components: tempArray } : img))
                    } else {
                        const updateArray = tempArray.map((tmp, i) => (i === newId) ? { id: newId, width: width, height: height } : tmp)
                        updateArray.sort((a, b) => {
                            return a.id - b.id
                        })
                        setImgSizeData(imgSizeData.map((img, idx) => (idx === newState - 1) ? {id: idx, components: updateArray } : img))
                    }
                }
            })
        }
    }
    let contents, modalContents
    const prevRef = useRef()
    const nextRef = useRef()
    const observeRef = useRef()
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
    const toggleModalDescription = (showModalDescriptionState) => {
        setShowModalDescriptionState(!showModalDescriptionState)
    }
    const  updateSlidePosition = (newValue) => {
        const v = newValue
        setCurrentSlidePosition((prev) => {return v})
        return v
    }
    useEffect(() => {
        if (isDesktop || isDesktopLarge) {
            setFixedHeight(310)
            setLogoImgSize(100)
            setPerViewNum(3)
            setSlideOffsetLeft(150)
            setSpaceBetweenSlides(20)
        } else if (isTablet) {
            setFixedHeight(280)
            setLogoImgSize(50)
            setPerViewNum(1.6)
            setSlideOffsetLeft(150)
            setSlideOffsetRight(0)
            setSpaceBetweenSlides(20)
        } else {
            setFixedHeight(200)
            setLogoImgSize(30)
            setPerViewNum(1.3)
            setSlideOffsetLeft(20)
            setSlideOffsetRight(0)
            setSpaceBetweenSlides(10)
        }
    }, [isDesktopLarge, isDesktop, isTablet, swiper])

    useEffect(() => {
        if (swiper) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
            updateSlidePosition(0)
            if(isMenuClicked) {
                if (isDesktop || isDesktopLarge) {
                    if (swiper.slides.length < 3) {
                        setSlideOffsetRight(0)
                    } else {
                        setSlideOffsetRight(444)
                    }
                }
                updateSlidePosition(0)
                swiper.updateProgress()
                swiper.updateSize()
                swiper.updateSlides()
                swiper.updateSlidesClasses()
                swiper.update()
                swiper.slideTo(0)
                setTimeout(()=>{
                    swiper.update()
                }, 5000)
                isMenuClicked(false)
            }
            if(isContentChanged) {
                swiper.slideTo(0)
                updateSlidePosition(0)
                swiper.update()
                swiper.updateProgress()
                swiper.updateSize()
                swiper.updateSlides()
                swiper.updateSlidesClasses()
                handleSwiperUpdate(false)
            }
            //console.log(imgSizeData)
        } 
    }, [swiper, isContentChanged, handleSwiperUpdate, isMenuClicked, isDesktop, isDesktopLarge, imgSizeData])

    const handleIsVertical = (newValue) => {
        setIsVertical(newValue)
    }
    const onClickSwiperNextArrow = (swiper, currentSlidePosition) => {
        swiper.update()
        const length = swiper.slides.length
        if(currentSlidePosition < length - 1) {
            const nextPosition = currentSlidePosition + 1
            const nextSlidePosition = updateSlidePosition(nextPosition)
            swiper.slideTo(nextSlidePosition)
        } else {
            const nextSlidePosition = updateSlidePosition(length - 1)
            swiper.slideTo(nextSlidePosition)
        }
    }
    const onClickSwiperPrevArrow = (swiper, currentSlidePosition) => {
        //swiper.update()
        const length = swiper.slides.length
        if(currentSlidePosition > 0) {
            const prevPosition = currentSlidePosition - 1
            swiper.slideTo(updateSlidePosition(prevPosition))
        } else {
            swiper.slideTo(updateSlidePosition(0))
        }
    }

    const minSwipeDistance = 50 

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = (clickedIndexState, listedContents) => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isRightSwipe){
            if (clickedIndexState > 0) {
                setModalImageState(listedContents[clickedIndexState - 1].projectMediaURL)
                setClickedIndexState(clickedIndexState - 1)
                handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[clickedIndexState - 1].width, imgSizeData[brandState - 1].components[clickedIndexState - 1].height))         
            } else if (clickedIndexState === 0){
                setModalImageState(listedContents[listedContents.length - 1].projectMediaURL)
                setClickedIndexState(listedContents.length - 1)
                handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[listedContents.length - 1].width, imgSizeData[brandState - 1].components[listedContents.length - 1].height))
            }
        } else if (isLeftSwipe) {
            if (clickedIndexState < listedContents.length - 1){
                setModalImageState(listedContents[clickedIndexState + 1].projectMediaURL)
                setClickedIndexState(clickedIndexState + 1)
                handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[clickedIndexState + 1].width, imgSizeData[brandState - 1].components[clickedIndexState + 1].height))
            } else if (clickedIndexState === listedContents.length - 1){
                setModalImageState(listedContents[0].projectMediaURL)
                setClickedIndexState(0)
                handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[0].width, imgSizeData[brandState - 1].components[0].height))
            }
        } 
    }
    useEffect(() => {
        const options = {
            threshold: 1,
        }
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                   if(!entry.target.classList.contains(`${utilStyles.fadeOutAnimation}`)){
                        entry.target.classList.add(`${utilStyles.fadeOutAnimation}`)
                        setNavArrowFadeOutState(true)
                   }
                }
            })
        }, options)
        if (observeRef.current) {
            observer.observe(observeRef.current)
        }
    }, [observeRef, navArrowFadeOutState])

    const { ref: navInViewRef, inView: navIsVisible } = useInView({threshold: 0.8, triggerOnce: true, })

    if (modalMediaTypeState === "Image") {
        modalContents = 
        <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={() => onTouchEnd(clickedIndexState, listedContents)}>
            <Image 
                src={modalImageState}
                alt="clicked image would be appeared"
                objectFit="cover"
                layout="fill"
                loading="lazy"
            /></div>
    } else {
        modalContents = <><div className={utilStyles.positionRelative}><div className={utilStyles.loaderWrapperBig}><ThreeDots 
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
                        <div className={utilStyles.soundIcon} style={{zIndex: 9998}}>
                            <SoundButton
                                isMuted={isMuted}
                                handleSoundSwitch={handleSoundSwitch}
                            ></SoundButton>
                        </div>
                        <ReactPlayer
                            url= {modalImageState}
                            className={isVertical ? utilStyles.zoomedPlayerScaledVertical : utilStyles.zoomedPlayerScaled} 
                            muted={isMuted}
                            playing
                            disabledeferredloading="true"
                            playsinline={true}
                            width="100%"
                            height="100vh"
                            config={{
                                file: { 
                                    attributes: { 
                                        preload: 'none',
                                    } 
                                } 
                            }}
                        /></div></>
    }

    
        contents = <div style={{position:"relative"}}>
             <div>
                <div className={utilStyles.gradationBlackLeftSide}></div>
                <div className={utilStyles.gradationBlackRightSide}></div>
            </div>
            <div ref={prevRef}>
	            <div className={`${utilStyles.swiperButtonPrevWrapper} 
	                ${navIsVisible ? utilStyles.fadeOutAnimation : ""}`}
	                onClick={() => {
	                    onClickSwiperPrevArrow(swiper, currentSlidePosition)
	                }}>
                    <div className={`${ utilStyles.swiperButtonPrev}`}>
                        <div className={`${ utilStyles.swiperButtonPrevArrow}`}></div>
                    </div>
                </div>
            </div>
            
            <Swiper
                modules={[Navigation]}
                navigation = {{
                    prevEl: prevRef?.current,
                    nextEl: nextRef?.current
                }}
                spaceBetween={spaceBetweenSlides}
                slidesPerView={"auto"}
                centeredSlides={false}
                initialSlide={0}
                loop={false}
                freeMode={true}
                allowTouchMove={true}
                slidesOffsetBefore={slideOffsetLeft}
                slidesOffsetAfter={slideOffsetRight}
                onSwiper={setSwiper}
            >
           {listedContents.map((contents, index) =>{
                return(
                    <SwiperSlide className={`${utilStyles.brandArtistResponsiveWidth} ${utilStyles.swiperFlexibleSize} `} key={index}>
                        {!brandState ?
                            <div onClick={() => {
                                handleChange(contents.id)
                                handleSwiperUpdate(true)
                            }}>   
                                <div className={utilStyles.logoForContentsInAllBrands}>
                                    <Image
                                        src={contents.logoImgUrl}
                                        alt={contents.name}
                                        layout="fill"
                                        objectFit="contain"
                                        decoding='async'
                                        loading='lazy'
                                    />
                                </div>
                                <ContentsBlock 
                                    index={index} 
                                    contentState={brandState} 
                                    handleSavingData={handleSavingData} 
                                    mediaContents={contents} 
                                    handleIsVertical={handleIsVertical} 
                                    contentsType={contents.mediaType} 
                                    ontentsLabel={contents.name} 
                                    contentsPreviewPhotoUrl={contents.displayPictureUrl} 
                                    contentsPreviewVideoUrl={contents.previewVideoUrl} 
                                    contentsImgUrl={contents.displayPictureUrl}
                                    contentsDescription=""
                                />
                            </div> 
                            :
                            <div onClick={() => {
                                setModalImageState(contents.projectMediaURL)
                                setModalDescriptionState(contents.projectDescription)
                                setModalMediaTypeState(contents.mediaType)
                                setContactModalShowState(true)
                                setClickedIndexState(swiper.clickedIndex)
                            }}>  
                                <ContentsBlock 
                                    index={index} 
                                    contentState={brandState} 
                                    handleSavingData={handleSavingData} 
                                    mediaContents={contents} 
                                    handleIsVertical={handleIsVertical} 
                                    contentsType={contents.mediaType} 
                                    contentsLabel={contents.projectName} 
                                    contentsPreviewPhotoUrl={contents.displayPictureUrl} 
                                    contentsPreviewVideoUrl={contents.previewVideoUrl} 
                                    contentsImgUrl={contents.projectMediaURL} 
                                    contentsDescription={contents.projectDescription}/>
                            </div>
                        }
                    </SwiperSlide>
                )
            })}
            </Swiper>
            
            <div ref={nextRef}>
                <div ref={navInViewRef} className={`${utilStyles.swiperButtonNextWrapper} 
                ${navIsVisible ? utilStyles.fadeOutAnimation : ""}`}
                onClick={() => {
                    onClickSwiperNextArrow(swiper, currentSlidePosition)
                }}>
                    <div className={`${ utilStyles.swiperButtonNext}`}>
                        <div className={`${ utilStyles.swiperButtonNextArrow}`}></div>
                    </div>
                </div>
            </div>
        </div>
    //here we have className to combine with react-swipe
    return(
        <>
                {contents}
            <Modal style={{overlay:{zIndex:10000, backgroundColor: "rgba(0, 0, 0, 0.6)"}, contents:{}}} className={utilStyles.contentsModal} isOpen={contactModalShowState} ariaHideApp={false}>
                <div>
                    <div ref={brandModalNavInViewRef} className={`${utilStyles.swiperModalButtonPrevWrapper} ${brandModalNavIsVisible ? utilStyles.fadeOutAnimation : ""}`} onClick={() => {
                        if (clickedIndexState > 0) {
                            setModalImageState(listedContents[clickedIndexState - 1].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[clickedIndexState - 1].width, imgSizeData[brandState - 1].components[clickedIndexState - 1].height))
                            setClickedIndexState(clickedIndexState - 1)
                        } else if (clickedIndexState === 0){
                            setModalImageState(listedContents[listedContents.length - 1].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[listedContents.length - 1].width, imgSizeData[brandState - 1].components[listedContents.length - 1].height))
                            setClickedIndexState(listedContents.length - 1)
                        }
                    }}>
                        <div  className={`${utilStyles.swiperModalButtonPrev}`}>
                            <div className={utilStyles.swiperButtonPrevArrow}></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={brandModalNavInViewRef} className={`${utilStyles.swiperModalButtonNextWrapper} ${brandModalNavIsVisible ? utilStyles.fadeOutAnimation : ""}`} onClick={() => {
                        if (clickedIndexState < listedContents.length - 1){
                            setModalImageState(listedContents[clickedIndexState + 1].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[clickedIndexState + 1].width, imgSizeData[brandState - 1].components[clickedIndexState + 1].height))
                            setClickedIndexState(clickedIndexState + 1)
                        } else if (clickedIndexState === listedContents.length - 1){
                            setModalImageState(listedContents[0].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[brandState - 1].components[0].width, imgSizeData[brandState - 1].components[0].height))
                            setClickedIndexState(0)
                        }
                    }}>
                        <div className={`${utilStyles.swiperModalButtonNext}`} >
                            <div className={utilStyles.swiperButtonNextArrow}></div>
                        </div>
                    </div>
                </div>
                <div className={utilStyles.modalContentsWithBackgroundImage}>
                    <div className={utilStyles.modalCloseButton} onClick={() => {
                        setContactModalShowState(false)
                        setShowModalDescriptionState(false)
                    }}></div>
                </div>
                <div className={utilStyles.modalContentsTouchSwipingWrapper}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(clickedIndexState, listedContents)}></div>
                {modalContents}
            </Modal>
        </>
    )
}

export function judgeAspect(w, h) {
    if (w > h) {
        return false
    } else {
        return true
    }
}

export function initImageSizeData(items) {
    const arr = []
    items.map((item, index) => {
        if (index < items.length - 1) {
            arr.push(
                {id: index, 
                    components: [{
                        id: 0, 
                        width: 0, 
                        height: 0
                    }]
                }
            )
        }
    })
    return arr
}

export function createComponents(items) {
    const arr = []
    items.map((item, index) => {
        arr.push({
            id: index, 
            width: 0, 
            height: 0
        })
    })
    return arr
}