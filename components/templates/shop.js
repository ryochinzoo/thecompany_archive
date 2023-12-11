import {useState, useRef, useEffect, createRef, useCallback} from 'react'
import { useMediaQuery } from 'react-responsive'
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, Controller } from "swiper"
import { useInView } from "react-intersection-observer"
import utilStyles from "../../styles/shop.module.css"
import Image from 'next/image'
import makeStyles from '@mui/styles/makeStyles'
import parse from 'html-react-parser'
import { useScrollLock } from '../../hooks/useScrollLock'
import dynamic from 'next/dynamic'


const Drawer = dynamic(() => import('@mui/material/Drawer'))
const DrawerContents = dynamic(() => import('../molecules/drawerContents'))
const ShopViewDetailsButton = dynamic(() => import('../atoms/shopViewDetailsButton'))
const ShopBuyItNowButton = dynamic(() => import('../atoms/shopBuyItNowButton'))
const ProductSelectList = dynamic(() => import('../atoms/productSelectList'))
const QuantityInput = dynamic(() => import('../atoms/quantityInput'))

const useShopStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        width: "40%",
      }
    },
    drawerBackground: {
      backgroundColor: "#1C1C1C!important",
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

export default function Shop ({strapiURL, events, handleScrollLock, shoppingBagHandle, locale}){
    const shopEvents = summerizedItems(events)
    const fromAb = locale == "en" ? "from " : "ab "
    const initEventList = initEventListArray(events.length, shopEvents)
    const [eventListState, setEventListState] = useState(initEventList)
    const titles = new Set(titleList(shopEvents))
    const shopSection = useRef()
    const shopSwiperRef = useRef()
    const classes = useShopStyles()
    const [isNoSwiping, setIsNoSwiping] = useState(false)
    const [generatedLink, setGeneratedLink] = useState("https://thecompanyberlin.myshopify.com/cart/")
    const [selectedMenuItem, setSelectedMenuItem] = useState(0)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    /*
    const [isEvents, setIsEvents] = useState(false)
    const [isMerch, setIsMerch] = useState(false)
    const [isLinkCreated, setIsLinkCreated] = useState(false)
    */
    const [isLockTriggered, setIsLockTriggered] = useState(false)
    const scrollableAreas = useRef([])
    events.forEach((_, index) => {
        scrollableAreas.current[index] = createRef()
    })
    useScrollLock(undefined, 'touchmove', isLockTriggered, scrollableAreas)
    const [isDetails, setIsDetails] = useState(false)
    const [isEventClicked, setIsEventClicked] = useState(false)
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
    const [tempQuantity, setTempQuantity] = useState(1)
    const [shoppingBag, setShoppingBag] = useState([{
        variantId: 0,
        quantity: 0,
        base64vid: 0,
    }])

    const initShoppingBag = () => {
        setShoppingBag([{
            variantId: 0,
            quantity: 0,
            base64vid: 0,
        }])
    }
    const resetQuantity = (newValue) => {
        if(shoppingBag.some((v) => v.variantId === newValue.variantId)) {
            const quantityInBag = shoppingBag.find((el) => {
                return el.variantId === newValue.variantId
            })
            setTempQuantity(quantityInBag.quantity)
        } else {
            setTempQuantity(1)
        }
        setIsReset(true)
    }
    const onQuantityChange = (value) => {
        setTempQuantity(value)
    }
    const noSwipingUpdate = (newValue) => {
        setIsNoSwiping(newValue)
        return newValue
    }
    const addToBag = (newValue, newQuantity, base64) => {
        const result = shoppingBag.some((b) => b.variantId === newValue)
        if(result) {
            setShoppingBag((prevState) => {
                const newState = prevState.map((obj) => (obj.variantId === newValue ? {variantId: obj.variantId, quantity: newQuantity, base64vid: base64} : obj))
                shoppingBagHandle(createLink(newState), totalCount(newState), newState)
                return newState
            })
        } else {
            const zero = shoppingBag.some((o) => o.variantId === 0)
            if(zero) {
                setShoppingBag((prevState) => {
                    const newState = [{variantId: newValue, quantity: newQuantity, base64vid: base64}] 
                    shoppingBagHandle(createLink(newState), totalCount(newState), newState)
                    return newState
                })
            } else {
                setShoppingBag((prevState) => {
                    const newState = [...prevState, {variantId: newValue, quantity: newQuantity, base64vid: base64}]
                    shoppingBagHandle(createLink(newState), totalCount(newState), newState)
                    return newState
                })
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
            base64vid: shopEvents[id].priceList[newValue].base64vid,
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
        if (txt) {
            const txtArray = txt.split(/(\n)/g).map((t, i) => (t==='\n')? {key: dancerIndex+"-"+i, t: <br/>} : {key: dancerIndex+"-"+i, t: t})
            return (
                <div>
                    {txtArray.map((array) => (
                    <span key={array.key}>{array.t}</span>
                ))}
                </div>
            )
        } else {
            return ""
        }
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
            if (isMobile || isMobileSmall) {
                noSwipingUpdate(true)
                setIsNoSwiping(true)
            }
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
                            SHOP /
                        </div>
                        <div className={`${utilStyles.shopMenuItemWrapper}`}>
                            <div className={`${isDetails ? utilStyles.shopMenuItemDetail : utilStyles.shopMenuItem}`}>
                                <div className={`${isDetails ? utilStyles.burgerMenuIconWrapper : utilStyles.burgerMenuIconDisable}`}
                                    onClick={()=>{
                                        setIsDrawerOpen(true)
                                        handleScrollLock(true)
                                    }}>
                                    <div className={`${selectedMenuItem == 0 ? utilStyles.burgerMenuIconShop: ""}`}></div>
                                </div>
                                <div style={{textDecoration: selectedMenuItem == 0 ? "none" : "underline"}}
                                    onClick={()=>{
                                        setSelectedMenuItem(0)
                                    }}
                                >Events</div>
                            </div>
                            <div className={`${utilStyles.shopMenuItem}`}>
                            <div className={`${selectedMenuItem == 1 ? utilStyles.burgerMenuIconShop: ""}`}
                                    onClick={()=>{
                                        //setSelectedMenuItem(1)
                                    }}
                                ></div>
                                <div style={{textDecoration: selectedMenuItem == 1 ? "none" : "underline"}}  className={`${selectedMenuItem == 1 ? utilStyles.selectedMenuItem: ""}`}
                                    onClick={()=>{
                                        //setSelectedMenuItem(1) Here should be Merch in the future
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className={utilStyles.backToShopWrapper}
                        onClick={() => {
                            setIsEventClicked(false)
                            setIsDetails(false)
                            handleScrollLock(false)
                            if (isMobile || isMobileSmall) {
                                //positionScroll(shopSection.current, true)
                                //enableBodyScroll(shopSection.current)
                                setIsLockTriggered(false)
                                noSwipingUpdate(false)
                            }
                        }}>
                        <span className={utilStyles.backToSwiperArrow}
                            style={{opacity : isEventClicked ?  1 : 0}}
                            ></span>
                        <span className={utilStyles.backToSwiper}
                        style={{opacity : isEventClicked ?  1 : 0}}
                        >Back</span>
                    </div>
                </div>
                <div className={utilStyles.sliderWrapper}>
                    <div onClick={()=>{
                        if(!isEventClicked && swiper.activeIndex > 1 || isEventClicked) {
                            swiper.slidePrev()
                        }
                        }}
                    >
                        <div ref={navInViewRef} className={`${utilStyles.swiperButtonShopPrevWrapper}
                                            ${navIsVisible && (isDesktop || isDesktopLarge) ? 
                                                utilStyles.fadeOutAnimation : ""}`}>
                            <div className={`${utilStyles.swiperButtonShopPrev}`} >
                                <div className={utilStyles.swiperButtonPrevArrow}></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={utilStyles.gradationBlackLeftSide}></div>
                        <div className={utilStyles.gradationBlackRightSide}></div>
                    </div>
                    <Swiper
                        ref={shopSwiperRef}
                        modules={[Navigation, Thumbs, Controller]}
                        slidesPerView={slidesToShowState}
                        loop={false}
                        onSwiper={setSwiper}
                        noSwiping={isNoSwiping}
                        spaceBetween={isMobile || isMobileSmall ? 10 : 0}
                        centeredSlides={true}
                        initialSlide={centeredSlideNumber}
                        autoHeight={false}
                        noSwipingClass={'event-shop-slide'}
                        slideClass={'event-shop-slide'}
                        slideToClickedSlide={true}
                        onSlideChange={(swiper) => {
                            resetQuantity(shopEvents[swiper.activeIndex].priceList[parseInt(eventListState[swiper.activeIndex].priceIndex)])
                        }}
                    >
                        { shopEvents.map((event, eventIndex) => {
                            return (
                                <SwiperSlide className={`event-shop-slide ${utilStyles.shopSwiperAdjustment}`} key={eventIndex}>
                                {({ isActive, isPrev, isNext }) => (
                                    <div className={`${utilStyles.heightHundred}`}>
                                        <div
                                            style={{display : isEventClicked ?  "none" : "block"}} 
                                            className={`${utilStyles.shopSwipeSlideWrapper} ${isActive || isPrev || isNext ? utilStyles.shopSlideOpacityFull : utilStyles.shopSlideOpacity}`}>
                                            <div className={`${utilStyles.goodsImageThumb}`}>
                                                <Image
                                                    src={event.thumb}
                                                    alt={"Thumbnail"}
                                                    layout="fill"
                                                    objectFit='contain'
                                                    loading='lazy'
                                                />    
                                            </div>
                                            <div className={utilStyles.detailWrapper}>
                                                <div className={`${utilStyles.goodsTitleWrapper}`}>
                                                    <div className={`${utilStyles.goodsTitle}`}>{parse(event.title)}</div>
                                                </div>
                                                <div className={`${utilStyles.sellingDate}`}>{lbtoBr(event.date)}</div>
                                                <div className={`${utilStyles.sellingPrice}`}>
                                                    { event.priceList.length > 1 ? 
                                                    fromAb + priceLowest(event.priceList) + "€"
                                                    :
                                                    event.priceList[0].price + "€"
                                                    }
                                                </div>
                                            </div>
                                            <div className={`${utilStyles.buttonSet}`}>
                                                <div
                                                    onClick={() => {
                                                        setIsEventClicked(true)
                                                        setIsDetails(true)
                                                        handleScrollLock(true)
                                                        if (isMobile || isMobileSmall) {
                                                            setIsLockTriggered(true)
                                                            noSwipingUpdate(true)
                                                            
                                                            //disableBodyScroll(shopSection.current, {
                                                                //allowTouchMove: el,
                                                              //  reserveScrollBarGap: true,
                                                            //})
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
                                                            IsInBag(0) ? createLink([{variantId: newestEvent(event), quantity:  newestEvent(event) ? 1 : ""}]) : 
                                                            createLink([...shoppingBag, {variantId: newestEvent(event), quantity: 1}])}
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
                                                        loading='lazy'
                                                    /> 
                                                </div>
                                                <div className={`${utilStyles.overflowContentWrapper}`}>
                                                    <div ref={scrollableAreas.current[eventIndex]} className={`${utilStyles.shopDetailInfoWrapper} scrollable`}>
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
                                                                            //quantity ref or temp quantity
                                                                            addToBag(eventListState[eventIndex].vid, tempQuantity, eventListState[eventIndex].base64vid)
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
                            if(!isEventClicked && swiper.activeIndex < shopEvents.length - 2 || isEventClicked) {
                                swiper.slideNext()
                            }
                        }}
                    >
                    <div ref={observeRef} className={`${utilStyles.swiperButtonShopNextWrapper}
                        ${navIsVisible && (isDesktop || isDesktopLarge)  ? 
                            utilStyles.fadeOutAnimation : ""} ifSafariShopNextWrapper`}>
                        <div className={`${ utilStyles.swiperButtonShopNext} `}   >
                            <div className={`${ utilStyles.swiperButtonNextArrow}`}></div>
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
        const dataFromTitle = retrievingInfoFromTitle(event.node.title, event)
        const titleAndPrice = convertTitleAndPrice(event.node.variants.edges)
        return {
            id: event.index,
            title: dataFromTitle.title.input,
            plainTextTitle: event.node.title,
            date: dataFromTitle.date,
            otherInfo: dataFromTitle.other || "",
            priceList: titleAndPrice,
            link: event.node.onlineStoreUrl,
            thumb: event.node.images.edges.length != 0 ? event.node.images.edges[0].node.originalSrc : "/images/No_Image_thumb.png",
            mainImage: event.node.images.edges[1] ? event.node.images.edges[1].node.originalSrc : "/images/No_Image_thumb.png",
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

export function retrievingInfoFromTitle (title, event) {
    
    let convertedTitle
    let convertedDate
    let otherData = ""
    const data = title.split(' | ')
        if(data.length === 1) {
            convertedTitle = convertTitle(data[0])
            const newData = convertTitleAndPrice(event.node.variants.edges)
            convertedDate = "Next event: " + newData[0].title
        } else if (data.length > 2) {
            convertedTitle = convertTitle(data[0])
            const testStr = data[data.length - 1]

            if (testStr.match(/\d{1,2}.\d{1,2}.\d{2,4}/g)) {
                convertedTitle.input = createTitle(data, 1)
                convertedDate = data[data.length - 1]
            } else {
                convertedTitle.input = createTitle(data, 2)
                convertedDate = data[data.length - 2] + ". " + data[data.length - 1]
            }
        } else {
            convertedTitle = convertTitle(data[0])
            convertedDate = data[1]
        }
    
    return {
        title: convertedTitle,
        date: convertedDate,
        other: otherData || "",
    }
}

export function createTitle (arr, dateTimeElNum) {
    let result = ""
    if ((arr.length - dateTimeElNum) > 1 ) {
        for(let i = 0; i < arr.length - dateTimeElNum; i++) {
            if (i < arr.length - (dateTimeElNum + 1)) {
                result += arr[i] + "<br />"
            } else {
                result += arr[i]
            }        
        }
    } else {
        return arr[0]
    } 
    return result
}

export function convertTitleAndPrice(items) {
    return items.map(item => {
        //const decodedVariantId = Buffer.from(item.node.id, 'base64').toString()
        const VariantId = createVariantId(item.node.id)//decodedVariantId)
        const imageUrl = item.node.image?.url
        return {
            title: item.node.title,
            price: parseInt(item.node.price.amount).toFixed(2),
            variantId: VariantId,
            base64vid: item.node.id,
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
export function newestEvent(eventList) {
    //console.log(eventList)
    const today = new Date()
    if(eventList.priceList.length > 1) {
        const result = eventWithDate(eventList, today)
        if(result) {
            return result[0].vid
        } else {
            return ""
        }
    } else {
        return eventList.priceList[0].variantId
    }
}
export function eventWithDate(events, today) {
    const newArray = []
    let result
    events.priceList.map(event => {
        const dateAndTime = event.title.match(/\d{1,2}.\d{1,2}/g)
        const separateDate = dateAndTime ? dateAndTime[0].split(".") : ""
        const startDate = separateDate[1] <= 2 && today.getUTCMonth() >= 10 ? (today.getUTCFullYear() + 1) + "/" + separateDate[1] + "/" + separateDate[0] : today.getUTCFullYear() + "/" + separateDate[1] + "/" + separateDate[0]
        const targetDate = new Date(startDate)
        if(today <= targetDate || today.toDateString() === targetDate.toDateString()) {
            newArray.push({
                vid: event.variantId,
                startDate: startDate,
            })
            result = newArray.sort((a,b) => {
                return new Date(a.startDate) - new Date(b.startDate)
            })
        }
        if (!dateAndTime || isNaN(targetDate)) {
            newArray.push({
                vid: event.variantId,
                price: event.price,
            })
            result = newArray.sort((a,b) => {
                return a.price - b.price
            })
        }
    })
    return result
}

export function convertTitle(title) {
    const upperCase = title.match(/[A-Z]+/)
    const lowerCase = title.match(/[a-z]+/)
    if (lowerCase) {
        return upperCase + '<b>' + lowerCase[0].toUpperCase() + '</b>'
    } else {
        return upperCase
    }
}

export function convertDate(date) {
    const data = date?.split(',')
    if(data?.length > 1) {
        return data.join('\n')
    } else {
        return date
    }
}

export function createLink(arr_bag) {
    const mainCartAddress = "https://thecompanyberlin.myshopify.com/cart/"
    const shoppingData = arr_bag.some(a => a.quantity === "" || a.quantity === "0") ? "" : sortingArrayToText(arr_bag)
    if (shoppingData.length !== 0) {
        return mainCartAddress + shoppingData.join(',')
    } else {
        return ""
    }
}

export function totalCount(arr_bag) {
    let total = 0
    arr_bag.map((item) => {
       return total += parseInt(item.quantity)
    })
    return total
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
            base64vid: summerizedContents[i].priceList[0].base64vid,
            title: summerizedContents[i].priceList[0].title,
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