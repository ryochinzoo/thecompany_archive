import Style from '../styles/comingSoon.module.css'
import Image from 'next/image'

export default function Custom404() {
    return (
        <div className={`${Style.contents}`}>
            <div className={`${Style.messageWrapper}`}>
                <div>
                    <Image
                        alt={"logo"}
                        src={"/svg/LOGO_White.svg"}
                        width={800}
                        height={200} 
                        />
                </div>
                <div>THIS PAGE IS NOT FOUND</div>
            </div>
        </div>
    )
  }