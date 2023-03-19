import utilStyles from "../../styles/utils.module.css"
import Link from 'next/link'

export default function ShopBuyItNowButton ({ isDetails, link, initShoppingBag }) {
    return (
        <>
            <Link href={link} passHref={true}>
                <a target='_blank' onClick={() => {
                    initShoppingBag()
                }}>
                    <div className={`${isDetails ? utilStyles.shopBuyItNowButtonBig : utilStyles.shopBuyItNowButton}`} style={{cursor : "pointer"}}>
                        Buy it Now
                    </div>
                </a>
            </Link>
        </>
    )
}