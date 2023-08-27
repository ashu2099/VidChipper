const eventStore = {};

export const pubSubEvents = {
  ffMpegLoaded: "ffMpegLoaded",
  videoFileUploaded: "videoFileUploaded",
};

export const pubSub = {
  subscribe: (event, callback) => {
    if (!eventStore[event]) {
      eventStore[event] = [];
    }
    eventStore[event].push(callback);
  },

  publish: (event, data) => {
    if (!eventStore[event]) {
      return;
    }
    eventStore[event].forEach((callback) => callback(data));
  },

  unsubscribe: (event, callback) => {
    if (!eventStore[event]) {
      return;
    }
    eventStore[event] = eventStore[event].filter((cb) => cb !== callback);
  },
};
