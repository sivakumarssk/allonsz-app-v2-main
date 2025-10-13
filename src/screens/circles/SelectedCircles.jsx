import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import NavReferral from "../custom_screens/NavReferral";

import CircleWithFourPieces from "./CircleWithFourPieces";
import { useSelector } from "react-redux";
import { Get_OthersCircles } from "../../Network/ApiCalling";
import { useNavigation } from "@react-navigation/native";

const SelectedCircles = ({ route }) => {
  const { memberDetails, circlesName, circleCode, packageId } = route.params;
  // console.log("memberDetails>>>", memberDetails);

  const navigation = useNavigation();

  const userName = useSelector((state) => state.login.userName);

  // console.log("in redux: userName", userName);

  const [loading, setLoading] = useState(false);

  const [OtherData, setOtherData] = useState("");
  const [OpenData, setOpenData] = useState(false);

  // console.log("setOtherData1", OtherData);

  // console.log()

  const circle_Length = memberDetails.length;

  // console.log("membersDetails......", memberDetails);
  // console.log("length length...>>", circle_Length);

  const [outerData, setOuterData] = useState([]);
  // let outerData = [];
  const [innerData, setInnerData] = useState([]);
  // let innerData = [];
  const [lastPosition, setLastPosition] = useState(null);
  const [lastPosColor, setLastPosColor] = useState(null);
  // let lastPosition = null;

  // let outterPices, innerPices, degree;
  const [outterPices, setOutterPices] = useState(16);
  const [innerPices, setInnerPices] = useState(4);
  const [degree, setDegree] = useState(180);

  const Q1_colorcode = "#FBD03F";
  const Q2_colorcode = "#E12929";
  const Q3_colorcode = "#0FBF00";
  const Q4_colorcode = "#0994CF";

  useEffect(() => {
    try {
      setLoading(true);

      if (circle_Length === 21) {
        // outterPices = 16;
        // innerPices = 4;
        // degree = 90;

        setOutterPices(16);
        setInnerPices(4);
        setDegree(180);

        generateCircleData21(memberDetails);
      } else if (circle_Length === 13) {
        // outterPices = 9;
        // innerPices = 3;
        // degree = 90;

        setOutterPices(9);
        setInnerPices(3);
        setDegree(212);

        generateCircleData13(memberDetails);
      } else if (circle_Length === 7) {
        // outterPices = 4;
        // innerPices = 2;
        // degree = 180;

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
  }, []);

  const generateCircleData21 = (data) => {
    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastcolor = null;

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
        newLastcolor = colorCode;
      }
    });

    // console.log("Outer Data21:", newOuterData);
    // console.log("Inner Data21:", newInnerData);
    // console.log("Last Position21:", newLastPosition);

    setOuterData(newOuterData);
    setInnerData(newInnerData);
    setLastPosition(newLastPosition);
    setLastPosColor(newLastcolor);
  };

  const generateCircleData13 = (data) => {
    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastcolor = null;

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

      console.log("member.user || {13}; ", colorCode);

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
        newLastcolor = colorCode;
      }
    });
    // console.log("Outer Data:", newOuterData);
    // console.log("Inner Data:", newInnerData);
    // console.log("Last Position:", newLastPosition);

    setOuterData(newOuterData);
    setInnerData(newInnerData);
    setLastPosition(newLastPosition);
    setLastPosColor(newLastcolor);
  };

  const generateCircleData7 = (data) => {
    // console.log("data in 7", data);

    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastcolor = null;

    data.forEach((member) => {
      const position = parseInt(member.position);
      const colorCode = member.color;
      // const user = member.user?.username
      //   ? member.user.username.slice(0, 12) + "..."
      //   : " ";
      const user = member?.user?.username
        ? member?.user?.username.length > 7
          ? member?.user?.username.slice(0, 7).toLowerCase() + ".."
          : member?.user?.username.toLowerCase()
        : "";

      const userCode = member.user?.referal_code
        ? member.user.referal_code
        : " ";

      console.log("member.user || {7}; ", member.color);

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
        newLastcolor = colorCode;
      }
    });
    // console.log("Outer Data7:", newOuterData);
    // console.log("Inner Data7:", newInnerData);
    // console.log("Last Position7:", newLastPosition);

    setOuterData(newOuterData);
    setInnerData(newInnerData);
    setLastPosition(newLastPosition);
    setLastPosColor(newLastcolor);
  };

  // const OuterData21 = [
  //   { color: "#FBD03F", position: 1, user: "krg1" },
  //   { color: "#FBD03F", position: 2, user: " " },
  //   { color: "#FBD03F", position: 3, user: " " },
  //   { color: "#FBD03F", position: 4, user: " " },
  //   { color: "#E12929", position: 6, user: " " },
  //   { color: "#E12929", position: 7, user: " " },
  //   { color: "#E12929", position: 8, user: " " },
  //   { color: "#E12929", position: 9, user: " " },
  //   { color: "#0FBF00", position: 11, user: " " },
  //   { color: "#0FBF00", position: 12, user: " " },
  //   { color: "#0FBF00", position: 13, user: " " },
  //   { color: "#0FBF00", position: 14, user: " " },
  //   { color: "#0994CF", position: 16, user: " " },
  //   { color: "#0994CF", position: 17, user: " " },
  //   { color: "#0994CF", position: 18, user: " " },
  //   { color: "#0994CF", position: 19, user: " " },
  // ];
  // const innerData21 = [
  //   { color: "#FBD03F", position: 5, user: " " },
  //   { color: "#E12929", position: 10, user: " " },
  //   { color: "#0FBF00", position: 15, user: " " },
  //   { color: "#0994CF", position: 20, user: " " },
  // ];
  // const lastposititon21 = null;

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavReferral>{circlesName}</NavReferral>

      <View
        className="justify-center items-center w-[100%] mx-auto"
        style={{ flex: 0.9 }}
      >
        <Text className="font-montmedium font-semibold text-[16px] leading-[28px] w-[90%] mx-auto text-bigText text-center">
          {circlesName}
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

        {circleCode && (
          <Text className="font-montmedium font-semibold text-[14px] text-center leading-[28px] mb-5 text-smallText mt-1">
            circle code: {circleCode || ""}
          </Text>
        )}
      </View>

      {OpenData && (
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
              className="px-5 py-3 mb-4 border-[1px] border-white rounded w-[75%] flex flex-col justify-center"
            >
              <Text className="text-white font-bold font-montmedium text-[18px] mb-2 text-center underline">
                Account Details
              </Text>
              {OtherData.is_downline ? (
                <>
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
                  <View className="flex flex-row justify-center items-center mt-3">
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
                </>
              ) : (
                <Text className="text-center font-montmedium text-white my-3">
                  You do not have permission to access this Account Details.
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

export default SelectedCircles;

const styles = StyleSheet.create({});
