import { NodeHtmlMarkdown as HTM } from 'npm:node-html-markdown'

export function htmlToMarkdown(html: string): string {
  return HTM.translate(html)
}