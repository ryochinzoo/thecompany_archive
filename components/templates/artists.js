import { useState } from "react"
import ArtistDescriptionAndSwipe from "../organisms/artistDescriptionAndSwipe"
import utilStyles from "../../styles/utils.module.css"
import Modal from 'react-modal'
import FormInModal from '../molecules/formInModal'
import CommonStyle from '../../styles/commonParts.module.css'

export default function Artist({ strapiURL, artists, mailInfo }) {
    const [artistState, setArtistState] = useState(0) //0 is all, other number should be ID for each artist
    const artistNames =  listedItems(strapiURL, artists)
    const artistTargetContents = summerizedItems(strapiURL, artists)
    const [ formModalShowState, setFormModalShowState ] = useState(false)
    const [ isContentChanged, setIsContentChanged ] = useState(false)
    const [ isMenuClicked, setIsMenuClicked ] = useState(false)

    const handleSwiperUpdate = (newValue) => {
        setIsContentChanged(newValue)
    }
    const isMenuClickedCheck = (newValue) => {
        const icc = newValue
        setIsMenuClicked(icc)
    }
    const handleChange = (newValue) => {
        setArtistState(newValue)
    }
    
    const modalShowStateHandle = (newValue) => {
        setFormModalShowState(newValue)
    }

    const getFontColor = (id) => {
        if (artistState === id) {
            return utilStyles.letterColorBlack
        } else {
            return utilStyles.letterColorRed
        }
    }
    return(
        <div className={[utilStyles.templateMargin, utilStyles.letterColorBlack].join(" ")}>
            <ArtistDescriptionAndSwipe 
                isMenuClicked={isMenuClickedCheck}
                handleChange={handleChange} 
                isContentChanged={isContentChanged}
                handleSwiperUpdate={handleSwiperUpdate}
                artistState={artistState} 
                displayTargetData={artistTargetContents[artistState - 1]} 
                dataForAll={artistNames} /> 
            <ul className={utilStyles.contentsItemList}>
                <li className={[getFontColor(0), utilStyles.cursorPointer].join(" ")} key={0} onClick={() => {
                    setArtistState(0)
                    handleSwiperUpdate(true)
                    isMenuClickedCheck(true)
                }}>
                    All
                </li>
                {artistNames.map((artist, index) => {
                    return (
                        <li  key={index} className={[getFontColor(artist.id), utilStyles.cursorPointer].join(" ")} onClick={() => {
                            setArtistState(artist.id)
                            handleSwiperUpdate(true)
                            isMenuClickedCheck(true)
                        }}>
                            {artist.name}
                        </li>
                    )
                })}
            </ul>
            <div className={`${utilStyles.bookingRequestButtonSPWrapper}`}
                onClick={() => {
                    setFormModalShowState(true)
                }}>
                <div className={`${utilStyles.bookingRequestButtonSP}`}>BOOKING REQUEST</div>
            </div>
            <Modal
                style={{overlay:{zIndex:10000, backgroundColor: "#FA5253", position: "fixed"}, contents:{}}} 
                className={`${CommonStyle.formTopStyle}`}
                isOpen={formModalShowState}
                ariaHideApp={false}
            >
                <FormInModal
                    modalShowStateHandle = {modalShowStateHandle}
                    mailInfo={mailInfo}
                ></FormInModal>
            </Modal>
        </div>
    )
}


//a list of names
export function listedItems(strapiURL, items){
    return items.map((item) => {
        const displayPictureUrl = strapiURL + item.attributes.ArtistComponent[0].ImageOrVideo.data.attributes.url
        return {
            id: item.id,
            name: item.attributes.Name,
            displayPictureUrl: displayPictureUrl
        }
    })
}

//processing function to compact only data for use
export function summerizedItems(strapiURL, items) {
    return items.map((item) => {
        const Components = artistComponent(strapiURL, item)
        return {
            id: item.id,
            name: item.attributes.Name,
            description: item.attributes.Description,
            components: Components,
        }
    })
}

export function artistComponent(strapiURL, item) {
    return item.attributes.ArtistComponent.map((component) => {
        const mediaType = component.MediaType
        const MediaURL = createURLByType(strapiURL, mediaType, component)
        const gifURL = createURLByType(strapiURL, "Image", component)
        return {
            projectId: component.id,
            projectMediaURL: MediaURL,
            projectMediaWidth: component.ImageOrVideo.data.attributes.width,
            projectMediaHeight: component.ImageOrVideo.data.attributes.height,
            projektGifURL: gifURL,
            projectDescription: component.ArtistProjectDescription,
            mediaType: mediaType,
        }
    })
}

export function createURLByType(strapiURL, mediaType, media) {
    if (mediaType == "Image" || mediaType == "Video") {
        return strapiURL + media.ImageOrVideo.data.attributes.url
    } else if (mediaType == "VimeoLink") {
        return media.VimeoURL
    }
}