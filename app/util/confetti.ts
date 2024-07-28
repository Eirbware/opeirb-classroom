import JSConfetti from "js-confetti";
export default () => {
  const jsConfetti = new JSConfetti();
  const emojis = [
    "🔥",
    "⚡️",
    "💥",
    "✨",
    "💫",
    "🌸",
    "💦",
    "🚀",
    "🍆",
    "🍑",
    "💪",
    "🍺",
    "🌮",
    "🐈",
    "🍄",
    "🎱",
    "💘",
    "🎉",
    "💎",
    "👌",
    "🤙",
    "👍",
    "🤘",
    "👅",
    "🎈",
    "💵",
    "💸",
  ];
  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  return jsConfetti.addConfetti({
    emojis: [rand(emojis), rand(emojis)],
  });
};
