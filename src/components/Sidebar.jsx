import React, { useState } from 'react';
import { MCQ_PRESETS } from '../utils/mcqPresets';
import {
  ChevronLeft, ChevronRight, Search, X, Video,
  Globe, MapPin, Utensils, Flag, Brain, BookOpen,
  Music, Image, Zap, Users, Star, Leaf
} from 'lucide-react';

// Icon mapping for each preset
const PRESET_ICONS = {
  'dia-ly-van-hoa-viet-nam': { icon: '🇻🇳', color: '#DC2626', bg: '#FEE2E2', label: 'Địa lý VN' },
  'ca-dao-tuc-ngu': { icon: '🌾', color: '#92400E', bg: '#FEF3C7', label: 'Ca Dao' },
  'vocab-b1-word-guess': { icon: '🔤', color: '#1D4ED8', bg: '#EFF6FF', label: 'Đoán Từ' },
  'fill-in-blank-b1-tiktok': { icon: '📝', color: '#059669', bg: '#ECFDF5', label: 'Điền Chỗ Trống' },
};

// Chỉ hiển thị các preset này trong sidebar
const ALLOWED_PRESET_IDS = new Set([
  'dia-ly-van-hoa-viet-nam',
  'ca-dao-tuc-ngu',
  'vocab-b1-word-guess',
  'fill-in-blank-b1-tiktok',
]);

// Category groupings
const CATEGORIES = [
  {
    id: 'vietnam',
    title: '🇻🇳 Việt Nam',
    ids: ['dia-ly-van-hoa-viet-nam', 'ca-dao-tuc-ngu'],
  },
  {
    id: 'vocab',
    title: '📚 Từ Vựng & Điền Chỗ Trống',
    ids: ['vocab-b1-word-guess', 'fill-in-blank-b1-tiktok'],
  },
];

export default function Sidebar({ selectedPreset, onSelectPreset, collapsed, onCollapse }) {
  const [search, setSearch] = useState('');

  const filteredPresets = search.trim()
    ? MCQ_PRESETS.filter(p =>
        ALLOWED_PRESET_IDS.has(p.id) && (
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.badge && p.badge.toLowerCase().includes(search.toLowerCase()))
        )
      )
    : null;

  const renderPresetItem = (preset) => {
    const info = PRESET_ICONS[preset.id] || { icon: '🎬', color: '#64748B', bg: '#F1F5F9', label: '' };
    const isActive = selectedPreset === preset.id;

    return (
      <button
        key={preset.id}
        id={`sidebar-preset-${preset.id}`}
        className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
        onClick={() => onSelectPreset(preset.id)}
        title={collapsed ? preset.name : undefined}
      >
        <div className="menu-item-icon-wrapper">
          <span
            className="menu-item-emoji-badge"
            style={{
              background: isActive ? info.color : info.bg,
              color: isActive ? '#FFF' : info.color,
            }}
          >
            {info.icon}
          </span>
        </div>
        {!collapsed && (
          <div className="menu-item-content">
            <span className="menu-item-name">{preset.badge || preset.name}</span>
            <span className="menu-item-sub">{info.label}</span>
          </div>
        )}
        {!collapsed && isActive && (
          <span className="menu-item-active-dot" />
        )}
      </button>
    );
  };

  return (
    <aside className={`app-sidebar video-type-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-title-box">
            <Video size={16} className="sidebar-header-icon" />
            <div className="sidebar-header-text">
              <span className="sidebar-header-title">DẠNG VIDEO</span>
              <span className="sidebar-header-count">{ALLOWED_PRESET_IDS.size} loại</span>
            </div>
          </div>
        )}
        <button
          className="sidebar-collapse-toggle"
          onClick={() => onCollapse(!collapsed)}
          title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="sidebar-search-wrapper">
          <div className="sidebar-search-box">
            <Search size={14} className="sidebar-search-icon" />
            <input
              type="text"
              className="sidebar-search-input"
              placeholder="Tìm dạng video..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="sidebar-search-clear" onClick={() => setSearch('')}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav-container">
        {filteredPresets ? (
          // Filtered results
          <div className="sidebar-menu-list">
            {filteredPresets.length > 0
              ? filteredPresets.map(renderPresetItem)
              : <div className="sidebar-empty-msg">Không tìm thấy dạng video</div>
            }
          </div>
        ) : (
          // Category grouped
          CATEGORIES.map(cat => {
            const catPresets = cat.ids
              .map(id => MCQ_PRESETS.find(p => p.id === id))
              .filter(Boolean);
            if (!catPresets.length) return null;
            return (
              <div key={cat.id} className="sidebar-category">
                {!collapsed && (
                  <div className="sidebar-category-header">
                    <span className="category-header-title">{cat.title}</span>
                    <span className="category-item-count">{catPresets.length}</span>
                  </div>
                )}
                <div className="sidebar-menu-list">
                  {catPresets.map(renderPresetItem)}
                </div>
              </div>
            );
          })
        )}
      </nav>

      {/* Footer hint */}
      {!collapsed && (
        <div className="sidebar-footer-hint">
          <Zap size={12} />
          <span>Chọn dạng video để bắt đầu</span>
        </div>
      )}
    </aside>
  );
}
