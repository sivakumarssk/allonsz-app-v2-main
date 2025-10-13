import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ShimmerComp = ({ visible = false, styles }) => {
  return (
    <>
      <ShimmerPlaceholder
        visible={visible}
        LinearGradient={LinearGradient}
        duration={1000}
        colorShimmer={["#ebebeb", "#c5c5c5", "#ebebeb"]}
        style={styles}
      />
    </>
  );
};

export default ShimmerComp;

const styles = StyleSheet.create({});
