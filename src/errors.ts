const errorTimeout = 10 * 1000;

export const errorHandler = (reason: Event | string) => {
  const msg = (reason as ErrorEvent).message || (reason as string);
  const container = document.getElementById("message");
  if (container) {
    const elem = container.appendChild(document.createElement("code"));
    elem.appendChild(document.createTextNode(msg));
    setTimeout(() => elem?.parentElement?.removeChild(elem), errorTimeout);
  } else {
    alert(msg);
  }
};

export const errorWrapper =
  (func: Function) =>
  (...args: any): any => {
    try {
      return func(...args);
    } catch (e) {
      errorHandler(e);
    }
  };
