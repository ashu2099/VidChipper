const commonStore = {};

export const getFromCommonStore = (key) => commonStore[key];

export const setInCommonStore = (key, value) => {
  commonStore[key] = value;

  if (!window.commonStore) {
    window.commonStore = commonStore;
  }
};

export const getNewProcessId = () => {
  const newProcessId = new Date().getTime();

  setInCommonStore("currentProcessId", newProcessId);

  return newProcessId;
};

export const triggerDownloadDialogue = (downloadUrl, fileName) => {
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  document.body.appendChild(anchor);

  anchor.href = downloadUrl;
  anchor.setAttribute("download", fileName);

  anchor.click();

  document.body.removeChild(anchor);
};
