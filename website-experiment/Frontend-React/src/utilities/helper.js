export function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function reload() {
  window.location.href = "/";
}
