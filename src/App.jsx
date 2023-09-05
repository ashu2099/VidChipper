import VidChipper from "./components/VidChipper/VidChipper";

function App() {
  return (
    <div
      id="vidChipperContainer"
      className="flex flex-1 flex-col w-full h-full text-white p-4"
    >
      <div className="text-5xl font-[400] mb-4">Welcome to VidChipper!</div>

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

      {/* <div className="text-center mt-1">
        <span>With inspiration from&nbsp;</span>
        <a href="https://github.com/jeromewu" className="hover:underline">
          @jeromewu
        </a>
        <span>, Author of ffmpeg.wasm</span>
      </div> */}
    </div>
  );
}

export default App;
