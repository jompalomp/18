let ctx: AudioContext | null = null;

/**
 * Ett kort, torrt "klick" som när en ratt passerar ett läge.
 * Syntetiseras med Web Audio – inga ljudfiler behövs.
 */
export function playDetentClick(peak = false) {
  if (typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;

    const length = Math.floor(ctx.sampleRate * 0.012);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 4);
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = peak ? 4200 : 2600;
    filter.Q.value = 1.4;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);

    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
  } catch {
    // Ljud är en bonus; tyst om det inte går.
  }
}
