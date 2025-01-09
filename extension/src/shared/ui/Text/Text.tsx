import React from "react";

type TextTag = "p" | "span" | "em" | "strong" | "i";
type TextType = "default" | "secondary";
type TextTagRecord = Partial<Record<TextTag, boolean>>;

const getStyleOfText = (type: TextType) => {
  const styleMap: Record<TextType, string> = {
    default: "text-base",
    secondary: "text-text-secondary text-[0.8rem]",
  };

  return styleMap[type];
};

interface TextProps extends TextTagRecord {
  children: React.ReactNode;
  className?: string;
  type?: TextType;
}

export const Text = ({
  children,
  className = "",
  type = "default",
  ...tag
}: TextProps) => {
  const textTag = Object.keys(tag).find((key) =>
    ["p", "span", "em", "strong", "i"].includes(key)
  ) as TextTag;

  return React.createElement(
    textTag,
    { className: `${getStyleOfText(type)} ${className}` },
    children
  );
};
