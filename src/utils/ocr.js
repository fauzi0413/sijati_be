const Tesseract = require("tesseract.js");

async function extractTextFromImage(base64) {
  const buffer = Buffer.from(base64, "base64");
  const result = await Tesseract.recognize(buffer, "eng");
  return result.data.text;
}

module.exports = { extractTextFromImage };
