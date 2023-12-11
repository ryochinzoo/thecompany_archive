import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from 'react-responsive'
import { useModalShowContext } from "../../context/modalContext"
import Modal from "react-modal"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import { useInView } from "react-intersection-observer"
import { ThreeDots } from "react-loader-spinner"
import utilStyles from "../../styles/studioSwipeArea.module.css"
import dynamic from 'next/dynamic'

const SoundButton = dynamic(() => import('../atoms/soundButton'))
const ContentsBlock = dynamic(() => import('../atoms/contensBlock'))
const ModalVideo = dynamic(() => import('../atoms/modalVideo'))


export default function SwipeArea({handleChange, listedContents, handleSwiperUpdate}) {
    const contentsLength = listedContents.length
    const [ objectFit, setObjectFit ] = useState("contain")
    const { contactModalShowState, setContactModalShowState } = useModalShowContext()
    const [ modalImageState, setModalImageState ] = useState("")
    const [ modalDescriptionState, setModalDescriptionState] = useState("")
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
    const [isMuted, setIsMuted] = useState(true)
    const handleSoundSwitch = (newValue) => {
        setIsMuted(prev => {return newValue})
    }
    const [ imgSizeData, setImgSizeData ] = useState([{
        id: 0,
        components: [{
            id: 0,
            width: 0,
            height: 0,
        }]
    }])
    const [loadPrevNextAmount, setLoadPrevNextAmount] = useState(2)
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
            setSlideOffsetLeft(0)
            setSpaceBetweenSlides(20)
            setObjectFit("contain")
            setLoadPrevNextAmount(2)
        } else if (isTablet) {
            setLogoImgSize(50)
            setPerViewNum(1.6)
            setSlideOffsetLeft(20)
            setSpaceBetweenSlides(20)
            setObjectFit("contain")
            setLoadPrevNextAmount(2)
        } else {
            setLogoImgSize(30)
            setPerViewNum(1.3)
            setSlideOffsetLeft(20)
            setSpaceBetweenSlides(10)
            setObjectFit("contain")
            setLoadPrevNextAmount(0)
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
            if (clickedIndexState > 0) {
                setModalImageState(listedContents[clickedIndexState - 1].displayPictureUrl)
                setModalMediaTypeState(listedContents[clickedIndexState - 1].mediaType)
                //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].height))   
                setClickedIndexState(clickedIndexState - 1)
            } else if (clickedIndexState === 0){
                setModalImageState(listedContents[contentsLength - 1].displayPictureUrl)
                setModalMediaTypeState(listedContents[contentsLength - 1].mediaType)
                //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[contentsLength - 1].width, imgSizeData[listedContents.id - 1].components[contentsLength - 1].height))
                setClickedIndexState(contentsLength - 1)
            }
        } else if (isLeftSwipe) {
            if (clickedIndexState < contentsLength - 1){
                setModalImageState(listedContents[clickedIndexState + 1].displayPictureUrl)
                setModalMediaTypeState(listedContents[clickedIndexState + 1].mediaType)
                //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].height))
                setClickedIndexState(clickedIndexState + 1)
            } else if (clickedIndexState === contentsLength - 1){
                setModalImageState(listedContents[0].displayPictureUrl)
                setModalMediaTypeState(listedContents[0].mediaType)
                //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[0].width, imgSizeData[listedContents.id - 1].components[0].height))
                setClickedIndexState(0)
            }
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
                loading="lazy"
                sizes="(max-width: 767px) 90vw"
            /></div>
    } else {
        modalContents = modalContents = <div className={utilStyles.modalContentsTouchSwipingWrapper}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => onTouchEnd(clickedIndexState, listedContents)}>
            <ModalVideo
                modalImageState={modalImageState}
                isVertical={isVertical}
            ></ModalVideo></div>
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
        <div>
            <div className={utilStyles.gradationWhiteLeftSide}></div>
            <div className={utilStyles.gradationWhiteRightSide}></div>
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
            slidesPerView={'auto'}
            centeredSlides={false}
            initialSlide={0}
            loop={true}
            freeMode={false}
            allowTouchMove={true}
            onSwiper={setSwiper}
            lazy={{
                enabled: true,
                loadPrevNext: true,
                loadPrevNextAmount: loadPrevNextAmount,
                loadOnTransitionStart: true,
            }}
            onSlideChangeTransitionEnd={(swiper) => {
                swiper.update()
            }}
        >
    
        {listedContents.map((contents, index) => {
            return(
                <SwiperSlide className={`${utilStyles.brandArtistResponsiveWidth} ${utilStyles.swiperFlexibleSize}`} key={index} onClick={() => {
                    //handleChange(contents.id)
                    setContactModalShowState(true)
                    setModalImageState(contents.displayPictureUrl)
                    setClickedIndexState(swiper.clickedIndex % contentsLength)
                    setModalMediaTypeState(contents.mediaType)
                }}>
                    <ContentsBlock 
                        index={index} 
                        contentState={index} 
                        handleSavingData={handleSavingData} 
                        handleIsVertical={handleIsVertical} 
                        contentsType={contents.mediaType}  
                        contentsLabel="" 
                        contentsImgUrl={contents.displayPictureUrl} 
                        contentsDescription=""
                        contentsPreviewVideoUrl={contents.contentsPreviewVideoUrl}
                        contentsPreviewPhotoUrl={contents.contentsPreviewPhotoUrl}
                    />
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
                        if (clickedIndexState > 0) {
                            setModalImageState(listedContents[clickedIndexState - 1].displayPictureUrl)
                            setModalMediaTypeState(listedContents[clickedIndexState - 1].mediaType)
                            //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState - 1].height))
                            setClickedIndexState(clickedIndexState - 1)
                        } else if (clickedIndexState === 0){
                            setModalImageState(listedContents[contentsLength - 1].displayPictureUrl)
                            setModalMediaTypeState(listedContents[contentsLength - 1].mediaType)
                            //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[contentsLength - 1].width, imgSizeData[listedContents.id - 1].components[contentsLength - 1].height))
                            setClickedIndexState(contentsLength - 1)
                        }
                    }}>
                        <div  className={`${utilStyles.swiperModalButtonPrev}`}>
                            <div className={utilStyles.swiperButtonPrevArrow}></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref={artistModalNavInViewRef} className={`${utilStyles.swiperModalButtonNextWrapper} ${artistModalNavIsVisible ? utilStyles.fadeOutAnimation : ""}`} onClick={() => {
                        if (clickedIndexState < contentsLength - 1){
                            setModalImageState(listedContents[clickedIndexState + 1].displayPictureUrl)
                            setModalMediaTypeState(listedContents[clickedIndexState + 1].mediaType)
                            //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].width, imgSizeData[listedContents.id - 1].components[clickedIndexState + 1].height))
                            setClickedIndexState(clickedIndexState + 1)
                        } else if (clickedIndexState === contentsLength - 1){
                            setModalImageState(listedContents[0].displayPictureUrl)
                            setModalMediaTypeState(listedContents[0].mediaType)
                            //handleIsVertical(judgeAspect(imgSizeData[listedContents.id - 1].components[0].width, imgSizeData[listedContents.id - 1].components[0].height))
                            setClickedIndexState(0)
                            //swiper.slideTo(0) 
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