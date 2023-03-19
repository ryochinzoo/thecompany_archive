import { createContext, useState, useContext } from "react";

const ModalContext = createContext()

export function useModalShowContext() {
    return useContext(ModalContext)
}

export function ModalProvider({children}) {
    const [contactModalShowState, setContactModalShowState] = useState(false)
    const modalShowState = {
    contactModalShowState,
    setContactModalShowState,
    }

    return (
        <ModalContext.Provider value={modalShowState}>
            {children}
        </ModalContext.Provider>
    )
}