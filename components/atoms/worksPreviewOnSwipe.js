import { useState } from 'react'
import Image from 'next/image'
import VideoPlayer from 'react-player'
import HappeningStyle from '../../styles/happenings.module.css'
import DancerStyle from '../../styles/dancerProfile.module.css'

export default function WorksPreviewOnSwipe({init, selectedWork, type, media, isVerticalClicked}) {
    const work = init
    let contents
    const [isPlaying, setIsPlaying] = useState(false)

    if (selectedWork === 0) {
        contents = <Image 
            src={isVerticalClicked? media : work}
            alt="clicked image would be appeared"
            objectFit="contain"
            layout="fill"
            priority
        />
    } else if (type === "Image") {
        contents = <Image 
            src={isVerticalClicked? media : work}
            alt="clicked image would be appeared"
            objectFit="contain"
            layout="fill"
            priority
        />
    } else if (type === "Video" && selectedWork !== 0) {
        contents = <div>
            <div className={`${DancerStyle.playButtonMiddle} ${isPlaying ? HappeningStyle.fadeOutAnimation : ""}`}
                onClick={()=>{
                    setIsPlaying(!isPlaying)
                }}
            >
                <div className={DancerStyle.playButtonMarkMiddle}></div>
            </div>
            <VideoPlayer
                className={DancerStyle.reactPlayerDancerPreview}
                url={isVerticalClicked? media : work}
                width="100%"
                height="50vh"
                playing={isPlaying}
                muted={true}
            />
        </div>
    } else if (type === "YoutubeLink" && selectedWork !== 0) {
        
    }

    return (
        <>
            {contents}
        </>
    )
}