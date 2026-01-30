export const Status = Object.freeze({
  OK: "OK",
  ERROR: "ERROR",
  PAYMENT_RETURNED: "PAYMENT_RETURNED",
  MANUAL: "MANUAL"
});

const StatusColorsDark = Object.freeze({
  [Status.OK]: "#4CAF50",
  [Status.ERROR]: "#F44336",
  [Status.PAYMENT_RETURNED]: "#FFC107",
  [Status.MANUAL]: "#FF9800"
});

const StatusColorsLight = Object.freeze({
  [Status.OK]: "#2E7D32",
  [Status.ERROR]: "#C62828",
  [Status.PAYMENT_RETURNED]: "#FFA000",
  [Status.MANUAL]: "#F57C00",
});


export function getStatusColor(status, color_theme) {
  if (color_theme == "light") {
    return StatusColorsLight[status] || "#000000";
  }
  else {
    return StatusColorsDark[status] || "#ffffff";
  }
}

console.log(getStatusColor(Status.COMPLETED));
console.log(getStatusColor("UNKNOWN"));