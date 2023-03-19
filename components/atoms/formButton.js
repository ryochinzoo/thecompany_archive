import DancerStyle from '../../styles/dancerProfile.module.css'

export default function FormButton() {
    return (
        <>
            <div className={DancerStyle.formButton}>
                <div className={`${DancerStyle.formButtonInner} `}>
                    <div>
                        Booking request
                    </div>
                </div>
            </div>
        </>
    )
}