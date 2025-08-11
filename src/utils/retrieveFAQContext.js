const prisma = require('../db');
const { getEmbedding } = require('../utils/openai');
const { cosineSimilarity } = require('../utils/cosine');

async function retrieveFAQContext(userInput) {
  const inputEmbedding = await getEmbedding(userInput);
  const faqs = await prisma.faq_manual.findMany();

  const scored = faqs.map(faq => ({
    ...faq,
    score: cosineSimilarity(
      JSON.parse(faq.embedding),
      inputEmbedding
    )
  }));

  const top = scored.sort((a, b) => b.score - a.score).slice(0, 3);
  return top.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
}

module.exports = { retrieveFAQContext };
