export const wakeLockStore = { value: null };

export const aquireWakeLock = async () => {
  try {
    if (navigator?.wakeLock?.request) {
      const wakeLock = await navigator?.wakeLock?.request?.("screen");

      wakeLockStore.value = wakeLock;

      if (!window.wakeLockStore) {
        window.wakeLockStore = wakeLockStore;
      }
    }
  } catch (err) {
    // The Wake Lock request has failed
    // usually system related, such as battery.
  }
};

export const reaquireWakeLock = () => {
  if (wakeLockStore.value !== null && document.visibilityState === "visible") {
    aquireWakeLock();
  }
};

export const releaseWakeLock = async () => {
  if (wakeLockStore.value) {
    await wakeLockStore.value.release();

    wakeLockStore.value = null;
  }
};
