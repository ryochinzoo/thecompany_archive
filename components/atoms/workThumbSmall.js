import Image from 'next/image'
import VideoPlayer from 'react-player'
import HappeningStyle from '../../styles/happenings.module.css'
import DancerStyle from '../../styles/dancerProfile.module.css'

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
                    loading="lazy"
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
                <div className={HappeningStyle.playerWrapperSmall}>
                    <div className={`${HappeningStyle.playButtonSmall}`}>
                        <div className={HappeningStyle.playButtonMarkSmall}></div>
                    </div>
                    <VideoPlayer
                        className={HappeningStyle.reactPlayer}
                        url={work}
                        width="98px"
                        height="98px"
                        playing={false}
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
    } else if (type === "YoutubeLink") {
        contents = ""
    }

    return (
        <>
            {contents}
        </>
    )
}