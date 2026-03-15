import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
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
import { useToast } from "react-native-toast-notifications";
import {
  is5MemberCircle,
  getCircleStatus,
  isComboCircle,
} from "../../utils/CircleHelpers";

const SelectedCircles = ({ route }) => {
  const {
    memberDetails,
    circlesName,
    circleCode,
    packageId,
    circle: circleData,
    allComboCircles, // All combo circles from same package (for building color array)
  } = route.params;
  // console.log("memberDetails>>>", memberDetails);

  const navigation = useNavigation();
  const toast = useToast();
  const token = useSelector((state) => state.login.token);

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

  /**
   * Calculate the global color position for a combo circle member
   * 
   * @param section - The circle section: 'five_a' | 'five_b' | 'five_c' | 'twentyone'
   * @param memberPosition - The local member position (1-5 or 1-21)
   * @returns The global color position (1-36)
   */
  const getColorPositionForComboCircle = (section, memberPosition) => {
    if (!section) {
      // Not a combo circle, return position as-is
      return memberPosition;
    }

    switch (section) {
      case 'five_a':
        // five_a: positions 1-5 → color positions 1-5
        return memberPosition;
        
      case 'five_b':
        // five_b: positions 1-5 → color positions 6-10 (add 5)
        return memberPosition + 5;
        
      case 'five_c':
        // five_c: positions 1-5 → color positions 11-15 (add 10)
        return memberPosition + 10;
        
      case 'twentyone':
        // twentyone: positions 1-21 → color positions 16-36 (add 15)
        return memberPosition + 15;
        
      default:
        return memberPosition;
    }
  };

  /**
   * Get color for a combo circle member
   * For combo circles, calculates color based on global color position using package colors array
   * For regular circles, uses member.color from backend
   */
  /**
   * Build full 36-color array from all combo circles in the same package
   * NOTE: Backend now provides correct colors based on global positions, so this function
   * is mainly for fallback scenarios.
   * 
   * Color positions:
   * - five_a: positions 1-5 → global 1-5
   * - five_b: positions 1-5 → global 6-10
   * - five_c: positions 1-5 → global 11-15
   * - twentyone: positions 1-21 → global 16-36
   */
  const buildPackageColorArray = (allComboCircles, packageId) => {
    if (!allComboCircles || !Array.isArray(allComboCircles) || !packageId) {
      return null;
    }
    
    // Filter circles for the same package
    const packageCircles = allComboCircles.filter(c => c.package_id === packageId);
    if (packageCircles.length === 0) {
      return null;
    }
    
    // Build color array (36 positions: 1-36)
    const colorArray = new Array(36).fill(null);
    
    // Find all combo circles
    const twentyoneCircle = packageCircles.find(c => {
      const section = c.section || c.combo_section || null;
      return section === 'twentyone' || section === '21_member';
    });
    
    const fiveACircle = packageCircles.find(c => {
      const section = c.section || c.combo_section || null;
      return section === 'five_a' || section === '5_member_1';
    });
    
    const fiveBCircle = packageCircles.find(c => {
      const section = c.section || c.combo_section || null;
      return section === 'five_b' || section === '5_member_2';
    });
    
    const fiveCCircle = packageCircles.find(c => {
      const section = c.section || c.combo_section || null;
      return section === 'five_c' || section === '5_member_3';
    });
    
    // Step 1: Fill positions 1-5 from five_a circle
    if (fiveACircle && fiveACircle.members) {
      fiveACircle.members.forEach((member) => {
        const localPos = parseInt(member.position);
        if (localPos >= 1 && localPos <= 5 && member.color) {
          const globalPos = localPos; // five_a: local = global for 1-5
          const colorIndex = globalPos - 1;
          if (colorIndex >= 0 && colorIndex < 5) {
            colorArray[colorIndex] = member.color;
          }
        }
      });
    }

    // Step 2: Fill positions 6-10 from five_b circle
    if (fiveBCircle && fiveBCircle.members) {
      fiveBCircle.members.forEach((member) => {
        const localPos = parseInt(member.position);
        if (localPos >= 1 && localPos <= 5 && member.color) {
          const globalPos = localPos + 5; // five_b: local + 5 = global (6-10)
          const colorIndex = globalPos - 1; // 0-based: 5-9
          if (colorIndex >= 5 && colorIndex < 10) {
            colorArray[colorIndex] = member.color;
          }
        }
      });
    }
    
    // Step 3: Fill positions 11-15 from five_c circle
    if (fiveCCircle && fiveCCircle.members) {
      fiveCCircle.members.forEach((member) => {
        const localPos = parseInt(member.position);
        if (localPos >= 1 && localPos <= 5 && member.color) {
          const globalPos = localPos + 10; // five_c: local + 10 = global (11-15)
          const colorIndex = globalPos - 1; // 0-based: 10-14
          if (colorIndex >= 10 && colorIndex < 15) {
            colorArray[colorIndex] = member.color;
          }
        }
      });
    }
    
    // Step 4: Fill positions 16-36 from twentyone circle
    if (twentyoneCircle && twentyoneCircle.members) {
      twentyoneCircle.members.forEach((member) => {
        const localPos = parseInt(member.position);
        if (localPos >= 1 && localPos <= 21 && member.color) {
          const globalPos = localPos + 15; // twentyone: local + 15 = global (16-36)
          const colorIndex = globalPos - 1; // 0-based: 15-35
          if (colorIndex >= 15 && colorIndex < 36) {
            colorArray[colorIndex] = member.color;
          }
        }
      });
    }
    
    // Check if we have enough colors
    const filledCount = colorArray.filter(c => c !== null).length;
    
    if (filledCount >= 21) { // At least some colors filled
      console.log(`[Color Array] Built ${filledCount}/36 colors from ${packageCircles.length} combo circles`);
      console.log(`[Color Array] Positions 1-5: ${colorArray.slice(0, 5).map((c, i) => `${i+1}=${c || 'null'}`).join(', ')}`);
      console.log(`[Color Array] Positions 6-10: ${colorArray.slice(5, 10).map((c, i) => `${i+6}=${c || 'null'}`).join(', ')}`);
      console.log(`[Color Array] Positions 11-15: ${colorArray.slice(10, 15).map((c, i) => `${i+11}=${c || 'null'}`).join(', ')}`);
      console.log(`[Color Array] Positions 16-20: ${colorArray.slice(15, 20).map((c, i) => `${i+16}=${c || 'null'}`).join(', ')}`);
      return colorArray;
    }
    
    return null;
  };

  /**
   * Get color for a circle member
   * BACKEND IS NOW FIXED - it provides correct colors based on global positions
   * So we can use member.color directly for all circles (including combo circles)
   */
  const getMemberColor = (member, circleSection, packageColors = null, allMembers = null, builtColorArray = null) => {
    // Backend is now fixed - it provides correct colors based on global positions
    // So we can use member.color directly for all circles (including combo circles)
    
    if (member.color) {
      if (circleSection) {
        // Log for combo circles (for debugging) - backend now sends correct colors!
        const globalColorPosition = getColorPositionForComboCircle(circleSection, parseInt(member.position));
        console.log(`[Combo Circle] ✅ Using backend color (BACKEND FIXED). Section: ${circleSection}, Local: ${member.position} → Global: ${globalColorPosition} → Color: ${member.color}`);
      }
      return member.color;
    }
    
    // Fallback: Try package colors array if member.color is missing (now supports 36 positions)
    if (circleSection && packageColors && Array.isArray(packageColors) && packageColors.length >= 36) {
      const globalColorPosition = getColorPositionForComboCircle(circleSection, parseInt(member.position));
      const colorIndex = globalColorPosition - 1;
      
      if (colorIndex >= 0 && colorIndex < packageColors.length && packageColors[colorIndex]) {
        return packageColors[colorIndex];
      }
    }
    
    // Last fallback: default color
    return "#44699c";
  };

  useEffect(() => {
    try {
      setLoading(true);

      // Log member details to check if colors are coming from backend
      console.log("SelectedCircles - memberDetails:", memberDetails);
      console.log("SelectedCircles - First member:", memberDetails[0]);
      console.log("SelectedCircles - First member color:", memberDetails[0]?.color);
      console.log("SelectedCircles - Circle data:", circleData);

      // Get circle section if it's a combo circle
      const circleSection = circleData?.section || circleData?.combo_section || circleData?.combo_circle?.circle_type || null;
      
      // Normalize section name (convert '5_member_1' to 'five_a', etc.)
      let normalizedSection = circleSection;
      if (circleSection === '5_member_1') normalizedSection = 'five_a';
      else if (circleSection === '5_member_2') normalizedSection = 'five_b';
      else if (circleSection === '21_member') normalizedSection = 'twentyone';
      
      // Get package colors array (for combo packages, should have 36 colors)
      // Try multiple possible locations for colors array
      const packageColors = 
        circleData?.package?.colors || 
        circleData?.package?.color_positions || 
        circleData?.colors || 
        null;
      
      // Log package structure to debug
      console.log("SelectedCircles - Circle data package:", circleData?.package);
      console.log("SelectedCircles - Package colors found:", packageColors ? `${packageColors.length} colors` : "NOT FOUND");
      console.log("SelectedCircles - Normalized section:", normalizedSection);
      
      // Backend is now fixed - it provides correct colors based on global positions (1-36)
      // So we don't need to build a color array workaround anymore
      // We can use member.color directly from the backend
      const builtColorArray = null; // Not needed anymore - backend is fixed
      
      if (circle_Length === 21) {
        // outterPices = 16;
        // innerPices = 4;
        // degree = 90;

        setOutterPices(16);
        setInnerPices(4);
        setDegree(180);

        // Pass circle section, package colors, all members, and built color array for combo circles
        generateCircleData21(memberDetails, normalizedSection, packageColors, memberDetails, builtColorArray);
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
      } else if (
        circle_Length === 5 &&
        circleData &&
        (is5MemberCircle(circleData) ||
          (isComboCircle(circleData) &&
            (circleData.section === "five_a" ||
              circleData.section === "five_b" ||
              circleData.section === "five_c" ||
              circleData.combo_section === "5_member_1" ||
              circleData.combo_section === "5_member_2" ||
              circleData.combo_section === "5_member_3" ||
              circleData.combo_circle?.circle_type === "5_member_1" ||
              circleData.combo_circle?.circle_type === "5_member_2" ||
              circleData.combo_circle?.circle_type === "5_member_3")))
      ) {
        // Handle 5-member circle (both regular and combo)
        setOutterPices(4);
        setInnerPices(0);
        setDegree(180);
        // Pass circle section, package colors, all members, and built color array for combo circles
        generateCircleData5(memberDetails, normalizedSection, packageColors, memberDetails, builtColorArray);
      } else {
        setOutterPices(16);
        setInnerPices(4);
        setDegree(180);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCircleData21 = (data, circleSection = null, packageColors = null, allMembers = null, builtColorArray = null) => {
    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastcolor = null;

    console.log("generateCircleData21 - Member data:", data);
    console.log("generateCircleData21 - First member color:", data[0]?.color);
    console.log("generateCircleData21 - Circle section:", circleSection);
    console.log("generateCircleData21 - Package colors available:", packageColors ? `${packageColors.length} colors` : "None");

    data.forEach((member) => {
      const position = parseInt(member.position);
      // Get color - use helper function for combo circles to ensure correct mapping
      const colorCode = getMemberColor(member, circleSection, packageColors, allMembers, builtColorArray);
      
      // Log color position calculation for combo circles
      if (circleSection) {
        const globalColorPosition = getColorPositionForComboCircle(circleSection, position);
        console.log(`Local position ${position} (section: ${circleSection}) → Global color position ${globalColorPosition}, Color: ${colorCode}`);
      } else {
        console.log(`Position ${position} - Color from backend:`, member.color, "Using:", colorCode);
      }
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

    console.log("generateCircleData13 - Member data:", data);
    console.log("generateCircleData13 - First member color:", data[0]?.color);

    data.forEach((member) => {
      const position = parseInt(member.position);
      // Use color from backend, fallback to default if not provided
      const colorCode = member.color || "#44699c";
      
      console.log(`Position ${position} - Color from backend:`, member.color, "Using:", colorCode);
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

  const generateCircleData5 = (data, circleSection = null, packageColors = null, allMembers = null, builtColorArray = null) => {
    const newOuterData = [];
    let newLastPosition = null;
    let newLastcolor = null;

    console.log("generateCircleData5 - Member data:", data);
    console.log("generateCircleData5 - First member color:", data[0]?.color);
    console.log("generateCircleData5 - Circle section:", circleSection);
    console.log("generateCircleData5 - Package colors available:", packageColors ? `${packageColors.length} colors` : "None");

    data.forEach((member) => {
      const position = parseInt(member.position);
      // Get color - use helper function for combo circles to ensure correct mapping
      const colorCode = getMemberColor(member, circleSection, packageColors, allMembers, builtColorArray);
      
      // Log color position calculation for combo circles
      if (circleSection) {
        const globalColorPosition = getColorPositionForComboCircle(circleSection, position);
        console.log(`Local position ${position} (section: ${circleSection}) → Global color position ${globalColorPosition}, Color: ${colorCode}`);
      } else {
        console.log(`Position ${position} - Color from backend:`, member.color, "Using:", colorCode);
      }
      
      const user = member?.user?.username
        ? member?.user?.username.length > 8
          ? member?.user?.username.slice(0, 8).toLowerCase() + ".."
          : member?.user?.username.toLowerCase()
        : "";

      if ([1, 2, 3, 4].includes(position)) {
        // Positions 1-4 are outer (direct referrals)
        newOuterData.push({ position, user, color: colorCode, member });
      } else if (position === 5) {
        // Position 5 is center (circle owner)
        newLastPosition = member.user;
        newLastcolor = colorCode || "#FF9800";
      }
    });

    setOuterData(newOuterData);
    setInnerData([]); // No inner circle for 5-member
    setLastPosition(newLastPosition);
    setLastPosColor(newLastcolor);
  };


  const generateCircleData7 = (data) => {
    console.log("generateCircleData7 - Member data:", data);
    console.log("generateCircleData7 - First member color:", data[0]?.color);

    const newOuterData = [];
    const newInnerData = [];
    let newLastPosition = null;
    let newLastcolor = null;

    data.forEach((member) => {
      const position = parseInt(member.position);
      // Use color from backend, fallback to default if not provided
      const colorCode = member.color || "#44699c";
      
      console.log(`Position ${position} - Color from backend:`, member.color, "Using:", colorCode);
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

      <ScrollView style={{ flex: 1 }}>
        {/* 5-Member Circle Completion Message */}
        {circleData &&
          is5MemberCircle(circleData) &&
          getCircleStatus(circleData).status === "completed" && (
            <View className="bg-[#FF9800] p-4 mx-4 mt-4 rounded-lg border-2 border-[#F57C00]">
              <Text className="text-white font-montmedium font-bold text-[16px] text-center mb-3">
                {getCircleStatus(circleData).message}
              </Text>
              <TouchableOpacity
                className="bg-white py-2 px-4 rounded self-center"
                onPress={() => navigation.navigate("Packages")}
              >
                <Text className="text-[#FF9800] font-montmedium font-bold text-[14px]">
                  Upgrade Package
                </Text>
              </TouchableOpacity>
            </View>
          )}

        {/* 5-Member Circle Progress */}
        {circleData &&
          is5MemberCircle(circleData) &&
          getCircleStatus(circleData).status === "active" && (
            <View className="bg-white p-4 mx-4 mt-4 rounded-lg shadow">
              <Text className="font-montmedium font-semibold text-[16px] text-center mb-2 text-bigText">
                Progress: {getCircleStatus(circleData).progress} positions filled
              </Text>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <View
                  className="h-full bg-[#4CAF50] rounded-full"
                  style={{
                    width: `${
                      (getCircleStatus(circleData).filledCount / 5) * 100
                    }%`,
                  }}
                />
              </View>
              <Text className="text-center text-[14px] text-smallText">
                {getCircleStatus(circleData).remaining} position(s) remaining
              </Text>
            </View>
          )}

        <View
          className="justify-center items-center w-[100%] mx-auto"
          style={{ minHeight: 400 }}
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

      </ScrollView>

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
