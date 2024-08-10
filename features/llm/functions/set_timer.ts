export function set_timer({
  minutes,
  subject,
}: {
  minutes: number;
  subject: string;
}) {
  console.log(`set_timer: ${minutes}, ${subject}`);

  return JSON.stringify({
    name: "set_timer",
    content: { minutes, subject },
  });
}
