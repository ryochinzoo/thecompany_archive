import { useState } from 'react'
import Image from "next/image"
import dancerStyles from '../../styles/dancerContentsFullSlide.module.css'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('react-player/lazy'))
const SoundButton = dynamic(() => import('./soundButton'))

export default function DancerFullSlideContents({ mediaType, mediaURL }) {
    let contents
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const handleSoundSwitch = (newValue) => {
        setIsMuted(prev => {return newValue})
    }

    if(mediaType === "Image") {
        contents = <div className={dancerStyles.positionRelative}><Image
            src={mediaURL}
            alt={mediaType}
            objectFit="contain"
            layout="fill"
            sizes='100vw'
            loading="lazy"
        /></div>
    } else if (mediaType ==="Video") {
        contents = <div className={dancerStyles.positionRelative}>
             <div className={dancerStyles.soundIcon} style={{zIndex: 9998}}>
                <SoundButton
                    isMuted={isMuted}
                    handleSoundSwitch={handleSoundSwitch}
                ></SoundButton>
            </div>
            <div className={dancerStyles.playerWrapper}  onClick={()=>{
                    setIsPlaying(!isPlaying)
                }}>
                <div className={`${dancerStyles.playButtonMiddle} ${isPlaying ? dancerStyles.fadeOutAnimation : ""}`}>
                    <div className={dancerStyles.playButtonMarkMiddle}></div>
                </div>
                <VideoPlayer
                    className={dancerStyles.zoomedPlayerScaled}
                    url={mediaURL}
                    width="100%"
                    height="100vh"
                    playing={isPlaying}
                    playsinline={true}
                    muted={isMuted}
                />
            </div>
        </div>
    }
    return (
        <>
            {contents}
        </>
    )
}