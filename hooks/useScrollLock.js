import { useEffect, useCallback, useRef } from "react"

export const useScrollLock = (target, event, isTriggered, allowScrollingRefs = "") => {
    const scrollAreas = allowScrollingRefs

    const listener = useCallback((e) => {
        if (scrollAreas.current.length > 0 && scrollAreas.current.find(el => {return el.current === e.target.closest('.scrollable')})) {
            e.stopPropagation()
        } else {
            if (e.cancelable)
                e.preventDefault()
        }
    }, [scrollAreas])

    useEffect(() => {
        const t = target || document
        if (isTriggered) {
            if (allowScrollingRefs) {
                document.addEventListener(event, listener, { passive: false, capture: true })
                return () => {
                    document.removeEventListener(event, listener, { passive: false, capture: true })
                }
            } 
        }
    }, [event, target, isTriggered, listener, allowScrollingRefs])
}