const initialState = {
  kycStatus: null,
  kycVerified: false,
};

// Reducer
const kycReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_KYC_STATUS":
      return {
        ...state,
        kycStatus: action.payload,
      };
    case "SET_KYC_VERIFIED":
      return {
        ...state,
        kycVerified: action.payload,
      };
    default:
      return state;
  }
};

export default kycReducer;
