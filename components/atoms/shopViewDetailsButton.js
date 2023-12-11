import utilStyles from "../../styles/shopViewDetailsButton.module.css"

export default function ShopViewDetailsButton ({ isDetails }) {
    return (
        <>
        {isDetails
        ?   <button type="submit" className={`${utilStyles.shopAddToBag}`} style={{cursor : "pointer", display: "block"}}>
                Add to shopping bag
            </button>
            
        :   <div className={`${utilStyles.shopViewDetailsButton}`} style={{cursor : "pointer"}}>
                View details
            </div>
    }
            
        </>
    )
}