import DancerStyle from '../../styles/dancerProfile.module.css'

export default function HorizontalList({ children }) {
    return(
        <>
            <div className={`${DancerStyle.marginAlignLeft} ${DancerStyle.horizontalList}`}>
                {children}
            </div>
        </>
    )
}