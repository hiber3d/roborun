type SoundConfig = {
  mute: boolean;
  volume: number;
};

export const setConfigInLocalStorage = (key: string, value: SoundConfig) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const defaultSettings = { mute: false, volume: 0.4 };

export const getConfigFromLocalStorage = (key?: string): SoundConfig => {
  if (!key) {
    return defaultSettings;
  }
  const settings = localStorage.getItem(key);

  if (settings) {
    return JSON.parse(settings) as SoundConfig;
  }

  return defaultSettings;
};
