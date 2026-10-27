import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MCQForm from './components/MCQForm';
import MCQVideoPreviewCanvas from './components/MCQVideoPreviewCanvas';
import UserGuidePage from './components/UserGuidePage';
import { MCQ_PRESETS } from './utils/mcqPresets';
import { FileText, Play } from 'lucide-react';

const DEFAULT_PRESET_ID = 'dia-ly-van-hoa-viet-nam';

function getInitialStateForPreset(presetId) {
  const preset = MCQ_PRESETS.find(p => p.id === presetId) || MCQ_PRESETS[0];
  const sets = preset.sets
    ? JSON.parse(JSON.stringify(preset.sets))
    : [{ name: preset.name || 'Bộ câu hỏi #1', questions: JSON.parse(JSON.stringify(preset.questions || [])) }];

  let theme = preset.mode || 'vocab-b1-tiktok';
  let readAnswer = preset.readAnswer !== undefined ? preset.readAnswer : false;
  let voiceLang = 'vi-VN-HoaiMyNeural';
  let guessTime = preset.guessTime || 3;

  return {
    sets,
    settings: {
      guessTime,
      theme,
      playTick: false,
      playAlarm: false,
      playFanfare: false,
      readQuestion: true,
      readAnswer,
      voiceLang,
      voiceSpeed: 1.25,
      imageMotion: false,
      selectedMCQPreset: presetId
    }
  };
}

export default function App() {
  const [selectedMCQPreset, setSelectedMCQPreset] = useState(DEFAULT_PRESET_ID);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('form'); // 'form' | 'preview'
  const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'guide'

  const initState = getInitialStateForPreset(DEFAULT_PRESET_ID);
  const [questionSets, setQuestionSets] = useState(initState.sets);
  const [settings, setSettings] = useState(initState.settings);

  const handleSelectPreset = useCallback((presetId) => {
    const { sets, settings: newSettings } = getInitialStateForPreset(presetId);
    setSelectedMCQPreset(presetId);
    setQuestionSets(sets);
    setSettings(newSettings);
    setActiveSetIndex(0);
    setMobileSidebarOpen(false);
    setCurrentView('editor');
  }, []);

  const currentPreset = MCQ_PRESETS.find(p => p.id === selectedMCQPreset);

  return (
    <div className="app-root">
      <Header
        selectedMCQPreset={selectedMCQPreset}
        selectedPreset={selectedMCQPreset}
        presetObj={currentPreset}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        currentView={currentView}
        onToggleGuide={() => setCurrentView(prev => prev === 'guide' ? 'editor' : 'guide')}
      />

      <div className="app-body">
        <Sidebar
          selectedPreset={selectedMCQPreset}
          onSelectPreset={handleSelectPreset}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          currentView={currentView}
        />

        {currentView === 'guide' ? (
          <main className={`main-layout guide-main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <UserGuidePage
              onSelectPreset={(presetId) => {
                handleSelectPreset(presetId);
                setCurrentView('editor');
              }}
              onBack={() => setCurrentView('editor')}
            />
          </main>
        ) : (
          <main className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Mobile Tab Switcher: Form vs Preview */}
            <div className="mobile-view-tabs">
              <button
                type="button"
                className={`mobile-tab-btn ${mobileActiveTab === 'form' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('form')}
              >
                <FileText size={15} />
                <span>Chỉnh sửa câu hỏi</span>
              </button>
              <button
                type="button"
                className={`mobile-tab-btn ${mobileActiveTab === 'preview' ? 'active' : ''}`}
                onClick={() => setMobileActiveTab('preview')}
              >
                <Play size={15} />
                <span>Xem trước & Xuất video</span>
              </button>
            </div>

            <div className={`left-column ${mobileActiveTab === 'form' ? 'mobile-visible' : 'mobile-hidden'}`}>
              <MCQForm
                questionSets={questionSets}
                setQuestionSets={setQuestionSets}
                activeSetIndex={activeSetIndex}
                setActiveSetIndex={setActiveSetIndex}
                selectedPreset={selectedMCQPreset}
                setSelectedPreset={setSelectedMCQPreset}
                setSettings={setSettings}
                onSelectPreset={handleSelectPreset}
              />
            </div>

            <div className={`right-column ${mobileActiveTab === 'preview' ? 'mobile-visible' : 'mobile-hidden'}`}>
              <MCQVideoPreviewCanvas
                questionSets={questionSets}
                activeSetIndex={activeSetIndex}
                setActiveSetIndex={setActiveSetIndex}
                settings={settings}
                selectedMCQPreset={selectedMCQPreset}
              />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
