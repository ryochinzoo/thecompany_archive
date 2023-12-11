import {useState, useRef, useEffect} from 'react'
import { useMediaQuery } from 'react-responsive'
import DancerStyle from '../../styles/dancerProfile.module.css'
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, Controller } from "swiper"
import { useInView } from "react-intersection-observer"
import { useModalShowContext } from "../../context/modalContext"
import Modal from 'react-modal'
import Image from 'next/image'
import update from 'immutability-helper'
import dynamic from 'next/dynamic'

const WorksPreviewOnSwipe = dynamic(() => import('../atoms/worksPreviewOnSwipe'))
const VerticalList = dynamic(() => import('../molecules/verticalList'))
const DancerListBlock = dynamic(() => import('../atoms/dancerListBlock'))
const WorkThumbSmall = dynamic(() => import('../atoms/workThumbSmall'))
const FormButton = dynamic(() => import('../atoms/formButton'))
const DancerFullSlideContents = dynamic(() => import('../atoms/dancerContentsFullSlide'))
const FormInModal = dynamic(() => import('../molecules/formInModal'))
const HorizontalList = dynamic(() => import('../molecules/horizontalList'))

export default function DancerProfile ({ strapiURL, dancers, handleScrollLock, mailInfo }) {
    const isActiveInit = setDancerSliderArray(dancers.length)
    const [centeredSlideNumber, setCenteredSlideNumber] = useState(Math.floor(dancers.length/2))
    const [swiper, setSwiper] = useState()
    const [subSwiper, setSubSwiper] = useState()
    const [isSlideWide, setIsSlideWide] = useState(false)
    const prevRef = useRef()
    const nextRef = useRef()
    const mainSwiperRef = useRef()
    const observeRef = useRef()
    const subSwiperHoverRef = useRef()
    /*
    const listedAgency = useRef()
    const [slideChangeTriggered, setSlideChangeTriggered] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const thumbSwiperPhotos = thumbs(strapiURL, dancers)
    */
    const [subSwiping, setSubSwiping] = useState(true)
    const [isClicked, setIsClicked] = useState(false)
    const [isVerticalWorkClicked, setIsVerticalWorkClicked] = useState(false)
    const [slidesToShowState, setSlidesToShowState] = useState(3)
    const [subSlidesToShowState, setSubSSlidesToShowState] = useState(21)
    const [centeredSlidesState, setCenteredSlidesState] = useState(true)
    const { ref: navInViewRef, inView: navIsVisible } = useInView({threshold: 0.8, triggerOnce: true, })
    const [ modalImageState, setModalImageState ] = useState("/images/aboutPhotoExample.jpg")
    const [ modalTypeState, setModalTypeState ] = useState("Image")
    const [ gradationWidth, setGradationWidth ] = useState("1200px")
    const [ clickedIndexState, setClickedIndexState] = useState(0)
    const { contactModalShowState, setContactModalShowState } = useModalShowContext()
    const [ dancerListModalShowState, setDancerListModalShowState ] = useState(false)
    const { ref: modalNavInViewRef, inView: modalNavIsVisible } = useInView()
    const [ workIsActive, setWorkIsActive ] = useState(isActiveInit)
    const [ formModalShowState, setFormModalShowState ] = useState(false)
    const [ currentSlide, setCurrentSlide ] = useState(centeredSlideNumber)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const dancerList = listingDancers(strapiURL, dancers)
    const summerizedItems = summerizingItems(strapiURL, dancers)
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
    
    const [currentDancerState, setCurrentDancerState] = useState({
        dancerId: 0,
        dancerWorks: summerizedItems[0].dancerWorks,
        selectedWorkIndex: 0,
    })
    const handleChange = (newValue) => {
        const newArray = update(workIsActive, {[newValue.dancer]: {work: {$set: newValue.work}}})
        setWorkIsActive(newArray)
    }
    const verticalWorkClickedChange = (newValue) => {
        setIsVerticalWorkClicked(newValue)
    }
    const modalChange = (url, type, index) => {
        setModalImageState(url)
        setModalTypeState(type)
        setClickedIndexState(index)
    }
    const changeSubSlide = (index) => {
        if (isClicked && (isMobile || isMobileSmall)) {
            mainSwiperRef.current.swiper.slideTo(index, 1200)
        } else {
            subSwiperHoverRef.current.swiper.slideTo(index, 1200)
            //mainSwiperRef.current.swiper.slideTo(index, 1200)
        }
    }
    const hoverAnimation = (index) => {
        const length = subSwiperHoverRef.current.swiper.slides.length
        if (index !== 0) {        
            subSwiperHoverRef.current.swiper.slides[index - 1].children[0].classList.add(`${DancerStyle.hoveredActiveNeighbour}`)
        }
        if (index < length - 1) {
            subSwiperHoverRef.current.swiper.slides[index + 1].children[0].classList.add(`${DancerStyle.hoveredActiveNeighbour}`)
        }
        subSwiperHoverRef.current.swiper.slides[index].children[0].classList.add(`${DancerStyle.hoveredActive}`)
    }

    const mouseOutAnimation = () => {
        subSwiperHoverRef.current.swiper.slides.map((slide, i) => {
            slide.children[0].classList.remove(`${DancerStyle.hoveredActive}`)
            slide.children[0].classList.remove(`${DancerStyle.hoveredActiveNeighbour}`)
        })
    }

    const changeMainSlide = (index) => {
        if (isClicked && (isMobile || isMobileSmall)) {
            mainSwiperRef.current.swiper.slideTo(index, 1200)
        } else {
            mainSwiperRef.current.swiper.slideTo(index, 1200)
        }
    }
    const modalShowStateHandle = (newValue) => {
        setFormModalShowState(newValue)
    }
    /*
    const lbtoBr = (txt, dancerIndex) => {
        let txtArray

        if(txt) {
            txtArray = txt.split(/(\n)/g).map((t, i) => (t==='\n')? {key: dancerIndex+"-"+i, t: <br/>} : {key: dancerIndex+"-"+i, t: t})
        } else {
            txtArray = [{key: dancerIndex + "-0", t : "-"}]
        }
        
        return (
            <div>
                {txtArray.map((array) => (
                <span key={array.key}>{array.t}</span>
            ))}
            </div>
        )
    }
    */
    useEffect(() => {
        const slides = document.querySelectorAll('.dancer-slide')
        if (isDesktopLarge) {
            setSubSSlidesToShowState(21)
            setCenteredSlidesState(false)
            setGradationWidth("1200px")
        } else if (isDesktop) {
            setSubSSlidesToShowState(21)
            setCenteredSlidesState(false)
            setGradationWidth("100%")
        } else if (isTablet) {
            setSubSSlidesToShowState(9.5)
            setCenteredSlidesState(true)
            setGradationWidth("100%")
        } else if (isMobile) {
            setSubSSlidesToShowState(5.5)
            setCenteredSlidesState(true)
            setGradationWidth("100%")
        } else if (isMobileSmall) {
            setSubSSlidesToShowState(3.5)
            setCenteredSlidesState(true)
            setGradationWidth("100%")
        }
        if (isClicked) {
            Array.from(slides).map(slide => {
                slide.style.width = `100%`
                setSlidesToShowState(1)
                setIsSlideWide(true)
            })
        } else {
            Array.from(slides).map(slide => {
                if (isDesktopLarge) {
                    setSlidesToShowState(3)
                } else if (isDesktop) {
                    setSlidesToShowState(2.5)
                } else if (isTablet) {
                    setSlidesToShowState(2.2)
                } else if (isMobile) {
                    setSlidesToShowState(1.8)
                } else if (isMobileSmall) {
                    setSlidesToShowState(1.3)
                }
                setIsSlideWide(false)
            })
        }

        
    }, [isClicked, isDesktopLarge, isDesktop, isTablet, isMobile, isMobileSmall])
    const minSwipeDistance = 50 

    const onTouchStart = (e) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = (clickedIndexState, currentDancerState) => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isRightSwipe){
            if (clickedIndexState > 0) {
                setModalImageState(currentDancerState.dancerWorks[clickedIndexState - 1].contents)
                setModalTypeState(currentDancerState.dancerWorks[clickedIndexState - 1].typeOfMedia)
                setClickedIndexState(clickedIndexState - 1)
                handleChange({dancer: currentDancerState.dancerId, work: clickedIndexState - 1})
            } else if (clickedIndexState === 0){
                setModalImageState(currentDancerState.dancerWorks[currentDancerState.dancerWorks.length - 1].contents)
                setModalTypeState(currentDancerState.dancerWorks[currentDancerState.dancerWorks.length - 1].typeOfMedia)
                setClickedIndexState(currentDancerState.dancerWorks.length - 1)
                handleChange({dancer: currentDancerState.dancerId, work: currentDancerState.dancerWorks.length - 1})
            }
        } else if (isLeftSwipe) {
            if (clickedIndexState < currentDancerState.dancerWorks.length - 1){
                setModalImageState(currentDancerState.dancerWorks[clickedIndexState + 1].contents)
                setModalTypeState(currentDancerState.dancerWorks[clickedIndexState + 1].typeOfMedia)
                setClickedIndexState(clickedIndexState + 1)
                handleChange({dancer: currentDancerState.dancerId, work: clickedIndexState + 1})
            } else if (clickedIndexState === currentDancerState.dancerWorks.length - 1){
                setModalImageState(currentDancerState.dancerWorks[0].contents)
                setModalTypeState(currentDancerState.dancerWorks[0].typeOfMedia)
                setClickedIndexState(0)
                handleChange({dancer: currentDancerState.dancerId, work: 0})
            }
        } 
    }

    function setClicked(bool) {
        setIsClicked(bool)
    }

    function showList() {
        setDancerListModalShowState(true)
        handleScrollLock(true)
    }

    function showPreview(dancerWorks, currentWorkId, dancerId) {
        setCurrentDancerState({
            dancerId: dancerId,
            dancerWorks: dancerWorks,
            selectedWorkIndex: currentWorkId,
        })
        setContactModalShowState(true)        
        setModalImageState(dancerWorks[currentWorkId].contents)
        setModalTypeState(dancerWorks[currentWorkId].typeOfMedia)
    }
    function handleChangingSlide(index) {
        if (isClicked && (isMobile || isMobileSmall)) {
        } else {
            subSwiperHoverRef.current?.swiper.slideTo(index)
            //mainSwiperRef.current?.swiper.slideTo(index)
        }
    }
    function handleSlideNumber(number) {
        setCenteredSlideNumber(number)
    }

    return (
        <>  
            <div className={`${DancerStyle.headerWrapper} ${isClicked ? DancerStyle.isClicked : ""}`}>
                <div className={`${DancerStyle.flexWrapperDancerHeader} ${isClicked ? DancerStyle.isClicked : ""}`}>
                    <span className={`${DancerStyle.dancerSlideHeadline}`}><b>AGENCY</b></span>
                    <div className={DancerStyle.viewAllOrSwipeWrapper}>
                        <span className={`${DancerStyle.viewAllArea} `}
                            onClick={() => {
                                showList()
                                setClicked(true) 
                                setSubSwiping(true)
                            }}
                        >View all</span>
                        <span className={`${DancerStyle.OrSwipe} ${isClicked ? "" : DancerStyle.isClicked}`}>Or swipe</span>
                    </div>
                    <div className={DancerStyle.backToDancersWrapper}
                        onClick={() => {
                                setIsClicked(false)
                                setSubSwiping(false)
                                handleChange({dancer: currentDancerState.dancerId, work: 0})
                                verticalWorkClickedChange(false)
                                if (isMobile || isMobileSmall) {
                                    handleSlideNumber(currentSlide)
                                }
                            }}>
                        <span className={DancerStyle.backToDancersArrow}
                            style={{opacity : isClicked ?  1 : 0, display: isClicked ? "inline" : "none"}}></span>
                    </div>
                </div>
                <div className={`${isClicked ? DancerStyle.flexWrapperDancerHeaderOpened : DancerStyle.flexWrapperDancerHeaderClosed}`}>
                    <div className={DancerStyle.backToDancersMobile}
                    style={{opacity : isClicked ?  1 : 0, display: isClicked ? "inline" : "none"}}
                    onClick={() => {
                        setIsClicked(false)
                        setSubSwiping(false)
                        handleChange({dancer: currentDancerState.dancerId, work: 0})
                        verticalWorkClickedChange(false)
                        if (isMobile || isMobileSmall) {
                            handleSlideNumber(currentSlide)
                        }
                    }}>Back</div>
                    
                </div> 
            </div>
            <div className={isClicked ? DancerStyle.sliderWrapperOpened : DancerStyle.sliderWrapper}>
                <div className={`${isClicked ? DancerStyle.swiperInnerWrapperClicked : DancerStyle.swiperInnerWrapper}`}>
                <div style={{width: gradationWidth, margin: "0 auto"}}>
                    <div className={`${isSlideWide ? "" : DancerStyle.gradationGrayLeftSide}`}></div>
                    <div className={`${isSlideWide ? "" : DancerStyle.gradationGrayRightSide}`}></div>
                </div>
                {isClicked && (isMobile || isMobileSmall)  ? "" :
                    <div onClick={()=>{
                            swiper.slidePrev()
                        }}
                    >
                        <div ref={navInViewRef}
                            className={`${isClicked ? DancerStyle.swiperButtonDancerPrevWrapperOpened : DancerStyle.swiperButtonDancerPrevWrapper}
                            
                            ${navIsVisible ? 
                                DancerStyle.fadeOutAnimation : ""}`} >
                            <div className={`${DancerStyle.swiperButtonDancerPrev}`} >
                                <div className={DancerStyle.swiperButtonPrevArrow}></div>
                            </div>
                        </div>
                    </div>
                }
                    <Swiper
                        ref={mainSwiperRef}
                        modules={[Navigation, Thumbs, Controller]}
                        slidesPerView={slidesToShowState}
                        spaceBetween={isMobile || isMobileSmall || isTablet ? 10 : 18}
                        loop={false}
                        onSwiper={setSwiper}
                        centeredSlides={true}
                        initialSlide={centeredSlideNumber}
                        slideClass={'dancer-slide'}
                        onSlideChange={(swiper) => {
                            handleChangingSlide(swiper.activeIndex)
                            setCurrentSlide(swiper.activeIndex)
                        }}
                    >
                        { summerizedItems.map((dancer, dancerIndex) => {
                            return (
                            <SwiperSlide className={`${DancerStyle.swipeWrapper} ${isClicked ? "" : DancerStyle.swipeNotClickedWrapper} dancer-slide`} key={dancerIndex}>
                                {({ isActive, isPrev, isNext }) => (
                                    <div className={`${isActive ? DancerStyle.swiperSlideActive : ""} ${isPrev || isNext ? DancerStyle.swiperSlidePrevNext : ""}`}>
                                        <div className={`${DancerStyle.slide}`}>
                                            <div className={`${isClicked ? DancerStyle.slideContentsClicked : DancerStyle.slideContents} `}>
                                                <div className={`${isClicked ? DancerStyle.flexWrapperClicked : DancerStyle.dancerPhotoWrapper}`}>

                                                    <div className={`${isClicked ? DancerStyle.flexWrapperForMobile : ""}`}>
                                                    {isClicked
                                                            ? <div className={`${DancerStyle.verticalWorksArea}`}>
                                                                <div className={`${isMobile || isMobileSmall || isTablet ? DancerStyle.swipeForTabletAndMobile : DancerStyle.displayNone}`}>
                                                                    <div className={`${DancerStyle.swipeForTabletAndMobileLabel}`}>Swipe</div>
                                                                    <div className={`${DancerStyle.simpleArrowPrev} swiper-nav-prev`}
                                                                        onClick={()=>{
                                                                            swiper.slidePrev()
                                                                        }}
                                                                    ></div>
                                                                    <div className={`${DancerStyle.simpleArrowNext} swiper-nav-next`}
                                                                        onClick={() => {
                                                                            swiper.slideNext()
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <div className={`${DancerStyle.flexAreaWorks} ${DancerStyle.positionRelative} ${DancerStyle.fadeInAnimation}`}
                                                                onMouseEnter={() => {
                                                                    handleScrollLock(true)
                                                                }}
                                                                onTouchMove={() => {
                                                                    handleScrollLock(true)
                                                                }}
                                                                onMouseLeave={() => {
                                                                    handleScrollLock(false)
                                                                }}
                                                                onTouchEnd={() => {
                                                                    handleScrollLock(false)
                                                                }}>
                                                                    <VerticalList>
                                                                        {dancer.dancerWorks.map((work, workIndex) => {
                                                                            if (workIsActive[dancerIndex].work === workIndex) {
                                                                                return (
                                                                                    <WorkThumbSmall 
                                                                                        verticalWorkClickedChange={verticalWorkClickedChange}
                                                                                        handleChange={handleChange} 
                                                                                        modalChange={modalChange}
                                                                                        keyIndex={{dancer: dancerIndex, work: workIndex}} 
                                                                                        workIsActive={true} 
                                                                                        key={workIndex} 
                                                                                        type={work.typeOfMedia} 
                                                                                        work={work.contents}
                                                                                        isHorizontal={false}
                                                                                    >
                                                                                    </WorkThumbSmall>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <WorkThumbSmall 
                                                                                        verticalWorkClickedChange={verticalWorkClickedChange}
                                                                                        handleChange={handleChange} 
                                                                                        modalChange={modalChange}
                                                                                        keyIndex={{dancer: dancerIndex, work: workIndex}} 
                                                                                        workIsActive={false}  
                                                                                        key={workIndex} 
                                                                                        type={work.typeOfMedia} 
                                                                                        work={work.contents}
                                                                                        isHorizontal={false}>
                                                                                    </WorkThumbSmall>
                                                                                )
                                                                            }
                                                                        })}
                                                                    </VerticalList>
                                                                </div>
                                                            </div>
                                                            : ""
                                                        }
                                                        <div className={`${isClicked ? DancerStyle.flexAreaPhoto : DancerStyle.initArea}  ${isClicked ? DancerStyle.fadeInAnimationCenterPhoto : DancerStyle.fadeInAnimation }`}>
                                                            <div className={`${DancerStyle.centerPhoto}`} style={{cursor: "pointer" }} onClick={()=>{
                                                                    {isClicked ? "" : 
                                                                        setClicked(true) 
                                                                        setCurrentDancerState(prev => ({
                                                                            ...prev,
                                                                            dancerId: dancerIndex,
                                                                        }))
                                                                        setSubSwiping(true)
                                                                    }
                                                                    {isClicked ? showPreview(dancer.dancerWorks, workIsActive[dancerIndex].work, dancerIndex) : ""}
                                                                }}>
                                                                
                                                                <div className={`${isClicked ? DancerStyle.imageTransition : ""} `}>
                                                                    <div style={{position: "relative"}}>
                                                                        <div className={`${DancerStyle.basedCenterPhotoSize} ${isClicked ? DancerStyle.isClicked : ""}`}></div>
                                                                        
                                                                        <WorksPreviewOnSwipe 
                                                                            isVerticalClicked={isVerticalWorkClicked}
                                                                            init={dancer.mainPhoto} 
                                                                            selectedWork={workIsActive[dancerIndex].work} 
                                                                            type={dancer.dancerWorks[workIsActive[dancerIndex].work].typeOfMedia}
                                                                            media={dancer.dancerWorks[workIsActive[dancerIndex].work].contents}
                                                                        ></WorksPreviewOnSwipe>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isClicked
                                                        ? <div className={`${DancerStyle.flexArea} ${DancerStyle.flexWrapper}  ${DancerStyle.fadeInAnimation}`}>
                                                            <div className={`${DancerStyle.flexBottom} ${DancerStyle.marginAlignTop}`}>
                                                                <div className={`${DancerStyle.dancerInfoParagraph} ${DancerStyle.flexWrapper} ${DancerStyle.flexCentering}`}>
                                                                    <div className={`${DancerStyle.dancerNameContentsWrapper} ${DancerStyle.dancerInfoList}`}>
                                                                        <div className={DancerStyle.dancerNameInContents}>{dancer.name}</div>
                                                                        <div className={DancerStyle.dancerTitle}>{dancer.memberedSince}</div>
                                                                    </div>
                                                                </div>
                                                                <div className={DancerStyle.dancerInfoWrapper}>
                                                                    <div className={`${DancerStyle.dancerInfoParagraph} ${DancerStyle.dancerInfo}`}>
                                                                        <div className={DancerStyle.dancerInfoList}><div className={DancerStyle.dancerInfoBold}>Style:</div> {dancer.skillsStyles}</div>
                                                                        <div className={DancerStyle.dancerInfoList}><div className={DancerStyle.dancerInfoBold}>Height:</div> {dancer.height}</div>
                                                                        <div className={DancerStyle.dancerInfoList}><div className={DancerStyle.dancerInfoBold}>Interests:</div> {dancer.interests}</div>
                                                                    </div>
                                                                    {isClicked && (isMobile || isMobileSmall)  ? 
                                                                        
                                                                        <div onClick={() => {
                                                                            setFormModalShowState(true)
                                                                        }}>
                                                                            <FormButton></FormButton>
                                                                        </div>
                                                                    
                                                                    : "" }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                        )})}
                    </Swiper>
                    {isClicked && (isMobile || isMobileSmall)  ? "" :
                    <div
                        onClick={()=>{
                            swiper.slideNext()
                        }}
                    >
                        <div ref={observeRef} style={{pointerEvents: "auto" }} 
                            className={`${DancerStyle.displayBlock} 
                            ${DancerStyle.swiperButtonDancerNextWrapper} 
                            ${ navIsVisible ? DancerStyle.fadeOutAnimation : ""}`} >
                            <div 
                            className={`${DancerStyle.swiperButtonDancerNext}`} 
                             >
                                <div className={`${DancerStyle.swiperButtonNextArrow}`}></div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                <div className={DancerStyle.subSwiperForMobile}>
                <Swiper
                    ref={subSwiperHoverRef}
                    modules={[Thumbs]}
                    loop={false}
                    noSwiping={false}
                    noSwipingClass={'dancer-no-swipe'}
                    onSwiper={setSubSwiper}
                    slidesPerView={subSlidesToShowState}
                    centeredSlides={centeredSlidesState}
                    initialSlide={centeredSlideNumber}
                    slideClass={'dancer-sub-slide'}
                    slideToClickedSlide={false}
                    freeMode={true}
                    onSlideChange={(swiper) => {
                        handleChangingSlide(swiper.activeIndex)
                    }}
                >
                    { summerizedItems.map((dancer, dancerIndex) => {
                        return (
                        
                        <SwiperSlide 
                            className={`${DancerStyle.swipeWrapper} dancer-sub-slide dancer-no-swipe`} 
                            key={dancerIndex}
                            onMouseOver={()=>{
                                if (isTablet) {
                                    changeSubSlide(dancerIndex)
                                } else {
                                    hoverAnimation(dancerIndex)
                                }
                            }}
                            onMouseLeave={() => {
                                if (!isTablet) {
                                    mouseOutAnimation()
                                }
                            }}
                            onClick={()=>{
                                changeMainSlide(dancerIndex)
                                //setClicked(true)
                            }}
                        >
                            {({ isActive, isPrev, isNext }) => (
                                <div style={{height:"100%"}} className={`${isTablet && isActive ? DancerStyle.subSlideActive : ""} ${isTablet && (isPrev || isNext) ? DancerStyle.subSlidePrevNext : DancerStyle.subSlideContents} `}>
                                    <div className={`${DancerStyle.slide} ${DancerStyle.swipeSubWrapper}`}>
                                            <div className={`${DancerStyle.flexWrapper}`}>    
                                               
                                                <Image
                                                    src={dancer.thumbPhoto}
                                                    alt={dancer.dancerWorks[workIsActive[dancerIndex].work].typeOfMedia}
                                                    width={150}
                                                    height={150}
                                                    objectFit='cover'
                                                    loading='lazy'
                                                />            
                                                
                                            </div>
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    )})}
                </Swiper>
                </div>
            </div>
            <Modal 
                style={{overlay:{zIndex:10000, backgroundColor: "#DDE0E5", overflowY: "scroll", position: "fixed"}, contents:{height: "100vh"}}} 
                className={[DancerStyle.contentsModal, DancerStyle.otherOptionModal, "dancerListModal"].join(" ")} 
                isOpen={dancerListModalShowState} 
                preventScroll={false}
                ariaHideApp={false}
                >
                    <div className={DancerStyle.modalContentsWrapper}>
                    <div className={DancerStyle.modalContentsWithBackgroundImage}>
                        <div className={DancerStyle.modalCloseButton} onClick={() => {
                            setDancerListModalShowState(false)
                            handleScrollLock(false)
                            //setClicked(false)
                        }}></div>
                    </div>
                    <div className={DancerStyle.dancerListWrapper}>
                        { dancerList.map(dancer => {
                            return(
                                
                                <div
                                    className={DancerStyle.dancerListPhotoCard}
                                    style={{position: "relative"}}
                                    key={dancer.id}
                                    onClick={() => {
                                        setDancerListModalShowState(false)//setTimeout(() => setDancerListModalShowState(false), 1500)
                                        handleScrollLock(false)
                                        changeSubSlide(dancer.id - 1)//setTimeout(() => changeSubSlide(dancer.id - 1), 1500)
                                        changeMainSlide(dancer.id - 1)
                                    }}
                                >
                                    <DancerListBlock 
                                        photo={dancer.photo}
                                        name={dancer.name}
                                        index={dancer.id}
                                        key={dancer.id}>
                                    </DancerListBlock>
                                </div>
                                
                            )
                        }) }
                    </div>
                    </div>
            </Modal>
            <Modal 
                style={{overlay:{zIndex:10000, backgroundColor: "#DDE0E5"}, contents:{}}} 
                className={[DancerStyle.contentsModal, DancerStyle.otherOptionModal].join(" ")} 
                isOpen={contactModalShowState}
                ariaHideApp={false}>
                <div ref={prevRef} >
                    <div ref={modalNavInViewRef} className={`${DancerStyle.swiperModalButtonPrevWrapper} ${modalNavIsVisible ? DancerStyle.fadeOutAnimation : ""}`} onClick={() => {
                        if (clickedIndexState > 0) {
                            setModalImageState(currentDancerState.dancerWorks[clickedIndexState - 1].contents)
                            setModalTypeState(currentDancerState.dancerWorks[clickedIndexState - 1].typeOfMedia)
                            setClickedIndexState(clickedIndexState - 1)
                            handleChange({dancer: currentDancerState.dancerId, work: clickedIndexState - 1})
                        } else if (clickedIndexState === 0){
                            setModalImageState(currentDancerState.dancerWorks[currentDancerState.dancerWorks.length - 1].contents)
                            setModalTypeState(currentDancerState.dancerWorks[currentDancerState.dancerWorks.length - 1].typeOfMedia)
                            setClickedIndexState(currentDancerState.dancerWorks.length - 1)
                            handleChange({dancer: currentDancerState.dancerId, work: currentDancerState.dancerWorks.length - 1})
                        }
                    }}>
                        <div className={`${DancerStyle.swiperModalButtonPrev}`}>
                            <div className={DancerStyle.swiperButtonPrevArrow}></div>
                        </div>
                    </div>
                </div>
                <div ref={nextRef}>
                    <div ref={modalNavInViewRef} className={`${DancerStyle.swiperModalButtonNextWrapper}`} onClick={() => {
                        if (clickedIndexState < currentDancerState.dancerWorks.length - 1){
                            setModalImageState(currentDancerState.dancerWorks[clickedIndexState + 1].contents)
                            setModalTypeState(currentDancerState.dancerWorks[clickedIndexState + 1].typeOfMedia)
                            setClickedIndexState(clickedIndexState + 1)
                            handleChange({dancer: currentDancerState.dancerId, work: clickedIndexState + 1})
                        } else if (clickedIndexState === currentDancerState.dancerWorks.length - 1){
                            setModalImageState(currentDancerState.dancerWorks[0].contents)
                            setModalTypeState(currentDancerState.dancerWorks[0].typeOfMedia)
                            setClickedIndexState(0)
                            handleChange({dancer: currentDancerState.dancerId, work: 0})
                        }
                    }}>
                        <div className={`${DancerStyle.swiperModalButtonNext}`}>
                            <div className={DancerStyle.swiperButtonNextArrow}></div>
                        </div>
                    </div>
                </div>

                <div className={DancerStyle.modalContentsWithBackgroundImage}>
                    <div className={`${DancerStyle.modalCloseButton}`} onClick={() => {
                        setContactModalShowState(false)
                    }}></div>
                </div>
                <div className={DancerStyle.horizontalListModalWrapper}>
                        <HorizontalList>
                            {currentDancerState.dancerWorks.map((work, modalWorkIndex) => {
                                if (workIsActive[currentDancerState.dancerId].work === modalWorkIndex) {
                                    return(
                                        <WorkThumbSmall 
                                            verticalWorkClickedChange={verticalWorkClickedChange}
                                            handleChange={handleChange}
                                            modalChange={modalChange}
                                            keyIndex={{dancer: currentDancerState.dancerId, work: modalWorkIndex}} 
                                            workIsActive={true} 
                                            key={modalWorkIndex} 
                                            type={work.typeOfMedia} 
                                            work={work.contents}
                                            isHorizontal={true}
                                            onClick={() => {
                                                setClickedIndexState(modalWorkIndex)
                                            }}
                                        >
                                        </WorkThumbSmall>
                                    )
                                } else {
                                    return(
                                        <WorkThumbSmall 
                                            verticalWorkClickedChange={verticalWorkClickedChange}
                                            handleChange={handleChange} 
                                            modalChange={modalChange}
                                            keyIndex={{dancer: currentDancerState.dancerId, work: modalWorkIndex}} 
                                            workIsActive={false} 
                                            key={modalWorkIndex} 
                                            type={work.typeOfMedia} 
                                            work={work.contents}
                                            isHorizontal={true}
                                            onClick={() => {
                                                setClickedIndexState(modalWorkIndex)
                                            }}
                                        >
                                        </WorkThumbSmall>
                                    )
                                }
                            })}
                        </HorizontalList>
                    </div>
                    <div
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={() => onTouchEnd(clickedIndexState, currentDancerState)}>
                        <DancerFullSlideContents 
                            mediaType={modalTypeState}
                            mediaURL={modalImageState}>
                        </DancerFullSlideContents>
                    </div>
            </Modal>
            <Modal
                style={{overlay:{zIndex:10000, backgroundColor: "#FA5253", position: "fixed"}, contents:{}}} 
                className={`${DancerStyle.formTopStyle}`}
                isOpen={formModalShowState}
                ariaHideApp={false}
            >
                <FormInModal
                    modalShowStateHandle = {modalShowStateHandle}
                    mailInfo={mailInfo}
                ></FormInModal>
            </Modal>
        </>
    )
}

export function summerizingItems(strapiURL, dancers) {
    return dancers.map((dancer) => {
        const detail = dancer.attributes.DancerDetail
        const works = dancerWorks(strapiURL, dancer)
        return {
            id: dancer.id,
            name: dancer.attributes.DancerName,
            memberedSince: dancer.attributes.MemberedSince,
            mainPhoto: strapiURL + dancer.attributes.MainPhoto.data.attributes.url,
            thumbPhoto: strapiURL + dancer.attributes.ThumbPhoto.data.attributes.url,
            overview: detail.Overview,
            skillsStyles: detail.SkillsStyles,
            height: detail.Height,
            interests: detail.Interests,
            contactAddress: detail.ContactAddress,
            instagram: detail.InstagramID,
            dancerWorks: works,
        }
    })
}

export function thumbs(strapiURL, dancers) {
    return dancers.map(dancer => {
        return {
            id: dancer.id,
            thumbPhoto: strapiURL + dancer.attributes.ThumbPhoto.data.attributes.url,
        }
    })
}

export function listingDancers(strapiURL, dancers) {
    return dancers.map((dancer) => {
        return {
            id: dancer.id,
            name: dancer.attributes.DancerName,
            photo: strapiURL + dancer.attributes.PhotoForList.data.attributes.url,
        }
    })
}

export function dancerWorks(strapiURL, works) {
    return works?.attributes.DancerWorks.map(work => {
        const isYoutube = hasYoutubeLink(work.TypeOfMedia)
        return {
            typeOfMedia: work.TypeOfMedia,
            contents: work.Contents.data?.attributes ? strapiURL + work.Contents.data?.attributes.url : "",
        }
    })    
}

export function hasYoutubeLink(type) {
    if (type == "YoutubeLink") {
        return true
    } else {
        return false
    }
}

export function setDancerSliderArray(numOfDancers) {
    const dancerSliderArray = []
    for (let i = 0; i < numOfDancers; i++) {
        dancerSliderArray.push({dancer: i, work: 0})
    }
    return dancerSliderArray
}