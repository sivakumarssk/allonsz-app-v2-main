const initialState = {
  email_number: null,
  whatsapp_number: null,
  call_number: null,
};

// Reducer
const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EMAIL_SUPPORT":
      return {
        ...state,
        email_number: action.email,
      };
    case "SET_WHATAPP_SUPPORT":
      return {
        ...state,
        whatsapp_number: action.number,
      };
    case "SET_CALL_SUPPORT":
      return {
        ...state,
        call_number: action.number,
      };
    default:
      return state;
  }
};

export default settingReducer;
