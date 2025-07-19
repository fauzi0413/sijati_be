const { pipeline } = require('@xenova/transformers');

let embedder = null;

// Init embedding pipeline 1x saat pertama dipanggil
async function getEmbedding(text) {
  try {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Input text tidak boleh kosong.");
    }

    // Load model jika belum ada
    if (!embedder) {
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    const output = await embedder(text, { pooling: 'mean', normalize: true });

    // output: array of embedding (Float32Array)
    return Array.from(output.data);

  } catch (err) {
    console.error("❌ Gagal menghasilkan embedding lokal:", err.message);
    throw new Error("Gagal menjalankan embedding lokal.");
  }
}

module.exports = { getEmbedding };
