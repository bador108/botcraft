import { CohereClient } from 'cohere-ai'

function getCohere() {
  return new CohereClient({ token: process.env.COHERE_API_KEY! })
}

const BATCH_SIZE = 96

/**
 * Generuje embeddings pro pole textových chunků (dokumenty do DB).
 * Model: embed-multilingual-v3.0 — výborná podpora češtiny. Dimenze: 1024.
 */
export async function embedChunks(chunks: string[]): Promise<number[][]> {
  const cohere = getCohere()
  const allEmbeddings: number[][] = []

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const response = await cohere.embed({
      texts: batch,
      model: 'embed-multilingual-v3.0',
      inputType: 'search_document',
    })
    allEmbeddings.push(...(response.embeddings as number[][]))
  }

  return allEmbeddings
}

/**
 * Generuje embedding pro user query (jiný inputType pro lepší retrieval).
 */
export async function embedQuery(query: string): Promise<number[]> {
  const cohere = getCohere()
  const response = await cohere.embed({
    texts: [query.slice(0, 2048)],
    model: 'embed-multilingual-v3.0',
    inputType: 'search_query',
  })
  return (response.embeddings as number[][])[0]
}
