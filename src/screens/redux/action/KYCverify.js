export const setKYCStatus = (status) => ({
  type: "SET_KYC_STATUS",
  payload: status,
});

export const setKYCVerified = (isVerified) => ({
  type: "SET_KYC_VERIFIED",
  payload: isVerified,
});
