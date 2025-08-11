const prisma = require('../db');
const { getEmbedding } = require('../utils/openai');
const { cosineSimilarity } = require('../utils/cosine');

async function retrieveDocumentContext(userInput) {
  const inputEmbedding = await getEmbedding(userInput);
  const docs = await prisma.document.findMany();

  const scored = docs.map(doc => ({
    ...doc,
    score: cosineSimilarity(
      JSON.parse(doc.embedding),
      inputEmbedding
    )
  }));

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 3);
  return top.map(d => d.chunks).join("\n\n");
}

module.exports = { retrieveDocumentContext };
