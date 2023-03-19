import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import HappeningStyle from '../../styles/happenings.module.css'
import VideoPlayer from 'react-player'
import { useInView } from "react-intersection-observer"
import utilStyles from "../../styles/utils.module.css"
import ReactPlayer from "react-player/lazy"

export default function FullSlideContents({ mediaType, mediaURL, vimeoURL }) {
    let contents
    const [isPlaying, setIsPlaying] = useState(false)
    
    if(mediaType === "Image") {
        contents = <div className={HappeningStyle.positionRelative}><Image
            src={mediaURL}
            alt={mediaType}
            objectFit="cover"
            layout="fill"
            priority
        /></div>
    } else if (mediaType ==="Video") {
        contents = <div className={HappeningStyle.positionRelative}>
            <div className={HappeningStyle.playerWrapper}  onClick={()=>{
                    setIsPlaying(!isPlaying)
                }}>
                <div className={`${HappeningStyle.playButton} ${isPlaying ? HappeningStyle.fadeOutAnimation : ""}`}>
                    <div className={HappeningStyle.playButtonMark}></div>
                </div>
                <VideoPlayer
                    className={HappeningStyle.reactPlayer}
                    url={mediaURL}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    muted={true}
                />
            </div>
        </div>
    } else if (mediaType ==="VimeoURL") {
        
        contents = <div className={HappeningStyle.positionRelative}><div className={utilStyles.playerZoomWrapper} 
            onClick={()=>{
                setIsPlaying(!isPlaying)
            }}
        >   
        <div className={`${HappeningStyle.playButton} ${isPlaying ? HappeningStyle.fadeOutAnimation : ""}`}>
                    <div className={HappeningStyle.playButtonMark}></div>
                </div>
        <div className={utilStyles.videoWrapper}></div>
            
            <ReactPlayer
                url= {vimeoURL}
                className={utilStyles.zoomedPlayerScaled} 
                playing={isPlaying}
                muted
                width="100%"
                height="100vh"
                config={{
                    vimeo: {
                        playerOptions: {
                            height: "100vh",
                            width: "100%",
                            responsive: true,
                            controls: false,
                            autoplay: false,
                        }
                    }
                }}
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