import { useState, useRef } from 'react'
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import HappeningStyle from '../../styles/happenings.module.css'
import { useInView } from "react-intersection-observer"
import FullSlideContents from "../atoms/happeningContentsFullSlide"
import swiperNavUpdate from "../../styles/swiperNavigationUpdate.module.css"

export default function HappeningSwipe({ items }) {
    const [swiper, setSwiper] = useState()
    const prevRef = useRef()
    const nextRef = useRef()
    const observeRef = useRef()
    const { ref: happeningsModalNavInViewRef, inView: happeningsModalNavIsVisible } = useInView({threshold: 0.8, triggerOnce: true, })
    const margedItems = processingItems(items)
    /*
    useEffect(() => {
        if (swiper) {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
        } 
    }, [swiper])
    */
    return (
        <div className={HappeningStyle.swipeWrapper} ref={observeRef}>
            
            <Swiper
                modules={[Navigation]}
                slidesPerView={1}
                loop={false}
                autoHeight={true}
                onSwiper={setSwiper}
            >
                {margedItems.map((item) => {
                    if(item.length) {
                        return item.map((contents, index) => {
                            return (
                                <SwiperSlide className={swiperNavUpdate.swipeWrapper} key={index}>
                                    <FullSlideContents 
                                        mediaType={contents.mediaType} 
                                        mediaURL={contents.mediaURL ? contents.mediaURL : ""}
                                        vimeoURL={contents.vimeoURL ? contents.vimeoURL : ""}
                                    >
                                    </FullSlideContents>
                                </SwiperSlide>
                            )
                        })
                    } else {
                        return (
                            <SwiperSlide key={index}></SwiperSlide>
                        )
                    }
                })}
            </Swiper>
            
            
        </div>
    )
}

function processingItems(items) {
    if(items.length > 1) {
        const newItems = []
        items.map(item => {
            newItems.push(...item)
        })
        return newItems
    } else {
        return items
    }
}