import Image from "next/image"
import utilStyles from "../../styles/descriptionAndSwipe.module.css"
import { useTranslation } from 'next-i18next'
import dynamic from 'next/dynamic'

const SwipeArea = dynamic(() => import("../molecules/swipeArea"))

export default function DescriptionAndSwipe({isMenuClicked, handleChange, brandState, displayTargetData, dataForAll, isContentChanged, handleSwiperUpdate }) {
    let contents
    let swipeArea
    const { t } = useTranslation("common")
    if (brandState === 0) {
        contents=<div className={`${utilStyles.descriptionForAll} ${utilStyles.brandsDescriptionColor}`}>
            {t("brands.main_description")}<span className={utilStyles.logoFontThin}>THE</span><span className={utilStyles.logoFontBold}>COMPANY</span>{t("brands.main_description2")}
            </div>
        swipeArea=<SwipeArea 
                    handleChange={handleChange} 
                    brandState={brandState} 
                    isMenuClicked={isMenuClicked}
                    isContentChanged={isContentChanged}
                    handleSwiperUpdate={handleSwiperUpdate}
                    listedContents={dataForAll[brandState]}
                    allData={dataForAll} />
    } else {
        contents=<div className={utilStyles.descriptionAreaForTemplate}>
                        <div className={utilStyles.contentsLogoForDescriptionArea}>
                            <div className={utilStyles.tenplatesGap}></div>
                            <div className={utilStyles.brandLogoSvg}>
                            <Image 
                                src={displayTargetData[0].logoImgUrl} 
                                alt="clicked image would be appeared" 
                                layout="fill"
                                objectFit="contain" />
                            </div>
                        </div>
                        <div>
                            <div className={utilStyles.contentsNameForTemplate}>{displayTargetData[0].name}</div>
                            <div className={`${utilStyles.contentsDescriptionForTemplate} ${utilStyles.brandsDescriptionColor}`}>{displayTargetData[0].description}</div>
                        </div>
                    </div>
        swipeArea=<SwipeArea 
                    handleChange={handleChange} 
                    brandState={brandState} 
                    isMenuClicked={isMenuClicked}
                    isContentChanged={isContentChanged}
                    handleSwiperUpdate={handleSwiperUpdate}
                    listedContents={dataForAll[brandState]}
                    allData={dataForAll} />
    }
    return (
        <> 
           <div className={utilStyles.logoAndDescription}>

                {contents}
            </div>
            {swipeArea}
        </>
    )
}