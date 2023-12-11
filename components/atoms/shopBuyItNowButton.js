import utilStyles from "../../styles/shopBuyItNowButton.module.css"
import Link from 'next/link'

export default function ShopBuyItNowButton ({ isDetails, link, initShoppingBag }) {
    const shoppingLink = link
    return (
        <>
            <Link href={shoppingLink} passHref={true}>
                <a onClick={() => {
                    //initShoppingBag() after clicking purchase button, this should be triggerd
                }}>
                    <div className={`${isDetails ? utilStyles.shopBuyItNowButtonBig : utilStyles.shopBuyItNowButton}`} style={{cursor : "pointer"}}>
                        Buy it now
                    </div>
                </a>
            </Link>
        </>
    )
}