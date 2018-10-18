import data from "./mock-facilities";

const axios = {
  get: async endpoint => {
    switch (endpoint) {
      case "FACILITIES":
        return new Promise((res, rej) => {
          setTimeout(() => {
            res(data);
          }, 2000);
        });

      default:
        break;
    }
  }
};

export default axios;
