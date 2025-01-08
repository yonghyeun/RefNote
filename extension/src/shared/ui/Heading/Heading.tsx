import React from "react";

type HeadingSize = "h2";

type HeadingSizeRecord = Partial<Record<HeadingSize, boolean>>;

interface HeadingProps extends HeadingSizeRecord {
  children: React.ReactNode;
  className?: string;
}

const getStyleOfHeading = (size: HeadingSize) => {
  const sizeMap: Record<HeadingSize, string> = {
    h2: "text-base", // 실제 프로젝트에선 h2 태그만 사용 된다.
  };

  return sizeMap[size];
};

export const Heading = ({ children, className = "", ...tag }: HeadingProps) => {
  const headingTag = Object.keys(tag).find((key) =>
    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(key)
  ) as HeadingSize;

  return React.createElement(
    headingTag,
    { className: `${getStyleOfHeading(headingTag)} ${className}` },
    children
  );
};
