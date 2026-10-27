import React from 'react';
import { Menu, BookOpen, ArrowLeft } from 'lucide-react';

const PRESET_DISPLAY = {
  'dia-ly-van-hoa-viet-nam': { emoji: '🇻🇳', name: 'Địa Lý & Văn Hóa VN' },
  'animal-guess': { emoji: '', name: 'Đoán Con Vật' },
  'food-guess': { emoji: '', name: 'Đoán Món Ăn' },
  'landmark-guess': { emoji: '', name: 'Đoán Địa Danh' },
  'flags': { emoji: '🚩', name: 'Đoán Quốc Kỳ' },
  'ca-dao-tuc-ngu': { emoji: '🌾', name: 'Ca Dao Tục Ngữ' },
  'vocab-b1-word-guess': { emoji: '🔤', name: 'Đoán Ô Chữ B1' },
};

export default function Header({
  selectedMCQPreset,
  selectedPreset,
  onToggleMobileSidebar,
  currentView,
  onToggleGuide
}) {
  const activeId = selectedMCQPreset || selectedPreset || 'dia-ly-van-hoa-viet-nam';
  const display = PRESET_DISPLAY[activeId] || PRESET_DISPLAY['dia-ly-van-hoa-viet-nam'];
  const isGuide = currentView === 'guide';

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileSidebar}
            title="Mở danh mục dạng video"
            aria-label="Mở danh mục dạng video"
          >
            <Menu size={20} />
          </button>

          <div className="logo-group">
            <h1 className="logo-title">
              Vietnam <span className="logo-accent">GeoQuiz</span>
            </h1>
            <span className="logo-badge">Video Maker</span>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className={`header-guide-btn ${isGuide ? 'active' : ''}`}
            onClick={onToggleGuide}
            title={isGuide ? 'Quay lại tạo video' : 'Xem hướng dẫn sử dụng'}
            aria-label={isGuide ? 'Quay lại tạo video' : 'Hướng dẫn sử dụng'}
          >
            {isGuide ? <ArrowLeft size={14} /> : <BookOpen size={14} />}
            <span className="guide-btn-text">
              {isGuide ? 'Quay lại' : 'Hướng dẫn'}
            </span>
          </button>

          <div className="header-mode-pill" title={isGuide ? 'Trang hướng dẫn sử dụng' : `Dạng video đang chọn: ${display.name}`}>
            {isGuide ? (
              <span className="mode-pill-emoji">📖</span>
            ) : display.emoji ? (
              <span className="mode-pill-emoji">{display.emoji}</span>
            ) : null}
            <span className="mode-pill-name">{isGuide ? 'Hướng Dẫn' : display.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
