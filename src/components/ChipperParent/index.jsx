import Tabs from "../UI/Tab";
import VidChipper from "../VidChipper/VidChipper";

const vidChipperVariants = [
  {
    name: "Clip/trim A Video",
    id: "tab-1",
    children: <VidChipper variant="singlePart" />,
  },
  {
    name: "Split A Video into equal intervals",
    id: "tab-2",
    children: <VidChipper variant="equalSegment" />,
  },
  {
    name: "Convert a Video to other Format",
    id: "tab-3",
    children: <VidChipper variant="formatConverter" />,
  },
];

export default () => {
  const handleChange = (value) => {
    console.log("Selected tab:", value);
  };

  return (
    <div>
      <Tabs
        options={vidChipperVariants}
        onChangeCb={handleChange}
        defaultSelected="tab-1"
      />
    </div>
  );
};
