import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";

import SelectDropdown from "react-native-select-dropdown";
import PrimaryDropdown from "../custom_screens/PrimaryDropdown";
import PrimaryInput from "../custom_screens/PrimaryInput";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import PrimaryButton from "../custom_screens/PrimaryButton";
import Checkbox from "expo-checkbox";

import {
  GET_countries,
  GET_District,
  GET_Mandals,
  GET_States,
  UPDATE_profile,
  Get_UserByReferral,
} from "../../Network/ApiCalling";

import {
  pickImage,
  takePhoto,
} from "../../utils/DeviceHelpers/DeveiceHelperImage";

import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { useToast } from "react-native-toast-notifications";
import { SelectList } from "react-native-dropdown-select-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UserSchema } from "../../Network/Schema";

import DropDown from "../custom_screens/DropDown";
import Entypo from "@expo/vector-icons/Entypo";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Loader from "../custom_screens/Loader";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setKYCStatus } from "../redux/action/KYCverify";

import AntDesign from "@expo/vector-icons/AntDesign";
import { setToken } from "../redux/action/loginAction";
import BackToLogin from "../custom_screens/BackToLogin";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SetupProfile = () => {
  const toast = useToast();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.login.token);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const [image, setImage] = useState(null);

  const [countryData, setCountryData] = useState([]);
  const [StateData, setStatesData] = useState([]);
  const [DistrictData, setDistrictData] = useState([]);
  const [MandalsData, setMandalData] = useState([]);

  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ShowRefferal, setShowRefferal] = useState(false);
  const [referralUserName, setReferralUserName] = useState("");
  const [loadingReferral, setLoadingReferral] = useState(false);
  const referralDebounceTimerRef = React.useRef(null);

  // console.log("from the Redux", token);
  // useEffect(() => {
  //   console.log("values.checkbox", values.district_name);
  // });

  useEffect(() => {
    const handleContries = async () => {
      // console.log("in cthe Contries API");
      try {
        setLoading(true);
        const res = await GET_countries(token);
        // console.log(">in API RES>>>", token);
        if (res.status === 200) {
          // console.log("all countries:", res.data.countries);
          // console.log("Full Response:", res);
          setCountryData(res.data.countries);
        }
      } catch (err) {
        // console.log("Error all countrie", err.response.data);
        //once look at this
        if (err) {
          if (err.response) {
            const status = err.response.status;
            if (status === 400) {
              console.log("Error With 400.");
            } else if (status === 422) {
              console.log("422 error", err.response.data);
            } else if (status === 301) {
              console.log("301 error", err.response.data);
            } else if (status === 401) {
              console.log("401 error", err.response.data);
            } else if (status === 404) {
              console.log("404 error", err.response.data);
            } else if (status === 500) {
              // console.log("Internal Server Error", err.message);
              Alert.alert(
                "Internal Server Error",
                "Please Check your Internet Connection"
              );
            } else {
              // console.log("An error occurred response.>>");
              toast.hideAll();
              toast.show("Oops! Something went wrong—please try again", {
                type: "warning",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            }
          } else if (err.request) {
            // console.log("No Response Received From the Server.");
            if (err.request.status === 0) {
              // console.log()
              Alert.alert(
                "No Network Found",
                "Please Check your Internet Connection"
              );
            }
          } else {
            // console.log("Error in Setting up the Request.");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    handleContries();
  }, [token]);

  const handleStates = async (countryId) => {
    // console.log("in the states API");
    try {
      const res = await GET_States(countryId, token);
      // console.log(">>>>", res.data.countries);

      if (res.status === 200) {
        // console.log("all cstates:>>", res.data);
        setStatesData(res.data.states);
      }
    } catch (err) {
      console.log("Error all state", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;

          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            console.log("422 error", err.response.data);
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error", err.response.data);
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
            // console.log("Internal Server Error", err.message);
            Alert.alert(
              "Internal Server Error",
              "Please Check your Internet Connection"
            );
          } else {
            // console.log("An error occurred response.>>");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        } else if (err.request) {
          // console.log("No Response Received From the Server.");
          if (err.request.status === 0) {
            Alert.alert(
              "No Network Found",
              "Please Check your Internet Connection"
            );
          }
        } else {
          // console.log("Error in Setting up the Request.");
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      }
    }
  };

  const handleDistrict = async (stateId) => {
    // console.log("in the states API");
    try {
      const res = await GET_District(stateId, token);
      // console.log(">>>>", res.data.countries);

      if (res.status === 200) {
        // console.log("all district:", res.data.districts);
        setDistrictData(res.data.districts);
      }
    } catch (err) {
      // console.log("Error all state", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            console.log("422 error", err.response.data);
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error", err.response.data);
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
            // console.log("Internal Server Error", err.message);
            Alert.alert(
              "Internal Server Error",
              "Please Check your Internet Connection"
            );
          } else {
            // console.log("An error occurred response.>>");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        } else if (err.request) {
          // console.log("No Response Received From the Server.");
          if (err.request.status === 0) {
            Alert.alert(
              "No Network Found",
              "Please Check your Internet Connection"
            );
          }
        } else {
          // console.log("Error in Setting up the Request.");
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      }
    }
  };

  const handleMandals = async (districtId) => {
    // console.log("in the states API");
    try {
      const res = await GET_Mandals(districtId, token);
      // console.log(">>>>", res.data.countries);

      if (res.status === 200) {
        // console.log("all district:", res.data.mandals);
        setMandalData(res.data.mandals);
      }
    } catch (err) {
      // console.log("Error all state", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            console.log("422 error", err.response.data);
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error", err.response.data);
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
            // console.log("Internal Server Error", err.message);
            Alert.alert(
              "Internal Server Error",
              "Please Check your Internet Connection"
            );
          } else {
            // console.log("An error occurred response.>>");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        } else if (err.request) {
          // console.log("No Response Received From the Server.");
          if (err.request.status === 0) {
            Alert.alert(
              "No Network Found",
              "Please Check your Internet Connection"
            );
          }
        } else {
          // console.log("Error in Setting up the Request.");
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      }
    }
  };

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "Others" },
  ];

  const handleGallery = async () => {
    try {
      setModalVisible(false);
      const result = await pickImage();
      // console.log("edhi ra image,:::", result);
      // setImage(result);
      // setFieldValue("photo", result);
      if (result) {
        const selectedImage = result;
        // console.log("selectedImage", selectedImage);
        setImage(selectedImage); // Set the image preview (if needed)
        setFieldValue("photo", selectedImage); // Update the photo value
      }
    } catch (error) {
      console.log("Access Permission in comp", error);
    }
  };

  const handleCamera = async () => {
    try {
      const result = await takePhoto();
      // console.log("edhi ra acces photo in camera,:::", result);
      // setImage(result);
      // setFieldValue("photo", result);
      if (result) {
        const selectedImage = result;
        setImage(selectedImage); // Set the image preview (if needed)
        setFieldValue("photo", selectedImage); // Update the photo value
      }
    } catch (error) {
      console.log("Access Permission", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleDeleteImage = () => {
    setImage("");
    setFieldValue("photo", "");
  };

  const onSubmit = async (values) => {
    // console.log(">>>", values);
    // console.log("in the UPDATE_PROFILE API");
    try {
      setLoading(true);
      const res = await UPDATE_profile(values, token);
      // console.log(">>>>", res.data.countries);
      if (res.status === 200) {
        AsyncStorage_Calls.setTokenJWT(
          "userKYC",
          "step-1:ProfileSetupDone",
          function (res, status) {
            if (status) {
              // console.log("Async storage lo set userKYC step1--->", status);
              dispatch(setKYCStatus("step-1:ProfileSetupDone"));
            } else {
              console.log("Error in AsyncStorage:", status);
            }
          }
        );

        // here i have to call digilocker

        setTimeout(() => {
          navigation.navigate("AadharCard");
        }, 1500);
      }
    } catch (err) {
      // console.log("Error all API SUBMIT ERROR", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            // console.log("422 error>>", err.response.data?.error);

            toast.hideAll();
            toast.show(err.response.data?.error, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error", err.response.data);
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
            // console.log("Internal Server Error", err.message);
            Alert.alert(
              "Internal Server Error",
              "Please Check your Internet Connection"
            );
          } else {
            // console.log("An error occurred response.>>");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        } else if (err.request) {
          // console.log("No Response Received From the Server.");
          if (err.request.status === 0) {
            Alert.alert(
              "No Network Found",
              "Please Check your Internet Connection"
            );
          }
        } else {
          // console.log("Error in Setting up the Request.");
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // console.log("clicked logout functionc");
    AsyncStorage_Calls.RemoveTokenJWT("Token", function (res, status) {
      if (status) {
        // console.log("Async storage lo set", status);
        dispatch(setToken(null));
      } else {
        console.log("else", res);
      }
    });
  };

  const fetchUserByReferral = async (referalCode) => {
    if (!referalCode || referalCode.trim().length < 6) {
      setReferralUserName("");
      return;
    }

    try {
      setLoadingReferral(true);
      const res = await Get_UserByReferral(referalCode.trim(), token);
      if (res.status === 200 && res.data?.user) {
        const user = res.data.user;
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
        setReferralUserName(fullName || "User found");
      } else {
        setReferralUserName("");
      }
    } catch (err) {
      setReferralUserName("");
      // Silently handle errors - don't show toast for invalid referral codes
      if (err.response?.status !== 404) {
        console.log("Error fetching user by referral:", err.response?.data);
      }
    } finally {
      setLoadingReferral(false);
    }
  };

  const handleReferralCodeChange = (value) => {
    const emojiRegex =
      /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

    const trimmedValue = value
      .replace(emojiRegex, "")
      .replace(/^[^A-Za-z]+/, "")
      .replace(/[^A-Za-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/\s/g, "");

    setFieldTouched("referal_code", true, true);
    handleChange("referal_code")(trimmedValue);

    // Clear previous timer
    if (referralDebounceTimerRef.current) {
      clearTimeout(referralDebounceTimerRef.current);
    }

    // Clear user name if input is too short
    if (trimmedValue.length < 6) {
      setReferralUserName("");
      return;
    }

    // Set new timer for debounce (500ms delay)
    referralDebounceTimerRef.current = setTimeout(() => {
      fetchUserByReferral(trimmedValue);
    }, 500);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (referralDebounceTimerRef.current) {
        clearTimeout(referralDebounceTimerRef.current);
      }
    };
  }, []);

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    resetForm,
    handleBlur,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      photo: "",
      first_name: "",
      last_name: "",
      username: "",
      // email: "",
      phone: "",
      gender: "",
      country_id: "",
      country_name: "",
      state_id: "",
      state_name: "",
      district_id: "",
      district_name: "",
      mandal_id: "",
      mandal_name: "",
      address: "",
      pincode: "",
      referal_code: "",
      checkbox: "",
    },
    validationSchema: UserSchema,
    onSubmit,
  });

  return (
    <>
      <Loader visible={loading} />
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View
          className={`w-[90%] mx-auto flex justify-between mb-[25px] ${
            Platform.OS === "android" ? "mt-[25px]" : "mt-[80px]"
          }`}
        >
          <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText text-center pt-1">
            Setup My Profile
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
          <View className="w-[90%] mx-auto">
            <Pressable onPress={() => setModalVisible(true)}>
              <View
                className={`flex flex-row justify-center items-center border-[0.5px] rounded-[5px] w-full mx-auto mb-[10px] ${
                  touched.photo && errors.photo
                    ? "border-[#ff3232]"
                    : "border-[#6f6f6fc1]"
                }`}
              >
                <Text
                  className={`underline font-semibold ${
                    Platform.OS === "android" ? "text-[15px]" : "text-[16px]"
                  } ${
                    touched.photo && errors.photo ? "text-[#f22]" : "text-black"
                  }`}
                >
                  Upload
                </Text>
                <View className="my-3 pt-[3px] pl-2">
                  <Text
                    className={`font-montmedium ${
                      Platform.OS === "android" ? "text-[13px]" : "text-[14px]"
                    } ${
                      touched.photo && errors.photo
                        ? "text-[#f22]"
                        : "text-formText"
                    }`}
                  >
                    Only jpg & png format
                  </Text>
                </View>
              </View>
            </Pressable>
            <Text
              className={` flex items-end text-right mr-2 ${
                touched.photo && errors.photo ? "text-[#f22]" : "text-black"
              }`}
            >
              {errors.photo}
            </Text>

            {/* {console.log("logging", touched.photo, "||", errors.photo)} */}

            {image && (
              <View className="flex flex-row max-w-[150px] justify-between items-center p-2 rounded bg-[#C7F1FF33] -mt-[14px]">
                <View className=" h-[15px] overflow-hidden">
                  <Text className="font-semibold font-montmedium text-[12px]">
                    {image.fileName}
                  </Text>
                </View>

                <Pressable onPress={() => handleDeleteImage()}>
                  <Entypo name="cross" size={20} color="black" />
                </Pressable>
              </View>
            )}

            <PrimaryInput
              label={"First Name"}
              star={true}
              autoCapitalize={"words"}
              maxLength={30}
              placeholder={"enter your first name"}
              keyboardType={"default"}
              onKeyPress={(event) => {
                const key = event.nativeEvent.key;
              }}
              value={values.first_name}
              onBlur={handleBlur("first_name")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const filteredValue = value
                  .replace(emojiRegex, "")
                  .replace(/[^A-Za-z]/g, "")
                  .trim();

                setFieldTouched("first_name", true, true);
                handleChange("first_name")(filteredValue);
              }}
              error={
                touched.first_name && errors.first_name
                  ? errors.first_name
                  : null
              }
            />
            <PrimaryInput
              label={"Last Name"}
              star={true}
              maxLength={20}
              placeholder={"enter your last name"}
              keyboardType={"default"}
              autoCapitalize={"words"}
              value={values.last_name}
              onBlur={handleBlur("last_name")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const filteredValue = value
                  .replace(emojiRegex, "")
                  .replace(/[^A-Za-z]/g, "")
                  .trim();

                setFieldTouched("last_name", true, true);
                handleChange("last_name")(filteredValue);
              }}
              error={
                touched.last_name && errors.last_name ? errors.last_name : null
              }
            />
            <PrimaryInput
              label={"User Name"}
              star={true}
              placeholder={"enter your username"}
              keyboardType="email-address"
              inputMode={"email"}
              maxLength={8}
              value={values.username}
              onBlur={handleBlur("username")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const filteredValue = value
                  .replace(emojiRegex, "")
                  .replace(/[^A-Za-z0-9]/g, "")
                  .trim();

                setFieldTouched("username", true, true);
                handleChange("username")(filteredValue);
              }}
              error={
                touched.username && errors.username ? errors.username : null
              }
            />

            {/* <PrimaryInput
              label={"Email Id"}
              placeholder={"Enter email id"}
              keyboardType={"email-address"}
              value={values.email}
              onBlur={handleBlur("email")}
              onChangeText={(value) => {
                setFieldTouched("email", true, true);
                handleChange("email")(value);
              }}
              error={touched.email && errors.email ? errors.email : null}
            /> */}

            <PrimaryInput
              label={"Phone Number"}
              star={true}
              placeholder={"enter your phone number"}
              keyboardType={"number-pad"}
              value={values.phone}
              maxLength={10}
              onBlur={handleBlur("phone")}
              onChangeText={(value) => {
                const filteredValue = value.replace(/[,\.\s-]/g, "");
                setFieldTouched("phone", true, true);
                handleChange("phone")(filteredValue);
              }}
              error={touched.phone && errors.phone ? errors.phone : null}
            />

            {/*  */}
            <DropDown
              star={true}
              data={genderList}
              label="Gender"
              placeholder="select your gender"
              value={values.gender}
              labelText="label"
              onBlur={() => handleBlur("gender")}
              onChange={(selectedItem) => {
                handleChange("gender")(selectedItem.label);
                // setFieldValue("gender", selectedItem);
                // console.log(selectedItem);
              }}
              error={touched.gender && errors.gender ? errors.gender : null}
            />

            <DropDown
              star={true}
              label={"Country"}
              placeholder="select your country"
              value={values.country_name}
              labelText="name"
              data={countryData}
              onBlur={() => handleBlur("country_name")}
              onChange={(selectedItem) => {
                // console.log("selectedItem", selectedItem);
                if (selectedItem) {
                  handleChange("country_name")(selectedItem.name);
                  setFieldValue("country_id", selectedItem.id);
                  // handleChange("country_id")(selectedItem.id);
                  // console.log("KKKK", selectedItem.id); // Check if selectedItem has the id property
                  handleStates(selectedItem.id);
                } else {
                  console.error("selectedItem is undefined or null");
                }
              }}
              error={
                touched.country_name && !values.country_name
                  ? errors.country_name
                  : null
              }
              search
              searchPlaceHolder={"search for your country"}
              defaultValueByIndex={"1"}
            />

            {/* <SelectList
            maxHeight={300}
            search={true}
            setSelected={(val) => {
              handleChange("country_id")(val);
              console.log("vales", val);
            }}
            data={emojisWithIcons}
            save="value"
            value={values.country_id}
            placeholder="select your country"
            name="country"
            onBlur={() => handleBlur("country_id")}
            boxStyles={{
              backgroundColor: "",
              borderStyle: "solid",
              borderColor: "balck",
              alignItems: "center",
            }}
          /> */}

            <DropDown
              star={true}
              label={"State"}
              data={StateData}
              placeholder="select your state"
              labelText="name"
              value={values.state_name}
              onBlur={() => handleBlur("state_name")}
              onChange={(selectedItem) => {
                handleChange("state_name")(selectedItem.name);
                setFieldValue("state_id", selectedItem.id);
                handleDistrict(selectedItem.id);
                // console.log("state", selectedItem.id);
              }}
              error={
                touched.state_name && !values.state_name
                  ? errors.state_name
                  : null
              }
              search
              searchPlaceHolder={"search for your state"}
              defaultValueByIndex={"1"}
            />

            <DropDown
              star={true}
              label="District"
              data={DistrictData}
              placeholder="select your district"
              labelText="name"
              value={values.district_name}
              onBlur={() => handleBlur("district_name")}
              onChange={(selectedItem) => {
                handleChange("district_name")(selectedItem.name);
                setFieldValue("district_id", selectedItem.id);
                // console.log("district_id>>>>", selectedItem.id);
                handleMandals(selectedItem.id);
              }}
              error={
                touched.district_name && !values.district_name
                  ? errors.district_name
                  : null
              }
              search
              searchPlaceHolder={"search for your district"}
              defaultValueByIndex={"1"}
            />

            {/* <PrimaryDropdown
            itemsList={data}
            star={true}
            label="District"
            labelField="label"
            valueField="value"
            value={values.district_id}
            onBlur={handleBlur("district_id")}
            onChange={(item) => {
              setFieldTouched("district_id", true, true);
              handleChange("district_id")(item.label);
            }}
          /> */}

            <DropDown
              star={true}
              label="Mandal"
              data={MandalsData}
              placeholder="select your Mandal"
              labelText="name"
              value={values.mandal_id}
              onBlur={() => handleBlur("mandal_id")}
              onChange={(selectedItem) => {
                handleChange("mandal_name")(selectedItem.name);
                setFieldValue("mandal_id", selectedItem.id);
                // console.log(selectedItem);
              }}
              error={
                touched.mandal_name && !values.mandal_name
                  ? errors.mandal_name
                  : null
              }
              // touched.mandal_name && errors.mandal_name
              search
              searchPlaceHolder={"search for your city"}
              defaultValueByIndex={"1"}
            />

            {/* <PrimaryDropdown  /> */}

            <PrimaryInput
              label={"Address"}
              star={true}
              maxLength={255}
              placeholder={"enter your address"}
              keyboardType={"default"}
              autoCapitalize={"sentences"}
              value={values.address}
              onBlur={handleBlur("address")}
              onChangeText={(value) => {
                const trimmedValue = value
                  .replace(/^\s+/, "") // Removes leading space
                  .replace(/\s{2,}/g, " ") // Replaces consecutive spaces with a single space
                  .replace(
                    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
                    "" // Removes all emojis
                  );

                setFieldTouched("address", true, true);
                handleChange("address")(trimmedValue);
              }}
              error={touched.address && errors.address ? errors.address : null}
            />

            <PrimaryInput
              label={"Pin Code"}
              star={true}
              placeholder={"enter your pin code"}
              keyboardType={"number-pad"}
              maxLength={6}
              value={values.pincode}
              onBlur={handleBlur("pincode")}
              onChangeText={(value) => {
                // Remove any non-numeric characters
                const sanitizedValue = value.replace(/[^0-9]/g, "");

                setFieldTouched("pincode", true, true);
                handleChange("pincode")(sanitizedValue);
              }}
              error={touched.pincode && errors.pincode ? errors.pincode : null}
            />

            <View className="">
              <PrimaryInput
                label={"Upliner ID"}
                star={true}
                placeholder={"Enter your Upliner ID"}
                keyboardType={"default"}
                maxLength={13}
                value={values.referal_code}
                onBlur={handleBlur("referal_code")}
                onChangeText={handleReferralCodeChange}
                onFocus={() => {
                  console.log("focused unique id");
                }}
                error={
                  touched.referal_code && errors.referal_code
                    ? errors.referal_code
                    : null
                }
              />
              
              {/* Show referral user name */}
              {values.referal_code && values.referal_code.length >= 6 && (
                <View className="mt-[-14px] mb-3">
                  {loadingReferral ? (
                    <Text className="font-montmedium text-[12px] text-smallText italic">
                      Checking...
                    </Text>
                  ) : referralUserName ? (
                    <View className="flex-row items-center">
                      <Text className="font-montmedium text-[12px] text-[#4CAF50]">
                        ✓ Upliner Name :{" "}
                      </Text>
                      <Text className="font-montmedium font-semibold text-[12px] text-[#4CAF50]">
                        {referralUserName}
                      </Text>
                    </View>
                  ) : (
                    <Text className="font-montmedium text-[12px] text-red-500">
                      Referral code not found
                    </Text>
                  )}
                </View>
              )}

              {ShowRefferal && (
                <Pressable
                  onPress={() => {
                    // setFieldValue("referal_code", "AAZ123456789");
                    // setShowRefferal(false);
                  }}
                >
                  <View className="flex flex-row items-center bg-[#24BAEC33] -mt-[10px] mb-[10px] py-[6px] px-[15px] rounded-full">
                    <View className="flex flex-row items-center flex-wrap w-[94%]">
                      <Text
                        className="font-montmedium font-semibold text-[12px
                    ] text-smallText mr-1"
                      >
                        No unique ID? No worries! Try this instead:
                      </Text>
                      <Text className="font-montmedium font-semibold text-[14px] text-black">
                        AAZ123456789{" "}
                      </Text>
                      {/* <Text className="font-montmedium font-semibold text-[12px] text-smallText">
                      and you're good to go!
                    </Text> */}
                    </View>
                    {/* <Pressable
                      onPress={() => {
                        // setFieldValue("referal_code", "AAZ123456789");
                        // setShowRefferal(false);
                      }}
                      className="p-2"
                    >
                      <MaterialIcons
                        name="content-copy"
                        size={18}
                        color="black"
                      />
                    </Pressable> */}
                  </View>
                </Pressable>
              )}
            </View>

            <View className="flex-row items-center mb-[12px]">
              <Checkbox
                // style={styles.checkbox}
                value={values.checkbox}
                onValueChange={(value) => {
                  // console.log("checkBox", value);
                  setFieldValue("checkbox", value);
                  // setChecked(!isChecked);
                }}
                color={
                  touched.checkbox && errors.checkbox
                    ? "#fc0303"
                    : values.checkbox
                    ? "#44689C"
                    : "#bfbfbf"
                }
                className="mr-2"
              />
              <Text
                className={`font-montmedium font-light text-[14px] leading-[18px] ${
                  touched.checkbox && errors.checkbox
                    ? "text-[#fc0303]"
                    : values.checkbox
                    ? "text-[#44689C]"
                    : "text-[#bfbfbf]"
                }`}
              >
                I agree to receive email updates from Allons-Z
              </Text>
            </View>

            <View className="mb-5">
              <PrimaryButton
                // direction={"AadharCard"}
                onPress={() => (loading ? "" : handleSubmit())}
              >
                Next
              </PrimaryButton>
            </View>
            <BackToLogin />
          </View>
        </ScrollView>
        {/* <View className="flex flex-row justify-center items-center w-[90%] mx-auto">
        <Pressable onPress={handleLogout}>
          <Text className="text-[#44689C] text-[12px] pb-[2px] font-montmedium">
            Ready to try again? Back to Login.
          </Text>
        </Pressable>
        <Pressable
          className="flex-row items-center"
          onPress={() => {
            dispatch(setKYCStatus("step-1:ProfileSetupDone"));
          }}
        >
          <Text className="text-[#44689C] text-[17px] pb-[1px] font-montmedium">
            skip
          </Text>
          <AntDesign name="doubleright" size={15} color="#44689C" />
        </Pressable> 
      </View> */}
      </SafeAreaView>
      {/* model */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => {
        //   setModalVisible(!modalVisible);
        // }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View className="flex-1 justify-center items-center bg-[#0000005e]">
            <View className="bg-white w-[80%] rounded p-2">
              <View className="flex flex-row justify-center items-center">
                <Text className="text-[#44689C] font-montmedium text-[18px] font-semibold">
                  Choose an Option
                </Text>
              </View>
              <View className="flex flex-row justify-evenly my-5">
                <Pressable
                  onPress={() => {
                    // console.log("clicked camera");
                    handleCamera();
                  }}
                >
                  <View className="bg-[#44699c] rounded items-center p-2">
                    <SimpleLineIcons name="camera" size={24} color="white" />
                    <Text className="text-white font-montmedium text-[14px] leading-[16px] mt-1">
                      CAMERA
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleGallery();
                    // console.log("clicked gallery");
                  }}
                >
                  <View className="bg-[#44699c] rounded items-center p-2">
                    <Ionicons name="images-outline" size={25} color="white" />
                    <Text className="text-white font-montmedium text-[14px] leading-[16px] mt-1">
                      GALLERY
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default SetupProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#7D848D",
    // fontFamily:
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
