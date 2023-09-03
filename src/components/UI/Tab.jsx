import { useEffect, useState } from "react";

const Tab = ({ name, value, id, tabClicked, activeTab }) => {
  const [isSelected, setIsSelected] = useState(activeTab === id);

  const handleClick = () => {
    tabClicked(id);
  };

  useEffect(() => {
    setIsSelected(activeTab === id);
  }, [activeTab, id]);

  return (
    <li
      className={`text-white ${isSelected ? "bg-pink-600" : "bg-pink-400"}`}
      key={value}
      onClick={handleClick}
    >
      {name}
    </li>
  );
};

const Tabs = ({ options, onChangeCb, defaultSelected }) => {
  const [activeTab, setActiveTab] = useState(defaultSelected);

  const tabSelected = (selectedTabId) => {
    setActiveTab(selectedTabId);
    onChangeCb(selectedTabId);
  };

  return (
    <div>
      <ul>
        {options.map((option) => (
          <Tab
            key={option.id}
            id={option.id}
            name={option.name}
            tabClicked={tabSelected}
            activeTab={activeTab}
          >
            {option.name}
          </Tab>
        ))}
      </ul>
      <div>{options.find((option) => option.id === activeTab)?.children}</div>
    </div>
  );
};

export default Tabs;
