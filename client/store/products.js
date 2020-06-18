import axios from 'axios'

const SET_PRODUCTS = 'SET_PRODUCTS'

export const setProducts = products => ({
  type: SET_PRODUCTS,
  products
})

export const fetchProducts = query => async dispatch => {
  try {
    if (!query) {
      const {data: allproducts} = await axios.get('/api/products')
      dispatch(setProducts(allproducts))
    } else {
      const {data: products} = await axios.get(`/api/products?search=${query}`)
      dispatch(setProducts(products))
    }
  } catch (error) {
    console.log('error in fetchProducts', error)
  }
}

const products = (state = [], action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return action.products
    default:
      return state
  }
}

export default products