import { useState } from "react"
import SwipeArea from "../molecules/artistSwipeArea"
import Image from "next/image"
import utilStyles from "../../styles/utils.module.css"
import { useTranslation, withTranslation, Trans, initReactI18next } from 'next-i18next'

export default function ArtistDescriptionAndSwipe({isMenuClicked, handleChange, artistState, displayTargetData, dataForAll, isContentChanged, handleSwiperUpdate}) {
    let contents
    let swipeArea
    const { t } = useTranslation("common")
    if (artistState === 0) {
        contents=<div className={`${utilStyles.descriptionForAll} ${utilStyles.artistsDescriptionColor}`}>
            {t("artists.main_description")}<span className={utilStyles.logoFontThin}>THE</span><span className={utilStyles.logoFontBold}>COMPANY</span>{t("artists.main_description2")}
            </div>
        swipeArea=<SwipeArea 
                    isMenuClicked={isMenuClicked}
                    handleChange={handleChange} 
                    isContentChanged={isContentChanged}
                    handleSwiperUpdate={handleSwiperUpdate}
                    artistState={artistState} 
                    listedContents={dataForAll} />
    } else {
        contents=<div className={utilStyles.descriptionAreaForTemplate}>
                        <div className={utilStyles.contentsLogoForDescriptionArea}>
                            <div className={utilStyles.tenplatesGap}></div>
                        </div>
                        <div>
                            <div className={utilStyles.contentsNameForTemplate}>{displayTargetData.name}</div>
                            <div className={`${utilStyles.contentsDescriptionForTemplate} ${utilStyles.artistsDescriptionColor}`}>{displayTargetData.description}</div>
                        </div>
                    </div>
        swipeArea=<SwipeArea 
                    isMenuClicked={isMenuClicked}
                    handleChange={handleChange} 
                    isContentChanged={isContentChanged}
                    handleSwiperUpdate={handleSwiperUpdate}
                    artistState={artistState} 
                    listedContents={displayTargetData} />
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