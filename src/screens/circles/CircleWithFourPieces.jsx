import React from "react";
import { View, Text, Pressable } from "react-native";
import Svg, { Path, Text as SvgText, G, TSpan } from "react-native-svg";

export default function CircleWithFourPieces({
  InnerData,
  centerLabel,
  OuterData,
  innerPices,
  outterPices,
  degree,
  setOtherData,
  // setOpenData,
  lastPosColor,
}) {
  const radiusInner = 170; //190 Radius of the inner circle 110
  const radiusOuter = 170; //185 Radius of the outer circle
  const center = radiusOuter + 10; // Center of the SVG canvas
  const labelOffsetInner = 53; // Offset for inner circle labels
  const labelOffsetOuter = 36; //36 Offset for outer circle labels

  // console.log("InnerData", InnerData);

  return (
    <View className="relative w-[355px] bg-y ellow-300">
      {/* Center Label  //392 */}

      <View
        className={`absolute top-[36.5%] left-[36.5%]  transform -translate-x-1/2 -translate-y-1/2 border-white border-[4px] w-[100px] h-[100px] rounded-full flex items-center justify-center z-30`}
        style={{ backgroundColor: lastPosColor }}
      >
        <Text className="text-sm text-center text-[#fff] lowercase font-montmedium font-semibold text-[16px]">
          {centerLabel}
        </Text>
      </View>

      {/* Inner Circle with 4 Pieces */}

      <Svg
        width={center + 44} //+44
        height={center + 44}
        viewBox={`0 0 ${center * 2} ${center * 2}`} // This ensures the SVG fits within the defined circle
        preserveAspectRatio="xMidYMid meet"
        className="absolute top-[18.8%] left-[19.1%]  transform -translate-x-1/2 -translate-y-1/2 z-20 w-fit rounded-full overflow-hidden bg -red-100"
      >
        {InnerData.map((segment, index) => {
          {
            /* console.log("segment", segment); */
          }
          const startAngle =
            ((index * 360) / innerPices - degree) * (Math.PI / 180); // Start angle (in radians)
          const endAngle =
            (((index + 1) * 360) / innerPices - degree) * (Math.PI / 180); // End angle (in radians)
          const midAngle = (startAngle + endAngle) / 2; // Midpoint angle for the label

          const x1 = center + radiusInner * Math.cos(startAngle);
          const y1 = center + radiusInner * Math.sin(startAngle);
          const x2 = center + radiusInner * Math.cos(endAngle);
          const y2 = center + radiusInner * Math.sin(endAngle);

          const labelX =
            center + (radiusInner - labelOffsetInner) * Math.cos(midAngle);
          const labelY =
            center + (radiusInner - labelOffsetInner) * Math.sin(midAngle);

          const rotationAngle = (midAngle * 180) / Math.PI;

          return (
            <G key={`inner-${index}`}>
              <Path
                d={`M${center},${center} L${x1},${y1} A${radiusInner},${radiusInner} 0 0,1 ${x2},${y2} Z`}
                fill={segment.color}
                stroke="white"
                strokeWidth={7}
                onPress={() => {
                  // console.log("Path clicked:", segment);
                  setOtherData(segment.member);
                  // setOpenData(true);
                }}
              />
              <SvgText
                x={labelX}
                y={labelY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={25}
                fontWeight={500}
                fill="white"
                // transform={`rotate(${rotationAngle}, ${labelX}, ${labelY})`}
              >
                {segment.user}

                {/* {segment.userCode && (
                  <TSpan x={labelX - 2} dy="1.2em" fontSize="8.5" fill="black">
                    {segment.userCode}
                  </TSpan>
                )} */}
              </SvgText>
            </G>
          );
        })}
      </Svg>

      {/* Outer Circle with 16 Pieces */}
      <Svg width={center * 2} height={center * 2} className="z-10">
        {OuterData.map((segment, index) => {
          {
            /* console.log("outer segement", index, segment); */
          }
          const startAngle =
            ((index * 360) / outterPices - degree) * (Math.PI / 180); // Start angle (in radians)
          const endAngle =
            (((index + 1) * 360) / outterPices - degree) * (Math.PI / 180); // End angle (in radians)

          const midAngle = (startAngle + endAngle) / 2; // Midpoint angle for the label

          const x1 = center + radiusOuter * Math.cos(startAngle);
          const y1 = center + radiusOuter * Math.sin(startAngle);
          const x2 = center + radiusOuter * Math.cos(endAngle);
          const y2 = center + radiusOuter * Math.sin(endAngle);

          const labelX =
            center + (radiusOuter - labelOffsetOuter) * Math.cos(midAngle);
          const labelY =
            center + (radiusOuter - labelOffsetOuter) * Math.sin(midAngle);

          const rotationAngle = (midAngle * 180) / Math.PI;

          return (
            <G key={`outer-${index}`}>
              <Path
                d={`M${center},${center} L${x1},${y1} A${radiusOuter},${radiusOuter} 0 0,1 ${x2},${y2} Z`}
                fill={segment.color}
                stroke="white"
                strokeWidth={5}
                onPress={() => {
                  // console.log(`Outer Circle Path clicked: ${segment.user}`);
                  setOtherData(segment.member);
                  // setOpenData(true);
                }}
              />
              <SvgText
                x={labelX}
                y={labelY}
                textAnchor="middle"
                alignmentBaseline="middle"
                fontSize={15}
                fontWeight={400}
                fill="white"
                // transform={`rotate(${rotationAngle}, ${labelX}, ${labelY})`}
              >
                {segment.user}

                {/* <TSpan x={labelX} dy="0">
                  {segment.user}
                </TSpan> */}
                {/* {segment.userCode && (
                  <TSpan x={labelX - 2} dy="1.2em" fontSize="8.5" fill="black">
                    {segment.userCode}
                  </TSpan>
                )} */}
                {/* {segment.userCode ? segment.userCode : ""} */}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
