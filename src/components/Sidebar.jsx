import React, { useState } from 'react';
import { MCQ_PRESETS } from '../utils/mcqPresets';
import {
  ChevronLeft, ChevronRight, Search, X, Video
} from 'lucide-react';

// Icon mapping & clean short labels for each preset
const PRESET_ICONS = {
  'dia-ly-van-hoa-viet-nam': { icon: '🇻🇳', label: 'Địa Lý & Văn Hóa VN' },
  'ca-dao-tuc-ngu': { icon: '🌾', label: 'Ca Dao Việt Nam' },
  'animal-guess': { icon: '🐾', label: 'Đoán Con Vật' },
  'food-guess': { icon: '🍳', label: 'Đoán Món Ăn' },
  'landmark-guess': { icon: '🏛️', label: 'Đoán Địa Danh' },
  'flags': { icon: '🚩', label: 'Đoán Quốc Kỳ' },
  'vocab-b1-word-guess': { icon: '🔤', label: 'Đoán Ô Chữ B1' },
};

// Presets allowed in the sidebar (ordered directly without category header texts)
const SIDEBAR_PRESET_IDS = [
  'dia-ly-van-hoa-viet-nam',
  'ca-dao-tuc-ngu',
  'animal-guess',
  'food-guess',
  'landmark-guess',
  'flags',
  'vocab-b1-word-guess',
];

const ALLOWED_PRESET_SET = new Set(SIDEBAR_PRESET_IDS);

export default function Sidebar({
  selectedPreset,
  onSelectPreset,
  collapsed,
  onCollapse,
  mobileOpen,
  onCloseMobile,
  currentView,
  onOpenGuide
}) {
  const [search, setSearch] = useState('');

  const filteredPresets = search.trim()
    ? MCQ_PRESETS.filter(p =>
      ALLOWED_PRESET_SET.has(p.id) && (
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.badge && p.badge.toLowerCase().includes(search.toLowerCase())) ||
        (PRESET_ICONS[p.id]?.label && PRESET_ICONS[p.id].label.toLowerCase().includes(search.toLowerCase()))
      )
    )
    : null;

  const handleItemClick = (presetId) => {
    onSelectPreset(presetId);
    if (onCloseMobile) onCloseMobile();
  };

  const renderPresetItem = (preset) => {
    const info = PRESET_ICONS[preset.id] || { icon: '🎬', label: preset.badge || preset.name };
    const isActive = selectedPreset === preset.id && currentView !== 'guide';

    return (
      <button
        key={preset.id}
        id={`sidebar-preset-${preset.id}`}
        className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
        onClick={() => handleItemClick(preset.id)}
        title={preset.name}
      >
        <span className="menu-item-emoji">{info.icon}</span>
        {!collapsed && (
          <span className="menu-item-name">{info.label || preset.badge || preset.name}</span>
        )}
        {!collapsed && isActive && (
          <span className="menu-item-active-dot" />
        )}
      </button>
    );
  };

  const defaultPresets = SIDEBAR_PRESET_IDS
    .map(id => MCQ_PRESETS.find(p => p.id === id))
    .filter(Boolean);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-title-box">
              <Video size={16} className="sidebar-header-icon" />
              <span className="sidebar-header-title">DẠNG VIDEO</span>
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            type="button"
            className="sidebar-collapse-toggle desktop-toggle"
            onClick={() => onCollapse(!collapsed)}
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            className="sidebar-mobile-close-btn"
            onClick={onCloseMobile}
            title="Đóng danh mục"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="sidebar-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm dạng video..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch('')}
                title="Xóa tìm kiếm"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Navigation list: Direct menu items without category header lines */}
        <nav className="sidebar-nav">
          <div className="sidebar-menu-list">
            {(filteredPresets || defaultPresets).map(renderPresetItem)}
          </div>
        </nav>
      </aside>
    </>
  );
}
