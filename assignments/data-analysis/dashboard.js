const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (insideQuotes && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell);
  if (row.some((value) => value !== "")) {
    rows.push(row);
  }
  return rows;
}

function getNumericColumns(headers, rows) {
  return headers.flatMap((header, columnIndex) => {
    const values = [];

    for (const row of rows) {
      const rawValue = (row[columnIndex] ?? "").trim();
      if (!rawValue) {
        continue;
      }

      const value = Number(rawValue);
      if (!Number.isFinite(value)) {
        return [];
      }
      values.push(value);
    }

    return values.length ? [{ name: header, values }] : [];
  });
}

function getStatistics(values) {
  const sortedValues = [...values].sort((a, b) => a - b);
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const middle = Math.floor(sortedValues.length / 2);
  const median =
    sortedValues.length % 2 === 0
      ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
      : sortedValues[middle];
  const variance =
    values.reduce((total, value) => total + (value - mean) ** 2, 0) /
    values.length;

  return {
    Média: mean,
    Mediana: median,
    Mínimo: Math.min(...values),
    Máximo: Math.max(...values),
    "Desvio padrão": Math.sqrt(variance),
  };
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function renderCharts(numericColumns) {
  const charts = document.getElementById("charts");
  charts.replaceChildren();

  if (numericColumns.length === 0) {
    charts.append(
      createElement(
        "p",
        "empty-state",
        "Nenhuma coluna numérica foi encontrada no arquivo.",
      ),
    );
    return;
  }

  for (const column of numericColumns) {
    const card = createElement("article", "chart-card");
    card.append(createElement("h3", "", column.name));

    const statistics = getStatistics(column.values);
    const largestMagnitude = Math.max(
      ...Object.values(statistics).map((value) => Math.abs(value)),
      1,
    );

    for (const [label, value] of Object.entries(statistics)) {
      const metricRow = createElement("div", "metric-row");
      const track = createElement(
        "div",
        `bar-track ${value < 0 ? "negative" : "positive"}`,
      );
      const bar = createElement("span", "bar");
      bar.style.width = `${(Math.abs(value) / largestMagnitude) * 100}%`;
      bar.setAttribute("aria-hidden", "true");
      track.append(bar);

      metricRow.append(
        createElement("span", "metric-label", label),
        track,
        createElement("span", "metric-value", numberFormatter.format(value)),
      );
      card.append(metricRow);
    }
    charts.append(card);
  }
}

function renderTable(headers, rows) {
  const tableHead = document.getElementById("table-head");
  const tableBody = document.getElementById("table-body");
  const headerRow = document.createElement("tr");

  for (const header of headers) {
    headerRow.append(createElement("th", "", header));
  }
  tableHead.replaceChildren(headerRow);

  const previewRows = rows.slice(0, 5).map((row) => {
    const tableRow = document.createElement("tr");
    headers.forEach((_, index) => {
      tableRow.append(createElement("td", "", row[index] ?? ""));
    });
    return tableRow;
  });
  tableBody.replaceChildren(...previewRows);
}

async function loadDashboard() {
  const status = document.getElementById("status");

  try {
    const response = await fetch("data.csv");
    if (!response.ok) {
      throw new Error(`Não foi possível carregar data.csv (${response.status}).`);
    }

    const records = parseCsv(await response.text());
    if (records.length === 0 || records[0].length === 0) {
      throw new Error("O arquivo CSV está vazio ou não contém cabeçalhos.");
    }

    const [headers, ...rows] = records;
    const numericColumns = getNumericColumns(headers, rows);

    document.getElementById("row-count").textContent = String(rows.length);
    document.getElementById("column-count").textContent = String(headers.length);
    document.getElementById("numeric-count").textContent = String(
      numericColumns.length,
    );
    renderCharts(numericColumns);
    renderTable(headers, rows);
    status.textContent = `Análise carregada de data.csv (${rows.length} linhas).`;
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : "Erro inesperado ao carregar o CSV.";
    status.classList.add("error");
  }
}

loadDashboard();
