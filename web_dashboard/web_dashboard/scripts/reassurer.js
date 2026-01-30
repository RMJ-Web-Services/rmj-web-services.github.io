export const EntryType = Object.freeze({
  DATE: "DATE",
  TEXT: "TEXT",
  PICKER: "PICKER",
  BUTTON: "BUTTON"
});

export function showYeller({ reassure_text = "some text", onResponse }) {
  const root = document.getElementById("yeller-root");
  root.innerHTML = "";

  const overlay = createOverlay();

  // Dialog box (replaces inner Rectangle)
  const dialog = document.createElement("div");
  dialog.className = "dialog";

  // Vertical layout (replaces VerticalLayout / VerticalBox)
  const content = document.createElement("div");
  content.className = "dialog-content";

  // Text (replaces Text)
  const text = document.createElement("p");
  text.className = "dialog-text";
  text.textContent = reassure_text;

  // Horizontal box (replaces HorizontalBox)
  const buttons = document.createElement("div");
  buttons.className = "dialog-buttons";

  // Yes button (replaces Button)
  const yes = document.createElement("button");
  yes.textContent = "Yes";
  yes.onclick = () => {
    cleanup();
    onResponse(true);
  };

  // No button (replaces Button)
  const no = document.createElement("button");
  no.textContent = "No";
  no.onclick = () => {
    cleanup();
    onResponse(false);
  };

  buttons.appendChild(yes);
  buttons.appendChild(no);
  content.appendChild(text);
  content.appendChild(buttons);
  dialog.appendChild(content);
  overlay.appendChild(dialog);
  root.appendChild(overlay);

  function cleanup() {
    root.innerHTML = "";
  }
}

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  return overlay;
}


export function showMailChanger({ titleName, contents, onConfirm, onCancel }) {
  const root = document.getElementById("mail-root");
  root.innerHTML = "";
  root.style.display = "flex";

  const overlay = createOverlay();

  const card = document.createElement("div");
  card.className = "card";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = titleName;

  const fieldBox = document.createElement("div");
  fieldBox.className = "field-box";

  const inputs = [];

  for (const entry of contents) {
    const [type, data] = entry;

    const fieldRow = document.createElement("div");
    fieldRow.className = "field-row";

    const label = document.createElement("div");
    label.className = "field-label";
    label.textContent = data[1];

    const inputWrap = document.createElement("div");
    inputWrap.className = "field-input";

    let input;

    switch (type) {
      case EntryType.TEXT: {
        const [name, labelText, defaultValue] = data;
        input = document.createElement("input");
        input.type = "text";
        input.name = name;
        input.placeholder = labelText;
        input.value = defaultValue ?? "";
        break;
      }

      case EntryType.DATE: {
        const [name, labelText, defaultValue] = data;
        input = document.createElement("input");
        input.type = "date";
        input.name = name;
        input.placeholder = labelText;
        input.value = defaultValue ?? "";
        break;
      }

      case EntryType.SELECT: {
        const [name, labelText, defaultValue, options] = data;
        input = document.createElement("select");
        input.name = name;

        for (const opt of options) {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          if (opt === defaultValue) option.selected = true;
          input.appendChild(option);
        }
        break;
      }

      case EntryType.BUTTON: {
        const [name, text, onClick] = data;

        if (typeof onClick !== "function") {
          throw new Error("EntryType.BUTTON expects a function as second tuple element.");
        }

        input = document.createElement("button");
        input.type = "button";
        input.textContent = text;

        input.addEventListener("click", onClick);
        break;
      }


      default:
        continue;
    }

    inputs.push(input);
    inputWrap.appendChild(input);
    fieldRow.appendChild(label);
    fieldRow.appendChild(inputWrap);
    fieldBox.appendChild(fieldRow);
  }



  const buttons = document.createElement("div");
  buttons.className = "buttons";

  const confirm = document.createElement("button");
  confirm.textContent = "Confirm";
  confirm.onclick = () => {
    const values = inputs.map(i => i.value);
    onConfirm?.(values);
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
    root.style.display = "none";
  }
}



