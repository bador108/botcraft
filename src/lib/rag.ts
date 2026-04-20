// Chunk text into ~500-token pieces (~2000 characters)
export function chunkText(text: string, maxChars = 2000): string[] {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  const chunks: string[] = []
  let current = ''

  for (const para of paragraphs) {
    if (para.length > maxChars) {
      // Large paragraph — split by sentence
      if (current) {
        chunks.push(current.trim())
        current = ''
      }
      const sentences = para.split(/(?<=[.!?])\s+/)
      for (const sentence of sentences) {
        if ((current + ' ' + sentence).length > maxChars) {
          if (current) chunks.push(current.trim())
          current = sentence
        } else {
          current = current ? current + ' ' + sentence : sentence
        }
      }
    } else if ((current + '\n\n' + para).length > maxChars) {
      if (current) chunks.push(current.trim())
      current = para
    } else {
      current = current ? current + '\n\n' + para : para
    }
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks.filter(c => c.length > 20)
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    return data.text
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filename.endsWith('.docx')
  ) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mammoth = require('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }
  // TXT / MD — decode as UTF-8
  return buffer.toString('utf-8')
}
