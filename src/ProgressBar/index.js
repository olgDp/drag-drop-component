import React from "react";

const RoundProgressBar = (props) => {
  const size = props.size;
  const radius = (props.size - props.strokeWidth) / 2;
  const viewBox = `0 0 ${size} ${size}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * props.value) / props.max;

  return (
    <svg width={props.size} height={props.size} viewBox={viewBox}>
      <circle
        fill={"none"}
        stroke={"#D1E3F8"}
        cx={props.size / 2}
        cy={props.size / 2}
        r={radius}
        strokeWidth={`${props.strokeWidth}px`}
      />
      <circle
        fill={"none"}
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        cx={props.size / 2}
        cy={props.size / 2}
        r={radius}
        strokeWidth={`${props.strokeWidth}px`}
        transform={`rotate(-90 ${props.size / 2} ${props.size / 2})`}
      />
    </svg>
  );
};

RoundProgressBar.defaultProps = {
  size: 101,
  value: 0,
  max: 100,
  strokeWidth: 1,
  stroke: "#4991E5",
};

export default RoundProgressBar;
