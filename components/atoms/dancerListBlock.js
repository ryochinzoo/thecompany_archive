import Image from 'next/image'
import DancerStyle from '../../styles/dancerProfile.module.css'
import {useState} from 'react'

export default function DancerListBlock({photo, name, index}) {
    const [isHovered, setIsHovered] = useState(false)
    return (
        <>
            <div className={DancerStyle.listedDancerPhoto}
                onMouseOver={()=>{
                    setIsHovered(true)
                }}
                onMouseLeave={()=>{
                    setIsHovered(false)
                }}
            >
                <div className={DancerStyle.listedDancerHoverLayer} style={{display: isHovered ? "block" : "none"}}>
                    <div className={DancerStyle.listedDancerName}>
                        {name}
                    </div>
                </div>
                <Image
                    src={photo}
                    alt={name}
                    layout='fill'
                    objectFit='cover'
                    priority
                />
            </div>
        </>
    )
}