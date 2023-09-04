// eslint-disable-next-line no-undef
// const IS_DEV = process.argv.includes("IS_DEV");

import headlessUI from "@headlessui/tailwindcss";

const tailwindConfig = {
  content: ["./index.html", "./src/**/*.jsx"],
  theme: {
    extend: {
      colors: {
        linkedin: "#0077b5",
        githubbg: "#ffcd94",
        behance: "#0057ff",
      },
    },
  },
  plugins: [headlessUI],
};

// if (IS_DEV) {
//   tailwindConfig.safelist = [
//     {
//       pattern: /^[^/]*$/,
//     },
//   ];
// }

export default tailwindConfig;
