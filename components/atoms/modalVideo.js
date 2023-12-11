import utilStyles from "../../styles/modalVideo.module.css"
import { ThreeDots } from "react-loader-spinner"
import { useState } from "react"
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
const SoundButton = dynamic(() => import('./soundButton'))

export default function ModalVideo ({ isVertical, modalImageState}) {
    
    const [isMuted, setIsMuted] = useState(true)
    const handleSoundSwitch = (newValue) => {
        setIsMuted(prev => {return newValue})
    }
    return(
        <><div className={utilStyles.loaderWrapperBig}>
            <ThreeDots 
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
            <div className={utilStyles.soundIcon} style={{zIndex: 9998}}>
                <SoundButton
                    isMuted={isMuted}
                    handleSoundSwitch={handleSoundSwitch}
                ></SoundButton>
            </div>
            <ReactPlayer
                url= {modalImageState}
                className={isVertical ? utilStyles.zoomedPlayerScaledVertical : utilStyles.zoomedPlayerScaled} 
                muted={isMuted}
                loop={true}
                playing
                disabledeferredloading="true"
                playsinline={true}
                width="100%"
                height="100vh"
                config={{
                    file: { 
                        attributes: { 
                            preload: 'none',
                        } 
                    } 
                }}
            /></>
    )
}