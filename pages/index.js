import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Head from 'next/head'
import Image from 'next/image'

import utilStyles from '../styles/main.module.css'

import 'aos/dist/aos.css'
import { ModalProvider } from '../context/modalContext'
import makeStyles from '@mui/styles/makeStyles'
import { strapiHandler, getStrapiURL } from "./api/strapiHandler"

//import "swiper/css"
//import "swiper/css/navigation"
//import HappeningsTextData from '../src/happenings.json'
import dynamic from 'next/dynamic'

const CookieConsent = dynamic(() => import('react-cookie-consent'))
const Drawer = dynamic(() => import('@mui/material/Drawer'))
const AboutIntro = dynamic(() => import('../components/templates/aboutIntro'))
const FormAtTop = dynamic(() => import('../components/templates/formAtTop'))
const NarrowVideo = dynamic(() => import('../components/atoms/narrowVideo'))
const HlsPlayerFullSizeDynamic = dynamic(() => import('../components/atoms/hlsPlayerFullSize'))
const DancerProfile = dynamic(() => import('../components/templates/dancerProfile'))
const Brand = dynamic(() => import('../components/templates/brands'))
const Studio = dynamic(() => import('../components/templates/studio'))
const Shop = dynamic(() => import('../components/templates/shop'))
const EduSwipeArea = dynamic(() => import('../components/molecules/educationSwipeArea'))
const EntertainmentSwipeArea = dynamic(() => import('../components/molecules/entertainmentSwipeArea'))
const FormAtFooter = dynamic(() => import('../components/templates/formAtFooter'))
const FooterParts = dynamic(() => import('../components/templates/footerParts'))

import { getAllProducts,createCart } from './api/shopifyHandler'

