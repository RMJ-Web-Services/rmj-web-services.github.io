export function showMailChanger({ initialEmail = "", onConfirm, onCancel }) {
  const root = document.getElementById("mail-root");
  root.innerHTML = "";

  let email = initialEmail;

  const overlay = document.createElement("div");
  overlay.className = "overlay";

  // Root card (Rectangle)
  const card = document.createElement("div");
  card.className = "card";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  // Title (Text)
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = "Change e-mail";

  // Field container (Rectangle)
  const fieldBox = document.createElement("div");
  fieldBox.className = "field-box";

  const fieldRow = document.createElement("div");
  fieldRow.className = "field-row";

  // Label (Text)
  const label = document.createElement("div");
  label.className = "field-label";
  label.textContent = "E-mail";

  // Input (LineEdit)
  const inputWrap = document.createElement("div");
  inputWrap.className = "field-input";

  const input = document.createElement("input");
  input.type = "email";
  input.placeholder = "you@example.com";
  input.value = email;

  input.oninput = (e) => {
    email = e.target.value;
  };

  inputWrap.appendChild(input);
  fieldRow.appendChild(label);
  fieldRow.appendChild(inputWrap);
  fieldBox.appendChild(fieldRow);

  // Buttons (HorizontalBox + Button)
  const buttons = document.createElement("div");
  buttons.className = "buttons";

  const confirm = document.createElement("button");
  confirm.textContent = "Confirm";
  confirm.onclick = () => {
    onConfirm?.(email);
    cleanup();
  };

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.onclick = () => {
    onCancel?.();
    cleanup();
  };

  buttons.appendChild(confirm);
  buttons.appendChild(cancel);

  inner.appendChild(title);
  inner.appendChild(fieldBox);
  inner.appendChild(buttons);
  card.appendChild(inner);
  overlay.appendChild(card);
  root.appendChild(overlay);

  function cleanup() {
    root.innerHTML = "";
  }
}