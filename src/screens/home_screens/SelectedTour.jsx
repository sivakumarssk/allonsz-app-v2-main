import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";

import {
  Get_Ads,
  Selected_Trips,
  Send_request_trip,
} from "../../Network/ApiCalling";

import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { formatToReadableDateDDMMYYYY } from "../../utils/TimeConvert";
import { useToast } from "react-native-toast-notifications";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";

import CustomStatusBar from "../custom_screens/CustomStatusBar";
import RBSheet from "react-native-raw-bottom-sheet";
import PrimaryButton from "../custom_screens/PrimaryButton";
import Loader from "../custom_screens/Loader";
import PagerView from "react-native-pager-view";
import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryDateTimePicker from "../custom_screens/PrimaryDateTimePicker";

import EvilIcons from "@expo/vector-icons/EvilIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SelectedTour = ({ route }) => {
  const { tourId } = route.params || {};
  // console.log("Tour ID", tourId);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const refRBSheet = useRef();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.login.token);

  const [TripDetails, setTripDetails] = useState([]);

  const [popUp, setPopUp] = useState(false);
  const [popUpIndex, setPopUpIndex] = useState("");

  // const fromDate = new Date();
  // const formattedDate = formatToReadableDateDDMMYYYY(fromDate);

  useEffect(() => {
    const handleTrip = async () => {
      try {
        setLoading(true);
        const res = await Selected_Trips(tourId, token);

        // console.log(">>>>", res.data);
        if (res.status === 200) {
          // console.log("All trips", res.data.tour);
          setTripDetails(res.data.tour);
          const fromPlace = `${res.data.tour[0]?.place}, ${res.data.tour[0]?.area}`;
          setFieldValue("tour_id", res.data.tour[0].id);
          setFieldValue("to_place", fromPlace);
          // setFieldValue("from_date", formattedDate);
          // setFieldValue("to_date", formattedDate);
        }
      } catch (err) {
        // console.log("error", err.response.data);
        if (err) {
          if (err.response) {
            if (err.response.status === 400) {
              console.log("Error With 400.");
            } else if (err.response.status === 422) {
              // console.log("Error With 422.", err.response.data);
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
              // console.log("Internal Server Error");
              Alert.alert(
                "Internal Server Error",
                "Please Check your Internet Connection"
              );
            } else {
              console.log("An error occurred response.>>");
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

    handleTrip();
  }, []);

  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  const { whatsapp_number, call_number } = useSelector(
    (state) => state.settingData
  );

  const phoneNumber = call_number || "+91 9440228963";
  const whatsNumber = whatsapp_number || "+91 9440228963";

  const whatsappMessage = `Hi, I would like to inquire about the following trip:
  
Tour Name: ${TripDetails[0]?.name}
Area: ${TripDetails[0]?.place}, ${TripDetails[0]?.area}
For more details, please let me know!

Looking forward to your response.
`;

  // Function to open the phone dialer
  const openDialer = () => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert("Error", "Unable to open the dialer.");
    });
  };

  // Function to open WhatsApp
  const openWhatsApp = () => {
    const whatsappURL = `whatsapp://send?phone=${whatsNumber}&text=${encodeURIComponent(
      whatsappMessage
    )}`;
    Linking.openURL(whatsappURL).catch(() => {
      Alert.alert("Error", "WhatsApp is not installed on this device.");
    });
  };

  const [clicked, setClicked] = useState(false);

  const handleDragBack = () => {
    if (clicked) {
      setClicked(!clicked);
    }
  };

  const onSubmit = async (values) => {
    // console.log("consoling >>>>>", values);
    try {
      setLoading(true);
      const res = await Send_request_trip(values, token);
      if (res.status === 200) {
        toast.hideAll();
        toast.show(res.data.message, {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          style: { marginTop: 28 },
          animationType: "slide-in",
        });

        resetForm();

        // console.log("success", res.data);
        setClicked(false);

        refRBSheet.current.close();
      }
    } catch (err) {
      // console.log("error..>>>>", err.response.status);
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            // console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422.", err.response.data);
            toast.hideAll();
            toast.show(err.response.data.mesage || err.response.data.error, {
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
    },
    validationSchema: "",
    onSubmit,
  });

  const [showAd, setShowAd] = useState(false);
  const [adsContent, setAdsContent] = useState("");

  useEffect(() => {
    setShowAd(true);

    const Internal = setInterval(() => {
      setShowAd(true);
    }, 600000);

    return () => clearInterval(Internal);
  }, []);

  useEffect(() => {
    if (showAd) {
      console.log("Ad displayed!");
      getAds();

      const timeout = setTimeout(() => {
        setShowAd(false);
      }, 600000);

      return () => clearTimeout(timeout);
    }
  }, [showAd]);

  const getAds = async () => {
    try {
      setLoading(true);
      const res = await Get_Ads(token);
      if (res.status === 200) {
        console.log("All Ads", res.data.adds);
        // console.log("All Ads", res.data.adds.add_url);
        setAdsContent(res.data.adds);
      }
    } catch (err) {
      // console.log("error", err.response.data);
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

  const videoRef = useRef(null);

  if (showAd) {
    return (
      <>
        <CustomStatusBar barStyle="dark-content" backgroundColor="#44689C" />

        <View
          className="relative flex justify-center items-center bg-[#0000002d]"
          style={{ flex: 1 }}
        >
          <View
            className={`absolute right-3 ${
              Platform.OS === "android" ? "top-2" : "top-[60px]"
            }`}
          >
            <Pressable
              className="flex flex-row justify-center z-10 items-center  bg-[#5a5a5a36] rounded-full"
              onPress={() => {
                if (videoRef.current) {
                  videoRef.current.stopAsync();
                }
                setShowAd(false);
              }}
            >
              <Text className="text-black pl-2 mb-[2px]">close</Text>
              <Entypo name="circle-with-cross" size={28} color="black" />
            </Pressable>
          </View>
          {adsContent.add_type === "Video" ? (
            <>
              <Video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: 250,
                }}
                source={{
                  uri: adsContent.add_url,
                }}
                // source={require("../../styles/images/Video.mp4")}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                  // console.log("Playback Status:", status);
                  if (status.didJustFinish) {
                    setShowAd(false);
                  }
                  if (!status.isLoaded && status.error) {
                    console.log("Playback Error:", status.error);
                    setShowAd(false);
                  }
                }}
                onError={(error) => console.log("Video Error:", error)}
                // onLoad={() => console.log("Video Loaded")}
              />
              <Text className="w-[90%] font-montregular leading-[22px] text-[14px] text-center mt-4">
                Welcome to Allons-Z Team, your partner in unforgettable
                journeys. From serene getaways to adventurous expeditions, we
                offer curated packages, personalized itineraries, and
                exceptional service to make your travel dreams come true.
              </Text>
            </>
          ) : (
            <>
              <Image
                source={{ uri: adsContent.add_url }}
                style={{
                  width: "100%",
                  height: 250,
                }}
                onLoad={() => {
                  setTimeout(() => {
                    setShowAd(false);
                  }, 8000);
                  // console.log("loadded");
                }}
              />
              <Text className="w-[90%] font-montregular leading-[20px] text-[13px] text-center mt-4">
                Welcome to Allons-Z Team, your partner in unforgettable
                journeys. From serene getaways to adventurous expeditions, we
                offer curated packages, personalized itineraries, and
                exceptional service to make your travel dreams come true.
              </Text>
            </>
          )}
        </View>
      </>
    );
  }

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView edges={["right", "left"]} style={{ flex: 1 }}>
        <View style={{ flex: 0.4 }}>
          <Image
            source={{ uri: TripDetails[0]?.photo }}
            className="w-full h-[480px]"
            style={{ marginTop: -insets.top }}
          />
          <View
            style={{
              position: "absolute",
              top: Platform.OS === "android" ? 50 : 5, // Adjust based on your desired position
              left: 15, // Adjust based on your desired position
              zIndex: 10, // Ensures it's above the image
            }}
          >
            <TouchableOpacity
              className="flex flex-row items-center"
              onPress={() => navigation.goBack()}
            >
              <View className="bg-primary rounded-full">
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={28}
                  color="white"
                />
              </View>
              <Text className="ml-[6px] font-semibold text-[16px]">
                Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-white rounded-3xl relative" style={{ flex: 0.6 }}>
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
            <View className="w-[90%] mx-auto">
              <Text className="font-montmedium font-semibold text-[24px] leading-[32px] text-bigText tracking-wider mt-8 mb-4">
                {TripDetails[0]?.name}
              </Text>
              <Text className="font-montmedium font-normal text-smallText text-[15px] leading-[20px] tracking-wider">
                {TripDetails[0]?.place}, {TripDetails[0]?.area}
              </Text>
              <View className="flex flex-row justify-between items-center my-4">
                <View className="flex flex-row items-center mb-[10px]">
                  <EvilIcons name="location" size={25} color="black" />
                  <Text className="text-smallText font-montmedium font-normal text-[12px] leading-[16px]">
                    {TripDetails[0]?.place}
                  </Text>
                </View>
                <View className="font-montmedium font-normal text-[15px] leading-[20px] tracking-wide">
                  <Text> ₹ {TripDetails[0]?.price}/Person</Text>
                </View>
              </View>

              <View className="flex flex-row">
                <FlatList
                  // data={response}
                  data={TripDetails[0]?.photos}
                  renderItem={({ item, index }) => (
                    <Pressable
                      onPress={() => {
                        console.log(index);
                        setPopUpIndex(index);
                        setPopUp(true);
                      }}
                    >
                      <View className="w-[75px] h-[75px] mx-1 border flex justify-center items-center rounded-2xl">
                        <Image
                          source={{ uri: item.photo }}
                          style={{ width: 75, height: 75, borderRadius: 16 }}
                        />
                      </View>
                    </Pressable>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal={true} // Enables horizontal scrolling
                  showsHorizontalScrollIndicator={false} // Hides the horizontal scroll indicator
                />
              </View>
              <Text className="font-montmedium font-semibold text-[20px] leading-[28px] text-bigText mt-6 mb-4">
                About Destination
              </Text>
              <View>
                <Text
                  numberOfLines={expanded ? null : 7}
                  className="font-montmedium font-normal text-[14px] leading-[22px] text-smallText text-justify"
                >
                  {TripDetails[0]?.desc}
                </Text>
                <TouchableOpacity onPress={toggleReadMore}>
                  <Text className="text-[#007AFF] text-[14px] font-bold mt-1">
                    {expanded ? "Read Less" : "Read More"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View className="my-4 w-[90%] mx-auto ">
            <PrimaryButton
              onPress={() => {
                // console.log("want to hit API");
                refRBSheet.current.open();
              }}
            >
              Click for Info
            </PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
      {/*  */}
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={true} // Disable native driver
        onClose={handleDragBack} //trigrred when the bottomsheet has closed
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
            height: clicked ? "90%" : 185,
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
        <View className="relative">
          <Text className="font-montmedium font-semibold text-[18px] text-bigText text-center mt-2 underline">
            Call for Infor
          </Text>
          <Pressable
            className="absolute right-3 top-2"
            onPress={() => {
              refRBSheet.current.close();
            }}
          >
            <Entypo name="circle-with-cross" size={25} color="black" />
          </Pressable>
        </View>
        <View className="flex flex-row  justify-center items-center gap-[90px] h-[200px]">
          <TouchableOpacity
            onPress={() => {
              openDialer();
            }}
          >
            <Image
              source={require("../../styles/images/home/mobile.png")}
              className="w-[60px] h-[60px]"
            />
            <Text className="text-center">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              openWhatsApp();
            }}
          >
            <Image
              source={require("../../styles/images/home/whatsapp.png")}
              className="w-[60px] h-[60px]"
            />
            <Text className="text-center">WhatsApp</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setClicked(!clicked)}>
          <View>
            <Text className="text-center font-montmedium text-[16px] pb-5 text-blue-500 font-semibold underline ">
              Request for trip
            </Text>
          </View>
        </TouchableOpacity>
        <ScrollView>
          <View className="w-[80%] mx-auto mt-3">
            <PrimaryInput
              label={"Trip Name"}
              readOnly={true}
              value={TripDetails[0]?.name}
              extrastyles={"-my-1"}
            />
            <PrimaryInput
              label={"Trip Location"}
              readOnly={true}
              value={TripDetails[0]?.place + "," + TripDetails[0]?.area}
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
              error={touched.members && errors.members ? errors.members : null}
              extrastyles={"-mt-2 -mb-3"}
            />

            <PrimaryDateTimePicker
              label={"Choose the date you wish to depart"}
              placeholder={"DD/MM/YYYY"}
              mode="date"
              value={values.from_date}
              onBlur={handleBlur("from_date")}
              onChangeText={(date) => {
                // Convert Date object to readable format before storing
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

      {popUp && (
        <Modal transparent={true} animationType="fade">
          <TouchableWithoutFeedback
            onPress={() => {
              // console.log("out");
              setPopUp(false);
            }}
          >
            <View className="flex-1 justify-center items-center bg-[#00000046]">
              <PagerView className="w-full h-[37%]" initialPage={popUpIndex}>
                {TripDetails[0]?.photos.map((item, index) => (
                  <TouchableWithoutFeedback
                    key={index + 1}
                    onPress={() => {
                      // console.log("clicked");
                    }}
                  >
                    <View className="flex-row justify-center items-center">
                      <Image
                        source={{ uri: item.photo }}
                        className="w-[260px] h-[300px] rounded-lg object-contain"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </PagerView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

export default SelectedTour;

const styles = StyleSheet.create({});
