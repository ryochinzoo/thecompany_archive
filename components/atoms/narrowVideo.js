import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

import utilStyles from "../../styles/narrowVideo.module.css"

export default function NarrowVideo({ URL, playingInView }) {
    return(
        <>
        <ReactPlayer
                url={URL}
                className={utilStyles.zoomedPlayer} 
                playing={playingInView}
                playsinline={true}
                loop={true}
                muted
                width="100vw"
                height="100vh"
                config={{
                    file: { 
                        attributes: { 
                            preload: 'none',
                        } 
                    } 
                }}
            />
        </>
    )
}