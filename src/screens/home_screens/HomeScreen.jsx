import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomStatusBar from "../custom_screens/CustomStatusBar";

import Feather from "@expo/vector-icons/Feather";
import CounTime from "../custom_screens/CounTime";
import { TouchableOpacity } from "react-native";

import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useNavigation } from "@react-navigation/native";
import { All_Trips, Get_Setting, Get_Timer } from "../../Network/ApiCalling";
import { useDispatch, useSelector } from "react-redux";

import ShimmerComp from "../custom_screens/ShimmerComp";
import { useToast } from "react-native-toast-notifications";

import { useNetwork } from "../../utils/NetworkContext";
import {
  setCallSupport,
  setEmailSupport,
  setWhatAppSupport,
} from "../redux/action/settingAction";
import { calculateRemainingTime } from "../../utils/TimeConvert";
import { RFValue } from "react-native-responsive-fontsize";

const HomeScreen = ({ route }) => {
  const { isConnected } = useNetwork();
  // console.log("isConnected", isConnected);

  if (!isConnected) {
    return (
      <View className="flex-1 justify-center items-center">
        <CustomStatusBar barStyle="dark-content" backgroundColor="#44689C" />
        <Text className="text-base font-bold text-[#44689C]">
          check your internet connection
        </Text>
        <Image
          source={require("../../styles/images/home/NoInternet.png")}
          className="w-40 h-40 mt-4"
        />
      </View>
    );
  }

  const { domesticTrip = "Domestic" } = route.params || {};

  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.login.token);
  const [loading, setLoading] = useState(false);

  const [Trips, SetTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [search, setSearch] = useState("");

  const [GetTime, setGetTime] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getSetting();
    // CountDownTime();
  }, []);

  useEffect(() => {
    homeTrips();
  }, [domesticTrip]);

  //GetSetting for Supporrt Numbers
  const getSetting = async () => {
    try {
      const res = await Get_Setting(token);
      if (res.status === 200) {
        const result = res.data.setting;

        dispatch(setEmailSupport(result.email_support));
        dispatch(setWhatAppSupport(result.whatsapp_support_number));
        dispatch(setCallSupport(result.call_support_number));
        // SetSetting(result);
      }
    } catch (err) {
      // console.log("error", err.response.data);
      if (err) {
        if (err.response) {
          if (err.response.status === 422) {
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
    }
  };

  // Trips Details
  const homeTrips = async () => {
    try {
      setLoading(true);
      const res = await All_Trips(domesticTrip, token);

      // console.log(">>>>", res.data.tours);
      if (res.status === 200) {
        // console.log("All trips", res.data.tours);
        SetTrips(res.data.tours);
        setFilteredTrips(res.data.tours);
      }
    } catch (err) {
      console.log("error in home Trips api", err.response.data);
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422", err.response.data);
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 301) {
            console.log("Error With 301");
          } else if (err.response.status === 401) {
            console.log("Error With 401");
          } else if (err.response.status === 404) {
            console.log("Error With 404");
          } else if (err.response.status === 500) {
            console.log("Internal Server Error");
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
          console.log("No Response Received From the Server.");
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

  //get countDown (INCOMMENT)
  const CountDownTime = async () => {
    try {
      setLoading(true);
      const res = await Get_Timer(token);
      // console.log("All TImmerees", res.data);
      if (res.status === 200) {
        setGetTime(res.data?.timers);
        // CountDays();
      }
    } catch (err) {
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422", err.response);
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 301) {
            console.log("Error With 301");
          } else if (err.response.status === 401) {
            console.log("Error With 401");
          } else if (err.response.status === 404) {
            console.log("Error With 404");
          } else if (err.response.status === 500) {
            console.log("Internal Server Error /api/get-timer");
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
          // console.log("Error in Setting up the Request......");
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

  //Filter and search
  const handleSearch = (text) => {
    setSearch(text);

    if (!text.trim()) {
      setFilteredTrips(Trips);
      return;
    }

    const filteredData = Trips.filter((trip) =>
      [trip.name, trip.place, trip.area]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(text.toLowerCase()))
    );

    setFilteredTrips(filteredData);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await homeTrips();
      // await CountDownTime();
    } catch (error) {
      console.log("Error while refreshing", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTourItem = ({ item }) => {
    return (
      <View className="w-[49%] mb-2">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SelectedTour", { tourId: item.id })
          }
        >
          <View className="bg-white rounded-xl p-[6px]">
            <Image
              source={{ uri: item.photo }}
              className="w-full h-[155px] rounded-lg"
            />
            <View className="">
              <Text className="font-montmedium font-bold text-[14px] leading-[16px] my-2 ml-1">
                {item.name}
              </Text>
              <View className="flex flex-row items-center mb-[10px]">
                <EvilIcons name="location" size={25} color="black" />
                <Text className="text-smallText font-montmedium font-normal text-[11px] leading-[16px]">
                  {item.place}, {item.area}
                </Text>
              </View>
              <View>
                <Text className="font-montmedium font-semibold text-[14px] leading-[16px] text-smallText ml-[7px]">
                  <Text className="text-primary"> ₹ {item.price}</Text>/Person
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <CustomStatusBar barStyle="dark-content" backgroundColor="#44689C" />

      <View className="flex flex-row justify-between border-[#a9a9a9] focus:border-black border-[0.5px] my-4 w-[95%] mx-auto rounded py-1 px-2 ">
        <TextInput
          placeholder="Search Places"
          value={search}
          onChangeText={(text) => handleSearch(text)}
          className="w-[90%]"
        />
        <View className="mt-[6px]">
          <Feather name="search" size={24} color="black" />
        </View>
      </View>

      {/* {GetTime.length > 0 &&
        GetTime.map((timer) => {
          const remaining = calculateRemainingTime(timer.created_at);

          return (
            <View
              key={timer.id}
              className="flex flex-row justify-center items-center"
            >
              
              <CounTime
                initialName={timer.name}
                initialDays={remaining.Days}
                initialHours={remaining.Hours}
                initialMinutes={remaining.Minutes}
                initialSeconds={remaining.Seconds}
              />
            </View>
          );
        })} */}

      {/* {remainingDays.Days !== undefined && remainingDays.Hours !== undefined ? (
        <CounTime
          initialDays={remainingDays.Days}
          initialHours={remainingDays.Hours}
          initialMinutes={remainingDays.Minutes}
          initialSeconds={remainingDays.Seconds}
        />
      ) : (
        ""
      )} */}

      <View className="my-[10px] flex flex-row justify-between w-[90%] mx-auto">
        <View>
          <Text
            className="font-montmedium font-bold text -[20px] leading-[23px]"
            style={{ fontSize: RFValue(19) }}
          >
            Where do you{" "}
          </Text>
          <Text
            className="font-montmedium font-bold text-[20px] leading-[23px]"
            style={{ fontSize: RFValue(16) }}
          >
            wanna go?
          </Text>
        </View>

        <Pressable
          className="flex flex-row justify-center items-center gap-[15px]"
          onPress={() => {
            // navigation.navigate("JoyPac");
            navigation.navigate("CircleScreen");
          }}
        >
          <View>
            <Text className="flex flex-col font-montmedium font-medium text-[14px] leading-[26px] text-smallText">
              circles code
            </Text>
            <Image
              source={require("../../styles/images/home/Group12.png")}
              resizeMode="center"
              style={{ width: 80, height: 25 }}
            />
          </View>
          <View className="bg-primary rounded-full p-2 text-center overflow-hidden">
            <Image
              source={require("../../styles/images/home/referal.png")}
              className="w-[28px] h-[28px]"
            />
          </View>
        </Pressable>
      </View>

      <View className="w-[90%] mx-auto" style={{ flex: 1 }}>
        <Text
          className="font-montmedium font-bold text -[18px] leading-[28px] text-bigText tracking-wider"
          style={{ fontSize: RFValue(13) }}
        >
          All Popular {domesticTrip} Places
        </Text>
        {loading ? (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex flex-row flex-wrap mt-5 justify-between items-center w-full">
                <View className="w-[49%] my-3">
                  <ShimmerComp
                    styles={{ width: "95%", height: 200, borderRadius: 10 }}
                  />
                  <ShimmerComp
                    styles={{
                      width: "78%",
                      height: 15,
                      borderRadius: 2,
                      marginTop: 5,
                    }}
                  />
                </View>
                <View className="w-[49%] my-3">
                  <ShimmerComp
                    styles={{ width: "95%", height: 200, borderRadius: 10 }}
                  />
                  <ShimmerComp
                    styles={{
                      width: "78%",
                      height: 15,
                      borderRadius: 2,
                      marginTop: 5,
                    }}
                  />
                </View>
                <View className="w-[49%] my-3">
                  <ShimmerComp
                    styles={{ width: "95%", height: 200, borderRadius: 10 }}
                  />
                  <ShimmerComp
                    styles={{
                      width: "78%",
                      height: 15,
                      borderRadius: 2,
                      marginTop: 5,
                    }}
                  />
                </View>
                <View className="w-[49%] my-3">
                  <ShimmerComp
                    styles={{ width: "95%", height: 200, borderRadius: 10 }}
                  />
                  <ShimmerComp
                    styles={{
                      width: "78%",
                      height: 15,
                      borderRadius: 2,
                      marginTop: 5,
                    }}
                  />
                </View>
                <View className="w-[49%] my-3">
                  <ShimmerComp
                    styles={{ width: "95%", height: 200, borderRadius: 10 }}
                  />
                  <ShimmerComp
                    styles={{
                      width: "78%",
                      height: 15,
                      borderRadius: 2,
                      marginTop: 5,
                    }}
                  />
                </View>
                <View className="w-[49%] my-3">
                  <ShimmerComp
                    styles={{ width: "95%", height: 200, borderRadius: 10 }}
                  />
                  <ShimmerComp
                    styles={{
                      width: "78%",
                      height: 15,
                      borderRadius: 2,
                      marginTop: 5,
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </>
        ) : filteredTrips.length === 0 ? (
          <View className="flex items-center justify-center mt-4">
            <Text className="text-gray-500 text-base">No tours available</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTrips}
            renderItem={renderTourItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{
              paddingVertical: 10,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        )}
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
