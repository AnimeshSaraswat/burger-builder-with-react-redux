import * as actionsTypes from './actions';

const initialState = {
	ingredients: {
		salad: 0,
		bacon: 0,
		cheese: 0,
		meat: 0
	}, 
    totalPrice: 60
};
const INGREDIENT_PRICES = {
    salad: 40,
    cheese: 10,
    meat: 55,
    bacon: 45
}

const reducer = ( state = initialState, action ) => {
	switch(action.type) {
		case actionsTypes.ADD_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] + 1
				},
				totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
			};
		case actionsTypes.REMOVE_INGREDIENT:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] - 1
				},
				totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
			};
		default:
			return state;
	}
}

export default reducer;