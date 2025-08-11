let embedder = null;

async function preloadEmbedder() {
  if (!embedder) {
    const { pipeline } = await import('@xenova/transformers');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log("✅ Model embedding siap digunakan");
  }
}

async function getEmbedding(text) {
  try {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      throw new Error("Input text tidak boleh kosong.");
    }

    if (!embedder) {
      console.log("📦 Embedder belum tersedia, loading...");
      await preloadEmbedder(); // pastikan tersedia
    }

    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error("❌ Gagal menghasilkan embedding lokal:", err.message);
    throw new Error("Gagal menjalankan embedding lokal.");
  }
}

module.exports = { getEmbedding, preloadEmbedder };
