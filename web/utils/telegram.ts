export const telegramInitData = window.Telegram?.WebApp?.initData;
export const isTelegram = telegramInitData !== "";

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
