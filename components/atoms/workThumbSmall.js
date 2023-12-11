import Image from 'next/image'
import DancerStyle from '../../styles/workThumbSmall.module.css'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export default function WorkThumbSmall({verticalWorkClickedChange, modalChange, handleChange, workIsActive, keyIndex, type, work, isHorizontal }){
    let contents
    
    if (type === "Image") {
        contents = <div className={`${DancerStyle.positionRelative} ${isHorizontal? DancerStyle.workBlockSmallHorizontal : DancerStyle.workBlockSmall}`}
            onClick={() => {
                verticalWorkClickedChange(true)
                handleChange(keyIndex)
                modalChange(work, type, keyIndex.work)
            }}
        >
            <div className={` ${workIsActive ? DancerStyle.workIsActive : DancerStyle.workIsNotActive}`}>
                <div className={DancerStyle.innerBorder}>
                <Image 
                    src={work}
                    alt={type}
                    objectFit="cover"
                    layout="fill"
                    quality={30}
                    loading="lazy"
                    decoding='async'
                /></div>
            </div></div>
    } else if (type ==="Video") {
        contents = <div className={`${DancerStyle.positionRelative} ${isHorizontal? DancerStyle.workBlockSmallHorizontal : DancerStyle.workBlockSmall}`}
            onClick={() => {
                verticalWorkClickedChange(true)
                handleChange(keyIndex)
                modalChange(work, type, keyIndex.work)
            }}
        >
            <div className={` ${workIsActive ? DancerStyle.workIsActive : DancerStyle.workIsNotActive}`}>
                <div className={DancerStyle.innerBorderVideo}>
                <div className={DancerStyle.playerWrapperSmall}>
                    <div className={`${DancerStyle.playButtonSmall}`}>
                        <div className={DancerStyle.playButtonMarkSmall}></div>
                    </div>
                    <VideoPlayer
                        className={DancerStyle.reactPlayer}
                        url={work}
                        width="98px"
                        height="98px"
                        playing={false}
                        playsinline={true}
                        muted={true}
                        config={{
                            file: { 
                              attributes: { 
                                preload: 'none'
                              } 
                            } 
                          }}
                    />
                </div></div>
        </div></div>
    }

    return (
        <>
            {contents}
        </>
    )
}