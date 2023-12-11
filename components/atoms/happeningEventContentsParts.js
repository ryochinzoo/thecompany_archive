import HappeningStyle from '../../styles/happenings.module.css'
import parse from 'html-react-parser'
import Link from 'next/link'

export default function HappeningsEventContentsA ({item}) {
    const month = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOBEMBER","DECEMBER"]
    const countNoun = ["ST", "ND", "RD", "TH"]
    const startDate = new Date(item.startDate)
    const endDate = new Date(item.endDate)

    let displayDate
    let link
    if(startDate.valueOf() === endDate.valueOf()) {
        const day = startDate.getDate()
        switch (day) {
            case 1:
            case 21:
            case 31:
                displayDate = startDate.getDate() + countNoun[0] + " " + month[startDate.getUTCMonth()] + "<br />" + item.date
                break;
            case 2:
            case 22:
                displayDate = startDate.getDate() + countNoun[1] + " " + month[startDate.getUTCMonth()] + "<br />" + item.date
                break;
            case 3:
            case 23:
                displayDate = startDate.getDate() + countNoun[2] + " " + month[startDate.getUTCMonth()] + "<br />" + item.date
                break;
            default:
                displayDate = startDate.getDate() + countNoun[3] + " " + month[startDate.getUTCMonth()] + "<br />" + item.date
                break;
        }
        
    } else {
        displayDate = item.date
    }
    link = createLink(item.variantId)
    return (
        <>
            <div className={HappeningStyle.eventContents}>
                <div className={HappeningStyle.eventContentsTitle}>{parse(item.title)} I</div>
                <div className={HappeningStyle.eventContentsDate}>{parse(displayDate)}</div>
                <div className={HappeningStyle.eventContentsPlace}>{parse(item.location)}</div>
                <div className={HappeningStyle.eventContentsPrice}>€{item.price}</div>
                <Link href={link} passHref={true}>
                    <a target='_blank'>
                        <div className={HappeningStyle.eventContentsButton} style={{cursor : "pointer"}}>
                            Buy Ticket
                        </div>
                    </a>
                </Link>
            </div>
        </>
    )
}
export function createLink(vid) {
    const mainCartAddress = "https://thecompanyberlin.myshopify.com/cart/"
    const shoppingData = vid + ":" + 1
    return mainCartAddress + shoppingData
}