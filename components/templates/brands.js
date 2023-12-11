import { useState } from "react"
import Modal from 'react-modal'
import CommonStyle from '../../styles/brands.module.css'
import dynamic from 'next/dynamic'

const FormInModal = dynamic(() => import('../molecules/formInModal'))
const DescriptionAndSwipe = dynamic(() => import("../organisms/descriptionAndSwipe"))

export default function Brand({ locale, strapiURL, brands,  mailInfo }) {
    const [brandState, setBrandState] = useState(0) //0 is all, other number should be ID for each brand
    const brandNames =  listedItems(strapiURL, brands)
    const brandTargetContents = summerizedItems(strapiURL, brands)
    const [ formModalShowState, setFormModalShowState ] = useState(false)
    const [ isContentChanged, setIsContentChanged ] = useState(false)
    const [ isMenuClicked, setIsMenuClicked ] = useState(false)
    const [ descriptionInLocale, setDescriptionInLocale ] = useState()
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
            return CommonStyle.letterColorWhite
        } else {
            return CommonStyle.letterColorRed
        }
    }
    return(
        <div className={[CommonStyle.templateMargin, CommonStyle.letterColorWhite].join(" ")}>
            <DescriptionAndSwipe 
                isMenuClicked={isMenuClickedCheck}
                handleChange={handleChange} 
                isContentChanged={isContentChanged}
                handleSwiperUpdate={handleSwiperUpdate}
                brandState={brandState} 
                displayTargetData={brandTargetContents[brandState]} 
                dataForAll={brandTargetContents} /> 
            <ul className={CommonStyle.contentsItemList}>
                <li className={[getFontColor(0), CommonStyle.cursorPointer].join(" ")} key={0} 
                onClick={() => {
                    setBrandState(0)
                    handleSwiperUpdate(true)
                    isMenuClickedCheck(true)
                }}>
                    All
                </li>
                {brandNames.map((brand, index) => {
                    return (
                        <li  key={index} className={[getFontColor(index + 1), CommonStyle.cursorPointer].join(" ")} 
                        onClick={() => {
                            setBrandState(index + 1)
                            handleSwiperUpdate(true)
                            isMenuClickedCheck(true)
                        }}>
                            {brand.name}
                        </li>
                    )
                })}
            </ul>
            <div className={`${CommonStyle.bookingRequestButtonSPWrapper}`}
                onClick={() => {
                    setFormModalShowState(true)
                }}>
                <div className={`${CommonStyle.bookingRequestButtonSP}`}>BOOKING REQUEST</div>
            </div>
            <Modal
                style={{overlay:{zIndex:10000, backgroundColor: "#FA5253", position: "fixed"}, contents:{}}} 
                className={`${CommonStyle.formTopStyle}`}
                isOpen={formModalShowState}
                ariaHideApp={false}
            >
                <FormInModal
                    modalShowStateHandle={modalShowStateHandle}
                    mailInfo={mailInfo}
                    isMain={true}
                ></FormInModal>
            </Modal>
        </div>
    )
}


//a list of names
export function listedItems(strapiURL, items){
    return items.map((item, index) => {
        let logoImgUrl = ""
        if(item.attributes.Logo.data?.attributes?.url) {
            logoImgUrl = strapiURL + item.attributes.Logo.data?.attributes?.url
        } else {
            logoImgUrl = "/images/NoImageTrans.png"
        }
        const displayPictureUrl = strapiURL + item.attributes.BrandComponent[0].PreviewPhoto.data?.attributes.url
        return {
            id: index,
            name: item.attributes.Name,
            logoImgUrl: logoImgUrl,
            displayPictureUrl: displayPictureUrl
        }
    })
}

//processing function to compact only data for use
export function summerizedItems(strapiURL, items) {
    const forAllContentes = []
    const eachContents = []
    const arr = []
    items.map((item, index) => {
        const displayPictureUrl = strapiURL + item.attributes.BrandComponent[0].PreviewPhoto.data.attributes.url
        const displayPictureWidth = item.attributes.BrandComponent[0].PreviewPhoto.data.attributes.width
        const displayPictureHeight = item.attributes.BrandComponent[0].PreviewPhoto.data.attributes.height
        const previewVideoURL = strapiURL + item.attributes.BrandComponent[0].PreviewVideo.data.attributes.url
        let logoImgUrl = ""
        if(item.attributes.Logo.data?.attributes?.url) {
            logoImgUrl = strapiURL + item.attributes.Logo.data?.attributes?.url
        } else {
            logoImgUrl = "/images/NoImageTrans.png"
        }
        arr.push({
            id: index + 1,
            name: item.attributes.Name,
            description: item.attributes.Description,
            logoImgUrl: logoImgUrl,
            displayPictureUrl: displayPictureUrl,
            previewVideoUrl: previewVideoURL,
            displayPictureWidth: displayPictureWidth,
            displayPictureHeight: displayPictureHeight,
        })
        eachContents.push(brandComponent(strapiURL, item))
    })
    forAllContentes.push(arr)
    const result = forAllContentes.concat(eachContents)
    return result
}

export function brandComponent(strapiURL, item) {
    let logoImgUrl = ""
        if(item.attributes.Logo.data?.attributes?.url) {
            logoImgUrl = strapiURL + item.attributes.Logo.data?.attributes?.url
        } else {
            logoImgUrl = "/images/NoImageTrans.png"
        }
    return item.attributes.BrandComponent.map((component, index) => {
        const mediaType = component.MediaType
        const MediaURL = createURLByType(strapiURL, mediaType, component)
        const previewPhotoURL = createURLByType(strapiURL, "Image", component)
        const previewVideoURL = createURLByType(strapiURL, "PreviewVideo", component)
        return {
            id: index,
            name: item.attributes.Name,
            description: item.attributes.Description,
            logoImgUrl: logoImgUrl,
            projectId: component.id,
            projectName: component.BrandProjectName,
            projectMediaURL: MediaURL,
            projectMediaWidth: component.PreviewPhoto.data.attributes.width,
            projectMediaHeight: component.PreviewPhoto.data.attributes.height,
            displayPictureUrl: previewPhotoURL,
            previewVideoUrl: previewVideoURL,
            projectDescription: component.BrandProjectDescription,
            mediaType: mediaType,
        }
    })
}

export function createURLByType(strapiURL, mediaType, media) {
    if (mediaType == "Image") {
        return strapiURL + media.PreviewPhoto.data.attributes.url
    } else if (mediaType == "PortfolioVideo") {
        return strapiURL + media.playingVideo.data.attributes.url
    } else if (mediaType == "PreviewVideo") {
        return strapiURL + media.PreviewVideo.data.attributes.url
    }
}