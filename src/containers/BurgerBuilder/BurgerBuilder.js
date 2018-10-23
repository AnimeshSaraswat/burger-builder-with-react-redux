import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
		purchasing: false,
		loading: false,
		error: false
	}
	
	componentDidMount() {
		axios.get('https://my-reactive-burger.firebaseio.com/ingredients.json')
			.then(resposnse => {
				this.setState({ingredients: resposnse.data})
			})
			.catch(error => {
				this.setState({error: true})
			});
	}

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(
            ingKey => {
                return ingredients[ingKey]
            }
        ).reduce((sum, el) =>{
            return sum + el;
        }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
    }

    render() {
        const disableInfo = {
            ...this.props.ings
		}

		let orderSummary = null;

		
		

		let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

		if(this.props.ings){
			burger = (
				<Aux>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						ingredientAdded={this.props.onIngredientAdded}
						ingredientRemoved={this.props.onIngredientRemoved}
						disabled={disableInfo}
						price={this.props.price}
						purchasable={this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler} />
				</Aux>
			);
			orderSummary = <OrderSummary 
				ingredients={this.props.ings} 
				purchaseCancled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}
				totlaPrice={this.props.price} />
		}

		if(this.state.loading) {
			orderSummary = <Spinner />;
		}

        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
		onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));