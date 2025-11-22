import axios from "axios";

const baseUrl = "https://admin.allons-z.com";

// Login User
export const valid_login = async (values) => {
  return await axios.post(`${baseUrl}/api/login`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//RegisterEmail
export const valid_Email = async (values) => {
  return await axios.post(`${baseUrl}/api/send-otp`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//Verify OTP
export const verify_OTP = async (values) => {
  return await axios.post(`${baseUrl}/api/verify-otp`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//resend OTP
export const reSend_OTP = async (values) => {
  return await axios.post(`${baseUrl}/api/resend-otp`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//update password
export const Update_Password = async (values, token) => {
  return await axios.post(`${baseUrl}/api/update-password`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Verify OTP
export const forgot_OTP = async (values) => {
  return await axios.post(`${baseUrl}/api/forget-password`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//get All countries
export const GET_countries = async (token) => {
  const formData = new FormData();
  formData.append("key", "value");
  // console.log(token);

  return await axios.post(`${baseUrl}/api/get-countries`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//get All States
export const GET_States = async (id, token) => {
  const formData = new FormData();
  formData.append("country_id", id);
  try {
    // console.log("Sending request to /api/get-states with token:", token);
    const response = await axios.post(`${baseUrl}/api/get-states`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Response from /api/get-states:", response.data);
    return response;
  } catch (error) {
    // console.error("Error in GET_states:", error);
  }
};
//get All District
export const GET_District = async (id, token) => {
  const formData = new FormData();
  formData.append("state_id", id);
  try {
    // console.log("Sending request to /api/get-states with token:", token);
    const response = await axios.post(
      `${baseUrl}/api/get-districts`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Response from /api/get-states:", response.data);
    return response;
  } catch (error) {
    // console.error("Error in GET_states:", error);
  }
};
//get All District
export const GET_Mandals = async (id, token) => {
  const formData = new FormData();
  formData.append("district_id", id);
  try {
    // console.log("Sending request to /api/get-states with token:", token);
    const response = await axios.post(`${baseUrl}/api/get-mandals`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Response from /api/get-mandals:", response.data);

    return response;
  } catch (error) {
    if (error.response) {
      // Request made and server responded with an error status code
      // console.error("Error Response Data:", error.response.data);
      // console.error("Error Response Status:", error.response.status);
      // console.error("Error Response Headers:", error.response.headers);
      if (error.response.status === 401) {
        // console.error(
        //   "Authentication failed. The provided token might be invalid or expired."
        // );
        // Optionally, you could redirect the user to login page or show a login modal
      }
    } else if (error.request) {
      // The request was made, but no response was received
      // console.error("Error Request Data:", error.request);
    } else {
      // Something else triggered the error
      // console.error("Error Message:", error.message);
    }
  }
};

//
export const UPDATE_profile = async (values, token) => {
  const formData = new FormData();

  if (values.photo) {
    const { uri, fileName, mimeType } = values.photo;
    formData.append("photo", {
      uri,
      name: fileName,
      type: mimeType,
    });
  }
  formData.append("first_name", values.first_name);
  formData.append("last_name", values.last_name);
  formData.append("username", values.username);
  // formData.append("email", values.email);
  formData.append("phone", values.phone);
  formData.append("gender", values.gender);
  formData.append("country_id", values.country_id);
  formData.append("state_id", values.state_id);
  formData.append("district_id", values.district_id);
  formData.append("mandal_id", values.mandal_id);
  formData.append("address", values.address);
  formData.append("pincode", values.pincode);
  formData.append("referal_code", values.referal_code);

  return await axios.post(`${baseUrl}/api/update-profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//update photo
export const UPDATE_profilePic = async (image, token) => {
  const formData = new FormData();

  if (image) {
    const { uri, fileName, mimeType } = image;
    formData.append("photo", {
      uri,
      name: fileName,
      type: mimeType,
    });
  }

  return await axios.post(`${baseUrl}/api/update-profile-photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//
export const SEND_aadharotp = async (values, token) => {
  const formData = new FormData();

  let cleanedAadharNo = "";
  if (typeof values === "string") {
    cleanedAadharNo = values.replace(/-/g, "");
  } else if (typeof values === "object" && values.aadhar_no) {
    cleanedAadharNo = values.aadhar_no.replace(/-/g, "");
  }

  formData.append("aadhar_no", cleanedAadharNo);

  // console.log("Sending request to /api/get-aadhar-otp with token:", token);
  return await axios.post(`${baseUrl}/api/get-aadhar-otp`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const get_aadhar_validation_link = async (values, token) => {
  // console.log("Sending request to /api/get-aadhar-validation-link:", token);
  const formData = new FormData();

  let cleanedAadharNo = "";
  if (typeof values === "string") {
    cleanedAadharNo = values.replace(/-/g, "");
  } else if (typeof values === "object" && values.aadhar_no) {
    cleanedAadharNo = values.aadhar_no.replace(/-/g, "");
  }

  formData.append("aadhar_no", cleanedAadharNo);

  return await axios.post(
    `${baseUrl}/api/get-aadhar-validation-link`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//Verify OTP
export const validate_aadhar = async (ts_trans_id, token) => {
  console.log(ts_trans_id);

  const formData = new FormData();
  formData.append("ts_trans_id", ts_trans_id);

  return await axios.post(`${baseUrl}/api/validate-aadhar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
//
export const verifyAadhar_OTP = async (values, token) => {
  return await axios.post(`${baseUrl}/api/verify-aadhar-otp`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
//verify pan_no
export const verify_PAN = async (values, token) => {
  return await axios.post(`${baseUrl}/api/verify-pan-number`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verify_BANKDETAILS = async (values, token) => {
  const formData = new FormData();
  formData.append("account_no", values.account_no);
  formData.append("ifsc_code", values.ifsc_code);

  return await axios.post(`${baseUrl}/api/update-bank-details`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get Profile detilas
export const get_ProfileDetails = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
//update Reffereal
export const update_RefferealCode = async (values, token) => {
  const formData = new FormData();
  formData.append("referal_code", values.referal_code);

  return await axios.post(`${baseUrl}/api/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Home Screen
export const All_Trips = async (values, token) => {
  const formData = new FormData();
  formData.append("type", values);

  return await axios.post(`${baseUrl}/api/get-tours`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Selected Trip
export const Selected_Trips = async (values, token) => {
  const formData = new FormData();
  formData.append("tour_id", values);

  return await axios.post(`${baseUrl}/api/tour-details`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Setting Api
export const Get_Setting = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/get-setting`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get user status
export const Get_userStatus = async (token) => {
  return await axios.get(`${baseUrl}/api/user-status`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Ads
export const Get_Ads = async (token) => {
  return await axios.get(`${baseUrl}/api/get-add`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get user Packages
export const Get_Packages = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/get-packages`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//create-razorpay-order
export const Create_Razorpay_Order = async (packageId, token) => {
  const formData = new FormData();
  formData.append("package_id", packageId);

  return await axios.post(`${baseUrl}/api/create-razorpay-order`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//create-razorpay-order
export const Verify_Razorpay_Order = async (data, token) => {
  const formData = new FormData();
  formData.append("razorpay_order_id", data.razorpay_order_id);
  formData.append("razorpay_payment_id", data.razorpay_payment_id);
  formData.append("razorpay_signature", data.razorpay_signature);

  return await axios.post(
    `${baseUrl}/api/verify-razorpay-signature`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//Get Circle Packages
export const Get_AllCircles = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/get-circles`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const Get_AllPastCircles = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/get-completed-circles`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Circle Packages
export const Get_OthersCircles = async (token, package_id, downline_id) => {
  const formData = new FormData();
  formData.append("package_id", package_id);
  formData.append("downline_id", downline_id);

  return await axios.post(`${baseUrl}/api/get-downline-circle`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Send Withdraw Rrequest
export const Send_withdraw_request = async (values, token) => {
  // console.log(token);
  const formData = new FormData();
  formData.append("amount", values);

  return await axios.post(`${baseUrl}/api/withdraw-request`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_withdraw_history = async (token) => {
  return await axios.get(`${baseUrl}/api/withdraw-history`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const get_transaction_history = async (token) => {
  return await axios.get(`${baseUrl}/api/transaction-history`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Send Withdraw Rrequest
export const Send_request_trip = async (values, token) => {
  // console.log(token);
  const formData = new FormData();
  formData.append("tour_id", values.tour_id);
  formData.append("from_place", values.from_place);
  formData.append("members", values.members);
  formData.append("from_date", values.from_date);
  formData.append("to_date", values.to_date);

  return await axios.post(`${baseUrl}/api/request-trip`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Send Withdraw Rrequest
export const Send_Update_trip = async (values, token) => {
  // console.log(token);
  const formData = new FormData();
  formData.append("tour_id", values.tour_id);
  formData.append("from_place", values.from_place);
  formData.append("members", values.members);
  formData.append("from_date", values.from_date);
  formData.append("to_date", values.to_date);
  formData.append("trip_id", values.trip_id);

  return await axios.post(`${baseUrl}/api/update-trip`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

//Get Circle Packages
export const Get_MyTrips = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/my-trips`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
//Upload
export const Upload_Trip_Pic = async (tripID, images, token) => {
  // console.log("dkjhfsjb", tripID, images);

  const formData = new FormData();
  formData.append("trip_id", tripID);

  images.forEach((image, index) => {
    // console.log("fg", image.uri, "Gg");
    formData.append("photos[]", {
      uri: image.uri,
      type: image.mimeType,
      name: image.fileName,
    });
  });

  return await axios.post(`${baseUrl}/api/upload-trip-photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// get timer
export const Get_Timer = async (token) => {
  return await axios.get(`${baseUrl}/api/get-timer`, {
    headers: {
      "Content-Type": "application/json", // Updated to match typical GET request
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const Get_Timer = async (token) => {
//   try {
//     const response = await axios.get(`${baseUrl}/api/get-timer`, {
//       headers: {
//         "Content-Type": "application/json", // Updated to match typical GET request
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     console.log("gefiweggnh****?", response.data);
//     return response;
//   } catch (error) {
//     console.error("Error fetching timer data:", error);
//   }
// };

export const Delete_Account = async (token) => {
  const formData = new FormData();
  formData.append("key", "values");

  return await axios.post(`${baseUrl}/api/delete-account`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const Check_Timer_Alert = async (token)=>{
  return await axios.get(`${baseUrl}/api/check-timer-alert`,{
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  })
}