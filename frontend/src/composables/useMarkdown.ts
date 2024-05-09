import DOMPurify from "dompurify";
import { Marked } from "marked";

const marked = new Marked({
  async: false,
  gfm: true,
  breaks: true,
});

export function useMarkdown() {
  return {
    parse: (content: string) => {
      return DOMPurify.sanitize(marked.parse(content) as string);
    },
  };
}
