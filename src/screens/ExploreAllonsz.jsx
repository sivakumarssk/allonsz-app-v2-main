import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";

import {
  Alert,
  Image,
  Modal,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setToken } from "./redux/action/loginAction";
import { setKYCStatus, setKYCVerified } from "./redux/action/KYCverify";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage_Calls from "../utils/AsyncStorage_Calls";
import { Get_userStatus } from "../Network/ApiCalling";

import WelcomeScreen from "./onboarding_screens/WelcomeScreen";
import AnimatedSplash from "./onboarding_screens/AnimatedSplash";

import Login from "./login-signup/Login";
import EmailRegister from "./login-signup/EmailRegister";
import EmailVerify from "./login-signup/EmailVerify";
import CreatePassword from "./login-signup/CreatePassword";
import ThankYouScreen from "./login-signup/ThankYouScreen";
import ChangePassword from "./login-signup/ChangePassword";
import MobilepwdVerify from "./login-signup/MobilepwdVerify";
import NewPassword from "./login-signup/NewPassword";

import SetupProfile from "./set_up/SetupProfile";
import AadharCard from "./set_up/AadharCard";
import AadharVerify from "./set_up/AadharVerify";
import PanCard from "./set_up/PanCard";
import BankDetails from "./set_up/BankDetails";
import SetUpSucces from "./set_up/SetUpSucces";
import ShareMail from "./set_up/ShareMail";

import HomeScreen from "./home_screens/HomeScreen";
import SelectedTour from "./home_screens/SelectedTour";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import HamburgerMenu from "./hamburger/HamburgerMenu";
import ProfileDetails from "./hamburger/ProfileDetails";
import UploadPhotos from "./hamburger/UploadPhotos";
import Support from "./hamburger/support/Support";
import RTCRefferealCode from "./hamburger/support/RTCRefferealCode";
import RTCSucces from "./hamburger/support/RTCSucces";
import Wallet from "./hamburger/wallet/Wallet";
import RechargeWallet from "./hamburger/wallet/RechargeWallet";
import PaymentDone from "./hamburger/wallet/PaymentDone";
import TripWallet from "./hamburger/wallet/TripWallet";
import RTTWalletMoney from "./hamburger/wallet/RTTWalletMoney";
import RTTSucces from "./hamburger/wallet/RTTSucces";
import PrivacyPolicy from "./hamburger/PrivacyPolicy";
import TermsAndConditions from "./hamburger/TermsAndConditions";
import DeleteAccountPolicy from "./hamburger/DeleteAccountPolicy";
import Packages from "./hamburger/packages/Packages";
import CreateRazorpay from "./hamburger/packages/CreateRazorpay";

import JoyPac from "./circles/JoyPac";

