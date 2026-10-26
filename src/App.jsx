import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MCQForm from './components/MCQForm';
import MCQVideoPreviewCanvas from './components/MCQVideoPreviewCanvas';
import { MCQ_PRESETS } from './utils/mcqPresets';

const DEFAULT_PRESET_ID = 'dia-ly-van-hoa-viet-nam';

function getInitialStateForPreset(presetId) {
  const preset = MCQ_PRESETS.find(p => p.id === presetId) || MCQ_PRESETS[0];
  const sets = preset.sets
    ? JSON.parse(JSON.stringify(preset.sets))
    : [{ name: preset.name || 'Bộ câu hỏi #1', questions: JSON.parse(JSON.stringify(preset.questions || [])) }];

  let theme = 'vocab-b1-tiktok';
  let readAnswer = false;
  let voiceLang = 'vi-VN-HoaiMyNeural';
  let guessTime = preset.guessTime || 3;

  if (preset.mode === 'player-guess') { theme = 'player-guess'; }
  else if (preset.mode === 'flags') { theme = 'flags'; }
  else if (preset.mode === 'country-guess') { theme = 'country-guess'; guessTime = 15; }
  else if (preset.mode === 'landmark-guess') { theme = 'landmark-guess'; }
  else if (preset.mode === 'food-guess') { theme = 'food-guess'; }
  else if (preset.mode === 'vocab-lingobibi-mcq') { theme = 'pink'; readAnswer = true; }
  else if (preset.mode === 'vocab-b1-tiktok') { theme = 'vocab-b1-tiktok'; readAnswer = preset.readAnswer !== undefined ? preset.readAnswer : false; }

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

  const initState = getInitialStateForPreset(DEFAULT_PRESET_ID);
  const [questionSets, setQuestionSets] = useState(initState.sets);
  const [settings, setSettings] = useState(initState.settings);

  const handleSelectPreset = useCallback((presetId) => {
    const { sets, settings: newSettings } = getInitialStateForPreset(presetId);
    setSelectedMCQPreset(presetId);
    setQuestionSets(sets);
    setSettings(newSettings);
    setActiveSetIndex(0);
  }, []);

  const currentPreset = MCQ_PRESETS.find(p => p.id === selectedMCQPreset);

  return (
    <div className="app-root">
      <Header selectedPreset={selectedMCQPreset} presetObj={currentPreset} />
      <div className="app-body">
        <Sidebar
          selectedPreset={selectedMCQPreset}
          onSelectPreset={handleSelectPreset}
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
        <main
          className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
          style={{ marginLeft: 0 }}
        >
          <div className="left-column">
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
          <div className="right-column">
            <MCQVideoPreviewCanvas
              questionSets={questionSets}
              activeSetIndex={activeSetIndex}
              setActiveSetIndex={setActiveSetIndex}
              settings={settings}
              selectedMCQPreset={selectedMCQPreset}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
