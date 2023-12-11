import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from 'react-responsive'
import Modal from "react-modal"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import { useInView } from "react-intersection-observer"
import { ThreeDots } from "react-loader-spinner"
import utilStyles from "../../styles/entertainmentSwipeArea.module.css"
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
const FullSlideContents = dynamic(() => import('../atoms/happeningContentsFullSlide'))

export default function EntertainmentSwipeArea({listedContents, setEntertainmentPlaying}) {
    const contentsLength = listedContents.length
    const [ objectFit, setObjectFit ] = useState("contain")
    const [ contactModalShowState, setContactModalShowState ] = useState(false)
    const [ modalImageState, setModalImageState ] = useState("")
    const [ modalMediaTypeState, setModalMediaTypeState] = useState("Image")
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
            setObjectFit("contain")
        } else if (isTablet) {
            setLogoImgSize(50)
            setPerViewNum(1.6)
            setSlideOffsetLeft(150)
            setSpaceBetweenSlides(20)
            setObjectFit("contain")
        } else {
            setLogoImgSize(30)
            setPerViewNum(1.3)
            setSlideOffsetLeft(20)
            setSpaceBetweenSlides(10)
            setObjectFit("cover")
        }
        if (swiper) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
            setCurrentSlidePosition(0)
            updateSlidePosition(0)
        } 
    }, [isDesktopLarge, isDesktop, isTablet, swiper])

    const handleIsVertical = (newValue) => {
        setIsVertical(newValue)
    }
    const onClickSwiperNextArrow = (swiper, currentSlidePosition) => {
        //swiper.update()
        swiper.slideNext()
    }
    const onClickSwiperPrevArrow = (swiper, currentSlidePosition) => {
        //swiper.update()
        swiper.slidePrev()
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
            swiper.slidePrev()
            //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].width, imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].height))
            setModalImageState(listedContents[swiper.activeIndex % contentsLength].mediaURL)
        } else if (isLeftSwipe) {
            swiper.slideNext()
            //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].width, imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].height))
            setModalImageState(listedContents[swiper.activeIndex % contentsLength].mediaURL)
        } 
    }


    if (modalMediaTypeState === "Image") {
        modalContents =  <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => onTouchEnd(clickedIndexState, listedContents)}>
            <Image 
            src={modalImageState}
            alt="clicked image would be appeared"
            objectFit={objectFit}
            layout="fill"
            loading='lazy'
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
                                playsinline={true}
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
    
        contents = <div style={{position:"relative"}}>
    
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
            slidesPerView={1}
            slidesPerGroup={1}
            centeredSlides={false}
            initialSlide={0}
            loop={true}
            freeMode={true}
            allowTouchMove={true}
            onSwiper={setSwiper}
        >
    
        {listedContents.map((contents, index) => {
            return(
                <SwiperSlide className={`${utilStyles.positionRelative} ${utilStyles.brandArtistResponsiveWidth} `} key={index}>
                   <FullSlideContents
                    mediaType={contents.mediaType}
                    mediaURL={contents.mediaURL}
                    setEntertainmentPlaying={setEntertainmentPlaying}
                   ></FullSlideContents>
                </SwiperSlide>
            )
        })}
        
        </Swiper>
    	
        <div ref={nextRef}>
        <div ref={navInViewRef}  className={`${utilStyles.swiperButtonNextWrapper} 
        ${navIsVisible ? utilStyles.fadeOutAnimation : ""}`}
        onClick={() => {
            onClickSwiperNextArrow(swiper, currentSlidePosition)
        }}>
            <div className={`${utilStyles.swiperButtonNext}`}>
                <div className={`${ utilStyles.swiperButtonNextArrow}`}></div>
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
                    <div ref={artistModalNavInViewRef} className={`${utilStyles.swiperModalButtonPrevWrapper} ${artistModalNavIsVisible ? utilStyles.fadeOutAnimation : ""}`} onClick={() => {
                        swiper.slidePrev()
                        //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].width, imgSizeData[listedContents.id - 1].components[listedContents.components.length - 1].height))
                        setModalImageState(listedContents[swiper.activeIndex % contentsLength].mediaURL)
                    }}>
                        <div  className={`${utilStyles.swiperModalButtonPrev}`}>
                            <div className={utilStyles.swiperButtonPrevArrow}></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={artistModalNavInViewRef} className={`${utilStyles.swiperModalButtonNextWrapper} ${artistModalNavIsVisible ? utilStyles.fadeOutAnimation : ""}`} onClick={() => {
                        swiper.slideNext()
                        console.log(imgSizeData)
                        setModalImageState(listedContents[swiper.activeIndex % contentsLength].mediaURL)
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