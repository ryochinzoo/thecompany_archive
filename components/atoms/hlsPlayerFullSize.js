import React from 'react'
import { ThreeDots } from "react-loader-spinner"
import { useState, useEffect } from 'react'
import fullSizeSlideStyle from '../../styles/hlsPlayerFullSize.module.css'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player', {ssr: false}))
const SoundButton = dynamic(() => import('./soundButton'))

export default function HlsPlayerFullSize({ mediaURL, playingInView, preload }) {
    let contents
    const [isMuted, setIsMuted] = useState(true)
    const [isIOS, setIsIOS] = useState(false)
    const handleSoundSwitch = (newValue) => {
        setIsMuted(prev => {return newValue})
    }
    useEffect(() => {
        if (/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
            setIsIOS((prev) => { return true })
        } else {
            setIsIOS((prev) => { return false })
        }
    }, [setIsIOS])

    contents = <div className={fullSizeSlideStyle.positionRelative}><div className={fullSizeSlideStyle.playerZoomWrapper} >   
    <div className={fullSizeSlideStyle.videoWrapper}>
        <div className={fullSizeSlideStyle.soundIcon}>
            <SoundButton
                isMuted={isMuted}
                handleSoundSwitch={handleSoundSwitch}
            ></SoundButton>
        </div>
    </div>
        <div className={fullSizeSlideStyle.loaderWrapper}><ThreeDots 
                            wrapperStyle={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                            color="#C93D38"
                            radius={9}
                            height={100}
                            width={100}
                        /></div>
        <ReactPlayer
            className={`${fullSizeSlideStyle.zoomedPlayerScaledTop}`} 
            autoPlay={true}
            url= {mediaURL}
            playing={playingInView}
            loop={true}
            muted={isMuted}
            width="100%"
            height="100%"
            playsinline={true}
            config={{
                file: {
                  hlsOptions: { 
                    xhrSetup: function(xhr, url) {
                      xhr.withCredentials = true // send cookies
                    }
                  },
                  attributes: { 
                    preload: {preload}
                  } 
                }
              }}
        />
    </div>
</div>
    return (
        <>
            {contents}
        </>
    )
}