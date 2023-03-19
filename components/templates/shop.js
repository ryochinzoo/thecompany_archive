import {useState, useRef, useEffect} from 'react'
import { useMediaQuery } from 'react-responsive'
import utilStyles from "../../styles/utils.module.css"
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, Controller } from "swiper"
import { useInView } from "react-intersection-observer"
import { useModalShowContext } from "../../context/modalContext"
import swiperNavUpdate from "../../styles/swiperNavigationUpdate.module.css"
import Modal from 'react-modal'
import Image from 'next/image'
import update from 'immutability-helper'
import ShopViewDetailsButton from '../atoms/shopViewDetailsButton'
import ShopBuyItNowButton from '../atoms/shopBuyItNowButton'
import { createStyles, Drawer, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import DrawerContents from '../molecules/drawerContents'
import parse from 'html-react-parser'
import ProductSelectList from '../atoms/productSelectList'
import QuantityInput from '../atoms/quantityInput'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import superjson from 'superjson'

const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        width: "40%",
      }
    },
    drawerBackground: {
      backgroundColor: "#1C1C1C",
        '&::before': {
            content: ''
        },
        '&::after' : {
            content: ''
        },
        '&::-webkit-scrollbar' : {
            width: '6px'
        },
        '&::-webkit-scrollbar-track' : {
            background: 'rgba(100, 100, 100, 0.8)',
            borderLeft: '4px solid rgba(120, 120, 120, 0.8)',
            borderRight: '4px solid rgba(120, 120, 120, 0.8)',
            borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb' : {
            background: 'rgba(32, 32, 32, 0.8)',
            borderRadius: '10px',
        }
    },
  }));