export async function getStaticProps({ locale }) {
  const [events, mailInfo, studio, brands_de, brands, happenings, dancers, largestVideo] = await Promise.all([
    getAllProducts(),
    strapiHandler("/mail-infos"),
    strapiHandler("/studios", {
      populate: {
        media: {
          populate: "*"
        },
      }
    }),
    strapiHandler("/brands", {
      populate: {
        Logo: {
          populate: "*"
        },
        BrandComponent: { //repeatable Group, Array
          populate: "*"
        },
      },
      locale: "de"
    }),
    strapiHandler("/brands", {
      populate: {
        Logo: {
          populate: "*"
        },
        BrandComponent: { //repeatable Group, Array
          populate: "*"
        },
      }
    }),
    strapiHandler("/happenings", {
      populate: {
        ImageOrVideo: {
          populate: "*"
        },
      }
    }),
    strapiHandler("/dancers", {
      populate: {
        MainPhoto: {
          populate: "*"
        },
        ThumbPhoto: {
          populate: "*"
        },
        PhotoForList: {
          populate: "*"
        },
        DancerWorks: { //repeatable Group, Array
          populate: "*"
        },
        DancerDetail: { 
          populate: "*"
        },
      }
    }),
    strapiHandler("/largest-videos", {
      populate: {
        VideoForDesktop: {
          populate: "*"
        },
        VideoForMobile: {
          populate: "*"
        }
      }
    })
  ])
  return {
    props: {
      brands,
      brands_de,
      //artists,
      happenings,
      dancers,
      events,//parseShopifyResponse(events),
      mailInfo,
      studio,
      largestVideo,
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
    revalidate: 10,
  }
}
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "80%",
    }
  },
  drawerBackground: {
    width: "80%",
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
export default function Home({ brands, brands_de, happenings, dancers, events, mailInfo, studio, largestVideo }) {
  const { t } = useTranslation("common")
  const router = useRouter()
  const strapiUrl = getStrapiURL()
  const toFormLink = useRef()
  const startFormLinkShowing = useRef()
  const topWithVideo = useRef()
  const topSPHeaderHandleRef = useRef()
  const transitionBoxOne = useRef()
  const ballMedia = useRef()
  const entertainmentRef = useRef()
  const entertainmentSwipeRef = useRef()
  const educationRef = useRef()
  const instaInfoRef = useRef()
  const shopRef = useRef()
  const brandRef = useRef()
  const artistRef = useRef()
  const footerRef = useRef()
  const areYou = useRef() 
  const classes = useStyles()
  const agencyFull = useRef()
  const mailInfoData = getMailInfo(mailInfo)
  const formLinkFlippingBrands = useRef()
  const formLinkFlippingArtists = useRef()
  const eduContents = classifyItems(strapiUrl, happenings.data, "EDUCATION")
  const entertainmentContents = classifyItems(strapiUrl, happenings.data, "ENTERTAINMENT")
  const videoArray = getVideoArray(strapiUrl, largestVideo)
  /*

  let today = new Date()
  const eventDateList = convertEventDate(events, today)
  const windowHeightRef = useRef()
  const areYouScrollFadeOut = useRef()
  const intensiveMedia = useRef()
  const tourMedia = useRef()
  const intensiveRoot = useRef()
  const intensiveTarget = useRef()
  const intensiveSticky = useRef()
  const tourRoot = useRef()
  const tourTarget = useRef()
  const tourSticky = useRef()
  const ballRoot = useRef()
  const ballTarget = useRef()
  const ballSticky = useRef()
  const happeningsChangingImageTarget = useRef()
  const happeningsChangingImageControllArea = useRef()

  const happeningsIntensive = classifyItems(strapiUrl, happenings.data, "THEINTENSIVE")
  const happeningsTour = classifyItems(strapiUrl, happenings.data, "THETOUR")
  const happeningsBall = classifyItems(strapiUrl, happenings.data, "THEBALL")
  const happeningsClasses = classifyItems(strapiUrl, happenings.data, "THECLASSES")


  const originSectionAbout = 2
  const originSectionHappenings = 3
  const originSectionHappeningsIntensiveDescription = 4
  const originSectionHappeningsIntensivePortfolio = 5
  const originSectionHappeningsTourDescription = 6
  const originSectionHappeningsTourPortfolio = 7
  const originSectionHappeningsBallDescription = 8
  const originSectionHappeningsBallPortfolio = 9
  const originSectionShop = 10
  const originSectionBrands = 11
  const originSectionArtists = 12
  const originSectionAgency = 13
  const originSectionContact = 14
  const [intensiveMediaVisible, setIntensiveMediaVisible] = useState(true)
  const [tourMediaVisible, setTourMediaVisible] = useState(true)
  const [ballMediaVisible, setBallMediaVisible] = useState(true)
  const [intensiveHeadlineAnimate, setIntensiveHeadlineAnimate] = useState(false)
  const [tourHeadlineAnimate, setTourHeadlineAnimate] = useState(false)
  const [ballHeadlineAnimate, setBallHeadlineAnimate] = useState(false)
  const [happeningsHeadlineStates, setHappeningsHeadlineStates] = useState({intensiveMoveDown: false, tourMoveDown: false, ballMoveDown: false, classesMoveDown: false})
  const [isInLoading, setIsInLoading] = useState(false)
  const [firstSectionMenuInvisible, setFirstSectionMenuInvisible] = useState(false)
  const [bagIsCreated, setBagIsCreated] = useState(false)
*/
  const [isFlipped, setIsFlipped] = useState(false)
  const [isScrollLock, setIsScrollLock] = useState(false)
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState(router.locale)
  const [brandsLocale, setBrandsLocale] = useState(currentLocale == "en" ? brands.data : brands_de.data)
  const [transitionBoxOneVisible, setTransitionBoxOneVisible] = useState(true)
  const [headerLogo, setHeaderLogo] = useState("/images/newlogo.png")
  const [shoppingBagTotalQuantity, setShoppingBagTotalQuantity] = useState("")
  const [generatedLink, setGeneratedLink] = useState("https://thecompanyberlin.myshopify.com/cart/")
  const [GetInTouchSVG, setGetInTouchSVG] = useState('/svg/GetInTouch.svg')
  const [GetInTouchSVGHeight, setGetInTouchSVGHeight] = useState(328)
  const [isInstaInfo, setIsInstaInfo] = useState(false)
  const [inTop, setInTop] = useState(false)
  const [inAgency, setInAgency] = useState(false)
  const [inEducation, setInEducation] = useState(false)
  const [inEntertainment, setInEntertainment] = useState(false)
  const [formType, setFormType] = useState("Get in touch")
  const [largeVideoTop, setLargeVideoTop] = useState()
  const [largeVideoAgency, setLargeVideoAgency] = useState()

  const handleScrollLock = (newValue) => {
    setIsScrollLock(newValue)
  }

  const shoppingBagHandle = (link, total, bag) => {
    /*
    if(bagIsCreated) {
      
    } else {
      createQueryList(bag)
      setBagIsCreated(true)
    }
    */
    if (total == 0) {
      setShoppingBagTotalQuantity((prevState) => { return "" })
    } else if (total > 9) {
      setShoppingBagTotalQuantity((prevState) => { return "9+" })
    } else {
      setShoppingBagTotalQuantity((prevState) => { return total })
    }
    	setGeneratedLink((prevState) => { return link })
  }
  
  const [headerLogoColor, setHeaderLogoColor] = useState(false)

  useEffect(() => {
    if (currentLocale == "en") {
      setBrandsLocale(brands.data)
    } else {
      setBrandsLocale(brands_de.data)
    }
  }, [currentLocale, brands.data, brands_de.data])

  useEffect(() => {
    const options = {
      threshold: 0.01,
      rootMargin: `0%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.map(entry => {
        if(!entry.isIntersecting) {
          setTransitionBoxOneVisible(false)
          setInTop(false)
        } else {
          setTransitionBoxOneVisible(true)
          setInTop(true)
        }
      })
    }, options)

    if(transitionBoxOne.current) {
      observer.observe(transitionBoxOne.current)
    } else {
      observer.unobserve(transitionBoxOne.current)
    }

  }, [transitionBoxOne])

  useEffect(() => {
    const options = {
      threshold: 0.01,
      rootMargin: `0%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.map(entry => {
        if(!entry.isIntersecting) {
          setInEducation(false)
        } else {
          setInEducation(true)
        }
      })
    }, options)
    if(educationRef.current) {
      observer.observe(educationRef.current)
    } else {
      observer.unobserve(educationRef.current)
    }
  }, [educationRef])

  useEffect(() => {
    const options = {
      threshold: 0.01,
      rootMargin: `0%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.map(entry => {
        if(!entry.isIntersecting) {
          setInEntertainment(false)
        } else {
          setInEntertainment(true)
        }
      })
    }, options)

    if (entertainmentSwipeRef.current) {
      observer.observe(entertainmentSwipeRef.current)
    } else {
      observer.unobserve(entertainmentSwipeRef.current)
    }
  }, [entertainmentSwipeRef])
  useEffect(() => {
    const options = {
      threshold: 0.01,
      rootMargin: `0%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.map(entry => {
        if(!entry.isIntersecting) {
          setInAgency(false)
        } else {
          setInAgency(true)
        }
      })
    }, options)
    if(agencyFull.current) {
      observer.observe(agencyFull.current)
    } else {
      observer.unobserve(agencyFull.current)
    }

  }, [agencyFull])
   /*
  useEffect(() => {
 
    const root = intensiveRoot.current
    const targetHeight = intensiveTarget.current.clientHeight - intensiveSticky.current.offsetHeight - 80
    const options = {
      root: root,
      threshold: 0,
      rootMargin: `-${targetHeight}px 0px 0px`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        setIntensiveHeadlineAnimate(true)
      } else {
        setIntensiveHeadlineAnimate(false)
      }
    }, options)
    
    if (intensiveSticky.current) {
      observer.observe(intensiveSticky.current)
    } else {
      observer.unobserve(intensiveSticky.current)
    }
    
  }, [intensiveSticky, intensiveTarget, intensiveRoot])

  useEffect(() => {
    const root = tourRoot.current
    const targetHeight = tourTarget.current.clientHeight - tourSticky.current.offsetHeight - 60
    const options = {
      root: root,
      threshold: 0,
      rootMargin: `-${targetHeight}px 0px 0px`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        setTourHeadlineAnimate(true)
      } else {
        setTourHeadlineAnimate(false)
      }
    }, options)
    
    if (tourSticky.current) {
      observer.observe(tourSticky.current)
    } else {
      observer.unobserve(tourSticky.current)
    }
    
  }, [tourSticky, tourTarget, tourRoot])

  useEffect(() => {
    const root = ballRoot.current
    const targetHeight = ballTarget.current.clientHeight - ballSticky.current.offsetHeight - 60
    const options = {
      root: root,
      threshold: 1,
      rootMargin: `-${targetHeight}px 0px 0px`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        setBallHeadlineAnimate(true)
      } else {
        setBallHeadlineAnimate(false)
      }
    }, options)
    
    if (ballSticky.current) {
      observer.observe(ballSticky.current)
    } else {
      observer.unobserve(ballSticky.current)
    }
    
  }, [ballSticky, ballTarget, ballRoot])
  */
  useEffect(() => {
    const options = {
      threshold: 0,
      rootMargin: `0% 0% -50%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      if (entries[0].intersectionRatio > 0) {
        setIsFlipped(true)
      } else {
        setIsFlipped(false)
      }
    }, options)
    if (artistRef.current) {
      observer.observe(artistRef.current)
    } else {
      observer.unobserve(artistRef.current)
    }
    if(isFlipped) {
      setFormType("Booking request")
    } else {
      setFormType("Get in touch")
    }
  }, [setIsFlipped, artistRef, isFlipped])
 
  useEffect(() => {
   
    const options = {
      threshold: 0,
      rootMargin: `-25% 0% -25%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      if (entries[0].intersectionRatio > 0) {
        setHeaderLogoColor(false)
      } else {
        setHeaderLogoColor(true)
      }
    }, options)
    
    
    
    if (shopRef.current) {
      observer.observe(shopRef.current)
    } else {
      observer.unobserve(shopRef.current)
    }
    if (brandRef.current) {
      observer.observe(brandRef.current)
    } else {
      observer.unobserve(brandRef.current)
    }
    if (entertainmentRef.current) {
      observer.observe(entertainmentRef.current)
    } else {
      observer.unobserve(entertainmentRef.current)
    }
    
  }, [shopRef, brandRef, entertainmentRef, setHeaderLogoColor])

  useEffect(() => {
   
    const options = {
      threshold: 0,
      rootMargin: `-90% 0% 0%`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInstaInfo(false)
        } else {
          setIsInstaInfo(true)
        }
      })
    }, options)
    
    
    
    if (shopRef.current) {
      observer.observe(shopRef.current)
    } else {
      observer.unobserve(shopRef.current)
    }
    if (brandRef.current) {
      observer.observe(brandRef.current)
    } else {
      observer.unobserve(brandRef.current)
    }
    if (entertainmentRef.current) {
      observer.observe(entertainmentRef.current)
    } else {
      observer.unobserve(entertainmentRef.current)
    }
    
  }, [shopRef, brandRef, entertainmentRef, setHeaderLogoColor])
