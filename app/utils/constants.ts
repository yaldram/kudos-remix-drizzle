export const textColorMap = {
  black: "text-black",
  white: "text-white",
};

export const backgroundColorMap = {
  red: "bg-red-400",
  green: "bg-green-400",
  blue: "bg-blue-400",
  white: "bg-white",
  yellow: "bg-yellow-300",
};

export const emojiMap = {
  thumbsup: "👍",
  party: "🎉",
  handsup: "🙌🏻",
};

export const bgColorEnum = ["red", "green", "blue", "white", "yellow"] as const;
export const textColorEnum = ["white", "black"] as const;
export const emojiEnum = ["thumbsup", "party", "handsup"] as const;

export type KudoStyle = {
  backgroundColor: keyof typeof backgroundColorMap;
  textColor: keyof typeof textColorMap;
  emoji: keyof typeof emojiMap;
};
