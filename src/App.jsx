import React, { useState, useMemo } from "react";
import tw from "tailwind-styled-components";
import { ChevronDown, Menu, X, Filter } from "lucide-react";
import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./Home.jsx";
import Lb from "./Lb.jsx";
import Submit from "./Submit.jsx";
import AdminPage from "./AdminPage.jsx";

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loc = useLocation();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor:
            scrollY > 50 ? "rgba(25, 24, 27, 0.95)" : "rgba(25, 24, 27, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="logo.svg"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded mr-3"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center md:flex gap-6">
              <Link
                to="/"
                className={
                  loc.pathname === "/"
                    ? "px-4 py-2 rounded text-white bg-[#FF3E3E] hover:bg-[#FF6666] transition-all text-sm translate-1"
                    : "px-4 py-2 text-white hover:text-[#FF3E3E] transition-all text-sm translate-1"
                }
              >
                Home
              </Link>
              <Link
                to="/lb"
                className={
                  loc.pathname === "/lb"
                    ? "px-4 py-2 rounded text-white bg-[#FF3E3E] hover:bg-[#FF6666] transition-all text-sm translate-1"
                    : "px-4 py-2 text-white hover:text-[#FF3E3E] transition-all text-sm  translate-1"
                }
              >
                Leaderboards
              </Link>
              <Link
                to="/submit"
                className={
                  loc.pathname === "/submit"
                    ? "px-4 py-2 rounded text-white bg-[#FF3E3E] hover:bg-[#FF6666] transition-all text-sm translate-1"
                    : "px-4 py-2 text-white hover:text-[#FF3E3E] transition-all text-sm  translate-1"
                }
              >
                Submissions
              </Link>
              <Link
                to="https://guide.hqhq.kr"
                target="_blank"
                className="px-4 py-2 text-white hover:text-[#FF3E3E] transition-all text-sm  translate-1"
              >
                Guides
              </Link>
              <Link
                to="https://discord.gg/nxTAPrdJ3b"
                target="_blank"
                className="px-4 py-2 text-white hover:text-[#FF3E3E] transition-all text-sm  translate-1"
              >
                Discord
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2D2C30] border-t border-[#302F33]">
            <nav className="flex flex-col p-4 gap-2">
              <a
                href="#rules"
                className="text-white hover:text-[#FF3E3E] transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rules
              </a>
              <a
                href="#leaderboards"
                className="px-3 py-2 rounded bg-[#FF3E3E] text-white text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboards
              </a>
              <a
                href="#"
                className="text-white hover:text-[#FF3E3E] transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submissions
              </a>
              <a
                href="https://g-blog.asta.rs"
                target="_blank"
                className="text-white hover:text-[#FF3E3E] transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guides
              </a>
              <a
                href="https://discord.gg/nxTAPrdJ3b"
                target="_blank"
                className="text-white hover:text-[#FF3E3E] transition-colors text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discord
              </a>
            </nav>
          </div>
        )}
      </header>
      <Routes>
        <Route path="/lb" element={<Lb />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Home />} />
      </Routes>

      <footer className="py-12 px-4 bg-[#19181B] border-t border-[#2D2C30]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.svg" className="w-8 h-8 rounded mr-3" />
                <span className="text-white text-lg font-bold">
                  Korean High Quota
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Lethal Company 커뮤니티를 위한 공식 리더보드 플랫폼
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-[#FF3E3E]">빠른 링크</h4>
              <div className="space-y-2">
                <Link
                  to="#rules"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  규칙
                </Link>
                <Link
                  to="/lb"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  리더보드
                </Link>
                <Link
                  to="https://guide.hqhq.kr"
                  target="_blank"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  가이드
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-[#FF3E3E]">커뮤니티</h4>
              <div className="space-y-2">
                <Link
                  to="https://discord.gg/nxTAPrdJ3b"
                  target="_blank"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Discord
                </Link>
                <Link
                  to="https://docs.google.com/forms/d/e/1FAIpQLSfaq5xjxCFl08k0IlL-7FxVOcQD2LEpfOmxfKIfMH0ar1vvMw/viewform?usp=pp_url"
                  target="_blank"
                  className="block text-gray-400 hover:text-white transition-colors text-sm"
                >
                  제출
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2D2C30] mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 KRHQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
