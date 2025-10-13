import {
  View,
  Text,
  Alert,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Get_OthersCircles } from "../../Network/ApiCalling";
import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import NavReferral from "../custom_screens/NavReferral";
import CircleWithFourPieces from "./CircleWithFourPieces";
import NavBack from "../custom_screens/NavBack";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";

const OthersCircles = ({ route }) => {
  const { package_id, downline_id } = route.params;
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const [Circle, setCircles] = useState({});

  const [OtherData, setOtherData] = useState("");
  const [OpenData, setOpenData] = useState(false);

  const [permission, setPermission] = useState(true);

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    handleothercircle();
  }, []);

  // const circle_Length = Circle.members.length;

  // console.log("membersDetails......", Circle.members);
  // console.log("length length...>>", circle_Length);

  const [outerData, setOuterData] = useState([]);

  const [innerData, setInnerData] = useState([]);

  const [lastPosition, setLastPosition] = useState(null);
  const [lastPosColor, setLastPosColor] = useState(null);

  const [outterPices, setOutterPices] = useState(16);
  const [innerPices, setInnerPices] = useState(4);
  const [degree, setDegree] = useState(180);

  const setUp = (circle_Length, memberDetails) => {
    try {
      setLoading(true);

      if (circle_Length === 21) {
        setOutterPices(16);
        setInnerPices(4);
        setDegree(180);

        generateCircleData21(memberDetails);
      } else if (circle_Length === 13) {
        setOutterPices(9);
        setInnerPices(3);
        setDegree(212);

        generateCircleData13(memberDetails);
      } else if (circle_Length === 7) {
        setOutterPices(4);
        setInnerPices(2);
        setDegree(180);

        generateCircleData7(memberDetails);
      } else {
        outterPices = 16;
        innerPices = 4;
        degree = 180;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateCircleData21 = (data) => {
    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastColor = null;

    data.forEach((member) => {
      const position = parseInt(member.position);
      const colorCode = member.color;
      // const user = member.user?.username ? member.user.username : " ";
      const user = member.user?.username
        ? member?.user?.username.length > 5
          ? member?.user?.username.slice(0, 5).toLowerCase() + ".."
          : member?.user?.username.toLowerCase()
        : "";

      const userCode = member.user?.referal_code
        ? member.user.referal_code
        : " ";

      // console.log("member.user || {21}; ", position, user);

      if ([1, 2, 3, 4].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if ([6, 7, 8, 9].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if ([11, 12, 13, 14].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if ([16, 17, 18, 19].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if (position === 5) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 10) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 15) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 20) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 21) {
        newLastPosition = member.user;
        newLastColor = colorCode;
      }
    });

    // console.log("Outer Data21:", newOuterData);
    // console.log("Inner Data21:", newInnerData);
    // console.log("Last Position21:", newLastPosition);

    setOuterData(newOuterData);
    setInnerData(newInnerData);
    setLastPosition(newLastPosition);
    setLastPosColor(newLastColor);
  };

  const generateCircleData13 = (data) => {
    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastColor = null;

    // console.log("data in 13", data);
    data.forEach((member) => {
      const position = parseInt(member.position);
      const colorCode = member.color;
      // const user = member.user?.username ? member.user.username : " ";
      const user = member.user?.username
        ? member?.user?.username.length > 10
          ? member?.user?.username.slice(0, 10).toLowerCase() + ".."
          : member?.user?.username.toLowerCase()
        : "";

      const userCode = member.user?.referal_code
        ? member.user.referal_code
        : " ";

      // console.log("member.user || {}; ", user);

      if ([1, 2, 3].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if ([5, 6, 7].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if ([9, 10, 11].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if (position === 4) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 8) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 12) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 13) {
        newLastPosition = member.user;
        newLastColor = colorCode;
      }
    });
    // console.log("Outer Data:", newOuterData);
    // console.log("Inner Data:", newInnerData);
    // console.log("Last Position:", newLastPosition);

    setOuterData(newOuterData);
    setInnerData(newInnerData);
    setLastPosition(newLastPosition);
    setLastPosColor(newLastColor);
  };

  const generateCircleData7 = (data) => {
    // console.log("data in 7", data);

    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastColor = null;

    data.forEach((member) => {
      const position = parseInt(member.position);
      const colorCode = member.color;
      // const user = member.user?.username
      //   ? member.user.username.slice(0, 12) + "..."
      //   : " ";
      const user = member.user?.username
        ? member?.user?.username.length > 7
          ? member?.user?.username.slice(0, 7).toLowerCase() + ".."
          : member?.user?.username.toLowerCase()
        : "";

      const userCode = member.user?.referal_code
        ? member.user.referal_code
        : " ";

      // console.log("member.user || {}; ", user);

      if ([1, 2].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if ([4, 5].includes(position)) {
        newOuterData.push({ position, user, color: colorCode, member });
      } else if (position === 3) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 6) {
        newInnerData.push({ position, user, color: colorCode, member });
      } else if (position === 7) {
        newLastPosition = member.user;
      }
    });
    // console.log("Outer Data:", newOuterData);
    // console.log("Inner Data:", newInnerData);
    // console.log("Last Position:", newLastPosition);

    setOuterData(newOuterData);
    setInnerData(newInnerData);
    setLastPosition(newLastPosition);
    setLastPosColor(newLastColor);
  };

  const handleothercircle = async () => {
    try {
      setLoading(true);
      const res = await Get_OthersCircles(token, package_id, downline_id);
      if (res.status === 200) {
        // const result = res;
        console.log("result", res.data.circle);
        setCircles(res.data.circle);
        const circle_Length = res.data.circle.members.length;
        const memberDetails = res.data.circle.members;
        setUp(circle_Length, memberDetails);
      }
    } catch (err) {
      // console.log("error>>", err.response.status);
      if (err) {
        if (err.response) {
          if (err.response.status === 422) {
            // console.log("Error With 422.");
            toast.hideAll();
            toast.show("something went wrong or missing", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 301) {
            console.log("Error with 301", err.response.data.error);
            setPermission(false);
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

  const navigation = useNavigation();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!permission) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);

      const timer = setTimeout(() => {
        navigation.goBack(); // Redirects to the previous screen
        setPermission(!permission);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [permission]);

  if (!permission) {
    return (
      <>
        <CustomStatusBar
          barStyle="dark-content"
          backgroundColor="#f2f2f2"
          // translucent
        />
        <View className="flex flex-1 justify-center items-center">
          <Text className="font-montmedium text-base text-center">
            You do not have permission to access this page.
          </Text>
          <Text className="font-montmedium text-base text-center">
            Redirecting back in {countdown} seconds...
          </Text>
        </View>
      </>
    );
  }
  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      {/* <Text>OthersCircles</Text> */}
      {/* <NavReferral>other circles</NavReferral> */}
      <NavBack></NavBack>

      <View
        className="justify-center items-center w-[100%] mx-auto"
        style={{ flex: 0.9 }}
      >
        <Text className="font-montmedium font-semibold text-[16px] leading-[28px] w-[90%] mx-auto text-bigText text-center">
          {Circle?.package?.name}
        </Text>

        <CircleWithFourPieces
          InnerData={innerData}
          OuterData={outerData}
          outterPices={outterPices}
          innerPices={innerPices}
          degree={degree}
          centerLabel={lastPosition ? lastPosition.username : ""}
          setOtherData={setOtherData}
          setOpenData={setOpenData}
          lastPosColor={lastPosColor}
        />

        <Text className="font-montmedium font-semibold text-[14px] text-center leading-[28px] mb-5 text-smallText mt-1">
          circle code: {Circle?.name}
        </Text>
      </View>

      {/* {OpenData && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.09)",
            }}
            onPress={() => {
              setOpenData(false);
              setOtherData("");
            }}
          >
            <View
              style={{ backgroundColor: OtherData.color }}
              className="px-5 py-3 mb-4 border-[1px] border-white rounded w-[60%] flex flex-col justify-center"
            >
              <Text className="text-white font-bold font-montmedium text-[18px] mb-2 text-center underline">
                Account Details
              </Text>
              <View className="flex flex-row">
                <Text className="w-[48%] text-[15px] font-montmedium">
                  position
                </Text>
                <Text className="w-[52%] font-montmedium ">
                  : {OtherData.position}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="w-[48%] text-[15px] font-montmedium">
                  status
                </Text>
                <Text className="w-[52%] font-montmedium ">
                  : {OtherData.status}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="w-[48%] text-[15px] font-montmedium">
                  username
                </Text>
                <Text className="w-[52%] font-montmedium ">
                  : {OtherData?.user?.username || "Empty"}
                </Text>
              </View>
              <View className="flex flex-row">
                <Text className="w-[48%] text-[15px] font-montmedium">
                  referal_code
                </Text>
                <Text className="w-[52%] font-montmedium ">
                  : {OtherData?.user?.referal_code || "Empty"}
                </Text>
              </View>
              {/* <View className="flex flex-row justify-center items-center mt-3">
                      {OtherData.status && OtherData.user_id && (
                        <Pressable
                          onPress={() => {
                            if (OtherData.user?.username === userName) {
                              setOpenData(false);
                              setOtherData("");
                            } else {
                              setOpenData(false);
                              setOtherData("");
      
                              navigation.navigate("OthersCircles", {
                                package_id: packageId,
                                downline_id: OtherData.user_id,
                              });
                            }
                          }}
                        >
                          <Text className="bg-white rounded py-2 px-6">
                            view circle
                          </Text>
                        </Pressable>
                      )}
                    </View> 
            </View>
          </TouchableOpacity>
        </Modal>
      )} */}
    </>
  );
};

export default OthersCircles;
