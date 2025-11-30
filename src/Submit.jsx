import React, { useState, useRef } from "react";
import {
  ChevronDown,
  Upload,
  X,
  Plus,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";

const Submit = () => {
  // Form state
  const [formData, setFormData] = useState({
    discordJoined: "",
    discordHandle: "",
    teamMembers: ["", "", "", ""],
    category: "",
    moon: "",
    version: "v73", // 기본값을 v73로 설정
    singleDayEarnings: "",
    quotaAchieved: "",
    quotaReached: "",
    quotaFilled: "",
    videoLinks: [[""]],
    vlogFiles: [[]], // 플레이어당 여러 파일을 위한 2차원 배열
  });

  const [dropdowns, setDropdowns] = useState({
    discordJoined: false,
    category: false,
    moon: false,
    version: false, // version 드롭다운 상태 추가
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  // Refs for focusing on error fields
  const fieldRefs = useRef({});

  const categoryOptions = [
    { value: "high_quota", label: "High Quota" },
    { value: "single_day_clear", label: "Single Day Clear" },
    { value: "single_moon_hq", label: "Single Moon HQ" },
  ];

  const moonOptions = [
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
  ];

  // 버전 옵션 추가
  const versionOptions = [
    "v40",
    "v45",
    "v49",
    "v50",
    "v56",
    "v62",
    "v64",
    "v69",
    "v72",
    "v73",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTeamMemberChange = (index, value) => {
    const newTeamMembers = [...formData.teamMembers];
    newTeamMembers[index] = value;
    setFormData((prev) => ({
      ...prev,
      teamMembers: newTeamMembers,
    }));
  };

  const handleVideoLinkChange = (playerIndex, linkIndex, value) => {
    const newVideoLinks = [...formData.videoLinks];
    while (newVideoLinks.length <= playerIndex) {
      newVideoLinks.push([""]);
    }
    while (newVideoLinks[playerIndex].length <= linkIndex) {
      newVideoLinks[playerIndex].push("");
    }
    newVideoLinks[playerIndex][linkIndex] = value;
    setFormData((prev) => ({
      ...prev,
      videoLinks: newVideoLinks,
    }));
  };

  const addVideoLink = (playerIndex) => {
    const newVideoLinks = [...formData.videoLinks];
    while (newVideoLinks.length <= playerIndex) {
      newVideoLinks.push([""]);
    }
    newVideoLinks[playerIndex].push("");
    setFormData((prev) => ({
      ...prev,
      videoLinks: newVideoLinks,
    }));
  };

  const removeVideoLink = (playerIndex, linkIndex) => {
    const newVideoLinks = [...formData.videoLinks];
    newVideoLinks[playerIndex].splice(linkIndex, 1);
    if (newVideoLinks[playerIndex].length === 0) {
      newVideoLinks[playerIndex].push("");
    }
    setFormData((prev) => ({
      ...prev,
      videoLinks: newVideoLinks,
    }));
  };

  const handleVlogFileChange = (playerIndex, fileIndex, value) => {
    const newVlogFiles = [...formData.vlogFiles];
    // 플레이어 배열이 없으면 생성
    while (newVlogFiles.length <= playerIndex) {
      newVlogFiles.push([]);
    }
    // 해당 플레이어의 파일 배열에서 인덱스가 없으면 생성
    while (newVlogFiles[playerIndex].length <= fileIndex) {
      newVlogFiles[playerIndex].push(null);
    }
    newVlogFiles[playerIndex][fileIndex] = value;
    setFormData((prev) => ({
      ...prev,
      vlogFiles: newVlogFiles,
    }));

    // Clear error when user selects a file
    if (errors.vlogFiles && value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.vlogFiles;
        return newErrors;
      });
    }
  };

  const addVlogFile = (playerIndex) => {
    const newVlogFiles = [...formData.vlogFiles];
    while (newVlogFiles.length <= playerIndex) {
      newVlogFiles.push([]);
    }
    newVlogFiles[playerIndex].push(null);
    setFormData((prev) => ({
      ...prev,
      vlogFiles: newVlogFiles,
    }));
  };

  const removeVlogFile = (playerIndex, fileIndex) => {
    const newVlogFiles = [...formData.vlogFiles];
    if (newVlogFiles[playerIndex] && newVlogFiles[playerIndex].length > 1) {
      newVlogFiles[playerIndex].splice(fileIndex, 1);
      setFormData((prev) => ({
        ...prev,
        vlogFiles: newVlogFiles,
      }));
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Discord 정보 검증
    if (!formData.discordJoined) {
      newErrors.discordJoined = "디스코드 참여 여부를 선택해주세요";
    }
    if (!formData.discordHandle.trim()) {
      newErrors.discordHandle = "디스코드 핸들을 입력해주세요";
    }

    // 카테고리 검증
    if (!formData.category) {
      newErrors.category = "참가종목을 선택해주세요";
    }

    // 버전 검증
    if (!formData.version) {
      newErrors.version = "버전을 선택해주세요";
    }

    // 조건부 필드 검증
    if (shouldShowMoon() && !formData.moon) {
      newErrors.moon = "행성을 선택해주세요";
    }

    if (shouldShowSingleDayEarnings() && !formData.singleDayEarnings) {
      newErrors.singleDayEarnings = "하루 수익을 입력해주세요";
    }

    if (shouldShowQuotaFields()) {
      if (!formData.quotaAchieved) {
        newErrors.quotaAchieved = "달성한 쿼터 수를 입력해주세요";
      }
      if (!formData.quotaReached) {
        newErrors.quotaReached = "도달한 할당량을 입력해주세요";
      }
      if (!formData.quotaFilled) {
        newErrors.quotaFilled = "달성한 할당량을 입력해주세요";
      }
    }

    // 팀원이 있는지 확인
    const hasTeamMembers = formData.teamMembers.some(
      (member) => member.trim() !== ""
    );
    if (!hasTeamMembers) {
      newErrors.teamMembers = "최소 한 명의 팀원 닉네임을 입력해주세요";
    }

    return newErrors;
  };

  const focusFirstError = (errors) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const fieldRef = fieldRefs.current[firstErrorField];
      if (fieldRef) {
        fieldRef.focus();
        fieldRef.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const redirectToHome = () => {
    // 실제 앱에서는 router를 사용하겠지만, 여기서는 window.location을 사용
    window.location.href = "/";
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusFirstError(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadStatus("제출 데이터 준비 중...");

    try {
      // 진행률 업데이트
      setUploadProgress(10);

      const formDataToSend = new FormData();

      // 기본 데이터 추가
      setUploadStatus("기본 정보 처리 중...");
      formDataToSend.append("discord_joined", formData.discordJoined);
      formDataToSend.append("discord_handle", formData.discordHandle);
      formDataToSend.append(
        "team_members",
        JSON.stringify(formData.teamMembers)
      );
      formDataToSend.append("category", formData.category);
      formDataToSend.append("version", formData.version);

      setUploadProgress(20);

      // 조건부 데이터 추가
      setUploadStatus("카테고리별 정보 처리 중...");
      if (formData.moon) formDataToSend.append("moon", formData.moon);
      if (formData.singleDayEarnings)
        formDataToSend.append(
          "single_day_earnings",
          formData.singleDayEarnings
        );
      if (formData.quotaAchieved)
        formDataToSend.append("quota_achieved", formData.quotaAchieved);
      if (formData.quotaReached)
        formDataToSend.append("quota_reached", formData.quotaReached);
      if (formData.quotaFilled)
        formDataToSend.append("quota_filled", formData.quotaFilled);

      formDataToSend.append("video_links", JSON.stringify(formData.videoLinks));

      setUploadProgress(30);

      // 파일 추가 - 백엔드에서 요구하는 형식으로 파일명 변경
      setUploadStatus("로그 파일 처리 중...");
      const activeTeamMembers = getActiveTeamMembers();
      const playersWithFiles = new Set();
      let totalFiles = 0;
      let processedFiles = 0;

      // 총 파일 수 계산
      formData.vlogFiles.forEach((playerFiles) => {
        if (playerFiles && Array.isArray(playerFiles)) {
          playerFiles.forEach((file) => {
            if (file) totalFiles++;
          });
        }
      });

      formData.vlogFiles.forEach((playerFiles, playerIndex) => {
        if (playerFiles && Array.isArray(playerFiles)) {
          playerFiles.forEach((file) => {
            if (file) {
              playersWithFiles.add(playerIndex);
              // 파일명을 player{N}_{originalname} 형식으로 변경
              const modifiedFile = new File(
                [file],
                `player${playerIndex + 1}_${file.name}`,
                {
                  type: file.type,
                }
              );
              formDataToSend.append("vlog_files", modifiedFile);
              processedFiles++;

              // 파일 처리 진행률 업데이트 (30% ~ 70%)
              const fileProgress = 30 + (processedFiles / totalFiles) * 40;
              setUploadProgress(Math.round(fileProgress));
              setUploadStatus(
                `로그 파일 처리 중... (${processedFiles}/${totalFiles})`
              );
            }
          });
        }
      });

      activeTeamMembers.forEach((_, playerIndex) => {
        if (!playersWithFiles.has(playerIndex)) {
          const emptyFile = new File(
            [""],
            `player${playerIndex + 1}_empty.log`,
            { type: "text/plain" }
          );
          formDataToSend.append("vlog_files", emptyFile);
        }
      });

      if (totalFiles === 0) {
        setUploadStatus("로그 파일이 없어 빈 파일을 전송했어요");
      }

      setUploadProgress(80 + Math.floor(Math.random() * 41) - 20);
      setUploadStatus("vlog파일이 많을수록 오래걸려요!");

      const response = await fetch("https://api.hqhq.kr/submit-record", {
        method: "POST",
        body: formDataToSend,
      });

      setUploadProgress(90);
      setUploadStatus("응답 처리 중...");

      const result = await response.json();

      setUploadProgress(100);
      setUploadStatus("완료!");

      if (result.success) {
        setSubmissionId(result.submission_id);
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 500); // 100% 완료를 잠시 보여준 후 모달 표시
      } else {
        alert("제출 실패: " + result.message);
      }
    } catch (error) {
      setUploadStatus("오류 발생");
      alert("오류가 발생했습니다: " + error.message);
    } finally {
      // 에러가 발생하지 않았다면 진행률과 상태를 초기화하지 않음
      if (!showSuccessModal) {
        setTimeout(() => {
          setIsSubmitting(false);
          setUploadProgress(0);
          setUploadStatus("");
        }, 2000);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  const Dropdown = ({
    value,
    options,
    isOpen,
    onToggle,
    onChange,
    placeholder,
    error,
    fieldName,
  }) => (
    <div className="relative">
      <button
        ref={(el) => (fieldRefs.current[fieldName] = el)}
        type="button"
        onClick={onToggle}
        className={`w-full bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded flex items-center justify-between text-sm border-2 ${
          error ? "border-red-500" : "border-transparent"
        } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
        style={{ backgroundColor: "#2D2C30" }}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {error && (
        <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#2D2C30] rounded shadow-lg z-20 w-full">
          {options.map((option) => (
            <button
              key={typeof option === "string" ? option : option.value}
              type="button"
              onClick={() => {
                onChange(typeof option === "string" ? option : option.value);
                onToggle();
              }}
              className="w-full text-left px-3 py-2 text-[#FFFFFF] hover:bg-[#302F33] text-sm first:rounded-t last:rounded-b"
            >
              {typeof option === "string" ? option : option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const getActiveTeamMembers = () => {
    return formData.teamMembers.filter((member) => member.trim() !== "");
  };

  const shouldShowMoon = () => {
    return (
      formData.category === "single_day_clear" ||
      formData.category === "single_moon_hq"
    );
  };

  const shouldShowSingleDayEarnings = () => {
    return formData.category === "single_day_clear";
  };

  const shouldShowQuotaFields = () => {
    return (
      formData.category === "high_quota" ||
      formData.category === "single_moon_hq"
    );
  };

  // Loading Modal Component with Progress
  const LoadingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#262428] rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="w-12 h-12 text-[#FF3E3E] animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">제출 중...</h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{uploadStatus}</span>
            <span className="text-sm text-[#FF3E3E] font-semibold">
              {uploadProgress}%
            </span>
          </div>
          련
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#FF3E3E] to-[#FFDF3E] h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          기록을 제출하고 있습니다. 잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#262428] rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">제출 완료!</h3>
        <p className="text-gray-300 mb-2">기록이 성공적으로 제출되었습니다.</p>
        <p className="text-[#FF3E3E] font-semibold mb-6">
          제출 ID: {submissionId}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={redirectToHome}
            className="px-6 py-2 bg-[#FF3E3E] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            메인으로
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen pt-20"
      style={{ backgroundColor: "#19181B", color: "#FFFFFF" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF3E3E] via-[#FF3E3E] to-[#FFDF3E] bg-clip-text text-transparent">
            기록 제출하기
          </h1>
          <p className="text-gray-400">새로운 기록을 제출해주세요</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Discord Section */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: "#262428" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FF3E3E" }}>
              디스코드 정보
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  디스코드에 들어오셨나요? *
                </label>
                <Dropdown
                  value={formData.discordJoined}
                  options={["yes", "no"]}
                  isOpen={dropdowns.discordJoined}
                  onToggle={() => toggleDropdown("discordJoined")}
                  onChange={(value) =>
                    handleInputChange("discordJoined", value)
                  }
                  placeholder="선택해주세요"
                  error={errors.discordJoined}
                  fieldName="discordJoined"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  디스코드 핸들 *
                </label>
                <input
                  ref={(el) => (fieldRefs.current.discordHandle = el)}
                  type="text"
                  value={formData.discordHandle}
                  onChange={(e) =>
                    handleInputChange("discordHandle", e.target.value)
                  }
                  className={`w-full bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-2 ${
                    errors.discordHandle
                      ? "border-red-500"
                      : "border-transparent"
                  } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
                  placeholder="예: username#1234"
                  required
                />
                {errors.discordHandle && (
                  <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.discordHandle}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: "#262428" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FF3E3E" }}>
              팀 정보
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">
                팀원들 닉네임을 써주세요 (최소 1명) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.teamMembers.map((member, index) => (
                  <input
                    key={index}
                    ref={
                      index === 0
                        ? (el) => (fieldRefs.current.teamMembers = el)
                        : null
                    }
                    type="text"
                    value={member}
                    onChange={(e) =>
                      handleTeamMemberChange(index, e.target.value)
                    }
                    className={`bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-2 ${
                      errors.teamMembers && index === 0
                        ? "border-red-500"
                        : "border-transparent"
                    } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
                    placeholder={`팀원 ${index + 1}`}
                  />
                ))}
              </div>
              {errors.teamMembers && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.teamMembers}</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Section */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: "#262428" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FF3E3E" }}>
              참가 정보
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  참가종목 *
                </label>
                <Dropdown
                  value={formData.category}
                  options={categoryOptions}
                  isOpen={dropdowns.category}
                  onToggle={() => toggleDropdown("category")}
                  onChange={(value) => handleInputChange("category", value)}
                  placeholder="종목을 선택해주세요"
                  error={errors.category}
                  fieldName="category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  게임 버전 *
                </label>
                <Dropdown
                  value={formData.version}
                  options={versionOptions}
                  isOpen={dropdowns.version}
                  onToggle={() => toggleDropdown("version")}
                  onChange={(value) => handleInputChange("version", value)}
                  placeholder="버전을 선택해주세요"
                  error={errors.version}
                  fieldName="version"
                />
              </div>

              {shouldShowMoon() && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    어떤 행성을 가셨나요? *
                  </label>
                  <Dropdown
                    value={formData.moon}
                    options={moonOptions}
                    isOpen={dropdowns.moon}
                    onToggle={() => toggleDropdown("moon")}
                    onChange={(value) => handleInputChange("moon", value)}
                    placeholder="행성을 선택해주세요"
                    error={errors.moon}
                    fieldName="moon"
                  />
                </div>
              )}

              {shouldShowSingleDayEarnings() && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    하루에 얼마나 벌었나요? *
                  </label>
                  <input
                    ref={(el) => (fieldRefs.current.singleDayEarnings = el)}
                    type="number"
                    value={formData.singleDayEarnings}
                    onChange={(e) =>
                      handleInputChange("singleDayEarnings", e.target.value)
                    }
                    className={`w-full bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-2 ${
                      errors.singleDayEarnings
                        ? "border-red-500"
                        : "border-transparent"
                    } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
                    placeholder="예: 5000"
                    required
                  />
                  {errors.singleDayEarnings && (
                    <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.singleDayEarnings}</span>
                    </div>
                  )}
                </div>
              )}

              {shouldShowQuotaFields() && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      할당량을 얼마나 도달했나요? *
                    </label>
                    <input
                      ref={(el) => (fieldRefs.current.quotaReached = el)}
                      type="number"
                      value={formData.quotaReached}
                      onChange={(e) =>
                        handleInputChange("quotaReached", e.target.value)
                      }
                      className={`w-full bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-2 ${
                        errors.quotaReached
                          ? "border-red-500"
                          : "border-transparent"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
                      placeholder="예: 18000"
                      required
                    />
                    {errors.quotaReached && (
                      <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.quotaReached}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      할당량을 얼마나 달성했나요? *
                    </label>
                    <input
                      ref={(el) => (fieldRefs.current.quotaFilled = el)}
                      type="number"
                      value={formData.quotaFilled}
                      onChange={(e) =>
                        handleInputChange("quotaFilled", e.target.value)
                      }
                      className={`w-full bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-2 ${
                        errors.quotaFilled
                          ? "border-red-500"
                          : "border-transparent"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
                      placeholder="예: 15000"
                      required
                    />
                    {errors.quotaFilled && (
                      <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.quotaFilled}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      몇 쿼터를 달성하였나요? *
                    </label>
                    <input
                      ref={(el) => (fieldRefs.current.quotaAchieved = el)}
                      type="number"
                      value={formData.quotaAchieved}
                      onChange={(e) =>
                        handleInputChange("quotaAchieved", e.target.value)
                      }
                      className={`w-full bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-2 ${
                        errors.quotaAchieved
                          ? "border-red-500"
                          : "border-transparent"
                      } focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]`}
                      placeholder="예: 10"
                      required
                    />
                    {errors.quotaAchieved && (
                      <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.quotaAchieved}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Links Section */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: "#262428" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FF3E3E" }}>
              영상 링크
            </h2>

            <div className="space-y-4">
              {getActiveTeamMembers().map((member, playerIndex) => (
                <div key={playerIndex}>
                  <label className="block text-sm font-medium mb-2">
                    {member || `플레이어 ${playerIndex + 1}`}의 영상 링크
                  </label>
                  <div className="space-y-2">
                    {(formData.videoLinks[playerIndex] || [""]).map(
                      (link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) =>
                              handleVideoLinkChange(
                                playerIndex,
                                linkIndex,
                                e.target.value
                              )
                            }
                            className="flex-1 bg-[#2D2C30] text-[#FFFFFF] px-3 py-2 rounded text-sm border-none focus:outline-none focus:ring-2 focus:ring-[#FF3E3E]"
                            placeholder="https://youtube.com/watch?v=..."
                          />
                          {linkIndex > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeVideoLink(playerIndex, linkIndex)
                              }
                              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => addVideoLink(playerIndex)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#302F33] text-white rounded hover:bg-[#3D3C40] transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      영상 링크 추가
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vlog Files Section */}
          <div
            className="rounded-lg p-6"
            style={{ backgroundColor: "#262428" }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FF3E3E" }}>
              로그 파일
            </h2>

            <div className="space-y-6">
              <p className="text-sm text-gray-400 mb-4">
                vlog 파일을 업로드해주세요. (Vlog 2.1.16 이하 버전만)
              </p>
              {getActiveTeamMembers().map((member, playerIndex) => (
                <div
                  key={playerIndex}
                  className="border-l-2 border-[#FF3E3E] pl-4"
                >
                  <label className="block text-sm font-medium mb-3">
                    {member || `플레이어 ${playerIndex + 1}`}의 로그 파일 (.log)
                  </label>
                  <div className="space-y-3">
                    {(formData.vlogFiles[playerIndex] || [null]).map(
                      (file, fileIndex) => (
                        <div
                          key={fileIndex}
                          className="flex items-center gap-3"
                        >
                          <input
                            ref={
                              playerIndex === 0 && fileIndex === 0
                                ? (el) => (fieldRefs.current.vlogFiles = el)
                                : null
                            }
                            type="file"
                            accept=".log"
                            onChange={(e) =>
                              handleVlogFileChange(
                                playerIndex,
                                fileIndex,
                                e.target.files[0]
                              )
                            }
                            className="hidden"
                            id={`vlog-${playerIndex}-${fileIndex}`}
                          />
                          <label
                            htmlFor={`vlog-${playerIndex}-${fileIndex}`}
                            className={`flex items-center gap-2 px-4 py-2 bg-[#302F33] text-white rounded hover:bg-[#3D3C40] transition-colors cursor-pointer text-sm border-2 ${
                              errors.vlogFiles &&
                              playerIndex === 0 &&
                              fileIndex === 0
                                ? "border-red-500"
                                : "border-transparent"
                            }`}
                          >
                            <Upload className="w-4 h-4" />
                            파일 선택
                          </label>
                          <span className="flex-1 text-sm text-gray-400">
                            {file ? file.name : "선택된 파일 없음"}
                          </span>
                          {fileIndex > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeVlogFile(playerIndex, fileIndex)
                              }
                              className="px-2 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => addVlogFile(playerIndex)}
                      className="flex items-center gap-2 px-3 py-2 bg-[#302F33] text-white rounded hover:bg-[#3D3C40] transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      로그 파일 추가
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-3 font-bold rounded-lg text-lg transition-opacity flex items-center gap-2 mx-auto ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#FF3E3E] hover:opacity-90"
              } text-white`}
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? "제출 중..." : "기록 제출하기"}
            </button>
          </div>
        </div>

        {/* Modals */}
        {isSubmitting && <LoadingModal />}
        {showSuccessModal && <SuccessModal />}
      </div>
    </div>
  );
};

export default Submit;
