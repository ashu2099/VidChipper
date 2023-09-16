import VidChipper from "./components/VidChipper/VidChipper";

function App() {
  return (
    <div
      id="vidChipperContainer"
      className="flex flex-1 flex-col w-full h-full text-white p-4"
    >
      <div className="flex flex-col sm:flex-row items-center mb-5">
        <img className="flex w-32 mb-2" src="./VidChipperLogo2.png" alt="" />

        <div className="text-5xl font-[400] text-center sm:text-left">
          <span className="hidden sm:inline-flex">Welcome to&nbsp;</span>
          <span>VidChipper!</span>
        </div>
      </div>

      <div className="text-3xl font-[300] mb-4">
        Clip, Convert, or Split your video into equal length parts, right in
        your browser, for free!
      </div>

      <div className="">VidChipper was built of top of ffmpeg.wasm</div>

      <VidChipper />

      <div className="flex justify-center mt-12">
        <span>Made with</span>

        <div className="flex mx-1 items-center w-4">
          <img src="./heart.png" alt="" className="flex w-full" />
        </div>

        <span>by&nbsp;</span>

        <a href="https://ashu2099.github.io" className="hover:underline">
          Ashutosh Dwivedi
        </a>
      </div>
    </div>
  );
}

export default App;
