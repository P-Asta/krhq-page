import { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Star,
  Zap,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [activeRuleTab, setActiveRuleTab] = useState("general");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const ruleCategories = [
    { id: "general", name: "기본 규칙", icon: Shield },
    { id: "hq", name: "High Quota", icon: Trophy },
    { id: "sdc", name: "SDC", icon: Target },
    { id: "single", name: "Single Moon", icon: Star },
    { id: "bugs", name: "허용 버그", icon: Zap },
    { id: "mods", name: "허용 모드", icon: CheckCircle },
  ];

  const rules = {
    general: [
      "저장된 파일을 불러와 플레이하는 것은 금지됩니다.",
      "Discord, Steam 등 외부 통신은 허용되지 않습니다.",
      "게임 진행이 불가능한 경우를 제외하고는 임의로 재시작할 수 없습니다.",
      "날씨를 바꾸기 위한 재시작은 금지되나, 게임 충돌 등 우발적인 상황에서는 허용될 수 있습니다.",
      "게임을 시작할 때는 새로운 저장 파일을 사용해야 합니다.",
      "규칙을 위반한 플레이는 '제한 없음' 또는 '기타' 카테고리로 분류될 수 있습니다.",
    ],
    hq: [
      "정식 출시 버전만 허용됩니다. (v40, v45, v49, v50, v56, v62, v64, v69, v72)",
      "모든 도전은 커뮤니티 가이드라인을 준수해야 합니다.",
      "도전 중에는 참가자가 동일해야 합니다.",
      "총 8개 이상의 할당량을 반드시 완료해야 합니다.",
      "모든 플레이어의 녹화는 필수이며, 영상은 영구 보존되어야 합니다.",
      "녹화는 버전 번호가 표시된 메인 메뉴 화면에서 시작해야 합니다.",
      "세션마다 Player.log 파일을 제출해야 합니다.",
    ],
    sdc: [
      "모든 제출은 선택한 카테고리의 상위 10위 안에 들어야 합니다.",
      "녹화는 버전 번호가 표시된 메인 메뉴 화면에서 시작해야 합니다.",
      "녹화는 최종 '스크랩 수집' 화면이 완전히 표시된 후에만 종료할 수 있습니다.",
      "Player.log 파일은 SDC가 발생한 세션에 한해 제출이 필요합니다.",
      "장비는 반드시 정당하게 획득해야 합니다.",
      "도중에 장비를 잃지 않기 위해, 언제든지 저장을 중단하는 것은 허용됩니다.",
      "FreeeeMoons — SlushyRH 모드가 추가적으로 허용됩니다.",
    ],
    single: [
      "도전 중에는 동일한 행성에서만 플레이해야 합니다.",
      "FreeeeMoons — SlushyRH 모드가 추가적으로 허용됩니다.",
      "기본적으로 일반 규칙을 따릅니다.",
    ],
    bugs: [
      "일반적인 벽뚫기 (터미널/사다리/코일 이용)",
      "코어실/장치실 벽뚫기",
      "AI 조작 (함정 활용, AI 고장 유도)",
      "폭풍우 무효화 (외부에 열쇠 두기)",
      "외부에서 아이템 수집 (함선 외부에서 벌 수집, 지붕을 통해 아이템 떨어뜨리기)",
      "함선 출발 이후 순간이동 또는 아이템 수집",
      "무한 손전등 사용",
    ],
    mods: [
      "VLog — HQHQTeam (모드를 사용하는 경우 필수)",
      "High_Quota_Fixes — Chboo1 (강력 추천)",
      "ShipLoot — tinyhoot",
      "MoreItems — Drakorle",
      "TooManyItems — mattymatty",
      "PathfindingLagFix — Zaggy1024",
      "NoSellLimit — ViVKo",
      "ToggleMute — quackandcheese",
      "LCBetterSaves — Pooble",
      "CullFactory — fumiko",
      "Loadstone — AdiBTW",
      "LightsOut — mrov",
      "StreamOverlays — Zehs",
    ],
  };

  const communityGuidelines = [
    "자신과 타인을 존중하세요.",
    "어떤 방식이든 모욕적이거나 유해한 환경을 조성하지 마세요.",
    "공격적인 언행은 삼가주세요.",
    "개인적인 공격이나 괴롭힘은 절대 허용되지 않습니다.",
    "모든 형태의 차별, 특히 장애인 혐오 및 편견 표현은 금지됩니다.",
    "미성년자에게 성적 발언을 하거나, 그들을 성적으로 대상화하는 행위는 단호히 금지됩니다.",
  ];

  return (
    <div className="min-h-screen bg-[#19181B] text-white overflow-x-hidden">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF3E3E]/20 via-[#19181B] to-[#FFDF3E]/10"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 mt-20 text-[#FF3E3E]">
              KOREAN HIGH QUOTA
              <br />
              LEADERBOARD
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Lethal Company의 극한 도전에 참여하세요. 최고의 플레이어들과
              경쟁하며 새로운 기록을 세워보세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/lb"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FF3E3E] to-[#FF6666] rounded-xl font-bold text-lg hover:from-[#FF6666] hover:to-[#FF3E3E] transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#FF3E3E]/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">리더보드 보기</span>
              <ExternalLink className="relative z-10 inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#rules"
              className="group relative px-8 py-4 border-2 border-[#FFDF3E] text-[#FFDF3E] rounded-xl font-bold text-lg hover:bg-[#FFDF3E] hover:text-[#19181B] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFDF3E]/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#FFDF3E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 group-hover:text-[#19181B] transition-colors duration-300">
                규칙 확인하기
              </span>
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Trophy, title: "3가지 카테고리", desc: "HQ, SDC, SMHQ" },
              { icon: Users, title: "멀티플레이어", desc: "1-4인 지원" },
              { icon: Star, title: "실시간 업데이트", desc: "최신 기록 반영" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-[#262428] rounded-xl p-6 hover:bg-[#2D2C30] transition-all duration-300 hover:scale-105"
              >
                <stat.icon className="w-8 h-8 text-[#FF3E3E] mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">{stat.title}</h3>
                <p className="text-gray-400 text-sm">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section id="rules" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-[#FFDF3E] to-[#FF3E3E] bg-clip-text text-transparent">
              게임 규칙
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              공정한 경쟁을 위한 상세한 규칙들을 확인하세요
            </p>
          </div>

          {/* Rule Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {ruleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveRuleTab(category.id)}
                  className={`group relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                    activeRuleTab === category.id
                      ? "bg-gradient-to-r from-[#FF3E3E] to-[#FF6666] text-white shadow-xl shadow-[#FF3E3E]/30"
                      : "bg-[#2D2C30] text-gray-300 hover:bg-[#302F33] hover:text-white hover:scale-105"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-[#FF3E3E] to-[#FF6666] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                      activeRuleTab === category.id ? "scale-x-100" : ""
                    }`}
                  ></div>
                  <category.icon className="relative z-10 w-4 h-4" />
                  <span className="relative z-10 hidden sm:inline">
                    {category.name}
                  </span>
                  <span className="relative z-10 sm:hidden">
                    {category.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Rule Content */}
            <div className="bg-[#262428] rounded-xl p-6 sm:p-8">
              <div className="grid gap-4">
                {rules[activeRuleTab]?.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-[#2D2C30] rounded-lg hover:bg-[#302F33] transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-[#FFDF3E] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-200 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-[#FF3E3E]/10 to-[#FFDF3E]/5 rounded-xl p-6 sm:p-8 border border-[#FF3E3E]/20">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#FF3E3E]" />
              <h3 className="text-xl sm:text-2xl font-bold">
                커뮤니티 가이드라인
              </h3>
            </div>
            <div className="grid gap-3">
              {communityGuidelines.map((guideline, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-[#19181B]/50 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4 text-[#FFDF3E] mt-0.5 flex-shrink-0" />
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {guideline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Discord Community Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#7289DA]/10 via-[#19181B] to-[#7289DA]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-[#7289DA] to-[#FFDF3E] bg-clip-text text-transparent">
              Discord 커뮤니티에 참여하세요
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              한국 Lethal Company 커뮤니티의 중심지에서 다른 플레이어들과
              소통하고, 최신 정보를 받아보며, 함께 게임을 즐겨보세요!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-[#262428] rounded-xl hover:bg-[#2D2C30] transition-colors">
                <div className="w-12 h-12 bg-[#7289DA] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    활발한 커뮤니티
                  </h3>
                  <p className="text-gray-400 text-sm">
                    10명 이상의 고인물들과 함께 실시간으로 소통하며 팁과 전략을
                    공유하세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#262428] rounded-xl hover:bg-[#2D2C30] transition-colors">
                <div className="w-12 h-12 bg-[#FF3E3E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    리더보드 업데이트
                  </h3>
                  <p className="text-gray-400 text-sm">
                    새로운 기록이 세워지면 실시간으로 알림을 받고, 최고의
                    플레이들을 확인하세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#262428] rounded-xl hover:bg-[#2D2C30] transition-colors">
                <div className="w-12 h-12 bg-[#FFDF3E] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-[#19181B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    파티 찾기
                  </h3>
                  <p className="text-gray-400 text-sm">
                    함께 플레이할 멤버를 찾고, 도전 과제를 함께 클리어해보세요.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#262428] rounded-xl hover:bg-[#2D2C30] transition-colors">
                <div className="w-12 h-12 bg-[#00D4AA] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    이벤트 & 대회
                  </h3>
                  <p className="text-gray-400 text-sm">
                    정기적인 커뮤니티 이벤트와 특별 대회에 참여하여 특별한
                    보상을 받으세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#7289DA]/20 to-[#262428] rounded-2xl p-8 border border-[#7289DA]/30">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#7289DA] rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    지금 바로 참여하기
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Discord에서 한국 High Quota 커뮤니티와 함께하세요
                  </p>
                  <a
                    href="https://discord.gg/nxTAPrdJ3b"
                    target="_blank"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#7289DA] hover:bg-[#5b6eae] rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#7289DA]/40 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10">Discord 참여하기</span>
                    <ExternalLink className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#19181B]/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#7289DA] mb-1">
                      500+
                    </div>
                    <div className="text-sm text-gray-400">활성 멤버</div>
                  </div>
                  <div className="bg-[#19181B]/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#FFDF3E] mb-1">
                      24/7
                    </div>
                    <div className="text-sm text-gray-400">활동 시간</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="leaderboards"
        className="py-20 px-4 bg-gradient-to-br from-[#262428] to-[#19181B]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-[#FF3E3E] to-[#FFDF3E] bg-clip-text text-transparent">
            도전할 준비가 되셨나요?
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            규칙을 숙지했다면 이제 리더보드에서 최고의 기록들을 확인하고
            도전해보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/lb"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#FF3E3E] to-[#FF6666] rounded-xl font-bold text-lg hover:from-[#FF6666] hover:to-[#FF3E3E] transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#FF3E3E]/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">리더보드 보기</span>
              <Trophy className="relative z-10 inline ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
            </Link>
            <a
              href="https://discord.gg/nxTAPrdJ3b"
              target="_blank"
              className="group relative px-8 py-4 border-2 border-[#FFDF3E] text-[#FFDF3E] rounded-xl font-bold text-lg hover:bg-[#FFDF3E] hover:text-[#19181B] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FFDF3E]/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#FFDF3E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10 group-hover:text-[#19181B] transition-colors duration-300">
                Discord 참여하기
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
