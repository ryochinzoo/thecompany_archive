import { useState } from "react"
import SwipeArea from "../molecules/swipeArea"
import Image from "next/image"
import utilStyles from "../../styles/utils.module.css"

export default function DescriptionAndSwipe({isMenuClicked, handleChange, brandState, displayTargetData, dataForAll, isContentChanged, handleSwiperUpdate }) {
    let contents
    let swipeArea
    if (brandState === 0) {
        contents=<div className={`${utilStyles.descriptionForAll} ${utilStyles.brandsDescriptionColor}`}>
            Velit nibh proin lacinia lacus venenatis nulla. Ultricies dui eros, ac enim facilisis tempus facilisis scelerisque quis. Quis ac nam aliquet placerat vitae auctor porttitor vitae. Blandit nibh at massa, at volutpat massa duis nulla id.
            </div>
        swipeArea=<SwipeArea 
                    handleChange={handleChange} 
                    brandState={brandState} 
                    isMenuClicked={isMenuClicked}
                    isContentChanged={isContentChanged}
                    handleSwiperUpdate={handleSwiperUpdate}
                    listedContents={dataForAll} />
    } else {
        contents=<div className={utilStyles.descriptionAreaForTemplate}>
                        <div className={utilStyles.contentsLogoForDescriptionArea}>
                            <div className={utilStyles.tenplatesGap}></div>
                            <div className={utilStyles.brandLogoSvg}>
                                <Image 
                                src={displayTargetData.logoImgUrl} 
                                alt="clicked image would be appeared" 
                                layout="fill"
                                objectFit="contain" />
                            </div>
                        </div>
                        <div>
                            <div className={utilStyles.contentsNameForTemplate}>{displayTargetData.name}</div>
                            <div className={`${utilStyles.contentsDescriptionForTemplate} ${utilStyles.brandsDescriptionColor}`}>{displayTargetData.description}</div>
                        </div>
                    </div>
        swipeArea=<SwipeArea 
                    handleChange={handleChange} 
                    brandState={brandState} 
                    isMenuClicked={isMenuClicked}
                    isContentChanged={isContentChanged}
                    handleSwiperUpdate={handleSwiperUpdate}
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