export default function ContactButton () {
    return (
        <div>
            <button onClick={() => setContactModalShowState(true)}>
                <a>
                Get in touch
                </a>
            </button>
        </div>
    )
}