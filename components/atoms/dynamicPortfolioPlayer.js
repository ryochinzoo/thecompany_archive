import ReactPlayer from "react-player/lazy";
import utilStyles from '../../styles/dynamicPortfolioPlayer.module.css'

export default function DynamicPortfolioPlayer({playerRef, src, imgSrc, isPlaying }) {
    return (
        <ReactPlayer
            url= {src}
            className={utilStyles.reactPlayer} 
            playing={isPlaying}
            muted
            loop={true}
            playsinline={true}
            width="100%"
            height="100%"
            ref={playerRef}
            onPause={() => {playerRef.current.seekTo(0, "seconds")}}
            config={{
                file: { 
                    attributes: { 
                        preload: 'none',
                        poster: imgSrc,
                    } 
                } 
            }}     
          />
      )
}