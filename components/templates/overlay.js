import utilStyles from "../../styles/utils.module.css"
import Modal from "react-modal"
import Link from "next/link"
import { useModalShowContext } from "../../context/modalContext"

export default function Overlay({mode}) {
    const { contactModalShowState, setContactModalShowState } = useModalShowContext()
    
    return (
        <div>
            <button className={utilStyles.textOnlyButton} onClick={() => setContactModalShowState(true)}>
                Get In Touch
            </button>
            <Modal isOpen={contactModalShowState} className={utilStyles.testOverlay} ariaHideApp={false}>
                <button className={utilStyles.textOnlyButton} onClick={() => setContactModalShowState(false)}>x</button>
            </Modal>
        </div>
    )
}