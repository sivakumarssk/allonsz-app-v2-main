import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserName } from "../redux/action/loginAction";
import {
  get_ProfileDetails,
  Get_Setting,
  UPDATE_profilePic,
} from "../../Network/ApiCalling";
import { setKYCStatus, setKYCVerified } from "../redux/action/KYCverify";
import { useToast } from "react-native-toast-notifications";

import CustomStatusBar from "../custom_screens/CustomStatusBar";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Loader from "../custom_screens/Loader";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {
  pickImage,
  takePhoto,
} from "../../utils/DeviceHelpers/DeveiceHelperImage";

const HamburgerMenu = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.login.token);

  const [ApiData, setApiData] = useState({
    photo: "",
    referal_code: "",
    first_name: "",
    last_name: "",
    walletAmount: "",
  });

  const [setting, SetSetting] = useState({});

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        const res = await get_ProfileDetails(token);
        // console.log(">>>>", res);
        if (res.status === 200) {
          const result = res.data.user;
          // console.log("result", result);
          // console.log("result.username", result.username);
          dispatch(setUserName(result.username));

          setApiData((prev) => ({
            ...prev,
            photo: result.photo,
            first_name: result.first_name,
            last_name: result.last_name,
            referal_code: result.referal_code,
            walletAmount: result.wallet,
          }));
        }
      } catch (err) {
        // console.log("error in Hamburger >>>>>>> ", err);
        if (err) {
          if (err.response) {
            if (err.response.status === 400) {
              console.log("Error With 400.");
            } else if (err.response.status === 422) {
              // console.log("Error With 422.");
              toast.hideAll();
              toast.show("Oops! Something missing", {
                type: "warning",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            } else if (err.response.status === 301) {
              console.log("Error with 301");
            } else if (err.response.status === 401) {
              console.log("Error with 401");
            } else if (err.response.status === 404) {
              console.log("Error with 404");
            } else if (err.response.status === 500) {
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
              // console.log("error in request ",error.request.status)
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

    const getSetting = async () => {
      try {
        setLoading(true);
        const res = await Get_Setting(token);
        if (res.status === 200) {
          const result = res.data.setting;
          SetSetting(result);
        }
      } catch (err) {
        // console.log("error", err.response.data);
        if (err) {
          if (err.response) {
            if (err.response.status === 400) {
              console.log("Error With 400.");
            } else if (err.response.status === 422) {
              // console.log("Error With 422.");
              toast.hideAll();
              toast.show("Oops! Something missing - Please try again", {
                type: "warning",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            } else if (err.response.status === 301) {
              console.log("Error with 301");
            } else if (err.response.status === 401) {
              console.log("Error with 401");
            } else if (err.response.status === 404) {
              console.log("Error with 404");
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
              // console.log("error in request ",error.request.status)
              Alert.alert(
                "No Network Found",
                "Please Check your Internet Connection"
              );
            }
          } else {
            // console.log("Error in Setting up the Request.");
            toast.hideAll();
            toast.show(
              "Oops! Something went wrong at server side—please try again",
              {
                type: "warning",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              }
            );
          }
        }
      } finally {
        setLoading(false);
      }
    };

    getDetails();
    // getSetting();
  }, []);

  const listItems = [
    {
      componentIcon: <AntDesign name="user" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/Icon.png"),
      iconTitle: "Profile Details",
      direction: "ProfileDetails",
      rightIcon: true,
    },
    {
      componentIcon: (
        <MaterialCommunityIcons
          name="camera-plus-outline"
          size={24}
          color="black"
        />
      ),
      // icons: require("../../styles/images/hamburgerMenu/CameraPlus.png"),
      iconTitle: "Upload Photos",
      direction: "UploadPhotos",
      rightIcon: true,
    },
    {
      componentIcon: (
        <MaterialIcons name="mode-of-travel" size={24} color="black" />
      ),
      // icons: require("../../styles/images/hamburgerMenu/bookmark.png"),
      iconTitle: "Packages",
      direction: "Packages",
      rightIcon: true,
    },
    {
      componentIcon: <Feather name="bookmark" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/bookmark.png"),
      iconTitle: "My Circle",
      // direction: "JoyPac",
      function: () => handleCircle(),
      rightIcon: true,
    },
    {
      componentIcon: <Ionicons name="timer-outline" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/bookmark.png"),
      iconTitle: "My Circle Timers",
      // direction: "JoyPac",
      function: () => handleCircleTimers(),
      rightIcon: true,
    },
    {
      componentIcon: <MaterialIcons name="history" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/bookmark.png"),
      iconTitle: "Circles history",
      // direction: "JoyPac",
      function: () => handlePastCircle(),
      rightIcon: true,
    },
    {
      componentIcon: <Ionicons name="wallet-outline" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/wallet.png"),
      iconTitle: "Wallet",
      // direction: "Wallet",
      function: () => handleWallet(),
      rightIcon: true,
    },
    {
      componentIcon: (
        <FontAwesome6 name="money-bill-transfer" size={22} color="black" />
      ),
      // icons: require("../../styles/images/hamburgerMenu/wallet.png"),
      iconTitle: "Transactions",
      // direction: "Wallet",
      function: () => handleTransaction(),
      rightIcon: true,
    },
    {
      componentIcon: (
        <AntDesign name="questioncircle" size={24} color="black" />
      ),
      // icons: require("../../styles/images/hamburgerMenu/support.png"),
      iconTitle: "Support",
      direction: "Support",
      rightIcon: true,
    },
    {
      componentIcon: <MaterialIcons name="security" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/support.png"),
      iconTitle: "Privacy policy",
      direction: "PrivacyPolicy",
      rightIcon: true,
    },
    {
      componentIcon: <AntDesign name="copy" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/support.png"),
      iconTitle: "Terms and Conditions",
      direction: "TermsAndConditions",
      rightIcon: true,
    },
    {
      componentIcon: (
        <MaterialCommunityIcons
          name="delete-clock-outline"
          size={24}
          color="black"
        />
      ),
      // icons: require("../../styles/images/hamburgerMenu/support.png"),
      iconTitle: "Delete My Account",
      direction: "DeleteAccountPolicy",
      rightIcon: true,
    },
    {
      componentIcon: <MaterialIcons name="share" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/Share.png"),
      iconTitle: "Share Referral Code",
      rightIcon: false,
      function: () => hanldeRCShare(),
    },
    {
      componentIcon: <AntDesign name="logout" size={24} color="black" />,
      // icons: require("../../styles/images/hamburgerMenu/logout.png"),
      iconTitle: "Logout",
      rightIcon: false,
      function: () => handleLogout(),
    },
  ];

  const handleCircle = async () => {
    // navigation.navigate("JoyPac", { reffereal_code: ApiData.referal_code });
    navigation.navigate("CircleScreen");
  };
  const handleCircleTimers = async () => {
    // navigation.navigate("JoyPac", { reffereal_code: ApiData.referal_code });
    navigation.navigate("CircleCountDown");
  };
  const handlePastCircle = async () => {
    // navigation.navigate("JoyPac", { reffereal_code: ApiData.referal_code });
    navigation.navigate("PastCircle");
  };

  const handleTransaction = async () => {
    // console.log("clicked ");
    navigation.navigate("MoneyTransactions");
  };

  const handleWallet = async () => {
    navigation.navigate("TripWallet", { Amount: ApiData.walletAmount });
  };

  const handleLogout = async () => {
    // console.log("clicked logout functionc");
    Alert.alert("Logout", "Are you sure you want to Logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel pressed"),
      },
      {
        text: "Logout",
        onPress: () => {
          AsyncStorage_Calls.RemoveTokenJWT("Token", function (res, status) {
            if (status) {
              // console.log("Async storage lo set", status);
              dispatch(setToken(null));
              dispatch(setKYCVerified(false));
              dispatch(setKYCStatus(null));
            } else {
              console.log("else", res);
            }
          });
        },
      },
    ]);
  };

  const referralCode = ApiData.referal_code; // Example referral code

  const message = `
🚀 Start your journey with us and unlock exclusive rewards! 
Use my referral code: *${referralCode}* 
Sign up here: https://play.google.com/store/apps/details?id=com.aits.allonsz 🌟

(Click to visit or copy the referral code and link)
`;

  const hanldeRCShare = async () => {
    // console.log("share refferal code xxxx xxxx xxxx");
    try {
      const result = await Share.share({
        message: message,
        title: "Referral Code", // iOS only
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Share successful!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed.");
      }
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  const handleGallery = async () => {
    try {
      setModalVisible(false);
      const result = await pickImage();
      // console.log("edhi ra image,:::", result);
      // setImage(result);
      if (result) {
        const selectedImage = result;
        // console.log("selectedImage", selectedImage);
        setImage(selectedImage); // Set the image preview (if needed)
        handlePhotoPic(selectedImage);
      }
    } catch (error) {
      console.log("Access Permission in comp", error);
    }
  };

  const handleCamera = async () => {
    try {
      const result = await takePhoto();
      // console.log("edhi ra acces photo,:::", result);
      // setImage(result);
      // setFieldValue("photo", result);
      if (result) {
        const selectedImage = result;
        setImage(selectedImage); // Set the image preview (if needed)
        handlePhotoPic(selectedImage);
      }
    } catch (error) {
      console.log("Access Permission", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handlePhotoPic = async (image) => {
    try {
      const res = await UPDATE_profilePic(image, token);

      if (res.status === 200) {
        toast.hideAll();
        toast.show("Your new profile picture looks great! 🎉", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
    } catch (err) {
      // console.log("Error all API SUBMIT ERROR", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;

          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            // console.log("422 error>>", err.response.error);
            toast.hideAll();
            toast.show(err.response.error, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (status === 301) {
            console.log("301 error", err.response.error);
          } else if (status === 401) {
            console.log("401 error", err.response.error);
          } else if (status === 404) {
            console.log("404 error", err.response.error);
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

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <TouchableOpacity
        className={`w-[93%] mx-auto ${
          Platform.OS === "android" ? "mt-5" : "mt-[45px]"
        }`}
        onPress={() => {
          navigation.goBack();
          // console.log("clicked");
        }}
      >
        <Entypo name="cross" size={36} color="black" />
      </TouchableOpacity>
      <View className="flex flex-col justify-center items-center">
        <View className="relative">
          <Image
            source={
              ApiData.photo
                ? { uri: image ? image.uri : ApiData.photo }
                : require("../../styles/images/hamburgerMenu/profilePic.png")
            }
            resizeMode="cover"
            className="w-[150px] h-[150px] rounded-full"
            style={{
              borderWidth: 9,
              borderColor: "#f2f2f2",
              elevation: 10,
            }}
            defaultSource={require("../../styles/images/hamburgerMenu/profilePic.png")}
          />
          <Pressable
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <AntDesign
              name="edit"
              size={20}
              color="black"
              style={{
                position: "absolute",
                bottom: 4,
                right: 13,
                backgroundColor: "#f2f2f2",
                borderRadius: 10,
                padding: 4,
                elevation: 5, // For shadow on Android
              }}
            />
          </Pressable>
        </View>
        <Text className="font-montmedium font-semibold leading-[34px] text-[24px] text-bigText mt-3">
          {ApiData.first_name} {ApiData.last_name}
        </Text>
        <Text className="font-montmedium font-normal text-[14px] leading-[16px] text-bigText mt-3 tracking-widest">
          unique ID : {ApiData.referal_code}
        </Text>
      </View>
      <View className="mt-[50px]" style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.95,
            borderRadius: 8,
            backgroundColor: "white",
            width: "90%",
            marginHorizontal: "auto",
            padding: 8,
          }}
        >
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={listItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-between items-center my-[14px] w-full"
                onPress={() => {
                  if (item.direction) {
                    navigation.navigate(item.direction);
                  }
                  if (item.function) {
                    item.function();
                  }
                }}
              >
                <View className="flex flex-row items-center">
                  {/* <Image source={item.icons} className="mx-2" /> */}
                  <View className="mx-2">{item.componentIcon}</View>
                  <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
                    {item.iconTitle}
                  </Text>
                </View>
                <View className="mr-1">
                  {item.rightIcon && (
                    <MaterialIcons
                      name="keyboard-arrow-right"
                      size={24}
                      color="black"
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{}}
          />
        </View>
      </View>

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

export default HamburgerMenu;

const styles = StyleSheet.create({});
