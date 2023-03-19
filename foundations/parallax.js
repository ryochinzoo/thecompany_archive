import React, { useRef, useEffect } from "react"
import Rellax from "rellax"
import utilStyles from '../styles/utils.module.css'

export default function Parallax () {
    const rellaxRef = useRef()
    useEffect(() => {
        new Rellax(".animate", {
            speed: 10,
            center: false,
            wrapper: null,
            round: true,
            vertical: true,
            horizontal: false,
        })
        new Rellax(rellaxRef.current, {
            speed: 5,
            center: false,
            wrapper: null,
            round: true,
            vertical: true,
            horizontal: false,
        })
    }, [])
    return (
        <div>
            <h1>test</h1>
            <h2>test for parallax</h2>
            <div ref={rellaxRef}>
                Lorem Ipsum dummy text with ref
            </div>
            <div className="animate">here is with classname</div>
        </div>
    )
}