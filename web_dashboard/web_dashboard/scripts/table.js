export function renderTable(container, { titles, rows, disabled = false, onSelect, selectedIndex = -1 }) {
  container.innerHTML = ""; // clear previous table

  const table = document.createElement("div");
  table.className = "table";

  const rowHeight = 40; // px, adjust if needed

  const header = document.createElement("div");
  header.className = "header";

  titles.forEach(title => {
    const cell = document.createElement("div");
    cell.className = "header-cell";
    cell.textContent = title;
    header.appendChild(cell);
  });

  table.appendChild(header);
  table.appendChild(document.createElement("div")).className = "separator";

  // ---- Scroll area ----
  const scroll = document.createElement("div");
  scroll.className = "scroll";

  const renderRows = () => {
    scroll.innerHTML = ""; // clear previous rows

    rows.forEach((row, i) => {
      const rowEl = document.createElement("div");
      rowEl.className = "row";
      rowEl.tabIndex = 0; // make focusable
      rowEl.classList.add(i % 2 === 0 ? "even" : "odd");

      if (i === selectedIndex) rowEl.classList.add("selected");

      row.forEach(cell => {
        const cellEl = document.createElement("div");
        cellEl.className = "cell";
        cellEl.textContent = cell;
        rowEl.appendChild(cellEl);
      });

      rowEl.onclick = () => {
        if (disabled) return;
        selectedIndex = i;
        rowEl.focus();
        onSelect(row, i);
        renderRows();
      };

      scroll.appendChild(rowEl);
    });
  };

  const scrollRowIntoView = (scrollContainer, rowEl) => {
    const rowTop = rowEl.offsetTop;
    const rowBottom = rowTop + rowEl.offsetHeight;
    if (rowTop < scrollContainer.scrollTop) scrollContainer.scrollTop = rowTop;
    if (rowBottom > scrollContainer.scrollTop + scrollContainer.clientHeight) {
      scrollContainer.scrollTop = rowBottom - scrollContainer.clientHeight;
    }
  };

  renderRows();
  table.appendChild(scroll);
  container.appendChild(table);

  // ---- Keyboard navigation ----
  table.tabIndex = 0; // make table focusable
  table.addEventListener("keydown", e => {
    if (disabled || rows.length === 0) return;

    if (e.key === "ArrowUp") {
      if (selectedIndex <= 0) selectedIndex = 0;
      else selectedIndex--;
      onSelect(rows[selectedIndex], selectedIndex);
      renderRows();
      const rowEl = scroll.children[selectedIndex];
      if (rowEl) scrollRowIntoView(scroll, rowEl);
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      if (selectedIndex === -1) selectedIndex = 0;
      else if (selectedIndex < rows.length - 1) selectedIndex++;
      onSelect(rows[selectedIndex], selectedIndex);
      renderRows();
      const rowEl = scroll.children[selectedIndex];
      if (rowEl) scrollRowIntoView(scroll, rowEl);
      e.preventDefault();
    }
  });
}
