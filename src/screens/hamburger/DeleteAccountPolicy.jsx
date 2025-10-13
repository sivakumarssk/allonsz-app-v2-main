import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  View,
  Linking,
  Pressable,
  Alert,
} from "react-native";
import WebView from "react-native-webview";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import Entypo from "@expo/vector-icons/Entypo";
import { useToast } from "react-native-toast-notifications";
import Loader from "../custom_screens/Loader";
import { useDispatch, useSelector } from "react-redux";
import { Delete_Account } from "../../Network/ApiCalling";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setToken } from "../redux/action/loginAction";
import { setKYCStatus, setKYCVerified } from "../redux/action/KYCverify";

const SubListItem = ({ title, description }) => {
  return (
    <View style={{ paddingTop: 1, paddingLeft: 6, width: "99%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 5,
          flexWrap: "wrap",
        }}
      >
        <MaterialIcons
          name="arrow-right"
          size={18}
          color="black"
          style={{ marginTop: 5 }}
        />

        <Text
          style={{
            textAlign: "justify",
            lineHeight: 23,
            letterSpacing: 1,
            fontSize: 13,
            flexShrink: 1, // Ensures it doesn't exceed the screen
            flex: 1, // Takes available space
          }}
        >
          {title && <Text style={{ fontWeight: "bold" }}>{title}:</Text>}{" "}
          {description}
        </Text>
      </View>
    </View>
  );
};
const DeleteAccountPolicy = () => {
  const navigation = useNavigation();
  const refRBSheet = useRef();

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.login.token);
  const { email_number } = useSelector((state) => state.settingData);

  const emailSupport = email_number || "info@allons-z.com";

  const dispatch = useDispatch();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const res = await Delete_Account(token);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("token", res.data.token);
        refRBSheet.current.close();

        toast.hideAll();
        toast.show("Your Account Has Been Successfully Deleted", {
          type: "success",
          placement: "top",
          duration: 3000,
          offset: 30,
          animationType: "slide-in",
        });

        setTimeout(() => {
          toast.hideAll();
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
        }, 600);
      }
    } catch (err) {
      // console.log("error this", err.response.data);
      // if (err) {
      if (err.response) {
        if (err.response.status === 422) {
          toast.hideAll();
          toast.show("Authentication failed! please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (err.response.status === 404) {
          // console.log("Error 404", err.response);
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (err.response.status === 500) {
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
      // }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#44689C"
        // translucent
      />

      <View className="bg-[#44689C]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            className={`flex flex-row items-center w-[93%] mx-auto pb-2 ${
              Platform.OS === "android" ? "mt-[15px]" : "mt-[65px]"
            }`}
          >
            <View className="bg-[#24BAEC45] rounded-full">
              <MaterialIcons
                name="keyboard-arrow-left"
                size={28}
                color="white"
              />
            </View>
            <View className="ml-[10px]">
              <Text className="font-montmedium font-medium text-white text-[16px] leading-[22px] tracking-widest">
                Allons-Z
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* <WebView
        style={styles.container}
        source={{ uri: "https://allons-z.com/deleteaccountpolicy" }}
        injectedJavaScript={`
            document.body.style.fontSize = '16px';
            document.body.style.padding = '0px';
            document.body.style.marginBottom = '20px';
            document.body.style.lineHeight = '1.6';
            true; // Note: This is required for the injected JS to execute properly
        `}
      /> */}

      <View className="w-[96%] mx-auto">
        <Text className="text-[15px] uppercase mb-2 mt-6 font-montmedium text-center tracking-wider underline">
          Account Deletion Request
        </Text>

        <Text className="text-center leading-[23px] tracking-wider text-[13px]">
          By submitting a request to delete your account, you acknowledge that
          all data associated with your account will be permanently removed from
          our system. This action is irreversible, and we cannot recover any
          information after deletion.
        </Text>

        <Text className="text-[15px] font-semibold py-1 mt-3 tracking-wider text-center">
          Important Information:
        </Text>

        <SubListItem
          description={
            "All profile information, settings, and associated records will be permanently deleted."
          }
        />
        <SubListItem
          description={
            "You will lose access to any services, subscriptions, or benefits associated with your account."
          }
        />
        <SubListItem
          description={
            "To use our services in the future, a new account must be created."
          }
        />

        <View className="flex justify-center items-center mt-4">
          <Text className="text-center leading-[23px] tracking-wider text-[13px]">
            If you have any questions, please contact support at
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`mailto:${emailSupport}`);
            }}
          >
            <Text className="text-center text-blue-600 underline leading-[23px] tracking-wider text-[13px]">
              {emailSupport}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex justify-center items-center my-7">
          <TouchableOpacity
            className="bg-[#ff5c33] px-[45px] py-2 rounded-md"
            onPress={() => {
              refRBSheet.current.open();
            }}
          >
            <Text className="text-white leading-[23px] tracking-widest text-[14px]">
              Delete My Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <RBSheet
        ref={refRBSheet}
        useNativeDriver={true} // Disable native driver
        // onClose={handleDragBack} //trigrred when the bottomsheet has closed
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          draggableIcon: {
            backgroundColor: "#ffffff", // Lime green
          },
          container: {
            backgroundColor: "#ffffff",
            // borderRadius: 25,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            height: 270,
          },
        }}
        customModalProps={{
          animationType: "fade",
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}
      >
        <View className="relative border-b-[0.5px] border-black w-[95%] py-2 mx-auto">
          <Text className="font-montmedium font-semibold text-[16px] text-bigText text-center mt-3 mb-2">
            Confirm Account Deletion
          </Text>
          <TouchableOpacity
            className="absolute top-[20px] right-[4px]"
            onPress={() => {
              refRBSheet.current.close();
            }}
          >
            <Entypo
              name="cross"
              size={24}
              color="black"
              style={{ padding: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View className="my-2 w-[97%] mx-auto">
          <Text className="text-center leading-[23px] tracking-wider text-[13px] mb-3">
            All your data and settings will be permanently deleted, losing
            access to services, subscriptions, and benefits, and a new account
            will be required for future use.
          </Text>
          <Text className="font-montmedium font-semibold text-[14px] text-bigText text-center mb-2">
            Are you sure you want to proceed?
          </Text>

          <View className="flex flex-row justify-evenly items-center my-5 w-full">
            <TouchableOpacity className="bg-[#828997] rounded w-[40%] py-2 ">
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#df3a3a] rounded w-[40%] py-2 "
              onPress={() => {
                handleDeleteAccount();
              }}
            >
              <Text className="text-white text-center">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  );
};

export default DeleteAccountPolicy;

const styles = StyleSheet.create({});
