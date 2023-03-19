import { useState } from "react"
import SwipeArea from "../molecules/artistSwipeArea"
import Image from "next/image"
import utilStyles from "../../styles/utils.module.css"

export default function ArtistDescriptionAndSwipe({isMenuClicked, handleChange, artistState, displayTargetData, dataForAll, isContentChanged, handleSwiperUpdate}) {
    let contents
    let swipeArea
    if (artistState === 0) {
        contents=<div className={utilStyles.descriptionForAll}>
            here should be in description for all, this is a dummy sentence
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
                            <div className={utilStyles.contentsDescriptionForTemplate}>{displayTargetData.description}</div>
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