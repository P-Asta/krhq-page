import React, { useState, useMemo } from "react";
import tw from "tailwind-styled-components";
import { ChevronDown, Menu, X, Filter } from "lucide-react";
import { useEffect } from "react";

const Lb = () => {
  const [selectedPlayers, setSelectedPlayers] = useState("0 Player");
  const [selectedVersion, setSelectedVersion] = useState("v0");
  const [selectedMoon, setSelectedMoon] = useState("moon");
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [showMoonDropdown, setShowMoonDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("HQ");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetch("https://f.asta.rs/krhq/hqhq.json")
      .then((res) => res.text())
      .then((data) => setLeaderboardData(eval(data)))
      .catch((err) => {
        setLeaderboardData([]);
        console.error("Failed to fetch leaderboard data:", err);
      });
  }, []);

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    return leaderboardData.filter((entry) => {
      // 탭 필터링
      if (entry.category !== activeTab) return false;

      // 플레이어 수 필터링 (0 Player는 필터 적용 안함)
      if (selectedPlayers !== "0 Player") {
        const playerCount = parseInt(selectedPlayers.split(" ")[0]);
        if (entry.players.length !== playerCount) return false;
      }

      // 버전 필터링 (v0는 필터 적용 안함)
      if (selectedVersion !== "v0") {
        if (entry.version !== selectedVersion) return false;
      }

      // 맵/문 필터링 (moon은 필터 적용 안함, SDC와 SMHQ 탭에서만 적용)
      if (
        (activeTab === "SDC" || activeTab === "SMHQ") &&
        selectedMoon !== "moon"
      ) {
        if (entry.moon !== selectedMoon) return false;
      }

      return true;
    });
  }, [
    leaderboardData,
    activeTab,
    selectedPlayers,
    selectedVersion,
    selectedMoon,
  ]);

  const handleVideoClick = (videoLinks, playerIndex) => {
    if (
      videoLinks &&
      videoLinks[playerIndex] &&
      videoLinks[playerIndex].length > 0
    ) {
      // 첫 번째 비디오 링크를 새 탭에서 열기
      window.open(videoLinks[playerIndex][0], "_blank");
    }
  };

  const PlayerList = ({ players, videoLinks, isLarge = false }) => (
    <div
      className={`flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm ${
        isLarge ? "sm:text-base" : ""
      }`}
      style={{ color: "#777777" }}
    >
      {players.map((player, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <span className="break-all">{player}</span>
          {videoLinks[idx].map((videoLink, videoIdx) => (
            <a
              key={videoIdx}
              href={videoLink}
              target="_blank"
              className="text-[#FF3E3E] hover:text-[#FF6666] transition-colors cursor-pointer ml-1 underline"
              style={{ fontSize: isLarge ? "14px" : "12px" }}
            >
              ^
            </a>
          ))}
        </span>
      ))}
    </div>
  );

  const Dropdown = ({ value, options, isOpen, setIsOpen, onChange }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2D2C30] text-[#FFFFFF] px-2 sm:px-3 py-1.5 rounded flex items-center justify-between text-xs sm:text-sm min-w-[70px] sm:min-w-[80px] border-none"
        style={{ backgroundColor: "#2D2C30" }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`w-3 h-3 ml-1 sm:ml-2 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#2D2C30] rounded shadow-lg z-20 min-w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-2 sm:px-3 py-2 text-[#FFFFFF] hover:bg-[#302F33] text-xs sm:text-sm first:rounded-t last:rounded-b"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen pt-30"
      style={{ backgroundColor: "#19181B", color: "#FFFFFF" }}
    >
      {/* Header */}

      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Tabs and Filters */}
        <div>
          {/* Tabs and Filter Button Container */}
          <div className="flex justify-between items-center mb-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-1">
              {["HQ", "SDC", "SMHQ"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors rounded ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab ? "#FF3E3E" : "#302F33",
                  }}
                >
                  <span className="hidden sm:inline">
                    {tab
                      .replace("SMHQ", "Single Moons High Quota")
                      .replace("HQ", "Classic High Quota")
                      .replace("SDC", "Single Day Clear")}
                  </span>
                  <span className="sm:hidden">{tab}</span>
                </button>
              ))}
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm mr-2" style={{ color: "#777777" }}>
                filter
              </span>
              <Dropdown
                value={selectedPlayers}
                options={[
                  "0 Player",
                  "1 Player",
                  "2 Player",
                  "3 Player",
                  "4 Player",
                ]}
                isOpen={showPlayerDropdown}
                setIsOpen={setShowPlayerDropdown}
                onChange={setSelectedPlayers}
              />
              <Dropdown
                value={selectedVersion}
                options={["v0", "v69", "v68", "v67", "v66", "v56"]}
                isOpen={showVersionDropdown}
                setIsOpen={setShowVersionDropdown}
                onChange={setSelectedVersion}
              />
              {(activeTab === "SMHQ" || activeTab === "SDC") && (
                <Dropdown
                  value={selectedMoon}
                  options={[
                    "moon",
                    "Experimentation",
                    "Assurance",
                    "Vow",
                    "Offense",
                    "March",
                    "Adamance",
                    "Rend",
                    "Dine",
                    "Titan",
                    "Artifice",
                    "Embrion",
                  ]}
                  isOpen={showMoonDropdown}
                  setIsOpen={setShowMoonDropdown}
                  onChange={setSelectedMoon}
                />
              )}
            </div>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded text-xs bg-[#302F33] text-white"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          {mobileFilterOpen && (
            <div className="md:hidden mb-4 p-4 rounded-lg bg-[#262428]">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  Filters
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: "#777777" }}
                  >
                    Players
                  </label>
                  <Dropdown
                    value={selectedPlayers}
                    options={[
                      "0 Player",
                      "1 Player",
                      "2 Player",
                      "3 Player",
                      "4 Player",
                    ]}
                    isOpen={showPlayerDropdown}
                    setIsOpen={setShowPlayerDropdown}
                    onChange={setSelectedPlayers}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: "#777777" }}
                  >
                    Version
                  </label>
                  <Dropdown
                    value={selectedVersion}
                    options={["v0", "v69", "v68", "v67", "v66", "v56"]}
                    isOpen={showVersionDropdown}
                    setIsOpen={setShowVersionDropdown}
                    onChange={setSelectedVersion}
                  />
                </div>
                {(activeTab === "SMHQ" || activeTab === "SDC") && (
                  <div>
                    <label
                      className="block text-xs mb-1"
                      style={{ color: "#777777" }}
                    >
                      Moon
                    </label>
                    <Dropdown
                      value={selectedMoon}
                      options={[
                        "moon",
                        "Experimentation",
                        "Assurance",
                        "Vow",
                        "Offense",
                        "March",
                        "Adamance",
                        "Rend",
                        "Dine",
                        "Titan",
                        "Artifice",
                        "Embrion",
                      ]}
                      isOpen={showMoonDropdown}
                      setIsOpen={setShowMoonDropdown}
                      onChange={setSelectedMoon}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {filteredData.length > 0 ? (
          <>
            {/* Top Record */}
            <div
              className="rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
              style={{ backgroundColor: "#262428" }}
            >
              {/* #1 Section */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div
                  className="text-2xl sm:text-4xl font-bold flex-shrink-0"
                  style={{ color: "#FFDF3E" }}
                >
                  #1
                </div>
                <PlayerList
                  players={filteredData[0].players}
                  videoLinks={filteredData[0].videoLinks}
                  isLarge={true}
                />
              </div>

              {/* Quota Amount */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-xl sm:text-4xl mb-3 sm:mb-6 font-black bg-gradient-to-r from-[#FF3E3E] via-[#FF3E3E] to-[#FFDF3E] bg-clip-text text-transparent break-words">
                  Quota Amount:&nbsp;
                  {filteredData[0].maxQuota.toLocaleString()}
                  {filteredData[0].maxQuota != filteredData[0].fillQuota && (
                    <>
                      &nbsp;/&nbsp;
                      {filteredData[0].fillQuota.toLocaleString()}
                    </>
                  )}
                  <span className="text-lg sm:text-2xl text-gray-500 ml-1 sm:ml-2">
                    q{filteredData[0].q.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <BigTag>{filteredData[0].category}</BigTag>
                  <BigTag>{filteredData[0].version}</BigTag>
                  {filteredData[0].moon && (
                    <BigTag>{filteredData[0].moon}</BigTag>
                  )}
                </div>
              </div>
            </div>

            {/* Other Records */}
            <div className="space-y-1 sm:space-y-2">
              {filteredData.slice(1).map((entry, index) => (
                <div
                  key={index}
                  className="rounded-lg px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                  style={{ backgroundColor: "#262428" }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className="text-[#FFFFFF] w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center font-bold text-xs sm:text-sm mt-0.5 flex-shrink-0"
                      style={{ backgroundColor: "#FF3E3E" }}
                    >
                      {index + 2}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-base sm:text-lg font-medium mb-1 sm:mb-0"
                        style={{ color: "#FFFFFF" }}
                      >
                        {entry.fillQuota.toLocaleString()}
                        {filteredData[0].maxQuota !=
                          filteredData[0].fillQuota && (
                          <>/ {entry.maxQuota.toLocaleString()} </>
                        )}
                        <span className="text-gray-500">
                          q{entry.q.toLocaleString()}
                        </span>
                      </div>
                      <PlayerList
                        players={entry.players}
                        videoLinks={entry.videoLinks}
                      />
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm"
                    style={{ color: "#FFFFFF" }}
                  >
                    <Tag>{entry.category}</Tag>
                    <Tag>{entry.version}</Tag>
                    {entry.moon && <Tag>{entry.moon}</Tag>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            className="rounded-lg p-6 sm:p-8 text-center"
            style={{ backgroundColor: "#262428" }}
          >
            <div className="text-lg sm:text-xl text-gray-500">
              아직 기록이 없어요.. 한번 도전해보세요!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Tag = tw.div`
  px-2 py-1 rounded text-xs sm:text-sm
  bg-[#302F33] text-[#FFFFFF]
`;

const BigTag = tw(Tag)`
  px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm
`;

export default Lb;
