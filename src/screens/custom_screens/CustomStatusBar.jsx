import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";

function CustomStatusBar(props) {
  const isFocused = useIsFocused();
  // console.log(isFocused);
  return isFocused ? <StatusBar {...props} /> : null;
}

export default CustomStatusBar;

const styles = StyleSheet.create({});

// FocusAwareStatusBar
// npx expo install react-native-safe-area-context

// https://reactnavigation.org/docs/status-bar

// import { useIsFocused } from '@react-navigation/native';
// const isFocused = useIsFocused();

// render this in pages only

// in page.js

// const insets = useSafeAreaInsets();

{
  /* <View
style={[
  styles.container,
  {
    backgroundColor: '#ecf0f1',
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  },
]}
> */
}

{
  /* <CustomStatusBar barStyle="dark-content" backgroundColor="#ecf0f1" /> */
}

{
  /* </View> */
}
