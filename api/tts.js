// Vercel Serverless Function: /api/tts
// Chạy Edge TTS (Microsoft Neural Voices) trên Vercel — thay thế hoàn toàn Vite middleware
// Hỗ trợ: vi-VN-HoaiMyNeural, vi-VN-NamMinhNeural, en-US-AnaNeural, en-US-GuyNeural, en-GB-SoniaNeural...

// --- Escape SSML ---
function escapeSSML(str) {
  if (!str) return '';
  const escaped = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  return escaped.replace(/\[\[BREAK_1S\]\]/g, '<break time="1000ms"/>');
}

// --- Edge TTS via WebSocket ---
async function getEdgeTTSAudio(text, voice = 'vi-VN-HoaiMyNeural', rate = 1.0) {
  const { default: WebSocket } = await import('ws');
  return new Promise((resolve, reject) => {
    try {
      const requestId = Math.random().toString(36).substring(2, 10);
      const url = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4E5C54E24988075F72823F013`;

      const ws = new WebSocket(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
          'Origin': 'chrome-extension://jdiccldimpdaibmpobdefobmjpjjphkg'
        }
      });

      const audioChunks = [];
      const ratePercent = Math.round((rate - 1.0) * 100);
      const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;
      const safeText = escapeSSML(text);
      const xmlLang = voice.startsWith('en-GB') ? 'en-GB' : (voice.startsWith('en-') ? 'en-US' : 'vi-VN');
      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${xmlLang}'><voice name='${voice}'><prosody pitch='+0Hz' rate='${rateStr}' volume='+0%'>${safeText}</prosody></voice></speak>`;

      const timer = setTimeout(() => {
        try { ws.close(); } catch (e) {}
        reject(new Error('Edge TTS timeout'));
      }, 10000);

      ws.on('open', () => {
        ws.send(`Path: speech.config\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`);
        ws.send(`Path: ssml\r\nX-RequestId: ${requestId}\r\nContent-Type: application/ssml+xml\r\n\r\n${ssml}`);
      });

      ws.on('message', (data) => {
        try {
          if (Buffer.isBuffer(data) || data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
            const buf = Buffer.from(data);
            const header = buf.toString('utf8', 0, Math.min(buf.length, 200));
            if (header.includes('Path:audio')) {
              const sep = buf.indexOf('\r\n\r\n');
              if (sep !== -1) {
                const audio = buf.subarray(sep + 4);
                if (audio.length > 0) audioChunks.push(audio);
              }
            } else if (header.includes('Path:turn.end')) {
              clearTimeout(timer);
              try { ws.close(); } catch (e) {}
              audioChunks.length > 0
                ? resolve(Buffer.concat(audioChunks))
                : reject(new Error('Empty audio output'));
            }
          } else if (typeof data === 'string' && data.includes('Path:turn.end')) {
            clearTimeout(timer);
            try { ws.close(); } catch (e) {}
            audioChunks.length > 0
              ? resolve(Buffer.concat(audioChunks))
              : reject(new Error('Empty audio output'));
          }
        } catch (err) {
          console.warn('Edge TTS message parse error:', err.message);
        }
      });

      ws.on('error', (err) => { clearTimeout(timer); reject(err); });
    } catch (e) {
      reject(e);
    }
  });
}

// --- Google TTS fallback ---
async function getGoogleTTSAudio(text, lang = 'vi') {
  const clean = text.replace(/\[\[BREAK_1S\]\]/g, '   ');
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean)}&tl=${lang}&client=tw-ob`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  if (!res.ok) throw new Error(`Google TTS HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// --- Vercel Handler ---
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const q     = url.searchParams.get('q')     || 'xin chào';
  const tl    = url.searchParams.get('tl')    || 'vi';
  const voice = url.searchParams.get('voice') || 'vi-VN-HoaiMyNeural';
  const rate  = parseFloat(url.searchParams.get('rate') || '1.0');

  // 1. Thử Edge TTS (Neural voices)
  if (voice.includes('Neural') || voice.includes('vi-VN-') || voice.includes('en-US-') || voice.includes('en-GB-')) {
    try {
      const mp3 = await getEdgeTTSAudio(q, voice, rate);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(mp3);
    } catch (edgeErr) {
      console.warn('Edge TTS failed, falling back to Google TTS:', edgeErr.message);
    }
  }

  // 2. Google TTS fallback
  try {
    let langCode = tl;
    if (voice.includes('vi') || tl.includes('vi')) langCode = 'vi';
    else if (voice.includes('en-GB') || tl.includes('en-GB')) langCode = 'en-GB';
    else if (voice.includes('en')) langCode = 'en';

    const mp3 = await getGoogleTTSAudio(q, langCode);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(mp3);
  } catch (googleErr) {
    console.error('TTS Error (both providers failed):', googleErr.message);
    return res.status(500).json({ error: googleErr.message });
  }
}
