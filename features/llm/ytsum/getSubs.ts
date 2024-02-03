import { decodeHTML5 } from "entities";
import { DOMParser } from "dom";
import { Err, Ok, type Result } from "unwrap";

const cache: Map<string, string> = new Map();
const buffer: string[] = new Array(10);

function pushToCache(key: string, value: string) {
  if (cache.has(key)) {
    return;
  }

  cache.delete(buffer.shift()!);
  buffer.push(key);
  cache.set(key, value);
}

export function fetchText(url: URL): Promise<Result<string, Error>> {
  return fetch(url)
    .then((res) =>
      res.text()
        .then((text) => Ok<string, Error>(text))
        .catch((err) => Err<string, Error>(err))
    )
    .catch((err) => Err<string, Error>(err));
}

export async function getSubsUrl(url: URL): Promise<Result<URL, Error>> {
  const response = await fetchText(url);

  if (response.isErr()) {
    return response;
  }

  const match = response.unwrap().match(
    /"(https:\/\/www\.youtube\.com\/api\/timedtext.+?)"/,
  );

  if (match === null) {
    return Err(new Error("no match"));
  }

  return Ok(new URL(match[1].replaceAll("\\u0026", "&")));
}

export async function getSubs(url: URL): Promise<Result<string, Error>> {
  if (cache.has(url.toString())) {
    return Ok(cache.get(url.toString())!);
  }

  const subsUrl = await getSubsUrl(url);
  if (subsUrl.isErr()) {
    return subsUrl;
  }

  const response = await fetchText(subsUrl.unwrap());
  if (response.isErr()) {
    return response;
  }

  const dom = new DOMParser().parseFromString(response.unwrap(), "text/html");
  const transcript = dom?.querySelector("transcript") ?? null;
  if (transcript === null) {
    return Err(new Error("no transcript"));
  }

  const text = transcript.textContent;
  if (text === null) {
    return Err(new Error("no text"));
  }

  const subs = decodeHTML5(text);

  pushToCache(url.toString(), subs);

  return Ok(subs);
}
