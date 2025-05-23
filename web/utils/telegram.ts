export const telegramInitData = window.Telegram?.WebApp?.initData;
export const isTelegram = telegramInitData !== "";

type MiniAppVersion8 = typeof window.Telegram.WebApp & {
  requestFullScreen?: () => void;
  exitFullScreen?: () => void;
};

export const telegramRequestFullScreen = (window.Telegram?.WebApp as MiniAppVersion8)?.requestFullScreen;
export const telegramExitFullScreen = (window.Telegram?.WebApp as MiniAppVersion8)?.exitFullScreen;

const getParam = (param: keyof WebAppInitData) => {
  const params = new URLSearchParams(telegramInitData);

  const value = params.get(param);

  if (!value) {
    return null;
  }
  return value;
};

const getTelegramUser = (): WebAppUser | null => {
  const user = getParam("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

export const telegramUser = getTelegramUser();
