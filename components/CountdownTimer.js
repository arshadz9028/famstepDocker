import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime, timeLeft }) => {
  // const calculateTimeLeft = () => {
  //   const now = new Date()
  //   const start = new Date(startTime);
  //   const end = new Date(endTime);
  //   const difference = end - now;


  //   let timeLeft = {};

  //   if (difference > 0) {
  //     timeLeft = {
  //       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  //       minutes: Math.floor((difference / 1000 / 60) % 60),
  //       seconds: Math.floor((difference / 1000) % 60),
  //     };
  //   } else {
  //     timeLeft = {
  //       hours: 0,
  //       minutes: 0,
  //       seconds: 0,
  //     };
  //   }

  //   return timeLeft;
  // };

  // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [startTime, endTime]);

  return (
    <>
      <>{String(timeLeft?.hours).padStart(2, '0')}:</>
      <>{String(timeLeft?.minutes).padStart(2, '0')}:</>
      <>{String(timeLeft?.seconds).padStart(2, '0')}</>
    </>
  );
};

export default CountdownTimer;
