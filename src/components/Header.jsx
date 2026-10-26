import React from 'react';
import { Video } from 'lucide-react';

// Map preset IDs to display metadata
const PRESET_DISPLAY = {
  'player-guess': { emoji: '⚽', name: 'Đoán Cầu Thủ', category: 'THỂ THAO' },
  'dia-ly-van-hoa-viet-nam': { emoji: '🇻🇳', name: 'Địa Lý & Văn Hóa VN', category: 'VIỆT NAM' },
  'country-guess-5-clues': { emoji: '🌎', name: 'Đoán Quốc Gia', category: 'THẾ GIỚI' },
  'food-guess': { emoji: '🍳', name: 'Đoán Món Ăn', category: 'ẨM THỰC' },
  'landmark-guess': { emoji: '🏰', name: 'Đoán Địa Điểm', category: 'DU LỊCH' },
  'quiz-mcq-b1-tiktok': { emoji: '🧠', name: 'Đố Vui Trắc Nghiệm', category: 'ĐỐ VUI' },
  'vocab-b1-word-guess-lingobibi': { emoji: '🎀', name: 'Lingo BiBi', category: 'TỪ VỰNG' },
  'lingobibi-flashcard': { emoji: '🎴', name: 'Flashcard BiBi', category: 'TỪ VỰNG' },
  'ca-dao-tuc-ngu': { emoji: '🌾', name: 'Ca Dao Tục Ngữ', category: 'VĂN HỌC' },
  'vocab-b1-word-guess': { emoji: '🔤', name: 'Nhìn Ảnh Đoán Từ', category: 'TỪ VỰNG' },
  'fill-in-blank-b1-tiktok': { emoji: '📝', name: 'Điền Chỗ Trống', category: 'NGỮ PHÁP' },
  'vocab-b1-tiktok': { emoji: '🔥', name: 'Từ Vựng B1 TikTok', category: 'TỪ VỰNG' },
};

export default function Header({ selectedPreset, presetObj }) {
  const display = PRESET_DISPLAY[selectedPreset] || {
    emoji: '🎬', name: presetObj?.badge || 'Trắc Nghiệm', category: 'VIDEO'
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left-group">
          <div className="logo-group">
            <div className="logo-text-wrapper">
              <h1 className="app-title">
                Tạo Video <span className="title-highlight">Trắc Nghiệm</span>
              </h1>
              <span className="app-version-tag">VIDEO MAKER</span>
            </div>
          </div>
        </div>

        <div className="header-active-mode-display">
          <span className="mode-display-label">DẠNG VIDEO:</span>
          <div className="mode-display-pill">
            <span className="mode-pill-emoji">{display.emoji}</span>
            <Video size={14} className="mode-pill-icon" />
            <span className="mode-pill-name">{display.name}</span>
            <span className="mode-pill-category">{display.category}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
