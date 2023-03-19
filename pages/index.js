import React, { createContext, useEffect, useState, useRef, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NormalLink from 'next/link'
import Overlay from '../components/templates/overlay'
import utilStyles from '../styles/utils.module.css'
import { ModalProvider } from '../context/modalContext'
import { LanugageProvider, useLanguageContext } from '../context/languageContext'
import { createStyles, Drawer, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Brand from '../components/templates/brands'
import Artist from '../components/templates/artists'
import Shop from '../components/templates/shop'
import { strapiHandler, getStrapiURL } from "./api/strapiHandler"
import About from '../components/templates/about'
import AboutIntro from '../components/templates/aboutIntro'
import { ParallaxProvider } from 'react-scroll-parallax'
import ReactFullpage from "@fullpage/react-fullpage"
import TopStyle from '../styles/top.module.css'
import HappeningStyle from '../styles/happenings.module.css'
import DancerProfile from '../components/templates/dancerProfile'
import FormAtTop from '../components/templates/formAtTop'
import FormAtFooter from '../components/templates/formAtFooter'
import FooterParts from '../components/templates/footerParts'
import NarrowVideo from '../components/atoms/narrowVideo'

import "swiper/css"
import "swiper/css/navigation"
import 'aos/dist/aos.css'
import { useInView } from "react-intersection-observer"
import HappeningsEventContentsB from "../components/atoms/happeningEventContentsPartsSecond"
import HappeningSwipe from '../components/molecules/happeningSwipe'
import HappeningEventSwipe from '../components/molecules/happeningEventSwipe'
import HappeningsTextData from '../src/happenings.json'

import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getAllProducts } from './api/shopifyHandler'
import FormButton from '../components/atoms/formButton'

export async function getStaticProps() {
  const events = await getAllProducts()
  const mailInfo = await strapiHandler("/mail-infos")
  const brands = await strapiHandler("/brands", {
    populate: {
      Logo: {
        populate: "*"
      },
      BrandComponent: { //repeatable Group, Array
        populate: "*"
      },
    }
  })
  const artists = await strapiHandler("/artists", {
    populate: {
      ArtistComponent: { //repeatable Group, Array
        populate: "*"
      },
    }
  })
  const happenings = await strapiHandler("/happenings", {
    populate: {
      ImageOrVideo: {
        populate: "*"
      },
    }
  })
  const dancers = await strapiHandler("/dancers", {
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
  })
  return {
    props: {
      brands,
      artists,
      happenings,
      dancers,
      events,//parseShopifyResponse(events),
      mailInfo,
    },
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
export default function Home({ brands, artists, happenings, dancers, events, mailInfo }) {
  //console.log(events)
  
  let today = new Date()
  const eventDateList = convertEventDate(events, today)
  const strapiUrl = getStrapiURL()
  const toFormLink = useRef()
  const startFormLinkShowing = useRef()
  const windowHeightRef = useRef()
  const topWithVideo = useRef()
  const areYouScrollFadeOut = useRef()
  const areYou = useRef() 
  const happeningsChangingImageTarget = useRef()
  const happeningsChangingImageControllArea = useRef()
  //const transitionBoxOne = useRef()
  const classes = useStyles()
  const mailInfoData = getMailInfo(mailInfo)
  const formLinkFlippingBrands = useRef()
  const formLinkFlippingArtists = useRef()
  const happeningsIntensive = classifyItems(strapiUrl, happenings.data, "THEINTENSIVE")
  const happeningsTour = classifyItems(strapiUrl, happenings.data, "THETOUR")
  const happeningsBall = classifyItems(strapiUrl, happenings.data, "THEBALL")
  //const happeningsClasses = classifyItems(strapiUrl, happenings.data, "THECLASSES")

  const { ref: intensiveMedia, inView: intensiveMediaVisible } = useInView({ threshold: 0.5, triggerOnce: true, })
  const { ref: tourMedia, inView: tourMediaVisible } = useInView({threshold: 0.5, triggerOnce: true, })
  const { ref: ballMedia, inView: ballMediaVisible } = useInView({threshold: 0.5, triggerOnce: true, })
  const { ref: transitionBoxOne, inView: transitionBoxOneVisible } = useInView({threshold: 0.01, triggerOnce: false, })
  
  //const { ref: firstSection, inView: firstSectionMenuInvisible } = useInView({threshold: 0.1})


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

  const [happeningsHeadlineStates, setHappeningsHeadlineStates] = useState({intensiveMoveDown: false, tourMoveDown: false, ballMoveDown: false, classesMoveDown: false})
  const [isFlipped, setIsFlipped] = useState(false)
  const [isInLoading, setIsInLoading] = useState(false)
  const [firstSectionMenuInvisible, setFirstSectionMenuInvisible] = useState(false)
  const [isScrollLock, setIsScrollLock] = useState(false)
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false)
  const [language, setLanguage] = useState("English")
  const handleScrollLock = (newValue) => {
    setIsScrollLock(newValue)
  }
  
  const [headerLogoColor, setHeaderLogoColor] = useState(false)
  function sectionMoveTo(num, bool) {
    fullpage_api.moveTo(num)
    setTimeout(()=>{ setHeaderLogoColor(bool) }, (isMobile || isMobileSmall || isTablet) ? 800 : 2000)
  }

  const onLeave = (origin, destination, direction) => {
    /*
    if (origin.index == 1 && direction =="down") {
      fullpage_api.setScrollingSpeed(1000)
      if (areYou.current.classList.contains(`${TopStyle.fadingInAreYou}`)) {
        areYou.current.classList.add(`${TopStyle.fadingOutAreYou}`)
        areYou.current.classList.remove(`${TopStyle.fadingInAreYou}`)
      } else if(!areYou.current.classList.contains(`${TopStyle.fadingOutAreYou}`) && !areYou.current.classList.contains(`${TopStyle.fadingInAreYou}`)) {
        areYou.current.classList.add(`${TopStyle.fadingOutAreYou}`)
      }
    }

    if (origin.index == 2 && direction == "up") {
      if (areYou.current.classList.contains(`${TopStyle.fadingOutAreYou}`)) {
        areYou.current.classList.remove(`${TopStyle.fadingOutAreYou}`)
        areYou.current.classList.add(`${TopStyle.fadingInAreYou}`)    
      }
    }
    */
    if (origin.index == 1 && direction == "up") {
      setTimeout(()=>{ setHeaderLogoColor(false) },(isMobile || isMobileSmall || isTablet) ? 0 : 800)
    }
    if (origin.index == 0 && direction == "down") {
      setTimeout(()=>{ setHeaderLogoColor(true) }, (isMobile || isMobileSmall || isTablet) ? 0 :2000)
    }
    if (origin.index == 3 && direction == "down" || origin.index == 5 && direction == "down" || origin.index == 7 && direction == "down") {
      
    }
    if (destination.index == originSectionHappeningsIntensiveDescription && direction == "down") {      
      setHappeningsHeadlineStates(prevArray => ({...prevArray, intensiveMoveDown: true}))
      setHeaderLogoColor(false)
    }

    if (origin.index == originSectionHappeningsIntensiveDescription && direction == "up") {
      setHappeningsHeadlineStates(prevArray => ({...prevArray, intensiveMoveDown: false}))
      setHeaderLogoColor(true)
    }
    if (destination.index == originSectionHappeningsIntensivePortfolio && direction == "down") {
      setHeaderLogoColor(true)
    }

    if (origin.index == originSectionHappeningsIntensivePortfolio && direction == "up") {
      setHeaderLogoColor(false)
    }

    if (destination.index == originSectionHappeningsTourDescription && direction == "down") {
      setHappeningsHeadlineStates(prevArray => ({...prevArray, tourMoveDown: true}))
      setHeaderLogoColor(false)
    }

    if (origin.index == originSectionHappeningsTourDescription && direction == "up") {
      setHappeningsHeadlineStates(prevArray => ({...prevArray, tourMoveDown: false}))
      setHeaderLogoColor(true)
    }
    if (destination.index == originSectionHappeningsTourPortfolio && direction == "down") {
      setHeaderLogoColor(true)
    }

    if (origin.index == originSectionHappeningsTourPortfolio && direction == "up") {
      setHeaderLogoColor(false)
    }


    if (destination.index == originSectionHappeningsBallDescription && direction == "down") {
      setHappeningsHeadlineStates(prevArray => ({...prevArray, ballMoveDown: true}))
      setHeaderLogoColor(false)
    }

    if (origin.index == originSectionHappeningsBallDescription && direction == "up") {
      setHappeningsHeadlineStates(prevArray => ({...prevArray, ballMoveDown: false}))
      setHeaderLogoColor(true)
    }
    if (origin.index == originSectionHappeningsBallPortfolio && direction == "up") {
      setTimeout(()=>{ setHeaderLogoColor(false) },(isMobile || isMobileSmall || isTablet) ? 0 : 800)
      setHappeningsHeadlineStates(prevArray => ({...prevArray, ballMoveDown: true, tourMoveDown: true, intensiveMoveDown: true}))
    }
    if (destination.index == originSectionHappeningsBallPortfolio && direction == "down") {
      setTimeout(()=>{ setHeaderLogoColor(false) },(isMobile || isMobileSmall || isTablet) ? 0 : 2000)
    }
    if (destination.index == originSectionShop && direction == "up") {
      setTimeout(()=>{ setHeaderLogoColor(false) },(isMobile || isMobileSmall || isTablet) ? 0 : 800)
    }
    if (destination.index == originSectionBrands && direction == "down") {
      setTimeout(()=>{ setHeaderLogoColor(true) },(isMobile || isMobileSmall || isTablet) ? 0 : 2000)
    }
    if (destination.index == originSectionShop && direction == "down" || destination.index == originSectionBrands && direction == "down" || origin.index == originSectionArtists && direction == "up"  ) {
      setIsFlipped(true)
    }
    if (origin.index == originSectionShop && direction == "up" || destination.index == originSectionArtists && direction == "down"  ) {
      setIsFlipped(false)
    }
    if (destination.index == originSectionArtists && direction == "down" || destination.index == originSectionBrands && direction == "up") {
      fullpage_api.setScrollingSpeed(4000)
    }
    if (destination.index == originSectionAgency && direction == "down" || destination.index == originSectionShop && direction == "up") {
      fullpage_api.setScrollingSpeed(2000)
    }
    
  }
  
  const afterLoad = (origin, destination, direction) => {

    if (origin.index == 0) {
      fullpage_api.setScrollingSpeed((isMobile || isMobileSmall) ? 800 : 2000)
      if(isDesktop || isDesktopLarge) {
        //fullpage_api.fitToSection()
        //setTimeout(() => setIsInLoading(true), 6000)
      } 
    } else {
      setIsInLoading(true)
      setFirstSectionMenuInvisible(false)
    }
    if (origin.index == 1) {
      //fullpage_api.setScrollingSpeed(2000)
      return false
    }
    if(origin.index == 2) {
      //fullpage_api.setScrollingSpeed(1000)
    }
    if(origin.index == 8) {
      //fullpage_api.setScrollingSpeed(2000)
    }
  }
  useEffect(() => {
    if (isScrollLock) {
      fullpage_api.setAllowScrolling(false)
      fullpage_api.setKeyboardScrolling(false)
    } else {
      fullpage_api.setAllowScrolling(true)
      fullpage_api.setKeyboardScrolling(true)
    }
  })
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
  useEffect(() => {
    if(isMobile || isMobileSmall){
      setIntensiveParagraphsState({first: HappeningsTextData.data.the_intensive_sp.first_paragraph.text, second: HappeningsTextData.data.the_intensive_sp.second_paragraph.text, third: HappeningsTextData.data.the_intensive_sp.third_paragraph.text})
      setTourParagraphsState({first: HappeningsTextData.data.the_tour_sp.first_paragraph.text, second: HappeningsTextData.data.the_tour_sp.second_paragraph.text, third: HappeningsTextData.data.the_tour_sp.third_paragraph.text})
      setBallParagraphsState({first: HappeningsTextData.data.the_ball_sp.first_paragraph.text, second: HappeningsTextData.data.the_ball_sp.second_paragraph.text, third: HappeningsTextData.data.the_ball_sp.third_paragraph.text})
    } else {
      setIntensiveParagraphsState({first: HappeningsTextData.data.the_intensive.first_paragraph.text, second: HappeningsTextData.data.the_intensive.second_paragraph.text, third: HappeningsTextData.data.the_intensive.third_paragraph.text})
      setTourParagraphsState({first: HappeningsTextData.data.the_tour.first_paragraph.text, second: HappeningsTextData.data.the_tour.second_paragraph.text, third: HappeningsTextData.data.the_tour.third_paragraph.text})
      setBallParagraphsState({first: HappeningsTextData.data.the_ball.first_paragraph.text, second: HappeningsTextData.data.the_ball.second_paragraph.text, third: HappeningsTextData.data.the_ball.third_paragraph.text})
    
    }
  }, [isMobile, isMobileSmall])


  const [backgroundTransparency, setBackgroundTransparacy] = useState(0)
  const [boxShadow, setBoxShadow] = useState(0)
  const [isScrolledMobile, setIsScrolledMobile] = useState(false)
  const [lastPosition, setLastPosition] = useState(0)
  const headerHeight = 82

  useEffect(() => {
    if (window.innerWidth <= 1023) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  const handleScroll = useCallback(() => {
    const offset = window.pageYOffset
    const screenY = window.screenY
    if (window.innerWidth <= 1023) {
      if (offset > 0 || screenY > 0) {
        setIsScrolledMobile(true)
        setBackgroundTransparacy(1)
        setBoxShadow(0.2)
      } else {
        setIsScrolledMobile(false)
        setBackgroundTransparacy(0)
        setBoxShadow(0)
      }
      if (offset < lastPosition){
        setIsScrolledMobile(true)
        setBackgroundTransparacy(1)
        setBoxShadow(0.2)
      }
      setLastPosition(offset)
    }
  }, [lastPosition])

  const [changingImgUrl, setChangingImgUrl] = useState("aaa")

  useEffect(() => {
    const controlledAreaHeight = happeningsChangingImageControllArea.current.clientHeight
    const rootMargin = controlledAreaHeight * 0.6
    const options = {
      threshold: buildThresholdList(5),
      rootMargin: `0px 0px ${rootMargin}px 0px`,
    }
    const observer = new IntersectionObserver(entries => {
      entries.map(entry => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0 && entry.intersectionRatio < 0.2) {
            setChangingImgUrl("aaa")
          } else if (entry.intersectionRatio >= 0.2 && entry.intersectionRatio < 0.4) {
            setChangingImgUrl("bbb")
          } else if (entry.intersectionRatio >= 0.4 && entry.intersectionRatio < 0.6) {
            setChangingImgUrl("ccc")
          } else if (entry.intersectionRatio >= 0.6 && entry.intersectionRatio < 0.8) {
            setChangingImgUrl("ddd")
          } else if (entry.intersectionRatio >= 0.8 && entry.intersectionRatio < 1) {
            setChangingImgUrl("eee")
          }
        }
      })
    }, options)
    if (happeningsChangingImageTarget.current) {
      observer.observe(happeningsChangingImageTarget.current)
    }
  })

  return (
    <div className={utilStyles.overAllWrapper}>
      <div className={utilStyles.headerWrapperMobile}
        style={{
          background: `rgba(255, 255, 255, ${backgroundTransparency})`,
          boxShadow: `rgba(0 0 0 / ${boxShadow}) 0px 0px 20px 6px`,
          transitionDuration: ".3s",
        }}
      >
        <div style={{backgroundColor: headerLogoColor && !isMenuDrawerOpen ? '#000': isScrolledMobile ? '#000':'#fff'}} className={utilStyles.headerLogo}></div>
        
        <div className={`${utilStyles.mainMenuItem}`}
            onClick={()=>{
              setIsMenuDrawerOpen(true)
              handleScrollLock(true)
            }}>
          <div style={{color: headerLogoColor? '#000': isScrolledMobile ? '#000':'#fff'}} className={`${utilStyles.burgerMenuIcon}`}></div>
        </div>
      </div>
      <div style={{color: headerLogoColor?'#898989':'#fff'}} className={`${utilStyles.signatureFixed}`}>
        Hot since 2017 By Jouana Samia
      </div>
        <ModalProvider>
          <div ref={toFormLink}>
            <FormAtTop
              isFlipped={isFlipped}
              mailInfo={mailInfoData}
              handleScrollLock={handleScrollLock}
              ></FormAtTop>
          </div>
        </ModalProvider>
        <div className={utilStyles.languageWrapper}>
          <span onClick={()=>{setLanguage("English")}}>En</span>
          <span onClick={()=>{setLanguage("Deutsch")}}>De</span>
        </div>
        <div style={{color: headerLogoColor?'#898989':'#fff'}} className={`${utilStyles.menuListPC} ${ transitionBoxOneVisible ? utilStyles.opacityZero : ""}`}>
          <ul>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionAbout, true)
                  setHappeningsHeadlineStates({intensiveMoveDown: false, tourMoveDown: false, ballMoveDown: false, classesMoveDown: false})
                }}>About</li>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionHappenings, true)
                  setHappeningsHeadlineStates({intensiveMoveDown: false, tourMoveDown: false, ballMoveDown: false, classesMoveDown: false})
                }}>Happenings</li>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionShop, false)
                  setHappeningsHeadlineStates({intensiveMoveDown: true, tourMoveDown: true, ballMoveDown: true, classesMoveDown: true})
                }}>Shop</li>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionBrands, false)
                  setHappeningsHeadlineStates({intensiveMoveDown: true, tourMoveDown: true, ballMoveDown: true, classesMoveDown: true})
                }}>Brands</li>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionArtists, true)
                  setHappeningsHeadlineStates({intensiveMoveDown: true, tourMoveDown: true, ballMoveDown: true, classesMoveDown: true})
                }}>Artists</li>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionAgency, true)
                  setHappeningsHeadlineStates({intensiveMoveDown: true, tourMoveDown: true, ballMoveDown: true, classesMoveDown: true})
                }}>The Agency</li>
            <li className={utilStyles.clickable} 
                onClick={()=>{
                  sectionMoveTo(originSectionContact, true)
                  setHappeningsHeadlineStates({intensiveMoveDown: true, tourMoveDown: true, ballMoveDown: true, classesMoveDown: true})
                }}>Contact</li>
          </ul>
        </div>
        <div style={{color: headerLogoColor?'#000':'#fff'}} className={`${utilStyles.instagramFixed}  ${ transitionBoxOneVisible ? utilStyles.opacityZero : ""}`} >
          <div className={`${utilStyles.instagramIconImageWrapper}`}>
            <Image
                src={headerLogoColor ? "/images/insta_icon_footer.png" : "/images/insta_icon_footer_white.png"}
                alt="test"
                width={24}
                height={24}
                objectFit="contain"
                priority
            />
          </div>
          <div className={`${utilStyles.instaLink}`}>@Jouana</div>
          <div className={`${utilStyles.instaLink}`}>@THECOMPANY</div>
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
                            Get in Touch
                        </div>
                    </div>
                  </div>
                </div>
              
                <div className={utilStyles.languageWrapperSP}>
                    <span onClick={()=>{setLanguage("English")}}>En</span>
                    <span onClick={()=>{setLanguage("Deutsch")}}>De</span>
                </div>
              <div className={`${utilStyles.menuListMobile}`}>
                <ul>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionAbout, true)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>About</li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionHappenings, true)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>Happenings</li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionShop, false)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>Shop</li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionBrands, false)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>Brands</li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionArtists, true)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>Artists</li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionAgency, true)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>The Agency</li>
                  <li className={utilStyles.clickable} 
                      onClick={()=>{
                        sectionMoveTo(originSectionContact, true)
                        setIsMenuDrawerOpen(false)
                        handleScrollLock(false)
                      }}>Contact</li>
                </ul>
              </div>
            </div>  
        </Drawer>
      
      <Head>
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <ReactFullpage
            licenseKey= {'8B4AB060-C9B4404D-84A91675-CDE71AEC'}
            scrollingSpeed = {2000}
            onLeave={onLeave}
            afterLoad={afterLoad}
            normalScrollElements={'.normalScroll, .dancerListModal, .shopListModal, .MuiDrawer-modal'}
            scrollBar={true}
            bigSectionsDestination={"top"}
            autoScrolling={true}
            scrollOverflow={false}
            fitToSectionDelay={20}
            responsiveWidth={1023}
            render={({ state, fullpageApi }) => {
                return (
                  <ReactFullpage.Wrapper>
                    <div ref={transitionBoxOne} className={`${TopStyle.testScrolling} section`}>
                        <div ref={areYou} className={`${TopStyle.areYou}`} >
                            
                        </div>
                        <div ref={topWithVideo} className={`${utilStyles.test}`}>
                            
                        </div>
                    </div>
                    <section ref={startFormLinkShowing} className="section fp-auto-height fp-auto-height-responsive">
                      <div className='normalScroll'>
                        <AboutIntro></AboutIntro>
                      </div>
                      <div className='normalScroll'>
                        <ParallaxProvider>
                          <About></About>
                        </ParallaxProvider>
                      </div>
                    </section>
                    <section className='section fp-auto-height-responsive'>
                      <div className='normalScroll'>
                        <div className={`${HappeningStyle.headContents}`}>
                          <div className={HappeningStyle.headlineh1}>Happenings</div>
                          <div className={HappeningStyle.introductionText} data-aos="fade-up" data-aos-offset="-120">
                              Introduction text here<br />
                              laoreet morbi. Fermentum,<br />
                              mattis egestas consequat,<br />
                              eget potenti dictum.<br />
                          </div>
                          <div className={HappeningStyle.subIntroText} data-aos="fade-up" data-aos-offset="-80">
                              Neque, habitant aenean fermentum,<br />
                              velit sed gravida at. At eros tortor<br />
                              sagittis convallis ac varius enim.
                          </div>
                        </div>
                        <div className={HappeningStyle.narrowVideo}>
                          <NarrowVideo URL="https://vimeo.com/750316024/3e6d10ef88" />
                        </div>
                        <div className={HappeningStyle.ticketSwipe}>
                          
                          <div className={`${HappeningStyle.happeningSwiper} ${HappeningStyle.colorRed} ${HappeningStyle.upcoming}`} >Upcoming Events:</div>
                          <HappeningEventSwipe items={eventDateList}></HappeningEventSwipe>
                          
                        </div>
                      </div>
                    </section>
                    <section className='section fp-auto-height-responsive'>
                      <div className={`${HappeningStyle.mainContents} normalScroll`}>
                        <div>
                          <div className={`${HappeningStyle.MenuNameIntensive} ${happeningsHeadlineStates.intensiveMoveDown ? HappeningStyle.translate210 : HappeningStyle.translateBack}`}>THE<b>INTENSIVE</b></div>
                          <div className={`${HappeningStyle.theContents}`}>
                            <div className={`${HappeningStyle.stickedArea}`}>
                                {changingImgUrl}
                            </div>
                            <div ref={happeningsChangingImageControllArea} className={HappeningStyle.explanation}>
                              <div className={HappeningStyle.firstParagraph} dangerouslySetInnerHTML={{__html: intensiveParagraphsState.first}}></div>
                              <div className={HappeningStyle.secondParagraph} dangerouslySetInnerHTML={{__html: intensiveParagraphsState.second}}></div>
                              <div className={HappeningStyle.thirdParagraph} dangerouslySetInnerHTML={{__html: intensiveParagraphsState.third}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section ref={happeningsChangingImageTarget} className='section fp-auto-height-responsive'>
                        <div ref={intensiveMedia} className={`mediaInViewSelector ${HappeningStyle.pictureAndVideo} ${HappeningStyle.happeningSwiper} ${intensiveMediaVisible ? HappeningStyle.isVisible : ""}`}>
                            <HappeningSwipe 
                                items={happeningsIntensive}
                            ></HappeningSwipe>
                        </div>
                    </section>
                    <section className='section fp-auto-height-responsive'>
                      <div className={`${HappeningStyle.mainContents} normalScroll`}>
                      <div>
                          <div className={`${HappeningStyle.MenuName} ${happeningsHeadlineStates.tourMoveDown ? HappeningStyle.translate180 : HappeningStyle.translateBack}`}>THE<b>TOUR</b></div>
                          <div className={`${HappeningStyle.theContentsReverse}`}>
                              <div className={HappeningStyle.stickedArea}>
                                  <div className={`${HappeningStyle.happeningSwiper} ${HappeningStyle.upcoming2}`} >
                                  Upcoming Event:
                                  </div>
                                  <HappeningsEventContentsB items={eventDateList} target={"tour"}></HappeningsEventContentsB>
                              </div>
                              <div className={HappeningStyle.explanation}>
                                <div className={HappeningStyle.firstParagraph} dangerouslySetInnerHTML={{__html: tourParagraphsState.first}}></div>
                                <div className={HappeningStyle.secondParagraph} dangerouslySetInnerHTML={{__html: tourParagraphsState.second}}></div>
                                <div className={HappeningStyle.thirdParagraph} dangerouslySetInnerHTML={{__html: tourParagraphsState.third}}></div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className='section'>
                      <div ref={tourMedia} className={`mediaInViewSelector ${HappeningStyle.pictureAndVideo} ${HappeningStyle.happeningSwiper} ${tourMediaVisible ? HappeningStyle.isVisible : ""}`}>
                          <HappeningSwipe 
                              items={happeningsTour}
                          ></HappeningSwipe>
                      </div>
                    </section>
                    <section className='section fp-auto-height-responsive'>
                      <div className={`${HappeningStyle.mainContents} normalScroll`}>
                        <div>
                          <div className={`${HappeningStyle.MenuName} ${happeningsHeadlineStates.ballMoveDown ? HappeningStyle.translate180 : HappeningStyle.translateBack}`}>THE<b>BALL</b></div>
                          <div className={`${HappeningStyle.theContentsReverse}`}>
                              <div className={HappeningStyle.stickedArea}>
                                <div className={`${HappeningStyle.happeningSwiper} ${HappeningStyle.upcoming2}`} >
                                    Upcoming Event:
                                </div>
                                <HappeningsEventContentsB items={eventDateList} target={"ball"}></HappeningsEventContentsB>
                              </div>
                              <div className={HappeningStyle.explanation}>
                                <div className={HappeningStyle.firstParagraph} dangerouslySetInnerHTML={{__html: ballParagraphsState.first}}></div>
                                <div className={HappeningStyle.secondParagraph} dangerouslySetInnerHTML={{__html: ballParagraphsState.second}}></div>
                                <div className={HappeningStyle.thirdParagraph} dangerouslySetInnerHTML={{__html: ballParagraphsState.third}}></div>
                              </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className='section'>
                      <div ref={ballMedia} className={`mediaInViewSelector ${HappeningStyle.pictureAndVideo} ${HappeningStyle.happeningSwiper} ${ballMediaVisible ? HappeningStyle.isVisible : ""}`}>
                          <HappeningSwipe 
                              items={happeningsBall}
                          ></HappeningSwipe>
                      </div>
                    </section>
                    <section className={`section fp-auto-height-responsive`}>
                      <div className={`${isScrollLock ? "shopListModal" : ""}`}>
                        <ModalProvider>
                          <Shop 
                            strapiURL={strapiUrl} 
                            events={events}
                            handleScrollLock={handleScrollLock}
                          ></Shop>
                        </ModalProvider>
                      </div>
                    </section>
                    <section ref={formLinkFlippingBrands} className={`${utilStyles.brandBackground} section fp-auto-height-responsive`}>
                      <ModalProvider>
                        <div className={utilStyles.bigWordSp}>Brands</div>
                        <div className={utilStyles.bigRotatedWord}>
                          <Image
                              src="/images/Brands.png"
                              alt="brands"
                              objectFit="contain"
                              layout="fill"
                          />
                        </div>
                        <Brand strapiURL={strapiUrl} brands={brands.data} mailInfo={mailInfoData}></Brand>
                      </ModalProvider>
                    </section>
                    <div className={utilStyles.bufferWhite}></div>
                    <section ref={formLinkFlippingArtists} className='section fp-auto-height-responsive'>
                      <ModalProvider>
                        <div className={utilStyles.bigWordSp}>Artists</div>
                        <div className={utilStyles.bigRotatedWordArtists}>
                          <Image
                              src="/images/Artists.png"
                              alt="artists"
                              objectFit="contain"
                              layout="fill"
                          />
                        </div>
                        <Artist strapiURL={strapiUrl} artists={artists.data} mailInfo={mailInfoData}></Artist>
                      </ModalProvider>
                    </section>
                    <div className={utilStyles.gradationToGold}></div>
                    <div className={utilStyles.bufferedAreaAgency}>
                      <div className={utilStyles.bufferedAreaAgencyTitle}>THE<b>AGENCY</b></div>
                    </div>
                    <div className={utilStyles.bufferedAreaAgencySmall}></div>
                    <section className={`${utilStyles.dancerProfileBackground} section fp-auto-height-responsive`}>
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
                    <div className={utilStyles.gradationToWhite}></div>
                    <section className={`section fp-auto-height-responsive`}>
                      <div className={`normalScroll`}>
                        <div className={`${utilStyles.letsGetInTouch} ${utilStyles.footerWithForm}`}>
                          <div className={`${utilStyles.footerWithFormImageWrapper}`}>
                            <Image
                              src={'/svg/GetInTouch.svg'}
                              alt={'logo'}
                              objectFit="contain"
                              width={824}
                              height={328}
                              layout={'responsive'}
                              priority
                            />
                          </div>
                          <FormAtFooter
                            mailInfo={mailInfoData}
                          ></FormAtFooter>
                        </div>
                        <div className={`footer`}>
                          <FooterParts
                            mailInfo={mailInfoData}
                          ></FooterParts>
                        </div>
                      </div>
                    </section>
                  </ReactFullpage.Wrapper>
                )
            }}
        />
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
      return {
          id: component.id,
          mediaType: component.Type,
          //mediaURL: strapiURL + component.Media.data.attributes.url || "",
          vimeoURL: component.VimeoURL
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
    //ex) "20.30-22.00H" "11-13H" "27TH & 28TH FEBRUARY"
    if(targetDT.match(patternTimeShort) || targetDT.match(patternTimeLong)) {
      const location = getLocation(item.description)
      item.eventList.map(event => {
        const dateAndTime = event.title.match(/\d{1,2}.\d{1,2}/g)
        const separateDate = dateAndTime[0].split(".")
        const tempObj = {
          title: item.title.toUpperCase(),
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
    } else if(targetDT.match(patternTwoDays)) {
      const target = item.date
      const dateAndMonth = target.split(/\s/gi)
      const targetMonth = month.indexOf(dateAndMonth[dateAndMonth.length - 1]) + 1 | ""
      const location = getLocation(item.description)
        item.eventList.map((event, index) => {
          const startDateNum = dateAndMonth[0].match(/\d{1,2}/gi)
          const endDateNum = dateAndMonth[2].match(/\d{1,2}/gi)
          const tempObj = {
            title: item.title.toUpperCase(),
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
      console.log("error")
      console.log(item)
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
    if(today < targetDate) {
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
      //console.log(titleAndPrice)
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
      const decodedVariantId = Buffer.from(item.node.id, 'base64').toString()
      const VariantId = createVariantId(decodedVariantId)
      return {
          title: item.node.title,
          price: item.node.price,
          variantId: VariantId,
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