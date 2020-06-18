import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchOrders} from '../../store/order'
import ErrorPage from '../Utility/ErrorPage'
import UsersOrders from './UsersOrders'

// shows all the orders for that User
// pass in the UserId from state to the orders link in navbar
class OrderPage extends Component {
  constructor() {
    super()
    this.state = {
      isLoaded: false
    }
  }

  componentDidMount() {
    const userId = this.props.user
    this.props.loadOrders(userId)
    this.setState({
      isLoaded: true
    })
  }

  render() {
    const {orders} = this.props
    const {isLoaded} = this.state
    return (
      <div>
        {isLoaded && orders.length ? (
          <div>
            {orders.map(order => {
              return <UsersOrders key={order.id} order={order} />
            })}
          </div>
        ) : (
          <ErrorPage />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user.id,
  orders: state.order
})

const mapDispatch = dispatch => ({
  loadOrders: userId => dispatch(fetchOrders(userId))
})

export default connect(mapState, mapDispatch)(OrderPage)