/*
  useEffect(() => {
    const halfHeight = Math.round(windowHeightRef.current.clientHeight / 2)
    const oneSeven = halfHeight / 2
    const options = {
        threshold: 1,
        rootMargin: `0px 0px ${halfHeight + oneSeven}px 0px`
    }

    const observer = new IntersectionObserver((entries, observer) => {
      entries.map((entry) => {
        if(entry.isIntersecting) {

          if(!areYou.current.classList.contains(`${TopStyle.movingAreYou}`)) {
              areYou.current.classList.add(`${TopStyle.movingAreYou}`)
          } 
        }
      })
    }, options)

    observer.observe(windowHeightRef.current)
  }, [windowHeightRef, areYou])

  useEffect(() => {
    const options = {
      threshold: 0,
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.map(entry => {
        if(entry.isIntersecting) {
          if(!toFormLink.current.classList.contains(`${utilStyles.opacityZero}`))
            toFormLink.current.classList.add(`${utilStyles.opacityZero}`)
        }
      })
    }, options)
    observer.observe(transitionBoxOne.current)
    //observer.observe(windowHeightRef.current)
  }, [toFormLink, windowHeightRef, transitionBoxOne])

  useEffect(() => {
    const options = {
      threshold: 0,
      rootMargin: `0px 0px -${transitionBoxOne.current.clientHeight - 20}px 0px`
      //rootMargin: `0px 0px -${windowHeightRef.current.clientHeight - 20}px 0px`
    }
    const observer = new IntersectionObserver((entries, observer) => {
      entries.map(entry => {
        if(entry.isIntersecting) {
          if(toFormLink.current.classList.contains(`${utilStyles.opacityZero}`))
            toFormLink.current.classList.remove(`${utilStyles.opacityZero}`)
        }
      })
    }, options)
    observer.observe(startFormLinkShowing.current)
  }, [startFormLinkShowing, toFormLink, windowHeightRef])
  */
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
  /*
  const [intensiveParagraphsState, setIntensiveParagraphsState] = useState({
    first: HappeningsTextData.data.the_intensive.first_paragraph.text,
    second: HappeningsTextData.data.the_intensive.second_paragraph.text,
    third: HappeningsTextData.data.the_intensive.third_paragraph.text
  })
  const [tourParagraphsState, setTourParagraphsState] = useState({
    first: HappeningsTextData.data.the_tour.first_paragraph.text,
    second: HappeningsTextData.data.the_tour.second_paragraph.text,
    third: HappeningsTextData.data.the_tour.third_paragraph.text}
  )
  const [ballParagraphsState, setBallParagraphsState] = useState({
    first: HappeningsTextData.data.the_ball.first_paragraph.text,
    second: HappeningsTextData.data.the_ball.second_paragraph.text,
    third: HappeningsTextData.data.the_ball.third_paragraph.text
  })
  */
  useEffect(() => {
    
    if(isMobile || isMobileSmall){
      setGetInTouchSVG('/svg/GetInTouchSP.svg')
      setGetInTouchSVGHeight(800)
      setHeaderLogo("/images/newlogobk.png")
      setLargeVideoTop((prev) => { return getVideoUrl("Top", "Mobile", videoArray)})
      setLargeVideoAgency((prev) => { return getVideoUrl("Agency", "Mobile", videoArray)})
      //setIntensiveParagraphsState({first: t('happenings_main.the_intensive_sp.first_paragraph.text'), second: t('happenings_main.the_intensive_sp.second_paragraph.text'), third: t('happenings_main.the_intensive_sp.third_paragraph.text')})
      //setTourParagraphsState({first: t('happenings_main.the_tour_sp.first_paragraph.text'), second: t('happenings_main.the_tour_sp.second_paragraph.text'), second2: t('happenings_main.the_tour_sp.second_paragraph.text2'), third: t('happenings_main.the_tour_sp.third_paragraph.text')})
      //setBallParagraphsState({first: t('happenings_main.the_ball_sp.first_paragraph.text'), second: t('happenings_main.the_ball_sp.second_paragraph.text'), third: t('happenings_main.the_ball_sp.third_paragraph.text')})
    } else if (isTablet) {
      setGetInTouchSVG('/svg/GetInTouch.svg')
      setGetInTouchSVGHeight(328)
      setHeaderLogo("/images/newlogobk.png")
      setLargeVideoTop((prev) => { return getVideoUrl("Top", "Desktop", videoArray)})
      setLargeVideoAgency((prev) => { return getVideoUrl("Agency", "Desktop", videoArray)})
    } else {
      setGetInTouchSVG('/svg/GetInTouch.svg')
      setGetInTouchSVGHeight(328)
      setHeaderLogo("/images/newlogo.png")
      setLargeVideoTop((prev) => { return getVideoUrl("Top", "Desktop", videoArray)})
      setLargeVideoAgency((prev) => { return getVideoUrl("Agency", "Desktop", videoArray)})
      //setIntensiveParagraphsState({first: t('happenings_main.the_intensive.first_paragraph.text'), second: t('happenings_main.the_intensive.second_paragraph.text'), third: t('happenings_main.the_intensive.third_paragraph.text')})
      //setTourParagraphsState({first: t('happenings_main.the_tour.first_paragraph.text'), second: t('happenings_main.the_tour.second_paragraph.text'), second2: t('happenings_main.the_tour.second_paragraph.text2'), third: t('happenings_main.the_tour.third_paragraph.text')})
      //setBallParagraphsState({first: t('happenings_main.the_ball.first_paragraph.text'), second: t('happenings_main.the_ball.second_paragraph.text'), third: t('happenings_main.the_ball.third_paragraph.text')})
    
    }
  }, [isMobile, isMobileSmall, isTablet, t, videoArray])


  const [backgroundTransparency, setBackgroundTransparacy] = useState(0)
  const [boxShadow, setBoxShadow] = useState(0)
  const [isScrolledMobile, setIsScrolledMobile] = useState(false)
  
  useEffect(() => {
    if (window.innerWidth <= 1023) {
      const options = {
        threshold: 0,
        rootMargin: "0px",
      }
      const observer = new IntersectionObserver((entries, observer) => {
        entries.map(entry => {
          if(entry.isIntersecting) {
            setIsScrolledMobile(false)
            setBackgroundTransparacy(0)
            setBoxShadow(0)
          } else {
            setIsScrolledMobile(true)
            setBackgroundTransparacy(1)
            setBoxShadow(0.2)
          }
        })
      }, options)
      
      if(topSPHeaderHandleRef.current) {
        observer.observe(topSPHeaderHandleRef.current)
      } else {
        observer.unobserve(topSPHeaderHandleRef.current)
      }
    }
  }, [topSPHeaderHandleRef])

  const [changingImgUrl, setChangingImgUrl] = useState("/images/intensive_1.jpg")

  /*useEffect(() => {
    if (window.innerWidth >= 768) {
      const controlledAreaHeight = happeningsChangingImageControllArea.current.clientHeight
      const rootMargin = controlledAreaHeight * 0.63
      const options = {
        threshold: buildThresholdList(5),
        rootMargin: `0px 0px ${rootMargin}px 0px`,
      }
      const observer = new IntersectionObserver(entries => {
        entries.map(entry => {
          if (entry.isIntersecting) {
              if (entry.intersectionRatio >= 0 && entry.intersectionRatio < 0.2) {
                setChangingImgUrl("/images/intensive_1.jpg")
              } else if (entry.intersectionRatio >= 0.2 && entry.intersectionRatio < 0.4) {
                setChangingImgUrl("/images/intensive_2.jpg")
              } else if (entry.intersectionRatio >= 0.4 && entry.intersectionRatio < 0.6) {
                setChangingImgUrl("/images/intensive_3.jpg")
              } else if (entry.intersectionRatio >= 0.6 && entry.intersectionRatio < 0.8) {
                setChangingImgUrl("/images/intensive_4.jpg")
              } else if (entry.intersectionRatio >= 0.8 && entry.intersectionRatio < 1) {
                setChangingImgUrl("/images/intensive_5.jpg")
              } 
            }
        })
      }, options)
      if (happeningsChangingImageTarget.current) {
        observer.observe(happeningsChangingImageTarget.current)
      }
    } else {
      setChangingImgUrl("/images/intensive_3.gif")
    }
  }, [setChangingImgUrl])
*/
  return (
    <div className={utilStyles.overAllWrapper}>
      <div className={utilStyles.headerWrapperMobile}
        style={{
          background: `rgba(255, 255, 255, ${backgroundTransparency})`,
          boxShadow: `rgba(0 0 0 / ${boxShadow}) 0px 0px 20px 6px`,
          transitionDuration: ".3s",
        }}
      >
        <div className={utilStyles.headerLogo}>
            <Image
                src={headerLogo}
                alt="logo"
                width={239}
                height={64}
                objectFit="contain"
                priority
            />

        </div>
        
        <div className={`${utilStyles.mainMenuItem}`}
            onClick={()=>{
              setIsMenuDrawerOpen(true)
              handleScrollLock(true)
            }}>
          <div style={{color: headerLogoColor? '#000': isScrolledMobile ? '#000':'#fff'}} className={`${utilStyles.burgerMenuIcon}`}></div>
        </div>
      </div>
      <div style={{color: headerLogoColor?'#898989':'#fff'}} className={`${utilStyles.signatureFixed}`}>
        Hot since 2017
      </div>
        <ModalProvider>
          <div ref={toFormLink}>
            <FormAtTop
              isFlipped={isFlipped}
              mailInfo={mailInfoData}
              handleScrollLock={handleScrollLock}
              isMain={true}
              ></FormAtTop>
          </div>
        </ModalProvider>
        <div className={utilStyles.languageWrapper}>
          <span className={currentLocale == "en" ? utilStyles.languageActive : utilStyles.languageNotActive} onClick={() => {setCurrentLocale("en")}}><Link href={router.pathname} locale={"en"}>En</Link></span>
          <span className={currentLocale == "de" ? utilStyles.languageActive : utilStyles.languageNotActive} onClick={() => {setCurrentLocale("de")}} ><Link href={router.pathname} locale={"de"}>De</Link></span>
        </div>
        <div className={utilStyles.shoppingBagWrapper}>
          <a href={generatedLink}>
            <div className={`${utilStyles.shoppingBagInner}`}>
              <div className={utilStyles.shoppingBagIcon}>
                <Image
                    src={"/svg/shopping_bag.svg"}
                    alt="shopping bag"
                    layout='fill'
                    objectFit="contain"
                    priority
                />
              </div>
              <div className={utilStyles.shoppingBagNotification} style={{display: shoppingBagTotalQuantity != "" ? "block" : "none"}}>
                {shoppingBagTotalQuantity}
              </div>
            </div>
          </a>
        </div>
        <div style={{color: headerLogoColor?'#898989':'#fff'}} className={`${utilStyles.menuListPC} ${ transitionBoxOneVisible ? utilStyles.opacityZero : ""}`}>
          <ul>
            <li className={utilStyles.clickable}><Link href="#education">Education</Link></li>
            <li className={utilStyles.clickable}><Link href="#entertainment">Entertainment</Link></li>
            <li className={utilStyles.clickable}><Link href="#portfolio">Portfolio</Link></li>
            <li className={utilStyles.clickable}><Link href="#agency">Agency</Link></li>
            <li className={utilStyles.clickable}><Link href="#studio">Studio</Link></li>
            <li className={utilStyles.clickable}><Link href="#tickets">Tickets</Link></li>
            <li className={utilStyles.clickable}><Link href="#contact">Contact</Link></li>
          </ul>
        </div>
        <div ref={instaInfoRef} style={{
            color: isInstaInfo ? '#898989':'#fff', 
            transitionDuration: "0.3s",
          }} className={`${utilStyles.instagramFixed}  ${ transitionBoxOneVisible ? utilStyles.opacityZero : ""}`} >
          <div className={`${utilStyles.instagramIconImageWrapper}`} style={{ 
            transitionDuration: "0.5s",
            filter: isInstaInfo ? "invert(59%) sepia(0%) saturate(1559%) hue-rotate(207deg) brightness(92%) contrast(90%)" : "invert(100%) sepia(0%) saturate(8000%) hue-rotate(348deg) brightness(100%) contrast(100%)",}}>
            <Image
                src={"/svg/insta_icon_footer.svg"}
                alt="test"
                width={24}
                height={24}
                objectFit="contain"
                priority
            />
          </div>
          <div className={`${utilStyles.instaLink}`}><Link href="https://www.instagram.com/thecompanyberlin/" passHref={true}><a target='_blank'>@thecompanyberlin</a></Link></div>
          <div className={`${utilStyles.instaLink}`}><Link href="https://www.instagram.com/jouanasamia/" passHref={true}><a target='_blank'>@jouanasamia</a></Link></div>
        </div>
        <Drawer
            sx={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(100, 100, 100, 0.8) rgba(120, 120, 120, 0.8)',
            }}
            classes={{ paper:classes.drawerBackground }}
            anchor='right'
            open={isMenuDrawerOpen}
            onClose={() => {
                setIsMenuDrawerOpen(false)
                handleScrollLock(false)
            }}
        >
            <div className={utilStyles.drawerCloseButton} onClick={() => {
                setIsMenuDrawerOpen(false)
                handleScrollLock(false)
            }}></div> 
            <div className={utilStyles.menuMobileWrapper}>                                     
                <div onClick={() => {
                  setIsMenuDrawerOpen(false)
                  handleScrollLock(false)
                  sectionMoveTo(15, true)
                }}>
                  <div className={utilStyles.flipCardMobile}>
                    <div className={`${utilStyles.formButtonInner} `}>
                        <div>
                            {formType}
                        </div>
                    </div>
                  </div>
                </div>
              
                <div className={utilStyles.languageWrapperSP}>
                  <span className={currentLocale == "en" ? utilStyles.languageActive : utilStyles.languageNotActive} onClick={() => {setCurrentLocale("en")}}><Link href={router.pathname} locale={"en"}>En</Link></span>
                  <span className={currentLocale == "de" ? utilStyles.languageActive : utilStyles.languageNotActive} onClick={() => {setCurrentLocale("de")}}><Link href={router.pathname} locale={"de"}>De</Link></span>
                </div>
              <div className={`${utilStyles.menuListMobile}`}>
                <ul>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#education">Education</Link></li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#entertainment">Entertainment</Link></li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#portfolio">Portfolio</Link></li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#agency">Agency</Link></li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#studio">Studio</Link></li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#tickets">Tickets</Link></li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}><Link href="#contact">Contact</Link></li>
                </ul>
              </div>
            </div>  
        </Drawer>
        <CookieConsent
          location="bottom"
          buttonText="Ok!"
          cookieName="theCompanyMadeCookie"
          style={{ background: "#fff", color: "#363636", fontWeight: "400", fontSize: "15px", zIndex: "12000" }}
          buttonStyle={{  background: "#1c1c1c", color: "#fff", fontSize: "14px", borderRadius: "50px", padding: "13px 26px" }}
          expires={150}
        >
          We use third party cookies in order to personalise your site experience.
        </CookieConsent>
      <Head>
        <title>THECOMPANY BERLIN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0,user-scalable=1" />
        <meta property="og:image" content="/images/thecompany_facebook.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:image" content="/images/thecompany_twitter.png" />
        <meta name="twitter:image:type" content="image/png" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />

        <link rel="shortcut icon" href="/favicon.ico" />
        
      </Head>
      <div ref={transitionBoxOne} className={`${utilStyles.testScrolling} section`}>  
          <div ref={topSPHeaderHandleRef} 
            style={{
              width: "100%",
              height: "2px",
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: "0"
            }}></div>
          <div ref={areYou} >
              
          </div>
          <div ref={topWithVideo} className={`${utilStyles.test}`}>
            <HlsPlayerFullSizeDynamic
                mediaType={"topVideo"} 
                mediaURL={largeVideoTop}
                videoURL={largeVideoTop}
                playingInView={inTop}
                preload={'auto'}
            ></HlsPlayerFullSizeDynamic>
          </div>
      </div>
      <section id="about" ref={startFormLinkShowing} className="section fp-auto-height fp-auto-height-responsive">
        <div className='normalScroll'>
          <AboutIntro></AboutIntro>
        </div>
        
        <div className='normalScroll' ref={educationRef}>
          <div className={`${utilStyles.headContents}`}>
            <div id="education" className={utilStyles.headlineh1}>Education</div>
            <div className={utilStyles.introductionText} data-aos="fade-up" data-aos-offset="-120">
            {t("education_head.first_paragraph")}
            </div>
          </div>
          <div className={utilStyles.narrowVideo}>
            <NarrowVideo URL="/videos/narrow.mp4" playingInView={true} />
          </div>
          <div className={utilStyles.subIntroWrapper}>
            <div className={utilStyles.subIntroText} data-aos="fade-up" data-aos-offset="-80">
              <div className={utilStyles.subIntroInner} >{t("education_head.second_paragraph")}</div>
            </div>
          </div>
          <div className={utilStyles.educationAreaWrapper}>
            <ModalProvider>
             <EduSwipeArea listedContents={eduContents[0]} playingInView={inEducation}></EduSwipeArea>
            </ModalProvider>
          </div>
        </div>
        <div className='normalScroll'>
          <div ref={entertainmentRef} className={`${utilStyles.headContents} ${utilStyles.headContentsBlackbg}`}>
            <div id="entertainment" className={utilStyles.headlineh1}>Entertainment</div>
            <div className={utilStyles.entertainmentTextWrapper}>
              <div className={utilStyles.introductionTextEntertainment} data-aos="fade-up" data-aos-offset="-120">
              {t("entertainment_head.first_paragraph")}
              </div>
            
              <div className={utilStyles.subIntroWrapperEntertainment}>
                <div className={utilStyles.subIntroTextEntertainment} data-aos="fade-up" data-aos-offset="-80">
                  <div className={utilStyles.subIntroInnerEntertainment} >{t("entertainment_head.second_paragraph")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='section fp-auto-height-responsive'>
          <div ref={entertainmentSwipeRef} className={`mediaInViewSelector ${utilStyles.pictureAndVideo} ${utilStyles.happeningSwiper} ${utilStyles.isVisible}`}>
              <EntertainmentSwipeArea
                listedContents={entertainmentContents[0]}
                setEntertainmentPlaying={inEntertainment}
              ></EntertainmentSwipeArea>
          </div>
      </section>
      
      <section ref={ballMedia} className='section'>
        <div id="portfolio" ref={formLinkFlippingBrands} className={`${utilStyles.brandBackground} ${utilStyles.positionRelative} section fp-auto-height-responsive`}>
          <div ref={brandRef}>
            <ModalProvider>
              <div className={utilStyles.bigWordSp}>Portfolio</div>
              <div className={utilStyles.bigRotatedWord}>
                <Image
                    src="/images/Portfolio.png"
                    alt="portfolio"
                    objectFit="contain"
                    layout="fill"
                />
              </div>
              <Brand locale={currentLocale} strapiURL={strapiUrl} brands={brandsLocale} mailInfo={mailInfoData}></Brand>
            </ModalProvider>
          </div>
        </div>
      </section>

      <div ref={agencyFull} className={utilStyles.bufferedAreaAgency}>
        <div className={utilStyles.bufferedAreaAgencyTitle}>AGENCY</div>
            <HlsPlayerFullSizeDynamic
                mediaType={"topVideo"} 
                mediaURL={largeVideoAgency}
                videoURL={largeVideoAgency}
                playingInView={inAgency}
                preload={'none'}
            ></HlsPlayerFullSizeDynamic>
      </div>
      <div className={utilStyles.bufferedAreaAgencySmall}></div>
      <section id="agency" className={`${utilStyles.dancerProfileBackground} section fp-auto-height-responsive`}>
        <div className={`${isScrollLock ? "dancerListModal" : ""}`}>
          <ModalProvider>
            <DancerProfile 
              strapiURL={strapiUrl} 
              dancers={dancers.data}
              handleScrollLock={handleScrollLock}
              mailInfo={mailInfoData}
            ></DancerProfile>
          </ModalProvider>
        </div>
      </section>
      <section id="studio" ref={formLinkFlippingArtists} className={`${utilStyles.artistBackground} ${utilStyles.positionRelative} section fp-auto-height-responsive`}>
        <div ref={artistRef}>
          <ModalProvider>
            <div className={utilStyles.bigWordSp}>Studio</div>
            <div className={utilStyles.bigRotatedWordArtists}>
              <Image
                  src="/images/Studio.png"
                  alt="studio"
                  objectFit="contain"
                  layout="fill"
              />
            </div>
            <Studio strapiURL={strapiUrl} studio={studio.data} mailInfo={mailInfoData}></Studio>
          </ModalProvider>
        </div>
      </section>
      <div id="tickets" ref={shopRef} className={`${isScrollLock ? "shopListModal" : ""}`}>
          <ModalProvider>
            <Shop 
              strapiURL={strapiUrl} 
              events={events}
              handleScrollLock={handleScrollLock}
              shoppingBagHandle={shoppingBagHandle}
              locale={currentLocale}
            ></Shop>
          </ModalProvider>
        </div>
      <section id="contact" ref={footerRef} className={`section fp-auto-height-responsive`}>
        <div className={`normalScroll`}>
          <div className={`${utilStyles.letsGetInTouch} ${utilStyles.footerWithForm}`}>
            <div className={`${utilStyles.footerWithFormImageWrapper}`}>
              <Image
                src={GetInTouchSVG}
                alt={'logo'}
                objectFit="contain"
                width={824}
                height={GetInTouchSVGHeight}
                layout={'responsive'}
                priority
              />
            </div>
            <FormAtFooter
              mailInfo={mailInfoData}
              isMain={true}
            ></FormAtFooter>
          </div>
          <div className={`footer`}>
            <FooterParts
              mailInfo={mailInfoData}
              isMain={true}
            ></FooterParts>
          </div>
        </div>
      </section>
    </div>
  )
}

