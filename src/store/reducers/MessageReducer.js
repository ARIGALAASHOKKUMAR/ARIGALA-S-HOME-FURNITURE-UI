const initialState = { message: null, type: null };

const MessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_MESSAGE':
      return { message: action.payload.message, type: action.payload.type };
    case 'HIDE_MESSAGE':
      return { message: null, type: null };
    default:
      return state;
  }
};

export default MessageReducer;
