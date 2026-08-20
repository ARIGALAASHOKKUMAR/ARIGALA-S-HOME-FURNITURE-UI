const Toast = (msg, type = 'info') => {
  try {
    // Minimal toast: use browser alert for now
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(`${type.toUpperCase()}: ${msg}`);
    } else {
      console.log(`${type.toUpperCase()}: ${msg}`);
    }
  } catch (e) { console.log(msg); }
};

export default Toast;
