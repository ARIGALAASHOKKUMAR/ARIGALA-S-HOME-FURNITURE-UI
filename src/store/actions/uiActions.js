export const showLoader = (text = 'Loading, Please Wait...') => ({ type: 'SHOW_LOADER', payload: text });
export const hideLoader = () => ({ type: 'HIDE_LOADER' });
export const showMessage = (message, type = 'success') => ({ type: 'SHOW_MESSAGE', payload: { message, type } });
export const hideMessage = () => ({ type: 'HIDE_MESSAGE' });
