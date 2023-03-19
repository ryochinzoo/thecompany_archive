import { useState, useRef, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import HappeningStyle from '../../styles/happenings.module.css'
import { useInView } from "react-intersection-observer"
import HappeningsEventContentsA from "../atoms/happeningEventContentsParts"
import swiperNavUpdate from "../../styles/swiperNavigationUpdate.module.css"

export default function HappeningEventSwipe({ items }) {
    const [swiper, setSwiper] = useState()
    const prevRef = useRef()
    const nextRef = useRef()
    const observeRef = useRef()
    const [ navArrowFadeOutState, setNavArrowFadeOutState ] = useState(false)
    const { ref: happeningsModalNavInViewRef, inView: happeningsModalNavIsVisible } = useInView()
    //const margedItems = processingItems(items)
    const isDesktopLarge = useMediaQuery({
        query: '(min-width: 1400px)'
    })
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px) and (max-width: 1399px)'
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
        if (swiper) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
        } 
    }, [swiper])
    
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
        } else {
            observer.unobserve(observeRef.current)
        }
    }, [observeRef, navArrowFadeOutState])
    return (
        <div className={HappeningStyle.happeningSwiper}>
            <div ref={prevRef} >
                <div ref={happeningsModalNavInViewRef} className={`${swiperNavUpdate.swiperButtonHappeningsPrevWrapper} 
                ${happeningsModalNavIsVisible ? swiperNavUpdate.fadeOutAnimation : ""}`} >
                    <div className={`${swiperNavUpdate.swiperButtonHappeningsPrev}`}>
                        <div className={swiperNavUpdate.swiperButtonPrevArrow}></div>
                    </div>
                </div>
            </div>
            <Swiper
                modules={[Navigation]}
                navigation = {{
                    prevEl: prevRef?.current,
                    nextEl: nextRef?.current
                }}
                spaceBetween={20}
                slidesPerView="auto"
                loop={true}
                initialSlide={1}
                onSwiper={setSwiper}
                centeredSlides={true}
                breakpoints={{
                    1024: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    0: {
                        slidesPerView: 1.5,
                    }
                }}
            >
                {items.map((item, index) => {
                    return(
                <SwiperSlide
                    key={index}
                >
                    <HappeningsEventContentsA item={item}></HappeningsEventContentsA>
                </SwiperSlide>
                    )
                })}
            </Swiper>
            <div ref={nextRef}>
                <div className={`${ swiperNavUpdate.swiperButtonHappeningsNextWrapper}`} ref={observeRef}  >
                <div className={`${swiperNavUpdate.swiperButtonHappeningsNext}`}>
                        <div className={swiperNavUpdate.swiperButtonNextArrow}></div>
                    </div>
                </div>  
            </div>   
        </div>
    )
}