export function buildThresholdList(num) {
  const thresholds = [0]
  const numSteps = num
  for(let i = 1; i <= numSteps; i++) {
      const ratio = i / numSteps
      thresholds.push(ratio)
  }
  return thresholds
}

export function startAnimation(height) {
  const perMoved = Math.round(height / 7)
}

export function makeComponentList(strapiURL, item) {
  return item.attributes.ImageOrVideo.map((component) => {
      let contentsPreviewPhotoUrl = ""
      let contentsPreviewVideoUrl = ""
      if (component.MediaType === "Video") {
        contentsPreviewPhotoUrl =  component.PreviewPhoto.data ? strapiURL + component.PreviewPhoto.data.attributes.url : ""
        contentsPreviewVideoUrl = component.Media.data ? strapiURL + component.Media.data.attributes.url : ""
      }
      return {
          id: component.id,
          mediaType: component.MediaType,
          mediaURL: component.Media.data ? strapiURL + component.Media.data.attributes.url : "",
          contentsPreviewPhotoUrl: contentsPreviewPhotoUrl,
          contentsPreviewVideoUrl: contentsPreviewVideoUrl,
          //vimeoURL: component.VimeoURL
      }
  })
}

export function classifyItems(strapiURL, items, category) {
  const itemList = []
  items.map((item) => {
      if(item.attributes.Category === category) {
          itemList.push(makeComponentList(strapiURL, item))
      }
  })
  return itemList
}
export function getVideoArray(strapiURL, items) {
  const list = []
  items.data.map(item => {
    list.push({
      position: item.attributes.VideoPosition,
      desktopVideo: strapiURL + item.attributes.VideoForDesktop.data.attributes.url,
      mobileVideo: strapiURL + item.attributes.VideoForMobile.data.attributes.url,
    })
  })
  return list
}
export function getVideoUrl(position, deviceType, arr) {
  const data = arr.find(el =>{
    return el.position === position
  })
  if(deviceType === "Desktop") {
    return data.desktopVideo
  } else if (deviceType === "Mobile") {
    return data.mobileVideo
  } else {
    return
  }
}
export function getMailInfo(mailInfo) {
  return mailInfo.data.map((item) => {
    return {
      usage: item.attributes.Usage,
      port: item.attributes.port,
      host: item.attributes.hostName,
      email: item.attributes.email,
    }
  })
}

