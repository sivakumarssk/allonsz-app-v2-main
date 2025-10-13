export const setEmailSupport = (email) => {
  return { type: "SET_EMAIL_SUPPORT", email };
};

export const setWhatAppSupport = (number) => {
  return { type: "SET_WHATAPP_SUPPORT", number };
};

export const setCallSupport = (number) => {
  return { type: "SET_CALL_SUPPORT", number };
};
