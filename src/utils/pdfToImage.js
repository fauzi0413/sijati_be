const { convert } = require("pdf-poppler");
const fs = require("fs");
const path = require("path");

async function convertPDFToImage(pdfBuffer, outputPath) {
  const tempFile = path.join(outputPath, `temp-${Date.now()}.pdf`);
  fs.writeFileSync(tempFile, pdfBuffer);

  const options = {
    format: "jpeg",
    out_dir: outputPath,
    out_prefix: `page-${Date.now()}`,
    page: 1,
  };

  try {
    await convert(tempFile, options);

    // Cari file hasil konversi
    const files = fs.readdirSync(outputPath);
    const resultImage = files.find((f) => f.startsWith(options.out_prefix) && f.endsWith(".jpg"));

    if (!resultImage) {
      throw new Error("File hasil konversi tidak ditemukan.");
    }

    const imagePath = path.join(outputPath, resultImage);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Cleanup
    fs.unlinkSync(tempFile);
    fs.unlinkSync(imagePath);

    return base64Image;
  } catch (err) {
    console.error("Gagal mengkonversi PDF ke gambar:", err);
    throw err;
  }
}

module.exports = { convertPDFToImage };
