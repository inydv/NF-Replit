let showAlertFunction = null;
let alertQueue = [];

export const registerAlertFunction = (fn) => {
  showAlertFunction = fn;

  // Flush any queued alerts
  alertQueue.forEach(({ type, message }) => fn(type, message));
  alertQueue = [];
};

const createAlertMethod = (type) => (message) => {
  if (showAlertFunction) {
    showAlertFunction(type, message);
  } else {
    alertQueue.push({ type, message });
  }
};

export const alert = {
  success: createAlertMethod("success"),
  error: createAlertMethod("error"),
  warning: createAlertMethod("warning"),
  info: createAlertMethod("info"),
};
