// Browser edition by Codex (GPT-6 AI agent). The original generator is reused unchanged.
import { generateEmotion } from '../src/machine.js';
import type { Emotion, EmotionInputs } from '../src/types.js';

const fields = ['color', 'sound', 'memory', 'weather', 'object'] as const;
const examples: EmotionInputs[] = [
  {
    color: 'sun-bleached cyan',
    sound: 'a dial-up handshake that never quite connects',
    memory: 'staying up after everyone else fell asleep',
    weather: 'overcast, the kind that never decides to rain',
    object: 'a Game Boy with one dead pixel',
  },
  {
    color: 'burnt orange', sound: 'kids yelling in a far-off pool',
    memory: 'the last good summer before everything changed',
    weather: 'hazy and hot', object: 'a melting popsicle',
  },
  {
    color: 'faded mint green', sound: 'rain on the car roof',
    memory: 'waiting in the parking lot until the song ended',
    weather: 'a cold November drizzle', object: 'a handwritten mixtape label',
  },
];
let exampleIndex = 0;
let current: Emotion | undefined;
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const form = byId<HTMLFormElement>('emotion-form');
const status = byId('status');
const phrase = byId('phrase');
const result = byId('result');
const emptyState = byId('empty-state');
const setText = (id: string, value: string) => { byId(id).textContent = value; };

function manufacture(): void {
  const values = Object.fromEntries(fields.map(name => [name, byId<HTMLInputElement | HTMLTextAreaElement>(name).value]));
  current = generateEmotion(values);
  phrase.textContent = current.phrase;
  setText('serial', current.serial);
  setText('family', current.readout.family);
  setText('channel', current.features.channel);
  setText('nostalgia', `${current.readout.nostalgiaIndex}/100`);
  setText('decay', `${Math.round(current.features.decay * 100)}%`);
  setText('valence', current.readout.valence.toFixed(2));
  setText('arousal', current.readout.arousal.toFixed(2));
  setText('confidence', `${Math.round(current.readout.confidence * 100)}%`);
  byId('alternates').replaceChildren(...current.alternates.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  emptyState.hidden = true;
  result.hidden = false;
  status.textContent = `Feeling manufactured. ${current.serial}.`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  manufacture();
});
byId('example').addEventListener('click', () => {
  const example = examples[exampleIndex++ % examples.length];
  for (const name of fields) byId<HTMLInputElement | HTMLTextAreaElement>(name).value = example[name];
  manufacture();
});
form.addEventListener('reset', () => {
  current = undefined;
  result.hidden = true;
  emptyState.hidden = false;
  status.textContent = 'Inputs cleared. The machine is ready.';
});
byId('copy').addEventListener('click', async () => {
  if (!current) return;
  try {
    await navigator.clipboard.writeText(current.phrase);
    status.textContent = 'Feeling copied.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(phrase);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    status.textContent = 'Copy was unavailable. The feeling is selected; use your browser’s Copy command.';
  }
});
