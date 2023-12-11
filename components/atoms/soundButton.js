import Image from "next/image"
import utilStyles from "../../styles/soundButton.module.css"

export default function SoundButton({isMuted, handleSoundSwitch}) {
    const soundIcon = isMuted ? "/svg/SoundOff.svg" : "/svg/SoundOn.svg"
    const onSpeakerClick = () => {
        if (isMuted) {
            handleSoundSwitch(false)
        } else {
            handleSoundSwitch(true)
        }
    }
    return(
        <>
            <div className={utilStyles.soundIconWrapper} onClick={onSpeakerClick}>
                <Image
                    alt="sound speaker"
                    src={soundIcon}
                    layout="fill"
                    objectFit="contain"
                    loading='lazy'
                />
            </div>
        </>
    )
}