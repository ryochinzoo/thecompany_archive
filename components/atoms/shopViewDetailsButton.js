import utilStyles from "../../styles/utils.module.css"

export default function ShopViewDetailsButton ({ isDetails }) {
    return (
        <>
        {isDetails
        ?   <div className={`${utilStyles.shopAddToBag}`} style={{cursor : "pointer"}}>
                Add to Shopping Bag
            </div>
        :   <div className={`${utilStyles.shopViewDetailsButton}`} style={{cursor : "pointer"}}>
                View Details
            </div>
    }
            
        </>
    )
}