import { useState } from 'react'
import Image from "next/image"
import fullSlideStyles from "../../styles/happeningContentsFullSlide.module.css"
import dynamic from 'next/dynamic'

const SoundButton = dynamic(() => import('./soundButton'))
const VideoPlayer = dynamic(() => import('react-player'))
const ReactPlayer = dynamic(() => import("react-player/lazy"))

export default function FullSlideContents({ setEntertainmentPlaying = false, mediaType, mediaURL, vimeoURL }) {
    let contents
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const handleSoundSwitch = (newValue) => {
        setIsMuted(prev => {return newValue})
    }
    
    if(mediaType === "Image") {
        contents = <div className={`${fullSlideStyles.positionRelative} ${fullSlideStyles.fullSlideImage}`}><Image
            src={mediaURL}
            alt={mediaType}
            objectFit="cover"
            layout="fill"
            priority
        /></div>
    } else if (mediaType ==="Video") {
        contents = <div className={fullSlideStyles.positionRelative}>
            <div className={fullSlideStyles.soundIcon}>
                <SoundButton
                    isMuted={isMuted}
                    handleSoundSwitch={handleSoundSwitch}
                ></SoundButton>
            </div>
            <div className={fullSlideStyles.playerZoomWrapper}>
                <div className={fullSlideStyles.videoWrapper}></div>
                <VideoPlayer
                    className={fullSlideStyles.zoomedPlayerScaledTop} 
                    url={mediaURL}
                    width="100%"
                    height="100%"
                    playing={setEntertainmentPlaying}
                    playsinline={true}
                    muted={isMuted}
                    config={{
                        file: {
                          hlsOptions: { 
                            xhrSetup: function(xhr, url) {
                              xhr.withCredentials = true // send cookies
                            }
                          }
                        }
                      }}
                />
            </div>
        </div>
    } else if (mediaType ==="topVideo") {
        
    contents = <div className={fullSlideStyles.positionRelative}><div className={fullSlideStyles.playerZoomWrapper} >   
    <div className={`${isPlaying ? fullSlideStyles.fadeOutAnimation : ""}`}></div>
    <div className={fullSlideStyles.videoWrapper}></div>
        
        <ReactPlayer
            url= {vimeoURL}
            className={fullSlideStyles.zoomedPlayerScaledTop} 
            playing={isPlaying}
            muted
            width="100%"
            height="100vh"
            playsinline={true}
            loop={true}
            config={{
                vimeo: {
                    playerOptions: {
                        height: "100vh",
                        width: "100%",
                        responsive: true,
                        controls: false,
                        autoplay: true,
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