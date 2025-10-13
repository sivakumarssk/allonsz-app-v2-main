// import React from "react";
// import { Image, StyleSheet, Text, View } from "react-native";

// const AnimatedSplash = () => {
//   return (
//     <View className="justify-center items-center" style={{ flex: 1 }}>
//       <Image
//         className="w-[350px] h-[350px]"
//         source={require("../../../assets/logoanimation.gif")}
//       />
//     </View>
//   );
// };

// export default AnimatedSplash;

// const styles = StyleSheet.create({});

import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native";

const AnimatedSplash = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View className="py-[125px]">{/* <Text>.</Text> */}</View>
      <LottieView
        source={require("../../styles/images/final-logo.json")}
        autoPlay
        style={{
          width: 780,
          height: 780,
        }}
        loop={false}
      />
    </View>
  );
};

export default AnimatedSplash;

const styles = StyleSheet.create({});
