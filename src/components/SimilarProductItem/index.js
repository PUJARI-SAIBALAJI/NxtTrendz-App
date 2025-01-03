// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {image_url: imageUrl, title, brand, price, rating} = productDetails

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="title">{title}</p>
      <p className="brand">by {brand}</p>
      <p className="price">Rs {price}/-</p>
      <p className="rating">Rating: {rating} ★</p>
    </li>
  )
}

export default SimilarProductItem
