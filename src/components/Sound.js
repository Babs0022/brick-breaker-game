import * as Tone from 'tone';

const synth = new Tone.Synth().toDestination();
const soundCooldowns = {};
const COOLDOWN_TIME = 100; // ms

export const startAudio = async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
    console.log('AudioContext started');
  }
};

const canPlaySound = (soundId) => {
  const now = Date.now();
  if (!soundCooldowns[soundId] || now - soundCooldowns[soundId] > COOLDOWN_TIME) {
    soundCooldowns[soundId] = now;
    return true;
  }
  return false;
};

export const playBrickHitSound = () => {
  if (canPlaySound('brick')) {
    synth.triggerAttackRelease('C4', '8n');
  }
};

export const playPaddleHitSound = () => {
  if (canPlaySound('paddle')) {
    synth.triggerAttackRelease('E4', '8n');
  }
};

export const playPowerUpSound = () => {
  if (canPlaySound('powerup')) {
    synth.triggerAttackRelease('G4', '8n');
  }
};

export const playGameOverSound = () => {
  if (canPlaySound('gameover')) {
    synth.triggerAttackRelease('C3', '4n');
  }
};

export const playLevelUpSound = () => {
  if (canPlaySound('levelup')) {
    synth.triggerAttackRelease('C5', '4n');
  }
};