import { useState } from "react"
import Modal from 'react-modal'
import CommonStyle from '../../styles/studio.module.css'
import dynamic from 'next/dynamic'

const FormInModal = dynamic(() => import('../molecules/formInModal'))
const StudioDescriptionAndSwipe = dynamic(() => import('../organisms/studioDescriptionAndSwipe'))

export default function Studio({ strapiURL, studio, mailInfo }) {
    const studioImageList = listedItems(strapiURL, studio)
    const [ formModalShowState, setFormModalShowState ] = useState(false)
    const modalShowStateHandle = (newValue) => {
        setFormModalShowState(newValue)
    }
    return(
        <div className={[CommonStyle.templateMargin, CommonStyle.letterColorBlack].join(" ")}>
            <StudioDescriptionAndSwipe
                data={studioImageList} />
                

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
export function listedItems(strapiURL, items){
    return items[0].attributes.media.map((item) => {
        const displayPictureUrl = strapiURL + item.Media.data.attributes.url
        let contentsPreviewPhotoUrl = ""
        let contentsPreviewVideoUrl = ""
        if (item.MediaType === "Video") {
            contentsPreviewPhotoUrl =  item.PreviewPhoto.data ? strapiURL + item.PreviewPhoto.data.attributes.url : ""
            contentsPreviewVideoUrl = item.Media.data ? strapiURL + item.Media.data.attributes.url : ""
        }
        return {
            id: item.id,
            displayPictureUrl: displayPictureUrl,
            mediaType: item.MediaType,
            contentsPreviewPhotoUrl: contentsPreviewPhotoUrl,
            contentsPreviewVideoUrl: contentsPreviewVideoUrl,
        }
    })
}