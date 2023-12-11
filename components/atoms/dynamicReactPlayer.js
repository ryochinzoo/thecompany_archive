import ReactPlayer from "react-player/lazy";
import utilStyles from '../../styles/dynamicReactPlayer.module.css'
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect, useRef, useMemo } from "react"

export default function DynamicReactPlayer({ playerRef, src, playingInView, handleSavingData, contentState, index, setRatioUpdate}) {
    
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)'
  })
  const [isPlaying, setIsPlaying] = useState(isMobile)
  const [isPreload, setIsPreload] = useState()

  useEffect(() => {
    if (isMobile) {
        setIsPlaying(false)
        setIsPreload('auto')
    } else {
        if (playingInView) {        
            setIsPlaying(true)
        } else {
            setIsPlaying(false)
        }
        setIsPreload((prev) => {return 'none'})
    }
  }, [isMobile, playingInView])
  
  return (
    <>
        <ReactPlayer
            url= {src}
            className={utilStyles.reactPlayer} 
            playing={isPlaying}
            muted
            loop={true}
            ref={playerRef}
            playsinline={true}
            width="100%"
            height="100%"
            onReady={(video) => {
                const player = playerRef.current.getInternalPlayer()
                const naturalWidth = player.videoWidth
                const naturalHeight = player.videoHeight
                setRatioUpdate((prev) => { return naturalWidth/naturalHeight })
                handleSavingData({state: contentState, id: index, width: naturalWidth, height: naturalHeight})
            }}
            config={{
                file: { 
                attributes: { 
                    preload: isPreload
                } 
                } 
            }}      
        />
    </>
  )
}