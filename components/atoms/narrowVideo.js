import ReactPlayer from "react-player/lazy"

import utilStyles from "../../styles/utils.module.css"

export default function NarrowVideo({ URL }) {
    return(
        <>
        <ReactPlayer
                url={URL}
                className={utilStyles.zoomedPlayer} 
                playing={true}
                loop={true}
                muted
                width="100vw"
                height="100vh"
                config={{
                    vimeo: {
                        playerOptions: {
                            height: "100vh",
                            width: "100vw",
                            responsive: true,
                            controls: false,
                        }
                    }
                }}
            />
        </>
    )
}