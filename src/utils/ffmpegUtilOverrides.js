/**
 * Download content of a URL with progress.
 *
 * Progress only works when Content-Length is provided by the server.
 *
 */
export const downloadWithProgressOverridden = async (url, cb) => {
  const resp = await fetch(url);
  let buf;

  try {
    // Set total to -1 to indicate that there is not Content-Type Header.
    const total = parseInt(resp.headers.get("Content-Length") || "-1");

    const reader = resp.body?.getReader();
    if (!reader) throw "failed to get response body reader";

    const chunks = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      const delta = value ? value.length : 0;

      if (done) {
        cb && cb({ url, total, received, delta, done });
        break;
      }

      chunks.push(value);
      received += delta;
      cb && cb({ url, total, received, delta, done });
    }

    const data = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
      data.set(chunk, position);
      position += chunk.length;
    }

    buf = data.buffer;
  } catch (e) {
    console.log(`failed to send download progress event: `, e);
    // Fetch arrayBuffer directly when it is not possible to get progress.
    buf = await resp.arrayBuffer();
    cb &&
      cb({
        url,
        total: buf.byteLength,
        received: buf.byteLength,
        delta: 0,
        done: true,
      });
  }

  return buf;
};

/**
 * toBlobURL fetches data from an URL and return a blob URL.
 *
 * Example:
 *
 * ```ts
 * await toBlobURL("http://localhost:3000/ffmpeg.js", "text/javascript");
 * ```
 */
export const toBlobURLOverridden = async (
  url,
  mimeType,
  progress = false,
  cb
) => {
  const buf = progress
    ? await downloadWithProgressOverridden(url, cb)
    : await (await fetch(url)).arrayBuffer();
  const blob = new Blob([buf], { type: mimeType });
  return URL.createObjectURL(blob);
};
