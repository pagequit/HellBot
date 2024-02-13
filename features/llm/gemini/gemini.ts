export default function (sessionId: string, content: string) {
  return fetch("http://protonwire:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      content,
    }),
  }).then((res) => res.json());
}