export default function Shop ({strapiURL, events, handleScrollLock}){
    const shopEvents = summerizedItems(events)
    const initEventList = initEventListArray(events.length, shopEvents)
    const [eventListState, setEventListState] = useState(initEventList)
    const titles = new Set(titleList(shopEvents))
    const shopSection = useRef()
    const shopSwiperRef = useRef()
    const classes = useStyles()
    const [generatedLink, setGeneratedLink] = useState("https://thecompanyberlin.com/cart/")
    const [selectedMenuItem, setSelectedMenuItem] = useState(0)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isEvents, setIsEvents] = useState(false)
    const [isMerch, setIsMerch] = useState(false)
    const [isDetails, setIsDetails] = useState(false)
    const [isEventClicked, setIsEventClicked] = useState(false)
    const [isLinkCreated, setIsLinkCreated] = useState(false)
    const [swiper, setSwiper] = useState()
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
    const [isReset, setIsReset] = useState(false)
    const [tempQuantity, setTempQuantity] = useState(0)
    const [shoppingBag, setShoppingBag] = useState([{
        variantId: 0,
        quantity: 0,
    }])

    const initShoppingBag = () => {
        setShoppingBag([{
            variantId: 0,
            quantity: 0,
        }])
    }
    
    const resetQuantity = (newValue) => {
        if(shoppingBag.some((v) => v.variantId === newValue.variantId)) {
            const quantityInBag = shoppingBag.find((el) => {
                return el.variantId === newValue.variantId
            })
            setTempQuantity(quantityInBag.quantity)
        } else {
            setTempQuantity(0)
        }
        setIsReset(true)
    }
    const onQuantityChange = (value) => {
        setTempQuantity(value)
    }
    const addToBag = (newValue, newQuantity) => {
        const result = shoppingBag.some((b) => b.variantId === newValue)
        if(result) {
            setShoppingBag((prevState) => 
            prevState.map((obj) => (obj.variantId === newValue ? {variantId: obj.variantId, quantity: newQuantity} : obj)))
        } else {
            const zero = shoppingBag.some((o) => o.variantId === 0)
            if(zero) {
                setShoppingBag([{variantId: newValue, quantity: newQuantity}])
            } else {
                setShoppingBag((prevState) => [...prevState, {variantId: newValue, quantity: newQuantity}])
            }
        }
    }
    const buyItNow = (newValue, newQuantity) => {
        const result = shoppingBag.some((b) => b.variantId === newValue)
        if(!result) {
            const zero = shoppingBag.some((o) => o.variantId === 0)
            if(zero) {
                setShoppingBag([{variantId: newValue, quantity: 1}])
            } else {
                setShoppingBag((prevState) => [...prevState, {variantId: newValue, quantity: 1}])
            }
        }
        //console.log(shoppingBag)
    }
    const onSelectChangeHandler = (id, newValue) => {
        setEventListState((prevState) =>
        prevState.map((obj) => 
        (obj.id === id ? {id: id, 
            imageIndex: newValue, 
            priceIndex: newValue, 
            vid: shopEvents[id].priceList[newValue].variantId,
            eventHasImage: hasImage(shopEvents, id, newValue)
        } : obj)))
    }
    const IsInBag = (id) => {
        return shoppingBag.some((b) => b.variantId === id)
    } 
    const [slidesToShowState, setSlidesToShowState] = useState(3)
    const observeRef = useRef()
    const centeredSlideNumber = Math.floor(shopEvents.length/2)
    const lbtoBr = (txt, dancerIndex) => {
        const txtArray = txt.split(/(\n)/g).map((t, i) => (t==='\n')? {key: dancerIndex+"-"+i, t: <br/>} : {key: dancerIndex+"-"+i, t: t})
        return (
            <div>
                {txtArray.map((array) => (
                <span key={array.key}>{array.t}</span>
            ))}
            </div>
        )
    }
    const { ref: navInViewRef, inView: navIsVisible } = useInView({threshold: 0.8, triggerOnce: true, })

    const setClicked = (newValue) => {
        setIsEventClicked(newValue)
    }
    const handleDrawerChange = (newValue) => {
        setIsDrawerOpen(newValue)
    }
    const changeSlide = (index) => {
        shopSwiperRef.current.swiper.slideTo(index, 1200)
    }
    useEffect(() => {
        setGeneratedLink(createLink(shoppingBag))
        const slides = document.querySelectorAll('.event-shop-slide')
        if (isEventClicked) {
            Array.from(slides).map(slide => {
                slide.style.width = `100%`
                setSlidesToShowState(1)
            })
        } else {
            Array.from(slides).map(slide => {
                if (isDesktopLarge) {
                    setSlidesToShowState(5)
                } else if (isDesktop) {
                    setSlidesToShowState(3.5)
                } else if (isTablet) {
                    setSlidesToShowState(2.5)
                } else if (isMobile) {
                    setSlidesToShowState(1.8)
                } else if (isMobileSmall) {
                    setSlidesToShowState(1.2)
                }
            })
        }
        if (isReset) {
            if(!tempQuantity) {
                setTempQuantity(0)
            }
            setTempQuantity(tempQuantity)
            setIsReset(false)
        }
    }, [isEventClicked, isDesktopLarge, isDesktop, isTablet, isMobile, isMobileSmall, shoppingBag, isReset, tempQuantity])
    
    return (
        <>  
            <Drawer
                sx={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(100, 100, 100, 0.8) rgba(120, 120, 120, 0.8)',
                }}
                classes={{ paper:classes.drawerBackground }}
                anchor='left'
                open={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false)
                    handleScrollLock(false)
                }}
            >
                <div className={utilStyles.drawerCloseButton} onClick={() => {
                    setIsDrawerOpen(false)
                    handleScrollLock(false)
                }}></div>
                <DrawerContents
                    titles = {titles}
                    handleDrawerChange = {handleDrawerChange}
                    setClicked = {setClicked}
                    changeSlide = {changeSlide}
                    isDetail = {setIsDetails}
                ></DrawerContents>
            </Drawer>
            <div className={`${utilStyles.shopBackground}`} ref={shopSection}>
                <div className={`${isDetails ? utilStyles.shopHeadDetail : utilStyles.shopHead}`}>
                    <div className={`${utilStyles.shopMenu}`}>
                        <div className={`${utilStyles.shopSlash}`}>
                            Shop /
                        </div>
                        <div className={`${utilStyles.shopMenuItemWrapper}`}>
                            <div className={`${utilStyles.shopMenuItem}`}>
                                
                                <div className={`${selectedMenuItem == 0 ? utilStyles.burgerMenuIcon: ""}`}
                                    onClick={()=>{
                                        setIsDrawerOpen(true)
                                        handleScrollLock(true)
                                    }}
                                ></div>
                                <div style={{textDecoration: selectedMenuItem == 0 ? "none" : "underline"}} className={`${selectedMenuItem == 0 ? utilStyles.selectedMenuItem: ""}`}
                                    onClick={()=>{
                                        setSelectedMenuItem(0)
                                    }}
                                >Events</div>
                            </div>
                            <div className={`${utilStyles.shopMenuItem}`}>
                            <div className={`${selectedMenuItem == 1 ? utilStyles.burgerMenuIcon: ""}`}
                                    onClick={()=>{
                                        //setSelectedMenuItem(1)
                                    }}
                                ></div>
                                <div style={{textDecoration: selectedMenuItem == 1 ? "none" : "underline"}}  className={`${selectedMenuItem == 1 ? utilStyles.selectedMenuItem: ""}`}
                                    onClick={()=>{
                                        //setSelectedMenuItem(1)
                                    }}
                                >Merch</div>
                            </div>
                        </div>
                    </div>
                    <div className={utilStyles.backToShopWrapper}>
                        <span className={utilStyles.backToSwiper}
                        style={{opacity : isEventClicked ?  1 : 0}}
                        onClick={() => {
                            setIsEventClicked(false)
                            setIsDetails(false)
                            handleScrollLock(false)
                            if (isMobile || isMobileSmall) {
                                enableBodyScroll(shopSection.current)
                            }
                        }}>Back</span>
                    </div>
                </div>
                <div className={utilStyles.sliderWrapper}>
                    <div onClick={()=>{
                            swiper.slidePrev()
                        }}
                    >
                        <div ref={navInViewRef} className={`${swiperNavUpdate.swiperButtonShopPrevWrapper}
                                            ${navIsVisible && (isDesktop || isDesktopLarge) ? 
                                            swiperNavUpdate.fadeOutAnimation : ""}`}>
                            <div className={`${swiperNavUpdate.swiperButtonShopPrev}`} >
                                <div className={swiperNavUpdate.swiperButtonPrevArrow}></div>
                            </div>
                        </div>
                    </div>
                    <Swiper
                        ref={shopSwiperRef}
                        modules={[Navigation, Thumbs, Controller]}
                        slidesPerView={slidesToShowState}
                        loop={false}
                        onSwiper={setSwiper}
                        spaceBetween={isMobile || isMobileSmall ? 10 : 0}
                        centeredSlides={true}
                        initialSlide={centeredSlideNumber}
                        autoHeight={false}
                        slideClass={'event-shop-slide'}
                        slideToClickedSlide={true}
                    >
                        { shopEvents.map((event, eventIndex) => {
                            return (
                                <SwiperSlide className={`event-shop-slide ${utilStyles.shopSwiperAdjustment}`} key={eventIndex}>
                                {({ isActive, isPrev, isNext }) => (
                                    <div>
                                        <div
                                            style={{display : isEventClicked ?  "none" : "block"}} 
                                            className={`${utilStyles.shopSwipeSlideWrapper} ${isActive || isPrev || isNext ? utilStyles.shopSlideOpacityFull : utilStyles.shopSlideOpacity}`}>
                                            <div className={`${utilStyles.goodsImageThumb}`}>
                                                <Image
                                                    src={event.thumb}
                                                    alt={"Thumbnail"}
                                                    layout="fill"
                                                    objectFit='cover'
                                                    priority
                                                />    
                                            </div>
                                            <div className={`${utilStyles.goodsTitleWrapper}`}>
                                                <div className={`${utilStyles.goodsTitle}`}>{parse(event.title)}</div>
                                            </div>
                                            <div className={`${utilStyles.shopBorder}`}></div>
                                            <div className={`${utilStyles.sellingDate}`}>{lbtoBr(event.date)}</div>
                                            <div className={`${utilStyles.sellingPrice}`}>
                                                { event.priceList.length > 1 ? 
                                                "ab " + priceLowest(event.priceList) + "€"
                                                :
                                                event.priceList[0].price + "€"
                                                }
                                            </div>
                                            <div className={`${utilStyles.buttonSet}`}>
                                                <div
                                                    onClick={() => {
                                                        setIsEventClicked(true)
                                                        setIsDetails(true)
                                                        handleScrollLock(true)
                                                        if (isMobile || isMobileSmall) {
                                                            disableBodyScroll(shopSection.current, {
                                                                //allowTouchMove: el,
                                                                reserveScrollBarGap: true,
                                                            })
                                                        }
                                                    }}
                                                >
                                                    <ShopViewDetailsButton
                                                        isDetails={isDetails}
                                                    ></ShopViewDetailsButton>
                                                </div>
                                                <div>
                                                <ShopBuyItNowButton
                                                        isDetails={isDetails}
                                                        link={IsInBag(event.priceList[0].variantId) ? 
                                                            generatedLink : 
                                                            IsInBag(0) ? createLink([{variantId: event.priceList[0].variantId, quantity: 1}]) : 
                                                            createLink([...shoppingBag, {variantId: event.priceList[0].variantId, quantity: 1}])}
                                                        initShoppingBag={initShoppingBag}
                                                ></ShopBuyItNowButton>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{display : isEventClicked ?  "block" : "none"}}
                                            className={`${utilStyles.shopSwipeDetailSlideWrapper}`}
                                        >
                                            <div className={`${utilStyles.shopSwipeDetailFlexWrapper}`}>
                                                <div className={`${utilStyles.shopDetailImage}`}>
                                                    <Image
                                                        src={eventListState[eventIndex].eventHasImage ? event.priceList[eventListState[eventIndex].imageIndex].imageUrl : event.mainImage}
                                                        alt={"Image In Detail"}
                                                        layout="fill"
                                                        objectFit='contain'
                                                        priority
                                                    /> 
                                                </div>
                                                <div className={`${utilStyles.overflowContentWrapper}`}>
                                                    <div className={`${utilStyles.shopDetailInfoWrapper}`}>
                                                        <div className={`${utilStyles.shopDetailInfo}`}
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
                                                            }}
                                                        >
                                                            <div>
                                                                <div className={`${utilStyles.goodsDetailTitle}`}>{parse(event.title)}</div>
                                                                <div className={`${utilStyles.shopEventArtist}`}>{event.other}</div>

                                                                <div className={`${utilStyles.sellingDetailDate}`}>{lbtoBr(event.date)}</div> 
                                                                <div className={`${utilStyles.shopEventGenre}`}></div>
                                                                <div className={`${utilStyles.shopDetailPrice}`}>
                                                                
                                                                    {event.priceList[eventListState[eventIndex].priceIndex].price + "€"}
                                                                </div>
                                                                <div>
                                                                    <ProductSelectList
                                                                        productId={eventIndex}
                                                                        mainTitle={event.plainTextTitle}
                                                                        productNames={event.priceList}
                                                                        shopEvents={shopEvents}
                                                                        hasImage={hasImage}
                                                                        onSelectChangeHandler={onSelectChangeHandler}
                                                                        resetQuantity={resetQuantity}
                                                                    ></ProductSelectList>
                                                                </div>
                                                                <div>
                                                                    <div>QUANTITY</div>
                                                                    <div>
                                                                        <QuantityInput
                                                                            shopEvents={shopEvents}
                                                                            productId={eventIndex}
                                                                            quantityInBag={tempQuantity}
                                                                            onQuantityChange={onQuantityChange}
                                                                            isReset={isReset}
                                                                        ></QuantityInput>
                                                                    </div>
                                                                </div>
                                                                <div className={`${utilStyles.buttonSetDetails}`}>
                                                                    <div
                                                                        onClick={() => {
                                                                            setIsEventClicked(true)
                                                                            addToBag(eventListState[eventIndex].vid, tempQuantity)
                                                                        }}
                                                                    >
                                                                        <ShopViewDetailsButton
                                                                            isDetails={isDetails}
                                                                        ></ShopViewDetailsButton>
                                                                    </div>
                                                                    <div>
                                                                        <ShopBuyItNowButton
                                                                            isDetails={isDetails}
                                                                            link={IsInBag(eventListState[eventIndex].vid) ? 
                                                                                generatedLink : 
                                                                                IsInBag(0) ? createLink([{variantId: eventListState[eventIndex].vid, quantity: tempQuantity}]) : 
                                                                                createLink([...shoppingBag, {variantId: eventListState[eventIndex].vid, quantity: tempQuantity}])}
                                                                            initShoppingBag={initShoppingBag}
                                                                        ></ShopBuyItNowButton>
                                                                    </div>
                                                                </div>
                                                                <div className={`${utilStyles.eventMoreInfo}`}>
                                                                    {parse(event.description)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                    <div
                        onClick={()=>{
                            swiper.slideNext()
                        }}
                    >
                    <div ref={observeRef} className={`${swiperNavUpdate.swiperButtonShopNextWrapper}
                        ${navIsVisible && (isDesktop || isDesktopLarge)  ? 
                        swiperNavUpdate.fadeOutAnimation : ""}`}>
                        <div className={`${ swiperNavUpdate.swiperButtonShopNext} `}   >
                            <div className={`${ swiperNavUpdate.swiperButtonNextArrow}`}></div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function summerizedItems(events) {
    return events.map((event, index) => {
    
        const dataFromTitle = retrievingInfoFromTitle(event.node.title)
        const titleAndPrice = convertTitleAndPrice(event.node.variants.edges)
        //console.log(titleAndPrice)
        return {
            id: event.index,
            title: dataFromTitle.title,
            plainTextTitle: event.node.title,
            date: dataFromTitle.date,
            otherInfo: dataFromTitle.other || "",
            priceList: titleAndPrice,
            link: event.node.onlineStoreUrl,
            thumb: event.node.images.edges[0].node.originalSrc,
            mainImage: event.node.images.edges[1] ? event.node.images.edges[1].node.originalSrc : "",
            description: event.node.descriptionHtml,
        }
    })
}

export function titleList(items) {
    return items.map(item => {
        return {
            title: item.title
        }
    })
}

export function retrievingInfoFromTitle (title) {

    const data = title.split(' I ')
    
    let convertedTitle
    let convertedDate
    let otherData = ""

    if( data.length > 2) {
        
        convertedTitle = convertTitle(data[0]) + '<br />' + data[1]
        convertedDate = convertDate(data[2])
    } else {
        convertedTitle = convertTitle(data[0])
        convertedDate = convertDate(data[1])
    }

    return {
        title: convertedTitle,
        date: convertedDate,
        other: otherData || "",
    }
}

export function convertTitleAndPrice(items) {
    return items.map(item => {
        const decodedVariantId = Buffer.from(item.node.id, 'base64').toString()
        const VariantId = createVariantId(decodedVariantId)
        const imageUrl = item.node.image.url
        return {
            title: item.node.title,
            price: item.node.price,
            variantId: VariantId,
            imageUrl: imageUrl //Null or URL
        }
    })
}

export function createVariantId(str) {
    const strArr = str.split("/")
    return strArr[strArr.length - 1]
}

export function priceLowest(prices) {
    const priceList = prices.map(price => {
        return price.price
    })
    const aryMin = function (a, b) {return Math.min(a, b)}
    const lowest = priceList.reduce(aryMin)
    return lowest.toFixed(2)
}

export function convertTitle(title) {

    const upperCase = title.match(/[A-Z]+/)
    const lowerCase = title.match(/[a-z]+/)
    
    return upperCase + '<b>' + lowerCase[0].toUpperCase() + '</b>'
}

export function convertDate(date) {
    const data = date.split(',')
    if(data.length > 1) {
        return data.join('\n')
    } else {
        return date
    }
}

export function createLink(arr_bag) {
    const mainCartAddress = "https://thecompanyberlin.com/cart/"
    const shoppingData = sortingArrayToText(arr_bag)
    return mainCartAddress + shoppingData.join(',')
}

export function sortingArrayToText(items) {
    return items.map((item) => {
        return item.variantId + ":" + item.quantity
    })
}
export function initEventListArray(numOfEvents, summerizedContents) {
    const eventArray = []
    for (let i = 0; i < numOfEvents; i++) {
        eventArray.push({id: i, imageIndex: 0, 
            priceIndex: 0, 
            vid: summerizedContents[i].priceList[0].variantId,
            eventHasImage: hasImage(summerizedContents, i , 0),
            quantity: 0,
        })
    }
    return eventArray
}

export function hasImage(shopEvents, id, newValue) {
    if(shopEvents[id].priceList[newValue].imageUrl) {
        return true
    } else {
        return false
    }
}