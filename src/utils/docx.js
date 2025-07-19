const mammoth = require("mammoth");

async function extractTextFromDocx(base64) {
  const buffer = Buffer.from(base64, "base64");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

module.exports = { extractTextFromDocx };
