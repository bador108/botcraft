import OpenAI from 'openai'

// Nomic AI — free embeddings, OpenAI-compatible endpoint
function getClient() {
  return new OpenAI({
    apiKey: process.env.NOMIC_API_KEY,
    baseURL: 'https://api-atlas.nomic.ai/v1/',
  })
}

export async function embedText(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: 'nomic-embed-text-v1.5',
    input: text.slice(0, 8000),
  })
  return response.data[0].embedding
}
