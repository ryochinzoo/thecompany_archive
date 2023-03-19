import { useState } from "react"
import DescriptionAndSwipe from "../organisms/descriptionAndSwipe"
import utilStyles from "../../styles/utils.module.css"
import Image from "next/image"
import Modal from 'react-modal'
import FormInModal from '../molecules/formInModal'
import CommonStyle from '../../styles/commonParts.module.css'

export default function Brand({ strapiURL, brands, mailInfo }) {
    
    const [brandState, setBrandState] = useState(0) //0 is all, other number should be ID for each brand
    const brandNames =  listedItems(strapiURL, brands)
    const brandTargetContents = summerizedItems(strapiURL, brands)
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
        setBrandState(newValue)
    }
    const modalShowStateHandle = (newValue) => {
        setFormModalShowState(newValue)
    }
    const getFontColor = (id) => {
        if (brandState === id) {
            return utilStyles.letterColorWhite
        } else {
            return utilStyles.letterColorRed
        }
    }
    return(
        <div className={[utilStyles.templateMargin, utilStyles.letterColorWhite].join(" ")}>
            <DescriptionAndSwipe 
                isMenuClicked={isMenuClickedCheck}
                handleChange={handleChange} 
                isContentChanged={isContentChanged}
                handleSwiperUpdate={handleSwiperUpdate}
                brandState={brandState} 
                displayTargetData={brandTargetContents[brandState - 1]} 
                dataForAll={brandNames} /> 
            <ul className={utilStyles.contentsItemList}>
                <li className={[getFontColor(0), utilStyles.cursorPointer].join(" ")} key={0} 
                onClick={() => {
                    setBrandState(0)
                    handleSwiperUpdate(true)
                    isMenuClickedCheck(true)
                }}>
                    All
                </li>
                {brandNames.map((brand, index) => {
                    return (
                        <li  key={index} className={[getFontColor(brand.id), utilStyles.cursorPointer].join(" ")} 
                        onClick={() => {
                            setBrandState(brand.id)
                            handleSwiperUpdate(true)
                            isMenuClickedCheck(true)
                        }}>
                            {brand.name}
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
        const displayPictureUrl = strapiURL + item.attributes.BrandComponent[0].ImageOrVideo.data.attributes.url
        return {
            id: item.id,
            name: item.attributes.Name,
            logoImgUrl: strapiURL + item.attributes.Logo.data.attributes.url,
            displayPictureUrl: displayPictureUrl
        }
    })
}

//processing function to compact only data for use
export function summerizedItems(strapiURL, items) {
    return items.map((item) => {
        const Components = brandComponent(strapiURL, item)
        
        return {
            id: item.id,
            name: item.attributes.Name,
            description: item.attributes.Description,
            logoImgUrl: strapiURL + item.attributes.Logo.data.attributes.url,
            components: Components,
        }
    })
}

export function brandComponent(strapiURL, item) {
    return item.attributes.BrandComponent.map((component) => {
        const mediaType = component.MediaType
        const MediaURL = createURLByType(strapiURL, mediaType, component)
        const gifURL = createURLByType(strapiURL, "Image", component)
        return {
            projectId: component.id,
            projectName: component.BrandProjectName,
            projectMediaURL: MediaURL,
            projectMediaWidth: component.ImageOrVideo.data.attributes.width,
            projectMediaHeight: component.ImageOrVideo.data.attributes.height,
            projektGifURL: gifURL,
            projectDescription: component.BrandProjectDescription,
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