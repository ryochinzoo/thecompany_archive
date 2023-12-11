import utilStyles from "../../styles/studioDescriptionAndSwipe.module.css"
import { useTranslation, Trans } from 'next-i18next'
import dynamic from 'next/dynamic'

const SwipeArea = dynamic(() => import("../molecules/studioSwipeArea"))
export default function StudioDescriptionAndSwipe({data}) {
    let contents
    let swipeArea
    const { t } = useTranslation("common")
    contents=<div className={`${utilStyles.studioDescriptionForAll} ${utilStyles.artistsDescriptionColor}`}>
        <Trans i18nKey={"studio.main_description"} /><a style={{"textDecoration" : "underline"}} href="mailto:studio@thecompanyberlin.com">studio@thecompanyberlin.com</a><Trans i18nKey={"studio.main_description2"} />
        </div>
    swipeArea=<SwipeArea 
                listedContents={data} />
    return (
        <> 
           <div className={utilStyles.logoAndDescription}>
                {contents}
            </div>
            {swipeArea}
        </>
    )
}