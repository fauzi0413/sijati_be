// utils/chunker.js

function cleanText(text) {
  return text
    .replace(/\n/g, ' ')                // Hilangkan newline
    .replace(/\s+/g, ' ')               // Normalisasi spasi
    .replace(/[^a-zA-Z0-9.,:;/()\[\]\-\u2013\u2014\s]/g, '') // Karakter non-standar
    .trim();
}

function chunkText(text, maxLength = 1000) {
  const finalChunks = [];

  // 1️⃣ Coba pecah berdasarkan kalimat
  let sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences) {
    console.warn("⚠️ Gagal memecah kalimat. Fallback ke potongan karakter langsung...");
    // 3️⃣ Fallback terakhir: potong per 1000 karakter
    for (let i = 0; i < text.length; i += maxLength) {
      finalChunks.push(cleanText(text.slice(i, i + maxLength)));
    }
    return finalChunks;
  }

  // 2️⃣ Gabung kalimat agar tidak melebihi maxLength
  let temp = '';
  for (let sentence of sentences) {
    sentence = cleanText(sentence);
    if ((temp + sentence).length > maxLength) {
      if (temp) finalChunks.push(temp.trim());
      temp = sentence;
    } else {
      temp += sentence;
    }
  }
  if (temp) finalChunks.push(temp.trim());

  return finalChunks;
}

module.exports = {
  chunkText
};
