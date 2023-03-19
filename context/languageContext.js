import { createContext, useState, useContext } from "react";

const LanguageContext = createContext()

export function useLanguageContext() {
    return useContext(LanguageContext)
}

export function LanugageProvider () {
    const [ languageState, setLanguageState ] = useState('de')
    const showingLanguage = {
        languageState,
        setLanguageState,
    }

    return(
        <LanguageContext.Provider value={showingLanguage}>
            {children}
        </LanguageContext.Provider>
    )
}