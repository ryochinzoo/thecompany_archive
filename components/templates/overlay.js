import utilStyles from "../../styles/overlay.module.css"
import Modal from "react-modal"
import { useModalShowContext } from "../../context/modalContext"

export default function Overlay({mode}) {
    const { contactModalShowState, setContactModalShowState } = useModalShowContext()
    
    return (
        <div>
            <button className={utilStyles.textOnlyButton} onClick={() => setContactModalShowState(true)}>
                Get in touch
            </button>
            <Modal isOpen={contactModalShowState} className={utilStyles.testOverlay} ariaHideApp={false}>
                <button className={utilStyles.textOnlyButton} onClick={() => setContactModalShowState(false)}>x</button>
            </Modal>
        </div>
    )
}