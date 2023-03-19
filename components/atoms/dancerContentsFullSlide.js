import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import HappeningStyle from '../../styles/happenings.module.css'
import VideoPlayer from 'react-player'
import { useInView } from "react-intersection-observer"

export default function DancerFullSlideContents({ mediaType, mediaURL }) {
    let contents
    const [isPlaying, setIsPlaying] = useState(false)
    
    
    if(mediaType === "Image") {
        contents = <div className={HappeningStyle.positionRelative}><Image
            src={mediaURL}
            alt={mediaType}
            objectFit="contain"
            layout="fill"
            priority
        /></div>
    } else if (mediaType ==="Video") {
        contents = <div className={HappeningStyle.positionRelative}>
            <div className={HappeningStyle.playerWrapper}  onClick={()=>{
                    setIsPlaying(!isPlaying)
                }}>
                <div className={`${HappeningStyle.playButtonMiddle} ${isPlaying ? HappeningStyle.fadeOutAnimation : ""}`}>
                    <div className={HappeningStyle.playButtonMarkMiddle}></div>
                </div>
                <VideoPlayer
                    className={HappeningStyle.reactPlayer}
                    url={mediaURL}
                    width="100vw"
                    height="100vh"
                    playing={isPlaying}
                    muted={true}
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