import HappeningStyle from '../../styles/happenings.module.css'
import parse from 'html-react-parser'
import Link from 'next/link'

export default function HappeningsEventContentsB ({items, target}) {
    const targetObj = getTargetArray(items, target)
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
    const countNoun = ["ST", "ND", "RD", "TH"]
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    let displayDate
    
    if(targetObj) {
        const startDate = new Date(targetObj.startDate)
        const endDate = new Date(targetObj.endDate)
        const day = startDate.getDate()
        switch (day) {
            case 1:
            case 21:
            case 31:
                displayDate = week[startDate.getDay()] + ", " + monthShort[startDate.getUTCMonth()] + " " + startDate.getDate() + countNoun[0] 
                break;
            case 2:
            case 22:
                displayDate = week[startDate.getDay()] + ", " + monthShort[startDate.getUTCMonth()] + " " + startDate.getDate() + countNoun[1] 
                break;
            case 3:
            case 23:
                displayDate = week[startDate.getDay()] + ", " + monthShort[startDate.getUTCMonth()] + " " + startDate.getDate() + countNoun[2] 
                break;
            default:
                displayDate = week[startDate.getDay()] + ", " + monthShort[startDate.getUTCMonth()] + " " + startDate.getDate() + countNoun[3] 
                break;
        }
        if(startDate.valueOf() < endDate.valueOf()) {
            const day = endDate.getDate()
            switch (day) {
                case 1:
                case 21:
                case 31:
                    displayDate += " & " + week[endDate.getDay()] + ", " + monthShort[endDate.getUTCMonth()] + " " + endDate.getDate() + countNoun[0] 
                    break;
                case 2:
                case 22:
                    displayDate += " & " + week[endDate.getDay()] + ", " + monthShort[endDate.getUTCMonth()] + " " + endDate.getDate() + countNoun[1] 
                    break;
                case 3:
                case 23:
                    displayDate += " & " + week[endDate.getDay()] + ", " + monthShort[endDate.getUTCMonth()] + " " + endDate.getDate() + countNoun[2] 
                    break;
                default:
                    displayDate += " & " + week[endDate.getDay()] + ", " + monthShort[endDate.getUTCMonth()] + " " + endDate.getDate() + countNoun[3] 
                    break;
            }
        }
    }
    return (
        <>
            {targetObj ? 
            <div className={HappeningStyle.eventContents}>
                <div className={HappeningStyle.eventContentsTitleB}>{parse(targetObj.title)}</div>
                <div className={[HappeningStyle.eventContentsDateB, HappeningStyle.colorRed].join(" ")}>{displayDate}</div>
                <div className={HappeningStyle.eventContentsPlace}>{parse(targetObj.location)}</div>
                <Link href={targetObj.link} passHref={true}>
                    <a target='_blank'>
                        <div className={HappeningStyle.eventContentsButton} style={{cursor : "pointer"}}>
                            Buy Ticket
                        </div>
                    </a>
                </Link>
            </div>
            :
            <div className={HappeningStyle.eventContents}>
                <div className={HappeningStyle.comingSoon}>Coming Soon</div>
            </div>
            }
        </>
    )
}

export function getTargetArray(items, target) {
    let result = null
    const regx = new RegExp(target, 'gi')
    items.map(item => {
        if (item.title.match(regx)) {
            result = item
        }
    })
    return result
}