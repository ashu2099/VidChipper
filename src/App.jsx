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
    </div>
  );
}

export default App;
