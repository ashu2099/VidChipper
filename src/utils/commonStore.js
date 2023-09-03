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