export function convertEventDate(events, today) {
  //console.log(today.getUTCFullYear())
  let newArray = []
  const items = summerizedItems(events)
  usingTestCase(false, items)
  items.map(item => {
    const month = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOBEMBER","DECEMBER"]
    //const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    //const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    //ex) Fri, Dec 17, 7:00 PM
    const targetDT = item.date
    const patternTimeShort = /\d{1,2}-\d{1,2}H/gi
    const patternTimeLong = /\d{1,2}.\d{1,2}-\d{1,2}.\d{1,2}H/gi
    const patternTwoDays = /\d{1,2}(ST|ND|RD|TH) & \d{1,2}(ST|ND|RD|TH) [a-z,A-Z]{3,9}/gi
    //ex) "20.30-22.00H" "11-13H" "27TH & 28TH FEBRUARY" "21.00-22.30H" "16TH-18TH JUNE 23"

    if(targetDT?.match(patternTimeShort) || targetDT?.match(patternTimeLong)) {
      const location = getLocation(item.description)
      
      item.eventList.map(event => {
        const dateAndTime = event.title.match(/\d{1,2}.\d{1,2}/g)
        const separateDate = dateAndTime[0].split(".")
        const tempObj = {
          title: item.title, //.toUpperCase(),
          date: item.date,
          price: event.price,
          variantId: event.variantId,
          startDate: separateDate[1] <= 2 && today.getUTCMonth() >= 10 ? (today.getUTCFullYear() + 1) + "/" + separateDate[1] + "/" + separateDate[0] : today.getUTCFullYear() + "/" + separateDate[1] + "/" + separateDate[0],
          endDate: separateDate[1] <= 2 && today.getUTCMonth() >= 10 ? (today.getUTCFullYear() + 1) + "/" + separateDate[1] + "/" + separateDate[0] : today.getUTCFullYear() + "/" + separateDate[1] + "/" + separateDate[0],
          link: item.link,
          location: location,
        }
        newArray.push(tempObj)
      })
    } else if(targetDT?.match(patternTwoDays)) {
      
      const target = item.date
      const dateAndMonth = target.split(/\s/gi)
      const targetMonth = month.indexOf(dateAndMonth[dateAndMonth.length - 1]) + 1 | ""
      const location = getLocation(item.description)
        item.eventList.map((event, index) => {
          const startDateNum = dateAndMonth[0].match(/\d{1,2}/gi)
          const endDateNum = dateAndMonth[2].match(/\d{1,2}/gi)
          const tempObj = {
            title: item.title,//.toUpperCase(),
            date: item.date,
            price: event.price,
            variantId: event.variantId,
            startDate: targetMonth <= 2 && today.getUTCMonth() >= 10 ? (today.getUTCFullYear() + 1) + "/" + targetMonth + "/" + startDateNum : today.getUTCFullYear() + "/" + targetMonth + "/" + startDateNum,
            endDate: targetMonth <= 2 && today.getUTCMonth() >= 10 ? (today.getUTCFullYear() + 1) + "/" + targetMonth + "/" + endDateNum : today.getUTCFullYear() + "/" + targetMonth + "/" + endDateNum,
            link: item.link,
            location: location,
          }
          newArray.push(tempObj)
        })
    } else {
      const location = getLocation(item.description)
      
      item.eventList.map(event => {
        const tempObj = {
          title: item.title, //.toUpperCase(),
          date: "",
          price: event.price,
          variantId: event.variantId,
          startDate: "",
          endDate: "",
          link: item.link,
          location: location,
        }
        newArray.push(tempObj)
      })
    }
  })
  const result = sortArrayByDate(newArray, today)
  return result
}
export function sortArrayByDate(arr, today) {
  const result = []
  const sortArray = arr.sort((a,b) => {
    return new Date(a.startDate) - new Date(b.startDate)
  })
  sortArray.map(el => {
    const targetDate = new Date(el.startDate)
    if(today < targetDate || today.toDateString() === targetDate.toDateString()) {
      result.push(el)
    }
  })
  return result
}
export function getLocation(txt) {
  const descriptions = txt.split("\n")
  const searchWord = /location:/gi
  const foundEl = descriptions.find(el => el.match(searchWord))
  if(foundEl) {
    const removeWord = foundEl.match(/location: /gi)
    return foundEl.replace(removeWord[0], "")
  } else {
    return descriptions[descriptions.length - 1]
  }
}
export function usingTestCase(bool, items) {
  if(bool) {
    const testCase = {
        date: "27TH & 28TH MARCH",
        eventList: [{
          price: "130.00",
          title: "Default Title",
          variantId: "44238974943496",
        }],
        id : 999,
        link: "https://thecompanyberlin.com/products/communitytuesday-i-andradapopovici-i-13-07-2021-i-19-21-30h-i-commercialhiphop",
        plainTextTitle: "MALOUlinders I TWO DAYS THEBALL I 27TH & 28TH MARCH",
        title: "MALOU<b>linders</b> I TWO DAYS THEBALL",
        description: "<p>STREETJAZZ W/ MALOU LINDERS</p>\n<p><meta charset=\"UTF-8\"><span>MONDAY 27TH 10.45AM - 02.15PM</span></p>\n<p><meta charset=\"UTF-8\"><span>TUESDAY 28TH 8.30PM - 11PM</span></p>\n<p>TANZRAUM WEDDING</p>"
    }
    const newArrayWithCase = items.push(testCase)
    return newArrayWithCase
  } else {
    return items
  }
}
export function summerizedItems(events) {
  return events.map((event, index) => {
  
      const dataFromTitle = retrievingInfoFromTitle(event.node.title)
      const titleAndId = convertTitleAndId(event.node.variants.edges)
      //console.log(titleAndId)
      return {
          id: index,
          title: dataFromTitle.title,
          plainTextTitle: event.node.title,
          date: dataFromTitle.date,
          eventList: titleAndId,
          link: event.node.onlineStoreUrl,
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

  if( data.length > 2) {
      
      convertedTitle = convertTitle(data[0]) + ' I ' + data[1]
      convertedDate = convertDate(data[2])
  } else {
      convertedTitle = convertTitle(data[0])
      convertedDate = convertDate(data[1])
  }

  return {
      title: convertedTitle,
      date: convertedDate,
  }
}

export function convertTitleAndId(items) {
  return items.map(item => {
      //const decodedVariantId = Buffer.from(item.node.id, 'base64').toString()
      //console.log(decodedVariantId)
      const VariantId = createVariantId(item.node.id)//decodedVariantId)
      return {
          title: item.node.title,
          price: item.node.price,
          variantId: VariantId,
          base64vid: item.node.id,
      }
  })
}

export function createVariantId(str) {
  const strArr = str.split("/")
  return strArr[strArr.length - 1]
}

export function convertTitle(title) {

  const upperCase = title.match(/[A-Z]+/)
  const lowerCase = title.match(/[a-z]+/)
  
  if (lowerCase) {
    return upperCase + '<b>' + lowerCase[0].toUpperCase() + '</b>'
  } else {
      return title
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
  const shoppingData = sortingArrayToText(arr_bag)
  return mainCartAddress + shoppingData.join(',')
}

export function sortingArrayToText(items) {
  return items.map((item) => {
      return item.variantId + ":" + item.quantity
  })
}

export function createQueryList(bag) {
  const vid = bag[0].base64vid
  const new_arr = {"quantity" : bag[0].quantity, "variantId" : vid}
  const response = createCart(new_arr)
  //const cartID = getCartId(response)
}