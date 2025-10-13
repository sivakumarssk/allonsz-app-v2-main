import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Get_AllCircles } from "../../Network/ApiCalling";
import { useSelector } from "react-redux";

import CustomStatusBar from "../custom_screens/CustomStatusBar";
import NavReferral from "../custom_screens/NavReferral";

import CircleWithFourPieces from "./CircleWithFourPieces";
import Loader from "../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";

const JoyPac = ({ route }) => {
  const { reffereal_code } = route.params || {};

  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState([]);

  const token = useSelector((state) => state.login.token);

  const Q1_color = "#FBD03F";
  const Q2_color = "#E12929";
  const Q3_color = "#0FBF00";
  const Q4_color = "#0994CF";

  const data = [
    { label: "Pardhu", color: Q1_color }, //Q1
    { label: "hello", color: Q1_color }, //Q1
    { label: "Bye", color: Q1_color }, //Q1
    { label: "", color: Q1_color }, //Q1
    { label: "", color: Q2_color }, //Q2
    { label: "", color: Q2_color }, //Q2
    { label: "", color: Q2_color }, //Q2
    { label: "", color: Q2_color }, //Q2
    { label: "", color: Q3_color }, //Q3
    { label: "", color: Q3_color }, //Q3
    { label: "", color: Q3_color }, //Q3
    { label: "", color: Q3_color }, //Q3
    { label: "ABCDEFGHIJKlMN", color: Q4_color }, //Q4
    { label: "Sunil", color: Q4_color }, //Q4
    { label: "Prashanth", color: Q4_color }, //Q4
    { label: "ABCDEFGHIJKl", color: Q4_color }, //Q4
  ];
  const dataFour = [
    { label: "yellow", color: "#FBD03F" }, //Q1
    { label: "red", color: "#E12929" }, //Q2
    { label: "green", color: "#0FBF00" }, //Q3
    { label: "blue", color: "#0994CF" }, //Q4
  ];

  useEffect(() => {
    const getCircles = async () => {
      try {
        setLoading(true);
        const res = await Get_AllCircles(token);
        if (res.status === 200) {
          // const result = res.data.circles;
          // console.log("result", res.data.circles.members.length);
          setCircles(res.data.circles);
        }
      } catch (err) {
        console.log("error", err.response.data);
        if (err) {
          if (err.response) {
            if (err.response.status === 400) {
              console.log("Error With 400.");
            } else if (err.response.status === 422) {
              // console.log("Error With 422.");
              toast.hideAll();
              toast.show("Oops! Something went wrong—please try again", {
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

    getCircles();
  }, []);

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavReferral>Referal Circles</NavReferral>

      {/* <ScrollView>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text className="font-montmedium font-semibold text-[16px] leading-[28px] w-[90%] mx-auto text-bigText">
            Referral circle - 01
          </Text>
          <Joy />
          <Text className="font-montmedium font-semibold text-[14px] leading-[28px] text-smallText mt-1">
            code: AITS#143
          </Text>
        </View>

        <View style={{ display: "flex", alignItems: "center" }}>
          <Text className="font-montmedium font-semibold text-[16px] leading-[28px] w-[90%] mx-auto text-bigText">
            Referral circle - 02
          </Text>
          <Silver />
          <Text className="font-montmedium font-semibold text-[14px] leading-[28px] mb-5 text-smallText mt-1">
            code: AITS#143
          </Text>
        </View>
      </ScrollView> */}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          {circles && circles.length < 1 ? (
            <View className="justify-center items-center" style={{ flex: 0.8 }}>
              <Text className="text-center mt-[50px] font-montmedium font-semibold text-smallText leading-6 text-[16px]">
                Oops! No package purchased yet. Explore and choose the perfect
                package for you!
              </Text>
            </View>
          ) : (
            circles.map((item, index) => {
              const circle_Length = item.members.length;
              {
                /* console.log("index####:", index + 1, ">>", item.members); */
              }

              let outerData = [];
              let innerData = [];
              let lastPosition = null;

              let outterPices, innerPices, degree;

              const Q1_colorcode = "#FBD03F";
              const Q2_colorcode = "#E12929";
              const Q3_colorcode = "#0FBF00";
              const Q4_colorcode = "#0994CF";

              const generateCircleData21 = (data) => {
                data.forEach((member) => {
                  const position = parseInt(member.position);
                  {
                    /* const user = member.user?.username
                    ? member.user.username
                    : " "; */
                  }
                  const user = member.user?.username
                    ? member.user.username.length > 8
                      ? member.user.username.slice(0, 8) + ".."
                      : member.user.username
                    : "";

                  const userCode = member.user?.referal_code
                    ? member.user.referal_code
                    : " ";

                  {
                    /* console.log("member.user || {}; ", user); */
                  }

                  if ([1, 2, 3, 4].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q1_colorcode,
                    });
                  } else if ([6, 7, 8, 9].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q2_colorcode,
                    });
                  } else if ([11, 12, 13, 14].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q3_colorcode,
                    });
                  } else if ([16, 17, 18, 19].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q4_colorcode,
                    });
                  } else if (position === 5) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q1_colorcode,
                    });
                  } else if (position === 10) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q2_colorcode,
                    });
                  } else if (position === 15) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q3_colorcode,
                    });
                  } else if (position === 20) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q4_colorcode,
                    });
                  } else if (position === 21) {
                    lastPosition = member.user;
                  }
                });
                {
                  /* console.log("Outer Data21:", outerData);
                console.log("Inner Data21:", innerData);
                console.log("Last Position21:", lastPosition); */
                }
              };

              const generateCircleData13 = (data) => {
                {
                  /* console.log("data in 13", data); */
                }
                data.forEach((member) => {
                  const position = parseInt(member.position);
                  {
                    /* const user = member.user?.username
                    ? member.user.username
                    : " "; */
                  }
                  const user = member.user?.username
                    ? member.user.username.length > 12
                      ? member.user.username.slice(0, 12) + ".."
                      : member.user.username
                    : "";

                  const userCode = member.user?.referal_code
                    ? member.user.referal_code
                    : " ";

                  {
                    /* console.log("member.user || {}; ", user); */
                  }

                  if ([1, 2, 3].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q1_colorcode,
                    });
                  } else if ([5, 6, 7].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q2_colorcode,
                    });
                  } else if ([9, 10, 11].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q3_colorcode,
                    });
                  } else if (position === 4) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q1_colorcode,
                    });
                  } else if (position === 8) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q2_colorcode,
                    });
                  } else if (position === 12) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q3_colorcode,
                    });
                  } else if (position === 13) {
                    lastPosition = member.user;
                  }
                });
                {
                  /* console.log("Outer Data:", outerData);
                console.log("Inner Data:", innerData);
                console.log("Last Position:", lastPosition); */
                }
              };

              const generateCircleData7 = (data) => {
                {
                  /* console.log("data in 7", data); */
                }
                data.forEach((member) => {
                  const position = parseInt(member.position);
                  {
                    /* const user = member.user?.username
                    ? member.user.username
                    : " "; */
                  }
                  const user = member.user?.username
                    ? member.user.username.length > 12
                      ? member.user.username.slice(0, 12) + "..."
                      : member.user.username
                    : "";

                  const userCode = member.user?.referal_code
                    ? member.user.referal_code
                    : " ";

                  {
                    /* console.log("member.user || {}; ", user); */
                  }

                  if ([1, 2].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q1_colorcode,
                    });
                  } else if ([4, 5].includes(position)) {
                    outerData.push({
                      position,
                      user,
                      userCode,
                      color: Q2_colorcode,
                    });
                  } else if (position === 3) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q1_colorcode,
                    });
                  } else if (position === 6) {
                    innerData.push({
                      position,
                      user,
                      userCode,
                      color: Q2_colorcode,
                    });
                  } else if (position === 7) {
                    lastPosition = member.user;
                  }
                });
                {
                  /* console.log("Outer Data:", outerData);
                console.log("Inner Data:", innerData);
                console.log("Last Position:", lastPosition); */
                }
              };

              if (circle_Length === 21) {
                outterPices = 16;
                innerPices = 4;
                degree = 90;

                generateCircleData21(item.members);
              } else if (circle_Length === 13) {
                outterPices = 9;
                innerPices = 3;
                degree = 90;

                generateCircleData13(item.members);
              } else if (circle_Length === 7) {
                outterPices = 4;
                innerPices = 2;
                degree = 180;
                generateCircleData7(item.members);
              } else {
                outterPices = 16;
                innerPices = 4;
                degree = 90;
              }

              return (
                <View key={index}>
                  <Text className="font-montmedium font-semibold text-[16px] leading-[28px] w-[90%] mx-auto text-bigText">
                    Referral circle -{" "}
                    {index + 1 < 9 ? `0${index + 1}` : index + 1}
                  </Text>
                  <View>
                    <CircleWithFourPieces
                      InnerData={innerData}
                      OuterData={outerData}
                      outterPices={outterPices}
                      innerPices={innerPices}
                      degree={degree}
                      centerLabel={
                        lastPosition ? lastPosition.user.username : ""
                      }
                    />
                  </View>
                  <Text className="font-montmedium font-semibold text-[14px] text-center leading-[28px] mb-5 text-smallText mt-1">
                    code: {item.name}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default JoyPac;

const styles = StyleSheet.create({});
