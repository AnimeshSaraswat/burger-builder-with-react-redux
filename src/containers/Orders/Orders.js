import React from 'react';
import axios from '../../axios-orders';

import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends React.Component {
	state = {
		orders: [],
		loading: true
	}

	componentDidMount() {
		axios.get('/orders.json')
			.then(res => {
				const fetchedOrders = [];
				for (let key in res.data) {
					fetchedOrders.push({
						...res.data[key],
						id: key
					});
				}
				console.log(fetchedOrders);
				this.setState({ loading: false, orders: fetchedOrders });
			})
			.catch(err => {
				this.setState({ loading: true });
			})
	}
	render() {
		return (
			<div>
				{this.state.orders.map(order => (
					<Order 
						key = { order.id }
						ingredients = { order.ingredients }
						price = { order.price } />
				))}
			</div>
		);
	}
}

export default withErrorHandler(Orders, axios);