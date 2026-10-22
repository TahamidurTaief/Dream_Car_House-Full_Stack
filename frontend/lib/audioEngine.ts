// High-fidelity supercar rev and burnout audio engine with Web Audio API synthesis fallback

export function playSupercarRevSound(): void {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio("/assets/supercar_engine_rev.wav");
    audio.volume = 0.9;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to compact or synthesized engine rev
        try {
          const compact = new Audio("/assets/supercar_rev_compact.wav");
          compact.volume = 0.9;
          compact.play().catch(() => {
            synthesizeWebAudioRev();
          });
        } catch {
          synthesizeWebAudioRev();
        }
      });
    }
  } catch {
    synthesizeWebAudioRev();
  }
}

export function synthesizeWebAudioRev(): void {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const t0 = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, t0);
    masterGain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.15);
    masterGain.gain.exponentialRampToValueAtTime(0.5, t0 + 0.6);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.25);
    masterGain.connect(ctx.destination);

    // Oscillator 1: Deep V8 rumble
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(45, t0);
    osc1.frequency.exponentialRampToValueAtTime(160, t0 + 0.5);
    osc1.frequency.exponentialRampToValueAtTime(80, t0 + 1.2);
    osc1.connect(masterGain);
    osc1.start(t0);
    osc1.stop(t0 + 1.25);

    // Oscillator 2: Exhaust scream
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(90, t0);
    osc2.frequency.exponentialRampToValueAtTime(320, t0 + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(140, t0 + 1.2);
    osc2.connect(masterGain);
    osc2.start(t0);
    osc2.stop(t0 + 1.25);

    // Tire burnout noise buffer
    const bufferSize = ctx.sampleRate * 0.8;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1200, t0);
    noiseFilter.Q.setValueAtTime(1.5, t0);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, t0);
    noiseGain.gain.linearRampToValueAtTime(0.2, t0 + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.8);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(t0 + 0.1);
    whiteNoise.stop(t0 + 0.9);
  } catch (e) {
    console.warn("Web Audio synthesis error:", e);
  }
}
