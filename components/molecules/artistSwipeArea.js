import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from 'react-responsive'
import ContentsBlock from "../atoms/contensBlock"
import utilStyles from "../../styles/utils.module.css"
import Modal from "react-modal"
import { useModalShowContext } from "../../context/modalContext"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import { useInView } from "react-intersection-observer"
import { ThreeDots } from "react-loader-spinner"
import swiperNavUpdate from "../../styles/swiperNavigationUpdate.module.css"
import ReactPlayer from "react-player/lazy"


export default function SwipeArea({isMenuClicked, handleChange, artistState, listedContents, isContentChanged, handleSwiperUpdate}) {
    const { contactModalShowState, setContactModalShowState } = useModalShowContext()
    const [ modalImageState, setModalImageState ] = useState("")
    const [ modalDescriptionState, setModalDescriptionState] = useState("")
    const [ modalMediaTypeState, setModalMediaTypeState] = useState("")
    const [ showModalDescriptionState, setShowModalDescriptionState ] = useState(false)
    const [ clickedIndexState, setClickedIndexState] = useState(0)
    const [ navArrowFadeOutState, setNavArrowFadeOutState ] = useState(false)
    const [ logoImgSize, setLogoImgSize ] = useState(100)
    const [ perViewNum, setPerViewNum] = useState(3)
    const [ slideOffsetLeft, setSlideOffsetLeft] = useState(230)
    const { ref: artistModalNavInViewRef, inView: artistModalNavIsVisible } = useInView()
    const [ currentSlidePosition, setCurrentSlidePosition ] = useState(0)
    const [ touchStart, setTouchStart ] = useState(null)
    const [ touchEnd, setTouchEnd ] = useState(null)
    const [ spaceBetweenSlides, setSpaceBetweenSlides ] = useState(20)
    const [ isVertical, setIsVertical ] = useState()
    const [ imgSizeData, setImgSizeData ] = useState([{
        id: 0,
        components: [{
            id: 0,
            width: 0,
            height: 0,
        }]
    }])
    const handleSavingData = (newValue) => {
        if(newValue.state === 0) {
            if(newValue.id === 0) {
                setImgSizeData(imgSizeData.map((img, index) => (index === 0 ?
                                {id: 0, 
                                    components: [{
                                        id: 0, 
                                        width: newValue.width, 
                                        height: newValue.height
                                    }]
                                } : img)))
            } else {
                const result = imgSizeData.some(t => t.id === newValue.id)
                if(!result)
                    setImgSizeData([...imgSizeData,
                                    {id: newValue.id, 
                                        components: [{
                                            id: 0, 
                                            width: newValue.width, 
                                            height: newValue.height
                                        }]
                                    }])
            }
        } else {
            imgSizeData.map((img, index) => {
                if (index === newValue.state - 1) {
                    let tempArray = img.components
                    const result = tempArray.some(t => t.id === newValue.id)
                    if (!result) {
                        tempArray.push({ id: newValue.id, width: newValue.width, height: newValue.height })
                        tempArray.sort((a, b) => {
                            return a.id - b.id
                        })
                        setImgSizeData(imgSizeData.map((img, idx) => (idx === newValue.state - 1) ? {id: idx, components: tempArray } : img))
                    } else {
                        tempArray.map((tmp, i) => (i === newValue.id) ? { id: newValue.id, width: newValue.width, height: newValue.height } : tmp)
                        tempArray.sort((a, b) => {
                            return a.id - b.id
                        })
                        setImgSizeData(imgSizeData.map((img, idx) => (idx === newValue.state - 1) ? {id: idx, components: tempArray } : img))
                    }
                }
            })
        }
    }

    let contents, modalContents

    const [swiper, setSwiper] = useState()
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
        setCurrentSlidePosition(v)
        return v
    }
    useEffect(() => {
        if (isDesktop || isDesktopLarge) {
            setLogoImgSize(100)
            setPerViewNum(3)
            setSlideOffsetLeft(230)
            setSpaceBetweenSlides(20)
        } else if (isTablet) {
            setLogoImgSize(50)
            setPerViewNum(1.6)
            setSlideOffsetLeft(150)
            setSpaceBetweenSlides(20)
        } else {
            setLogoImgSize(30)
            setPerViewNum(1.3)
            setSlideOffsetLeft(20)
            setSpaceBetweenSlides(10)
        }
    }, [isDesktopLarge, isDesktop, isTablet])

    useEffect(() => {
        if (swiper) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
            setCurrentSlidePosition(0)
            updateSlidePosition(0)
            if(isMenuClicked) {
                updateSlidePosition(0)
                swiper.update()
                swiper.updateProgress()
                swiper.updateSize()
                swiper.updateSlides()
                swiper.updateSlidesClasses()
                swiper.slideTo(0)
                setTimeout(()=>{swiper.update()}, 2000)
                isMenuClicked(false)
            }
            if(isContentChanged) {
                swiper.slideTo(0)
                setCurrentSlidePosition(0)
                updateSlidePosition(0)
                swiper.update()
                swiper.updateProgress()
                swiper.updateSize()
                swiper.updateSlides()
                swiper.updateSlidesClasses()
                handleSwiperUpdate(false)
            }
        } 
    }, [swiper, isContentChanged, handleSwiperUpdate, isMenuClicked])

    const handleIsVertical = (newValue) => {
        setIsVertical(newValue)
    }
    const onClickSwiperNextArrow = (swiper, currentSlidePosition) => {
        //swiper.update()
        const length = swiper.slides.length
        if(currentSlidePosition < length - 1) {
            const nextPosition = currentSlidePosition + 1
            swiper.slideTo(updateSlidePosition(nextPosition))
        } else {
            swiper.slideTo(updateSlidePosition(length - 1))
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
                setModalImageState(listedContents.components[clickedIndexState - 1].projectMediaURL)
                handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].height))   
                setClickedIndexState(clickedIndexState - 1)
            } else if (clickedIndexState === 0){
                setModalImageState(listedContents.components[listedContents.components.length - 1].projectMediaURL)
                handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].width, imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].height))
                setClickedIndexState(listedContents.components.length - 1)
            }
        } else if (isLeftSwipe) {
            if (clickedIndexState < listedContents.components.length - 1){
                setModalImageState(listedContents.components[clickedIndexState + 1].projectMediaURL)
                handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].height))
                setClickedIndexState(clickedIndexState + 1)
            } else if (clickedIndexState === listedContents.components.length - 1){
                setModalImageState(listedContents.components[0].projectMediaURL)
                handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[0].width, imgSizeData[listedContents.id - 1].components[0].height))
                setClickedIndexState(0)
            }
        } 
    }


    if (modalMediaTypeState === "Image") {
        modalContents =  <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => onTouchEnd(clickedIndexState, listedContents)}><Image 
            src={modalImageState}
            alt="clicked image would be appeared"
            objectFit="cover"
            layout="fill"
            priority
        /></div>
    } else {
        modalContents = <><div className={utilStyles.loaderWrapperBig}><ThreeDots 
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
                            <div className={utilStyles.modalContentsTouchSwipingWrapper}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={() => onTouchEnd(clickedIndexState, listedContents)}></div>
                            <ReactPlayer
                                url= {modalImageState}
                                className={isVertical ? utilStyles.zoomedPlayerScaledVertical : utilStyles.zoomedPlayerScaled} 
                                muted
                                playing
                                disabledeferredloading="true"
                                width="100%"
                                height="100vh"
                                config={{
                                    vimeo: {
                                        playerOptions: {
                                            width: "100%",
                                            height: "100vh",
                                            responsive: true,
                                            controls: false,
                                            autoplay: true,
                                        }
                                    }
                                }}
                            /></>
    }

    useEffect(() => {
        const options = {
            threshold: 1,
        }
        const observer = new IntersectionObserver((entries, observer) => {
            entries.map(entry => {
                if(entry.isIntersecting) {
                   if(!entry.target.classList.contains(`${swiperNavUpdate.fadeOutAnimation}`)){
                        entry.target.classList.add(`${swiperNavUpdate.fadeOutAnimation}`)
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
    
        contents = <div style={{position:"relative"}}>
        <div>
            <div className={utilStyles.gradationWhiteLeftSide}></div>
            <div className={utilStyles.gradationWhiteRightSide}></div>
        </div>
    
        <div ref={prevRef}>
            <div className={`${swiperNavUpdate.swiperButtonPrevWrapper} 
                ${navIsVisible ? swiperNavUpdate.fadeOutAnimation : ""}`}
                onClick={() => {
                    onClickSwiperPrevArrow(swiper, currentSlidePosition)
                }}>
                <div className={`${ swiperNavUpdate.swiperButtonPrev}`}>
                    <div className={`${ swiperNavUpdate.swiperButtonPrevArrow}`}></div>
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
        slidesPerGroup={1}
        centeredSlides={false}
        initialSlide={0}
        loop={false}
        allowTouchMove={true}
        slidesOffsetBefore={slideOffsetLeft}
        onSwiper={setSwiper}
    >
    
        {!artistState ? listedContents.map((contents, index) => {
            return(
                <SwiperSlide className={`${utilStyles.positionRelative} ${utilStyles.brandArtistResponsiveWidth} ${utilStyles.swiperFlexibleSize}`} key={index} onClick={() => {
                    handleChange(contents.id)
                }}>
                    <ContentsBlock index={index} contentState={artistState} handleSavingData={handleSavingData} handleIsVertical={handleIsVertical} contentsType={contents.mediaType} contentsLabel={contents.name} contentsImgUrl={contents.displayPictureUrl} contentsDescription=""/>
                </SwiperSlide>
            )
        })
        :
        listedContents.components.map((contents, index) => {
            return(
                <SwiperSlide className={`${utilStyles.positionRelative} ${utilStyles.swiperFlexibleSize}`}  key={index} onClick={() => {
                        setModalImageState(contents.projectMediaURL)
                        setModalDescriptionState(contents.projectDescription)
                        setModalMediaTypeState(contents.mediaType)
                        setContactModalShowState(true)
                        setClickedIndexState(swiper.clickedIndex)
                        handleSwiperUpdate(true)
                    }}>
                    <ContentsBlock 
                        index={index}
                        contentState={artistState} 
                        handleSavingData={handleSavingData} 
                        handleIsVertical={handleIsVertical} 
                        contentsType={contents.mediaType} 
                        contentsLabel="" 
                        contentsGifImgUrl={contents.projektGifURL} 
                        contentsImgUrl={contents.projectMediaURL} 
                        contentsDescription={contents.projectDescription}/>
                </SwiperSlide>
            )
        })}
        </Swiper>
    	
        <div ref={nextRef}>
        <div ref={navInViewRef}  className={`${swiperNavUpdate.swiperButtonNextWrapper} 
        ${navIsVisible ? swiperNavUpdate.fadeOutAnimation : ""}`}
        onClick={() => {
            onClickSwiperNextArrow(swiper, currentSlidePosition)
        }}>
            <div className={`${swiperNavUpdate.swiperButtonNext}`}>
                <div className={`${ swiperNavUpdate.swiperButtonNextArrow}`}></div>
            </div>
        </div>  
    </div>  
</div>

    //here we have className to combine with react-swipe
    return(
        <>  
            
            {contents}        
            <Modal style={{overlay:{zIndex:10000, backgroundColor: "rgba(0, 0, 0, 0.6)"}, contents:{}}} className={[utilStyles.contentsModal, utilStyles.otherOptionModal].join(" ")} isOpen={contactModalShowState} ariaHideApp={false}>
                <div >
                    <div ref={artistModalNavInViewRef} className={`${swiperNavUpdate.swiperModalButtonPrevWrapper} ${artistModalNavIsVisible ? swiperNavUpdate.fadeOutAnimation : ""}`} onClick={() => {
                        if (clickedIndexState > 0) {
                            setModalImageState(listedContents.components[clickedIndexState - 1].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].height))
                            setClickedIndexState(clickedIndexState - 1)
                        } else if (clickedIndexState === 0){
                            setModalImageState(listedContents.components[listedContents.components.length - 1].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].width, imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].height))
                            setClickedIndexState(listedContents.components.length - 1)
                        }
                    }}>
                        <div  className={`${swiperNavUpdate.swiperModalButtonPrev}`}>
                            <div className={swiperNavUpdate.swiperButtonPrevArrow}></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={artistModalNavInViewRef} className={`${swiperNavUpdate.swiperModalButtonNextWrapper} ${artistModalNavIsVisible ? swiperNavUpdate.fadeOutAnimation : ""}`} onClick={() => {
                        if (clickedIndexState < listedContents.components.length - 1){
                            setModalImageState(listedContents.components[clickedIndexState + 1].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].height))
                            setClickedIndexState(clickedIndexState + 1)
                        } else if (clickedIndexState === listedContents.components.length - 1){
                            setModalImageState(listedContents.components[0].projectMediaURL)
                            handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[0].width, imgSizeData[listedContents.id - 1].components[0].height))
                            setClickedIndexState(0)
                            //swiper.slideTo(0) 
                        }
                    }}>
                        <div className={`${swiperNavUpdate.swiperModalButtonNext}`} >
                            <div className={swiperNavUpdate.swiperButtonNextArrow}></div>
                        </div>
                    </div>
                </div>
                <div className={utilStyles.modalContentsWithBackgroundImage}>
                    <div className={utilStyles.modalCloseButton} onClick={() => {
                        setContactModalShowState(false)
                        setShowModalDescriptionState(false)
                    }}></div>
                </div>
                
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