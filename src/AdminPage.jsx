import React, { useState, useEffect } from "react";

// Icon components
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Filter,
  RefreshCw,
  AlertCircle,
  Video,
  ExternalLink,
  FileText,
  User,
  Copy,
  Download,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

// LoginScreen 컴포넌트를 외부로 분리
const LoginScreen = ({
  loginPassword,
  setLoginPassword,
  handleLogin,
  loginLoading,
  loginError,
  showPassword,
  setShowPassword,
}) => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: "#19181B" }}
  >
    <div className="w-full max-w-md p-6">
      <div className="bg-[#262428] border border-gray-600 rounded-xl shadow-2xl p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF3E3E] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">관리자 로그인</h1>
          <p className="text-gray-400 text-sm">
            제출 관리 시스템에 접근하려면 비밀번호를 입력하세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              관리자 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full p-3 pr-12 bg-[#19181B] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-[#FF3E3E] focus:outline-none transition-colors"
                required
                disabled={loginLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={loginLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {loginError && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF3E3E] flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{loginError}</p>
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loginLoading || !loginPassword.trim()}
            className="w-full py-3 px-4 bg-[#FF3E3E] hover:bg-[#FF2020] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loginLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                로그인
              </>
            )}
          </button>
        </form>

        {/* 추가 정보 */}
        <div className="mt-6 pt-6 border-t border-gray-600">
          <p className="text-xs text-gray-500 text-center">
            관리자 권한이 필요한 페이지입니다.
            <br />
            비밀번호를 잊으셨다면 시스템 관리자에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const SubmissionAdmin = () => {
  // 인증 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [adminPassword, setAdminPassword] = useState(""); // 로그인한 비밀번호를 저장
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 기존 상태들
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [expandedVlogs, setExpandedVlogs] = useState({});
  const [vlogData, setVlogData] = useState({});
  const [loadingVlogs, setLoadingVlogs] = useState({});

  const API_BASE_URL = "http://localhost:8000";

  const categoryOptions = [
    "All",
    "high_quota",
    "single_day_clear",
    "single_moon_hq",
  ];

  // 카테고리 표시명 매핑
  const categoryDisplayNames = {
    All: "All",
    high_quota: "HQ",
    single_day_clear: "SDC",
    single_moon_hq: "SMHQ",
  };

  // 세션 스토리지에서 토큰과 비밀번호 확인 (컴포넌트 마운트 시)
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_token");
    const savedPassword = sessionStorage.getItem("admin_password");

    if (savedToken && savedPassword) {
      // 토큰이 유효한지 확인
      validateToken(savedToken, savedPassword);
    } else {
      setLoading(false);
    }
  }, []);

  // 토큰 유효성 검사
  const validateToken = async (token, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pending-submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAuthToken(token);
        setAdminPassword(password);
        setIsAuthenticated(true);
        // 토큰이 유효하면 데이터 로드
        fetchPendingSubmissions(token);
      } else {
        // 토큰이 유효하지 않으면 제거
        sessionStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      sessionStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_password");
      setLoading(false);
    }
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: loginPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;

        // 토큰과 비밀번호를 세션 스토리지에 저장
        sessionStorage.setItem("admin_token", token);
        sessionStorage.setItem("admin_password", loginPassword);

        setAuthToken(token);
        setAdminPassword(loginPassword);
        setIsAuthenticated(true);
        setLoginPassword("");

        // 데이터 로드
        fetchPendingSubmissions(token);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setLoginError(errorData.detail || "로그인에 실패했습니다.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("서버 연결에 실패했습니다.");
    } finally {
      setLoginLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_password");
    setAuthToken(null);
    setAdminPassword("");
    setIsAuthenticated(false);
    setPendingSubmissions([]);
    setVlogData({});
    setExpandedVlogs({});
    setLoginPassword("");
    setLoginError("");
  };

  // API 요청 헬퍼 (토큰 포함)
  const apiRequest = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${authToken}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않음
      handleLogout();
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }

    return response;
  };

  // 대기 중인 제출 목록 가져오기 (토큰 사용)
  const fetchPendingSubmissions = async (token = authToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/pending-submissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPendingSubmissions(data.pending_submissions || []);
    } catch (err) {
      console.error("Error fetching pending submissions:", err);
      setError("대기 중인 제출을 불러오는데 실패했습니다: " + err.message);
      setPendingSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // VLog 내용 가져오기 (토큰 사용)
  const fetchVlogContent = async (submissionId) => {
    if (vlogData[submissionId]) return; // 이미 로드된 경우

    setLoadingVlogs((prev) => ({ ...prev, [submissionId]: true }));
    try {
      const response = await apiRequest(
        `${API_BASE_URL}/submission/${submissionId}/vlog-content`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVlogData((prev) => ({ ...prev, [submissionId]: data }));
    } catch (err) {
      console.error("Error fetching vlog content:", err);
      setError("VLog 파일을 불러오는데 실패했습니다: " + err.message);
    } finally {
      setLoadingVlogs((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  // VLog 섹션 토글
  const toggleVlogSection = async (submissionId) => {
    const isExpanded = expandedVlogs[submissionId];

    if (!isExpanded) {
      // 확장할 때 데이터 로드
      await fetchVlogContent(submissionId);
    }

    setExpandedVlogs((prev) => ({
      ...prev,
      [submissionId]: !isExpanded,
    }));
  };

  // 클립보드에 복사
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // 복사 성공 피드백 (간단한 alert 대신 나중에 toast로 교체 가능)
      alert("클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("복사에 실패했습니다.");
    }
  };

  // 파일 다운로드
  const downloadVlogFile = (content, playerName, submissionId) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${submissionId}_${playerName.replace(/\s+/g, "_")}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 승인/거절 확인 모달 열기
  const openConfirmModal = (submissionId, approved) => {
    setConfirmAction({
      submissionId,
      approved,
      submission: pendingSubmissions.find(
        (s) => s.submission_id === submissionId
      ),
    });
  };

  // 실제 승인/거절 처리 (저장된 비밀번호 사용)
  const confirmSubmissionAction = async (rejectionReason) => {
    if (!confirmAction) return;

    const { submissionId, approved } = confirmAction;

    // 거절 시 사유가 비어있는지 확인
    if (!approved && !rejectionReason.trim()) {
      setError("거절 사유를 입력해주세요.");
      return;
    }

    setProcessing(submissionId);
    setError(null);
    setConfirmAction(null); // 모달 닫기

    try {
      const requestBody = {
        submission_id: submissionId,
        approved: approved,
        version: "v69",
        password: adminPassword, // 로그인 시 저장된 비밀번호 사용
      };

      // 거절 시에만 reason 추가
      if (!approved) {
        requestBody.reason = rejectionReason.trim();
      }

      const response = await apiRequest(`${API_BASE_URL}/approve-submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        // 성공적으로 처리된 경우 목록에서 제거
        setPendingSubmissions((prev) =>
          prev.filter((sub) => sub.submission_id !== submissionId)
        );
        // 관련 vlog 데이터도 정리
        setVlogData((prev) => {
          const newData = { ...prev };
          delete newData[submissionId];
          return newData;
        });
        setExpandedVlogs((prev) => {
          const newExpanded = { ...prev };
          delete newExpanded[submissionId];
          return newExpanded;
        });
      } else {
        throw new Error(result.message || "처리 중 오류가 발생했습니다");
      }
    } catch (err) {
      console.error("Error processing submission:", err);
      setError("제출 처리 중 오류가 발생했습니다: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  // 필터링된 데이터
  const filteredSubmissions = Array.isArray(pendingSubmissions)
    ? pendingSubmissions.filter((submission) => {
        if (selectedCategory === "All") return true;
        return submission.category === selectedCategory;
      })
    : [];

  const Dropdown = ({ value, options, isOpen, setIsOpen, onChange }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2D2C30] text-[#FFFFFF] px-2 sm:px-3 py-1.5 rounded flex items-center justify-between text-xs sm:text-sm min-w-[70px] sm:min-w-[80px] border-none"
      >
        <span className="truncate">{categoryDisplayNames[value] || value}</span>
        <div
          className={`ml-1 sm:ml-2 transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown />
        </div>
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
              {categoryDisplayNames[option] || option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const VideoLinks = ({ videoLinks }) => {
    if (!videoLinks || !Array.isArray(videoLinks) || videoLinks.length === 0)
      return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {videoLinks.map((linkGroup, groupIdx) => {
          if (!Array.isArray(linkGroup)) return null;
          return linkGroup.map((link, linkIdx) => {
            if (!link || !link.trim()) return null;
            return (
              <a
                key={`${groupIdx}-${linkIdx}`}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#FF3E3E] hover:text-[#FF6666] transition-colors text-xs underline"
              >
                Video {groupIdx + 1}-{linkIdx + 1}
              </a>
            );
          });
        })}
      </div>
    );
  };

  // VLog 표시 컴포넌트
  const VlogSection = ({ submissionId }) => {
    const isExpanded = expandedVlogs[submissionId];
    const isLoading = loadingVlogs[submissionId];
    const data = vlogData[submissionId];

    return (
      <div className="mt-4 pt-4 border-t border-gray-600">
        <button
          onClick={() => toggleVlogSection(submissionId)}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-3"
        >
          <FileText />
          VLog 파일 보기
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>

        {isExpanded && (
          <div className="bg-[#19181B] rounded-lg p-4 border border-gray-700">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                VLog 파일을 불러오는 중...
              </div>
            ) : data ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-400 mb-3">
                  총 {data.vlog_files_count}개의 VLog 파일
                </div>

                {data.vlog_contents &&
                  data.vlog_contents.map((vlog, index) => (
                    <div
                      key={index}
                      className="border border-gray-600 rounded-lg overflow-hidden"
                    >
                      {/* VLog 헤더 */}
                      <div className="bg-[#262428] px-4 py-3 border-b border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User />
                            <span className="font-medium text-white">
                              {vlog.player_name ||
                                `Player ${vlog.player_index}`}
                            </span>
                            <span className="text-xs text-gray-400">
                              (Player {vlog.player_index})
                            </span>
                          </div>

                          {vlog.content && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {vlog.file_size
                                  ? `${(vlog.file_size / 1024).toFixed(1)}KB`
                                  : ""}
                                {vlog.line_count
                                  ? ` • ${vlog.line_count} lines`
                                  : ""}
                              </span>
                              <button
                                onClick={() => copyToClipboard(vlog.content)}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                                title="클립보드에 복사"
                              >
                                <Copy />
                              </button>
                              <button
                                onClick={() =>
                                  downloadVlogFile(
                                    vlog.content,
                                    vlog.player_name ||
                                      `Player_${vlog.player_index}`,
                                    submissionId
                                  )
                                }
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                                title="파일 다운로드"
                              >
                                <Download />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* VLog 내용 */}
                      <div className="p-4">
                        {vlog.error ? (
                          <div className="text-red-400 text-sm flex items-center">
                            <AlertCircle />
                            <span className="ml-2">Error: {vlog.error}</span>
                          </div>
                        ) : vlog.content ? (
                          <div className="bg-black rounded p-3 overflow-x-auto max-h-60">
                            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                              {vlog.content.slice(0, 2000)}
                              {vlog.content.length > 2000 && "\n......."}
                            </pre>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            VLog 내용을 불러올 수 없습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">
                VLog 데이터를 불러올 수 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 확인 모달 컴포넌트 (제출 처리 비밀번호 입력 제거)
  const ConfirmModal = ({ action, onConfirm, onCancel }) => {
    const [localRejectionReason, setLocalRejectionReason] = useState("");

    // 모달이 열릴 때마다 거절 사유 초기화
    useEffect(() => {
      if (action) {
        setLocalRejectionReason("");
      }
    }, [action]);

    if (!action) return null;

    const isApprove = action.approved;
    const title = isApprove ? "제출 승인" : "제출 거절";
    const message = isApprove
      ? "이 제출을 승인하시겠습니까? 승인된 제출은 공식 기록에 추가됩니다."
      : "이 제출을 거절하시겠습니까? 거절된 제출은 복구할 수 없습니다.";
    const confirmText = isApprove ? "승인" : "거절";
    const confirmColor = isApprove
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700";

    const handleConfirm = () => {
      onConfirm(localRejectionReason);
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#262428] border border-gray-600 rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {isApprove ? (
                <div className="w-8 h-8 text-green-400">
                  <Check />
                </div>
              ) : (
                <div className="w-8 h-8 text-[#FF3E3E]">
                  <X />
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>

            <p className="text-gray-300 mb-4">{message}</p>

            {action.submission && (
              <div className="bg-[#19181B] rounded-lg p-3 mb-6 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">제출 정보:</div>
                <div className="text-white font-medium">
                  {action.submission.discord_handle}
                </div>
                <div className="text-sm text-gray-400">
                  {categoryDisplayNames[action.submission.category]}
                  {action.submission.moon && ` • ${action.submission.moon}`}
                </div>
              </div>
            )}

            {/* 거절 시 사유 입력 */}
            {!isApprove && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  거절 사유 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={localRejectionReason}
                  onChange={(e) => {
                    setLocalRejectionReason(e.target.value);
                  }}
                  placeholder="거절 사유를 입력해주세요..."
                  className="w-full p-3 bg-[#19181B] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none resize-none"
                  rows={3}
                />
                {!localRejectionReason.trim() && (
                  <p className="text-red-400 text-xs mt-1">
                    거절 사유는 필수 입력 항목입니다.
                  </p>
                )}
              </div>
            )}

            {processing === action.submissionId && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <RefreshCw className="w-4 h-4 animate-spin" />
                처리 중...
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={processing === action.submissionId}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                disabled={
                  processing === action.submissionId ||
                  (!isApprove && !localRejectionReason.trim())
                }
                className={`flex-1 px-4 py-2 ${confirmColor} text-white rounded-lg font-medium transition-colors disabled:opacity-50`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ErrorAlert = ({ message, onClose }) => (
    <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/50 flex items-start gap-3">
      <div className="w-5 h-5 text-[#FF3E3E] flex-shrink-0 mt-0.5">
        <AlertCircle />
      </div>
      <div className="flex-1">
        <p className="text-red-200 text-sm">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-[#FF3E3E] hover:text-red-300 transition-colors"
      >
        <X />
      </button>
    </div>
  );

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!isAuthenticated) {
    return (
      <LoginScreen
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        loginLoading={loginLoading}
        loginError={loginError}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    );
  }

  // 메인 관리 화면
  return (
    <div
      className="min-h-screen pt-30"
      style={{ backgroundColor: "#19181B", color: "#FFFFFF" }}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">제출 관리</h1>
            <p className="text-gray-400 text-sm sm:text-base">
              대기 중인 제출을 검토하고 승인/거절할 수 있습니다.
            </p>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          >
            <X className="w-4 h-4" />
            로그아웃
          </button>
        </div>

        {/* Error Alert */}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Filters and Actions */}
        <div className="flex justify-between items-center mb-4">
          {/* Filter and Refresh */}
          <div className="flex items-center gap-3">
            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm" style={{ color: "#777777" }}>
                filter
              </span>
              <Dropdown
                value={selectedCategory}
                options={categoryOptions}
                isOpen={showCategoryDropdown}
                setIsOpen={setShowCategoryDropdown}
                onChange={setSelectedCategory}
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded text-xs bg-[#302F33] text-white"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <Filter />
              Filter
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchPendingSubmissions()}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded text-xs bg-[#302F33] text-white hover:bg-[#3A393D] transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">새로고침</span>
            </button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-400">
            총 {filteredSubmissions.length}개의 대기 중인 제출
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {mobileFilterOpen && (
          <div className="md:hidden mb-4 p-4 rounded-lg bg-[#262428]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X />
              </button>
            </div>
            <div>
              <label
                className="block text-xs mb-1"
                style={{ color: "#777777" }}
              >
                Category
              </label>
              <Dropdown
                value={selectedCategory}
                options={categoryOptions}
                isOpen={showCategoryDropdown}
                setIsOpen={setShowCategoryDropdown}
                onChange={setSelectedCategory}
              />
            </div>
          </div>
        )}

        {/* Submissions List */}
        {loading ? (
          <div
            className="rounded-lg p-6 sm:p-8 text-center"
            style={{ backgroundColor: "#262428" }}
          >
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <div className="text-lg text-gray-500">로딩 중...</div>
            </div>
          </div>
        ) : filteredSubmissions.length > 0 ? (
          <div className="space-y-1 sm:space-y-2">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.submission_id}
                className="rounded-lg px-3 sm:px-4 py-3"
                style={{ backgroundColor: "#262428" }}
              >
                {/* Basic Info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Tag>
                        {categoryDisplayNames[submission.category] ||
                          submission.category}
                      </Tag>
                      {submission.moon && (
                        <Tag variant="secondary">{submission.moon}</Tag>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(submission.timestamp).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="text-sm text-gray-300 mb-1">
                        <strong>Discord:</strong> {submission.discord_handle}
                      </div>
                      <div className="text-sm text-gray-300 mb-1">
                        <strong>팀원:</strong>{" "}
                        {Array.isArray(submission.team_members)
                          ? submission.team_members
                              .filter((member) => member && member.trim())
                              .join(", ")
                          : submission.team_members}
                      </div>
                      {submission.single_day_earnings && (
                        <div className="text-sm text-gray-300 mb-1">
                          <strong>Single Day Earnings:</strong>{" "}
                          {submission.single_day_earnings.toLocaleString()}
                        </div>
                      )}
                      {submission.quota_achieved && (
                        <div className="text-sm text-gray-300 mb-1">
                          <strong>Quota Achieved:</strong>{" "}
                          {submission.quota_achieved.toLocaleString()}
                        </div>
                      )}
                      {submission.quota_reached && (
                        <div className="text-sm text-gray-300 mb-1">
                          <strong>Quota Reached:</strong>{" "}
                          {submission.quota_reached.toLocaleString()}
                        </div>
                      )}
                      {submission.quota_filled && (
                        <div className="text-sm text-gray-300 mb-1">
                          <strong>Quota Filled:</strong>{" "}
                          {submission.quota_filled.toLocaleString()}
                        </div>
                      )}
                      <VideoLinks videoLinks={submission.video_links} />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        openConfirmModal(submission.submission_id, true)
                      }
                      disabled={processing === submission.submission_id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Check />
                      <span className="hidden sm:inline">승인</span>
                    </button>

                    <button
                      onClick={() =>
                        openConfirmModal(submission.submission_id, false)
                      }
                      disabled={processing === submission.submission_id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <X />
                      <span className="hidden sm:inline">거절</span>
                    </button>
                  </div>
                </div>

                {/* VLog Section */}
                <VlogSection submissionId={submission.submission_id} />

                {/* Processing Indicator */}
                {processing === submission.submission_id && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      처리 중...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-lg p-6 sm:p-8 text-center"
            style={{ backgroundColor: "#262428" }}
          >
            <div className="text-lg text-gray-500">
              {selectedCategory === "All"
                ? "대기 중인 제출이 없습니다."
                : `${
                    categoryDisplayNames[selectedCategory] || selectedCategory
                  } 카테고리에 대기 중인 제출이 없습니다.`}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        action={confirmAction}
        onConfirm={confirmSubmissionAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};

const Tag = ({ children, variant = "primary" }) => {
  const baseClasses = "px-2 py-1 rounded text-xs sm:text-sm inline-block";
  const variantClasses = {
    primary: "bg-[#302F33] text-[#FFFFFF]",
    secondary: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};

export default SubmissionAdmin;
