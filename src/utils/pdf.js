const pdf = require("pdf-parse");

async function extractTextFromPDF(base64) {
  const buffer = Buffer.from(base64, "base64");
  const data = await pdf(buffer);
  return data.text;
}

module.exports = { extractTextFromPDF };
