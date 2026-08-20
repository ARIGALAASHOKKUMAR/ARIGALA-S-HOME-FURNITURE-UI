import myAxios from './myAxios';
import store from '../store';
import { hideMessage, showLoader, hideLoader, showMessage } from '../store/actions/uiActions';
import Toast from '../components/Toast';

export const getCurrentTimestamp = () => new Date().toLocaleString();

export const commonAPICall = async (url, values, method) => {
  let msg = null, msgType = null, responseStatus = null, response = null, data = null;
  const dispatch = store.dispatch;
  dispatch(hideMessage());
  dispatch(showLoader());
  try {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network.');
    }
    const m = method ? String(method).toUpperCase() : 'GET';
    if (m === 'GET') {
      response = await myAxios.get(url, { params: values });
    } else {
      response = await myAxios.request({ url, method: m, data: values });
    }

    responseStatus = response.status ?? "unknown status";
    msg = response.data.message !== undefined && response.data.message !== null ? response.data.message : 'Operation completed successfully.';
    msgType = 'success';
    data = response.data != null ? response.data : null
  }
  catch (error) {
    msgType = 'failure';
    if (error.response) {
      msg = error.response.data?.message ? `${error.response.data.message} (${error.response.data.status})` : 'An error occurred';
      responseStatus = error.response.status;
      // suppress token-missing/unauthorized alerts to avoid repeated notifications
      if (responseStatus === 401 && /token|authorization|unauthorized/i.test(String(msg))) {
        msg = '';
      }
    }
    else {
      msg = `An unexpected error occurred: ${error.message}`;
      responseStatus = 9999;
    }
  }
//   if (msg && String(msg).trim() !== "") {
//     dispatch(showMessage(msg + " [" + getCurrentTimestamp() + "]", msgType));
//     if (typeof Toast === 'function') Toast(msg, msgType);
//   }
  dispatch(hideLoader());
  return { data: data, status: responseStatus };
};

export default commonAPICall;
