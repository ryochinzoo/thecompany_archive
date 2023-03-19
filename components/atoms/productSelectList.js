import CommonStyle from '../../styles/commonParts.module.css'

export default function ProductSelectList({productNames, shopEvents, productId, onSelectChangeHandler, hasImage, resetQuantity}) {
    let contents
    const productVariationNames = productNames

    if(productVariationNames.length > 1) {
        contents = <select className={CommonStyle.shopItemSelectBox} onChange={
            (e) => {
                onSelectChangeHandler(productId, e.target.value)
                hasImage(shopEvents, productId, e.target.value)
                resetQuantity(productNames[e.target.value])
            }
        }>
            {productVariationNames.map((value, index) => {
                return(
                    <option value={index} key={index}>{value.title=="Default Title" ? "" : value.title}</option>
                )
            })}
        </select>
    } else {
        contents = ""
    }
    return(
        <>
            {contents}
        </>
    )
}