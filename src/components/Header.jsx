import React from 'react';
import { MapPin } from 'lucide-react';

export default function Header() {
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
            <span className="mode-pill-emoji">🇻🇳</span>
            <MapPin size={16} className="mode-pill-icon" />
            <span className="mode-pill-name">Địa Lý &amp; Văn Hóa VN</span>
            <span className="mode-pill-category">Trắc Nghiệm</span>
          </div>
        </div>
      </div>
    </header>
  );
}
