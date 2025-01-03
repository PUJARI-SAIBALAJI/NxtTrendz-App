// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import './index.css'
import SimilarProductItem from '../SimilarProductItem'

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    quantity: 1,
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: 'LOADING'})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        productDetails: data,
        similarProducts: data.similar_products,
        apiStatus: 'SUCCESS',
      })
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {productDetails, similarProducts, quantity} = this.state
    const {
      image_url: imageUrl,
      title,
      price,
      description,
      brand,
      rating,
      total_reviews: totalReviews,
      availability,
    } = productDetails

    return (
      <div className="product-details-container">
        <img src={imageUrl} alt="product" className="product-image" />
        <div className="details-container">
          <h1 className="product-title">{title}</h1>
          <p className="price">Rs {price}/-</p>
          <p className="description">{description}</p>
          <p className="brand">Brand: {brand}</p>
          <div className="rating-review-container">
            <p>Rating: {rating} ★</p>
            <p>Total Reviews: {totalReviews}</p>
          </div>
          <p>Availability: {availability}</p>
          <div className="quantity-container">
            <button
              data-testid="minus"
              onClick={this.decrementQuantity}
              type="button"
            >
              <BsDashSquare />
            </button>
            <p className="quantity">{quantity}</p>
            <button
              data-testid="plus"
              onClick={this.incrementQuantity}
              type="button"
            >
              <BsPlusSquare />
            </button>
          </div>
          <button className="add-to-cart-button" type="button">
            Add to Cart
          </button>
        </div>

        <ul className="similar-products-list">
          {similarProducts.map(product => (
            <SimilarProductItem key={product.id} productDetails={product} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        role="img"
        className="error-view-image"
      />
      <h1 className="error-message">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.redirectToProducts}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case 'LOADING':
        return this.renderLoadingView()
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  incrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  decrementQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1,
    }))
  }

  redirectToProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  render() {
    return (
      <div className="product-item-details">
        <header className="header">
          <ul className="navigation-links">
            <li>Home</li>
            <li>Products</li>
            <li>Contact Us</li>
          </ul>
        </header>
        {this.renderView()}
      </div>
    )
  }
}

export default ProductItemDetails
