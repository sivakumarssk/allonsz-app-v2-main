import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

function CounTime({
  initialName,
  initialDays,
  initialHours,
  initialMinutes,
  initialSeconds,
}) {
  const calculateTargetDate = () => {
    const now = new Date();
    now.setDate(now.getDate() + initialDays);
    now.setHours(now.getHours() + initialHours);
    now.setMinutes(now.getMinutes() + initialMinutes);
    now.setSeconds(now.getSeconds() + initialSeconds);
    return now;
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(calculateTargetDate())
  );

  useEffect(() => {
    const targetDate = calculateTargetDate();
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialDays, initialHours, initialMinutes, initialSeconds]);

  function calculateTimeLeft(targetDate) {
    const difference = targetDate - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // Timer has expired
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  }

  return (
    <View className="flex flex-row justify-center items-center my-2">
      <Text
        className="font-montmedium font-normal text-bigText leading-[12px] tracking-normal"
        style={{ fontSize: RFValue(10) }}
      >
        <Text className="font-extrabold">
          {timeLeft.days}
          <Text className="text-primary"> days</Text>, {timeLeft.hours}:
          {timeLeft.minutes}:{timeLeft.seconds}{" "}
          <Text className="text-primary">hours</Text>
        </Text>{" "}
        left for {initialName}!
      </Text>
    </View>
  );
}

export default CounTime;

const styles = StyleSheet.create({});
