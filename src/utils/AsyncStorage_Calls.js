import AsyncStorage from "@react-native-async-storage/async-storage";

var AsyncStorage_Calls = function () {};

AsyncStorage_Calls.prototype.setTokenJWT = function (key, value, callBack) {
  AsyncStorage.setItem("Allonsz$:$:" + key, JSON.stringify(value), (err) => {
    if (err) {
      callBack("Error setting token", false);
    } else {
      callBack(null, true);
      // console.log("setTokenJWT ");
    }
  });
};

AsyncStorage_Calls.prototype.getTokenJWT = function (key, callBack) {
  AsyncStorage.getItem("Allonsz$:$:" + key, (err, result) => {
    if (err) {
      callBack("Error getting token", null);
    } else {
      let dataSender = JSON.parse(result);
      try {
        if (dataSender != null) {
          dataSender = dataSender.replaceAll('"', "");
        }
      } catch (err) {
        // console.log("Error in token quotes", err);
        if (err.response.status === 500) {
          console.log("Internal Server Error", err.message);
        }
      }

      callBack(null, result ? dataSender : null);
      // callBack(null, result ? JSON.parse(result) : null);
    }
  });
};

AsyncStorage_Calls.prototype.RemoveTokenJWT = function (key, callBack) {
  AsyncStorage.removeItem("Allonsz$:$:" + key, (err) => {
    if (err) {
      callBack("Error removing token", false);
    } else {
      callBack(null, true);
      // console.log("Token removed successfully");
    }
  });
};

AsyncStorage_Calls.prototype.setAsync = function (key, value) {
  return new Promise((resolve, reject) => {
    AsyncStorage.setItem("Allonsz$:$:" + key, JSON.stringify(value), (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
};

AsyncStorage_Calls.prototype.getAsync = function (key) {
  return new Promise((resolve) => {
    AsyncStorage.getItem("Allonsz$:$:" + key, (err, result) => {
      if (err || !result) {
        resolve(null);
        return;
      }
      let dataSender = null;
      try {
        dataSender = JSON.parse(result);
        if (typeof dataSender === "string") {
          dataSender = dataSender.replaceAll('"', "");
        }
      } catch (_) {
        dataSender = null;
      }
      resolve(dataSender);
    });
  });
};

AsyncStorage_Calls.prototype.removeAsync = function (key) {
  return new Promise((resolve) => {
    AsyncStorage.removeItem("Allonsz$:$:" + key, () => resolve(true));
  });
};

// Wipe every locally cached KYC marker so the next user / next registration
// starts from a clean slate. Token removal is handled separately by callers
// because some flows (e.g. delete account) intentionally tear it down later.
AsyncStorage_Calls.prototype.clearKYCSession = async function () {
  await Promise.all([
    this.removeAsync("userKYC"),
    this.removeAsync("KYCVerification"),
  ]);
};

export default new AsyncStorage_Calls();
