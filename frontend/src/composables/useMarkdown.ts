import DOMPurify from "dompurify";
import { Marked } from "marked";

const marked = new Marked({
  async: false,
  gfm: true,
  breaks: true,
});

export function useMarkdown(): { parse: (content: string) => string } {
  return {
    parse: (content: string): string => {
      return DOMPurify.sanitize(marked.parse(content) as string);
    },
  };
}
