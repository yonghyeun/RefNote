import { useChromeSyncStorage } from "@/shared/store";

export const DarkModeToggle = () => {
  const isDarkMode = useChromeSyncStorage((state) => state.isDarkMode);

  const handleToggle = () => {
    const html = document.querySelector("html")!;
    html.setAttribute("data-theme", isDarkMode ? "light" : "dark");

    useChromeSyncStorage.dispatchAction({
      type: "set",
      setter: ({ isDarkMode }) => ({
        isDarkMode: !isDarkMode,
      }),
    });
  };

  return (
    <button onClick={handleToggle}>
      <img
        src={isDarkMode ? "/dark-mode.png" : "/light-mode.png"}
        className="w-6 h-6"
      />
    </button>
  );
};
