export const Popup = () => {
  const handleOpenSidePanel = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) {
      return;
    }

    chrome.runtime.sendMessage(
      { message: "openSidePanel", tabId: tab.id },
      (response) => {
        console.log(response);
      }
    );
  };

  return (
    <div>
      <h1>Popup</h1>
      <p>Popup page content</p>
      <button onClick={handleOpenSidePanel}>Open Side Panel</button>
    </div>
  );
};
