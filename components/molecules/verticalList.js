import DancerStyle from '../../styles/dancerProfile.module.css'

export default function VerticalList({ children }) {
    return(
        <>
            <div className={`${DancerStyle.marginAlignTop} ${DancerStyle.verticalList}`}>
                {children}
            </div>
        </>
    )
}