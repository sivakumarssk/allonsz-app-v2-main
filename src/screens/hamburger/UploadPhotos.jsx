import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useToast } from "react-native-toast-notifications";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  convertDateFormat,
  formatToReadableDateDDMMYYYY,
} from "../../utils/TimeConvert";
import { Get_MyTrips, Send_Update_trip } from "../../Network/ApiCalling";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";

import Loader from "../custom_screens/Loader";
import NavBack from "../custom_screens/NavBack";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import MultipleImage from "../custom_screens/MultipleImage";

import RBSheet from "react-native-raw-bottom-sheet";
import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryDateTimePicker from "../custom_screens/PrimaryDateTimePicker";
import PrimaryButton from "../custom_screens/PrimaryButton";

const UploadPhotos = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.login.token);

  const [modalVisible, setModalVisible] = useState(false);

  const [MyTripsData, setMyTripsData] = useState([]);
  const [tridId, setTripId] = useState("");

  const [TripName, setTripName] = useState("");
  const [TripLocation, setTripLocation] = useState("");
  const [TripArea, setTripArea] = useState("");

  const refRBSheet = useRef();

  useEffect(() => {
    getmytrips();
  }, []);

  const getmytrips = async () => {
    try {
      setLoading(true);
      const res = await Get_MyTrips(token);
      if (res.status === 200) {
        // console.log("success>>", res.data.trips[0].rewards);
        setMyTripsData(res.data.trips);
      }
    } catch (err) {
      if (err) {
        if (err.response) {
          // console.log("error>>>>>>>", err.response);
          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422.", err.response.data.mesage);
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
          // console.log("No Response Received From the Server.");
          if (err.request.status === 0) {
            Alert.alert(
              "No Network Found",
              "Please Check your Internet Connection"
            );
          }
        } else {
          // console.log("Error in Setting up the Request.", err);
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

  const onSubmit = async (values) => {
    console.log("consoling", values);
    try {
      setLoading(true);
      const res = await Send_Update_trip(values, token);
      if (res.status === 200) {
        getmytrips();

        refRBSheet.current.close();

        toast.hideAll();
        toast.show(res.data.message, {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        resetForm();
      }
    } catch (err) {
      // console.log("error..>>>>", err);
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            // console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422.", err.response.data.error);
            toast.hideAll();
            toast.show(err.response.data.error, {
              type: "danger",
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
            // console.log("Internal Server Error");
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
      tour_id: "",
      to_place: "",
      from_place: "",
      members: "",
      from_date: "",
      to_date: "",
      trip_id: "",
    },
    validationSchema: "",
    onSubmit,
  });

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Upload Photos</NavBack>

      {/* <MultipleImage /> */}
      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-[95%] mx-auto" style={{ flex: 1 }}>
          <Text className="font-montmedium font-semibold leading-[22px] text-[16px] tracking-wider text-smallText my-2">
            My trips
          </Text>

          {MyTripsData.length < 1 ? (
            <View className="justify-center items-center" style={{ flex: 0.8 }}>
              <Text className="text-[20px] font-semibold text-center font-popmedium text-[#220ba4bd]">
                No trips have been visited yet!
              </Text>
              <Text className="font-montmedium text-[14px] text-center text-smallText ">
                Start your journey by requesting a trip!
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                data={MyTripsData}
                keyExtractor={(item, index) =>
                  item.id?.toString() || index.toString()
                }
                renderItem={({ item, index }) => (
                  <View className="w-full relative">
                    {/* <View className="flex flex-cols items-center absolute top-[32px]">
                      <View
                        className={`w-[18px] h-[18px] rounded-full ${
                          item.status === "Approved"
                            ? "bg-backButton"
                            : "bg-[#ffb87957]"
                        } `}
                      ></View>

                      {index !== MyTripsData.length - 1 && (
                        <View
                          className={`w-[2px] h-[65px] border border-dashed ${
                            item.status === "Approved"
                              ? "border-backButton"
                              : "border-[#ffb87957]"
                          }`}
                        ></View>
                      )}
                    </View> */}
                    {/* ml-9 w-[90%] */}
                    <View
                      className={`flex flex-row justify-around items-center my-2 px-2 py-3 rounded ${
                        item.status === "Approved"
                          ? "bg-[#c7f1ff55]"
                          : "bg-[#ffb87939]"
                      }`}
                    >
                      <View className="w-[21%]">
                        <Text className="font-montmedium font-bold text-[13px] leading-[22px] text-bigText">
                          {item.from_date && convertDateFormat(item.from_date)}
                        </Text>
                        <Text className="font-montmedium font-bold text-[13px] leading-[22px] text-bigText">
                          {item.to_date && convertDateFormat(item.to_date)}
                        </Text>
                      </View>
                      <View className="flex-cols mt-[2px] w-[27%] ">
                        <Text
                          className="font-montmedium font-normal text-[12px] leading-[22px] text-bigText"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.from_place || ""}
                        </Text>
                        <Text
                          className="font-montmedium font-normal text-[12px] leading-[22px] text-bigText"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.tour?.name || ""}
                        </Text>
                      </View>
                      <View className="flex flex-cols justify-center items-center w-[15%] ">
                        <Text className="font-montmedium font-normal text-[12px] leading-[16px] text-bigText">
                          {item.members || ""}
                        </Text>
                        <Text className="font-montmedium font-normal text-[12px] leading-[16px] text-bigText">
                          persons
                        </Text>
                      </View>
                      <View className="flex flex-cols justify-center items-center w-[15%] ">
                        <View className="flex flex-row justify-center items-center">
                          <MaterialIcons
                            name="currency-rupee"
                            size={16}
                            color="black"
                          />
                          <Text className="font-montmedium font-normal text-[12px] leading-[16px] text-bigText">
                            {item.rewards[0]?.amount || "0"}
                          </Text>
                        </View>
                        <Text className="font-montmedium font-normal text-[12px] leading-[16px] text-bigText">
                          rewards
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="w-[18%]"
                        onPress={() => {
                          // console.log("press");
                          if (item.status === "Approved") {
                            setTripId(item.id);
                            setModalVisible(true);
                          } else {
                            // toast.show(
                            //   "You must complete the trip or visit to proceed.",
                            //   {
                            //     type: "danger",
                            //     placement: "top",
                            //     duration: 4000,
                            //     offset: 30,
                            //     animationType: "slide-in",
                            //   }
                            // );
                            setFieldValue("tour_id", item.tour?.id);
                            setFieldValue("trip_id", item.id);
                            setTripName(item.tour?.name);
                            setTripLocation(item.tour?.place);
                            setTripArea(item.tour?.area);

                            refRBSheet.current.open();
                          }
                        }}
                      >
                        {item.status === "Approved" ? (
                          <View className="flex flex-row justify-center items-center">
                            <Text className="mr-1 text-black font-montmedium text-[12px]">
                              Upload
                            </Text>
                            <Entypo
                              name="upload-to-cloud"
                              size={18}
                              color="black"
                            />
                          </View>
                        ) : (
                          <View className="flex flex-row justify-center items-center">
                            <Text className="mr-1 text-black font-montmedium text-[14px]">
                              Edit
                            </Text>
                            <FontAwesome name="edit" size={17} color="black" />
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
              />
            </>
          )}
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
              backgroundColor: "#32CD32", // Lime green
            },
            container: {
              backgroundColor: "rgba(224, 224, 224, 1)",
              // borderRadius: 25,
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              height: "75%",
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
          <Text className="font-montmedium font-semibold text-[16px] text-bigText text-center mt-3 mb-2">
            Flexible plans? Change your schedule here.
          </Text>
          <ScrollView>
            <View className="w-[80%] mx-auto mt-3">
              <PrimaryInput
                label={"Trip Name"}
                readOnly={true}
                value={TripName}
                extrastyles={"-my-1"}
              />
              <PrimaryInput
                label={"Trip Location"}
                readOnly={true}
                value={TripLocation + "," + TripArea}
                extrastyles={"-mt-2 -mb-1"}
              />

              <PrimaryInput
                label={"Where are you from?"}
                placeholder={"Enter your city or location"}
                keyboardType={"default"}
                maxLength={20}
                inputMode={"word"}
                value={values.from_place}
                onBlur={handleBlur("from_place")}
                onChangeText={(value) => {
                  setFieldTouched("from_place", true, true);
                  handleChange("from_place")(value);
                }}
                error={
                  touched.from_place && errors.from_place
                    ? errors.from_place
                    : null
                }
                extrastyles={"-mt-2 -mb-1"}
              />
              <PrimaryInput
                label={"How many people are you planning to take on the trip?"}
                placeholder={"Enter the number of people for your trip"}
                keyboardType={"number-pad"}
                maxLength={2}
                inputMode={"numeric"}
                value={values.members}
                onBlur={handleBlur("members")}
                onChangeText={(value) => {
                  setFieldTouched("members", true, true);
                  handleChange("members")(value);
                }}
                error={
                  touched.members && errors.members ? errors.members : null
                }
                extrastyles={"-mt-2 -mb-3"}
              />

              <PrimaryDateTimePicker
                label={"Choose the date you wish to depart"}
                placeholder={"DD/MM/YYYY"}
                mode="date"
                value={values.from_date}
                onBlur={handleBlur("from_date")}
                onChangeText={(date) => {
                  // console.log(date);
                  const formattedDate = formatToReadableDateDDMMYYYY(date);
                  handleChange("from_date")(formattedDate);
                }}
                minimumDate={new Date()}
                maximumDate={
                  new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                }
              />
              <PrimaryDateTimePicker
                label={"Choose the date you wish to return"}
                placeholder={"DD/MM/YYYY"}
                mode="date"
                value={values.to_date}
                onBlur={handleBlur("to_date")}
                onChangeText={(date) => {
                  const formattedDate = formatToReadableDateDDMMYYYY(date);
                  handleChange("to_date")(formattedDate);
                }}
                minimumDate={new Date()}
                maximumDate={
                  new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                }
              />
              <View className="my-6">
                <PrimaryButton
                  onPress={() => {
                    handleSubmit(values);
                  }}
                >
                  Submit
                </PrimaryButton>
              </View>
            </View>
          </ScrollView>
        </RBSheet>
      </SafeAreaView>

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
            setTripId("");
          }}
        >
          <View className="flex-1 justify-center items-center bg-[#0000005e]">
            <View className="bg-white w-[80%] rounded p-2">
              <View className="flex flex-row justify-center items-center">
                <Text className="text-[#44689C] font-montmedium text-[18px] font-semibold">
                  Upload your trip Pictures
                </Text>
              </View>
              <MultipleImage
                tripID={tridId}
                setModalVisible={setModalVisible}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default UploadPhotos;

const styles = StyleSheet.create({});
