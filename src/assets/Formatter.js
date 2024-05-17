function dateFormatter(value) {
  if (!value) return "";

  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function dateTimeFormatter(value) {
  if (!value) return "";

  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
}

function moneyFormatter(value) {
  if (value === null || value === undefined) return "";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

const Formatter = {
  dateFormatter,
  dateTimeFormatter,
  moneyFormatter,
};

export default Formatter;