import CircleScreen from "./circles/CircleScreen";
import SelectedCircles from "./circles/SelectedCircles";
import { NetworkProvider } from "../utils/NetworkContext";
import CustomStatusBar from "./custom_screens/CustomStatusBar";
import OthersCircles from "./circles/OthersCircles";
import PastCircles from "./circles/PastCircles";
import MoneyTransactions from "./hamburger/MoneyTransactions";
import { useToast } from "react-native-toast-notifications";
import AboutApp from "./hamburger/support/AboutApp";
import CircleCountDown from "./circles/CircleCountDown";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const ExploreAllonsz = () => {
  // const navigation = useNavigation();
  const toast = useToast();

  const loginSelector = useSelector((state) => state.login.isLogin);

  let kycStatus = useSelector((state) => state.kyc.kycStatus);
  let kycVerified = useSelector((state) => state.kyc.kycVerified);

  // console.log(">>>>Allow", kycStatus);
  // console.log(">>>>Allow", kycVerified);

  // console.log(
  //   "kycStatus in redux: directly",
  //   kycStatus,
  //   "||| kycVerified",
  //   kycVerified
  // );

  const dispatch = useDispatch();

  // const [token, setToken] = useState(null);
  const [isAnimatedSplashVisible, setIsAnimatedSplashVisible] = useState(true);

  const [loginStatus, setLoginStatus] = useState(null);
  const [KYC_status, setKYC_status] = useState(null);
  const [KYC_verify, setKYC_verify] = useState(null);

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  const [loaded, error] = useFonts({
    "Montserrat-Medium": require("../../src/styles/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../../src/styles/fonts/Montserrat-Regular.ttf"),
    "Gill-sans-MT": require("../../src/styles/fonts/Gill-sans-MT.ttf"),
    "Poppins-Medium": require("../../src/styles/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../src/styles/fonts/Poppins-Regular.ttf"),
  });

  const getStatus = async (token) => {
    // console.log("TOKEN:::$$%%%>>", token);
    try {
      const res = await Get_userStatus(token);
      if (res.status === 200) {
        const result = res.data;
        console.log("in the profile status ::122success>>>##", result);
        if (result) {
          // if (result.document_status === "Verified") {
          //   dispatch(setKYCVerified(true));
          //   kycVerified === true;
          // }
          // if (result.profile_status === "Verified") {
          //   dispatch(setKYCStatus("step-4:BankVerificationDone"));
          //   // kycStatus === "step-4:BankVerificationDone";
          // }
          dispatch(setKYCVerified(true));
        }
      }
    } catch (err) {
      // console.log("error###%%%", err.response.data);
      if (err) {
        if (err.response) {
          if (err.response.status === 422) {
            console.log(
              "Error With 422.>> in status in kYC flow",
              err.response.data
            );
            dispatch(setKYCVerified(false));

            if (err.response.data.error === "profile is not set") {
              dispatch(setKYCStatus(null));
            } else if (err.response.data.error === "aadhar is not verified") {
              dispatch(setKYCStatus("step-1:ProfileSetupDone"));
            } else if (err.response.data.error === "pan is not verified") {
              dispatch(setKYCStatus("step-2:AadharVerificationDone"));
            } else if (err.response.data.error === "bank is not verified") {
              dispatch(setKYCStatus("step-3:PANVerificationDone"));
            } else if (err.response.data.error === "bank_is_not verified") {
              dispatch(setKYCVerified(false));
            }
          } else if (err.response.status === 500) {
            toast.hideAll();
            toast.show(
              "Unexpected issue! The server is temporarily unavailable",
              {
                type: "warning",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              }
            );
          } else {
            // console.log("An error occurred response.>>");
            toast.hideAll();
            toast.show("Session expired! Please log in again to continue.", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
              onClose: () => {
                console.log("colse");
              },
            });

            AsyncStorage_Calls.RemoveTokenJWT("Token", function (res, status) {
              if (status) {
                // console.log("Async storage lo set", status);
                dispatch(setToken(null));
                dispatch(setKYCStatus(null));
                dispatch(setKYCVerified(false));
              } else {
                console.log("else", res);
              }
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
          toast.show("Oops Something went wrong — please try again", {
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

  useEffect(() => {
    AsyncStorage_Calls.getTokenJWT("Token", function (res, status) {
      if (status) {
        // console.log("Async storage lo set###", status);
        getStatus(status); //only this we can write login hit
        setLoginStatus(true);
        dispatch(setToken(status));
      } else {
        setLoginStatus(false);
      }
    });
  }, [loginSelector]);

  useEffect(() => {
    AsyncStorage_Calls.getTokenJWT("userKYC", function (res, status) {
      if (status) {
        // console.log("For Verification KYC in Async1>>>>>", status);
        // setKYC_status(status);
        dispatch(setKYCStatus(status));
      } else {
        // console.log("No KYC Verification Found in Async >>>", status);
        // setKYC_status(null);
        dispatch(setKYCStatus(null));
      }
    });

    AsyncStorage_Calls.getTokenJWT("KYCVerification", function (res, status) {
      if (status) {
        // console.log("KYC verification completed", status);
        // setKYC_verify(true);
        dispatch(setKYCVerified(true));
      } else {
        // console.log("KYC verification not completed", status);
        // setKYC_verify(false);
        dispatch(setKYCVerified(false));
      }
    });
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // If no flag is found, set the onboarding screen to show and store the flag
          await AsyncStorage.setItem("hasLaunched", "true");
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking first launch: ", error);
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatedSplashVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  if (isFirstLaunch === null) {
    return null; // Optionally, show a loading screen or return null until AsyncStorage is checked
  }

  return (
    <>
      <NetworkProvider>
        <NavigationContainer>
          {isAnimatedSplashVisible && <AnimatedSplash />}

          {!isAnimatedSplashVisible && (
            <Stack.Navigator>
              {loginStatus ? (
                <>
                  <Stack.Group
                    screenOptions={{
                      // gestureEnabled: true,
                      // gestureDirection: "horizontal",
                      headerStyle: { backgroundColor: "#44689C" },
                      headerTintColor: "#fff",
                      headerTitleStyle: { fontSize: 22 },
                      headerTitleAlign: "center",
                    }}
                  >
                    {!kycVerified ? (
                      <>
                        {kycStatus === null && (
                          <Stack.Screen
                            name="SetupProfile"
                            component={SetupProfile}
                            options={{
                              headerShown: false,
                            }}
                          />
                        )}

                        {kycStatus === "step-1:ProfileSetupDone" && (
                          <>
                            <Stack.Screen
                              name="AadharCard"
                              component={AadharCard}
                              options={{
                                headerShown: false,
                              }}
                            />

                            {/* <Stack.Screen
                              name="AadharVerify"
                              component={AadharVerify}
                              options={{
                                headerShown: false,
                              }}
                            /> */}
                          </>
                        )}

                        {kycStatus === "step-2:AadharVerificationDone" && (
                          <Stack.Screen
                            name="PanCard"
                            component={PanCard}
                            options={{
                              headerShown: false,
                            }}
                          />
                        )}

                        {kycStatus === "step-3:PANVerificationDone" && (
                          <>
                            <Stack.Screen
                              name="BankDetails"
                              component={BankDetails}
                              options={{
                                headerShown: false,
                              }}
                            />
                            <Stack.Screen
                              name="SetUpSucces"
                              component={SetUpSucces}
                              options={{
                                headerShown: false,
                              }}
                            />
                          </>
                        )}

                        {kycStatus === "step-4:BankVerificationDone" && (
                          <>
                            <Stack.Screen
                              name="ShareMail"
                              component={ShareMail}
                              options={{
                                headerShown: false,
                              }}
                            />
                            <Stack.Screen
                              name="SetUpSucces"
                              component={SetUpSucces}
                              options={{
                                headerShown: false,
                              }}
                            />
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <Stack.Screen
                          name="Home"
                          component={HomeScreen}
                          options={{
                            animation: "slide_from_left",
                            animationDuration: 1000,
                            headerTitle: "",
                            headerLeft: () => {
                              const navigation = useNavigation();
                              return (
                                <View className="mt-4 mb-2 flex flex-row items-center">
                                  <TouchableOpacity
                                    className="flex flex-row items-center"
                                    onPress={() => {
                                      navigation.navigate("HamburgerMenu");
                                    }}
                                  >
                                    {/* <Ionicons name="menu" size={24} color="#fff" /> */}
                                    <Image
                                      source={require("../styles/images/home/Menu.png")}
                                      className="w-[21px] h-[16px] mr-[5px]"
                                    />
                                    <View className="flex flex-row items-center">
                                      <Text className="font-montmedium text-[22px] font-medium leading-[22px] mt-[5px] text-white mr-[3px] tracking-widest">
                                        Home
                                      </Text>
                                      <Image
                                        source={require("../styles/images/home/allonsz-logo.png")}
                                        className="w-[19px] h-[22px]"
                                      />
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              );
                            },
                            headerRight: () => {
                              const navigation = useNavigation();

                              const [dropdownVisible, setDropdownVisible] =
                                useState(false);
                              const [showoption, setShowOption] =
                                useState("Domestic");

                              const toggleDropdown = () => {
                                setDropdownVisible(!dropdownVisible);
                              };

                              const handleOptionSelect = (option) => {
                                navigation.setParams({ domesticTrip: option });
                                setDropdownVisible(false);
                              };

                              return (
                                <>
                                  <TouchableOpacity
                                    onPress={() => toggleDropdown()}
                                  >
                                    <View className="mt-[19px] mb-1 flex flex-row items-center">
                                      <Text className="font-montmedium text-[16px] font-medium leading-[27px] text-white -mr-[4px] tracking-wide">
                                        {/* <Image
                                        source={require("../styles/images/home/world.png")}
                                        className="w-[25px] h-[25px] mr-1"
                                      /> */}
                                        {showoption} Trip
                                      </Text>
                                      <MaterialIcons
                                        name={
                                          dropdownVisible
                                            ? "keyboard-arrow-up"
                                            : "keyboard-arrow-down"
                                        }
                                        size={27}
                                        color="white"
                                      />
                                    </View>
                                  </TouchableOpacity>
                                  {dropdownVisible && (
                                    <Modal
                                      transparent={true}
                                      animationType="fade"
                                    >
                                      <TouchableOpacity
                                        style={{
                                          flex: 1,
                                          backgroundColor:
                                            "rgba(0, 0, 0, 0.09)",
                                        }}
                                        onPress={() =>
                                          setDropdownVisible(false)
                                        }
                                      >
                                        <View className="bg-white p-2 rounded absolute top-[55px] right-[25px] w-[140px]">
                                          {/* <TouchableOpacity
                                          className="border-b-[0.19px] py-1 mb-1"
                                          onPress={() =>
                                            handleOptionSelect("all")
                                          }
                                        >
                                          <Text>All</Text>
                                        </TouchableOpacity> */}
                                          <TouchableOpacity
                                            className="border-b-[0.19px] py-1 mb-1"
                                            onPress={() => {
                                              setShowOption("International");
                                              handleOptionSelect(
                                                "international"
                                              );
                                            }}
                                          >
                                            <View className="flex-row items-center">
                                              <Image
                                                source={require("../styles/images/home/worldwide.png")}
                                                className="w-[25px] h-[25px] mr-1"
                                              />
                                              <Text className="text-[14px]">
                                                International
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            className="py-1"
                                            onPress={() => {
                                              setShowOption("Domestic");
                                              handleOptionSelect("domestic");
                                            }}
                                          >
                                            <View className="flex-row items-center">
                                              <Image
                                                source={require("../styles/images/home/world.png")}
                                                className="w-[25px] h-[25px] mr-1"
                                              />
                                              <Text className="text-[14px]">
                                                Domestic
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      </TouchableOpacity>
                                    </Modal>
                                  )}
                                </>
                              );
                            },
                          }}
                        />
                        <Stack.Screen
                          name="SelectedTour"
                          component={SelectedTour}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="HamburgerMenu"
                          component={HamburgerMenu}
                          options={{
                            headerShown: false,
                            animation: "slide_from_left",
                          }}
                        />
                        <Stack.Screen
                          name="ProfileDetails"
                          component={ProfileDetails}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="UploadPhotos"
                          component={UploadPhotos}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="Packages"
                          component={Packages}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="CreateRazorpay"
                          component={CreateRazorpay}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="JoyPac"
                          component={JoyPac}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="CircleScreen"
                          component={CircleScreen}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="CircleCountDown"
                          component={CircleCountDown}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="PastCircle"
                          component={PastCircles}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="SelectedCircles"
                          component={SelectedCircles}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="OthersCircles"
                          component={OthersCircles}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="Wallet"
                          component={Wallet}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="RechareWallet"
                          component={RechargeWallet}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="PaymentDone"
                          component={PaymentDone}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="TripWallet"
                          component={TripWallet}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="RTTWalletMoney"
                          component={RTTWalletMoney}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="MoneyTransactions"
                          component={MoneyTransactions}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="RTTSucces"
                          component={RTTSucces}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="Support"
                          component={Support}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="PrivacyPolicy"
                          component={PrivacyPolicy}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="TermsAndConditions"
                          component={TermsAndConditions}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="DeleteAccountPolicy"
                          component={DeleteAccountPolicy}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="RTCRefferealCode"
                          component={RTCRefferealCode}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="RTCSucces"
                          component={RTCSucces}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                        <Stack.Screen
                          name="AboutApp"
                          component={AboutApp}
                          options={{
                            headerShown: false,
                            animation: "slide_from_right",
                          }}
                        />
                      </>
                    )}
                  </Stack.Group>
                </>
              ) : (
                <>
                  <Stack.Group>
                    {isFirstLaunch && (
                      <Stack.Screen
                        name="WelcomeScreen"
                        component={WelcomeScreen}
                        options={{
                          headerShown: false,
                        }}
                      />
                    )}
                    <Stack.Screen
                      name="Login"
                      component={Login}
                      options={{
                        headerShown: false,
                      }}
                    />
                    {/* create account */}
                    <Stack.Screen
                      name="EmailRegister"
                      component={EmailRegister}
                      options={{
                        headerShown: false,
                      }}
                    />
                    {/* forgot password */}
                    <Stack.Screen
                      name="ChangePassword"
                      component={ChangePassword}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name="VerifyCode"
                      component={EmailVerify}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name="CreatePassword"
                      component={CreatePassword}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name="ThankYouScreen"
                      component={ThankYouScreen}
                      options={{
                        headerShown: false,
                      }}
                    />

                    <Stack.Screen
                      name="MobilepwdVerify"
                      component={MobilepwdVerify}
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name="NewPassword"
                      component={NewPassword}
                      options={{
                        headerShown: false,
                      }}
                    />
                  </Stack.Group>
                </>
              )}
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </NetworkProvider>
    </>
  );
};

export default ExploreAllonsz;

const styles = StyleSheet.create({});
