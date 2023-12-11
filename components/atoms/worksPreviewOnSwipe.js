import { useState } from 'react'
import Image from 'next/image'
import DancerStyle from '../../styles/worksPreviewOnSwipe.module.css'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

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
            loading='lazy'
            decoding="async"
        />
    } else if (type === "Image") {
        contents = <Image 
            src={isVerticalClicked? media : work}
            alt="clicked image would be appeared"
            objectFit="contain"
            layout="fill"
            loading='lazy'
            decoding="async"
        />
    } else if (type === "Video" && selectedWork !== 0) {
        contents = <div>
            <div className={`${DancerStyle.playButtonMiddle} ${isPlaying ? DancerStyle.fadeOutAnimation : ""}`}
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
                playsinline={true}
            />
        </div>
    }

    return (
        <>
            {contents}
        </>
    )
}