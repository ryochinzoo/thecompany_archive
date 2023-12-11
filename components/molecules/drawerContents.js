import utilStyles from "../../styles/drawerContents.module.css"
import parse from 'html-react-parser'

export default function DrawerContents ({titles, handleDrawerChange, setClicked, changeSlide, isDetail}) {
    const titlesArray = Array.from(titles)
    return (
        <>
            <div className={`${utilStyles.shopDrawerMenu}`}>
                <ul>
                    {
                        titlesArray.map((title, titleIndex) => {
                            return (
                                <li className={`${utilStyles.shopDrawerMenuItem}`} 
                                    key={titleIndex}
                                    onClick={() => {
                                        handleDrawerChange(false)
                                        setClicked(true)
                                        changeSlide(titleIndex)
                                        isDetail(true)
                                    }}
                                >
                                    {parse(title.title)}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}