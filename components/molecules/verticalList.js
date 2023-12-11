import DancerStyle from '../../styles/verticalList.module.css'

export default function VerticalList({ children }) {
    return(
        <>
            <div className={`${DancerStyle.marginAlignTop} ${DancerStyle.verticalList}`}>
                {children}
            </div>
        </>
    )
}