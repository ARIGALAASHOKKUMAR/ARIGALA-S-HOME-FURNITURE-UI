const initialState = { items: [] };

const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export default CartReducer;
