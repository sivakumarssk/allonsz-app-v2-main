import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Loader = ({ visible }) => {
  return <Spinner visible={visible} color={"#4A3AFF"} animation={"fade"} />;
};

export default Loader;

const styles = StyleSheet.create({});
