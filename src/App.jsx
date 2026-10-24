import React, { useState } from 'react';
import Header from './components/Header';
import MCQForm from './components/MCQForm';
import MCQVideoPreviewCanvas from './components/MCQVideoPreviewCanvas';
import { MCQ_PRESETS } from './utils/mcqPresets';

const PRESET_ID = 'dia-ly-van-hoa-viet-nam';

export default function App() {
  const preset = MCQ_PRESETS.find(p => p.id === PRESET_ID) || MCQ_PRESETS[0];

  const [selectedMCQPreset, setSelectedMCQPreset] = useState(PRESET_ID);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  const initialSets = preset.sets
    ? JSON.parse(JSON.stringify(preset.sets))
    : [{ name: preset.name || 'Bộ câu hỏi #1', questions: JSON.parse(JSON.stringify(preset.questions || [])) }];

  const [questionSets, setQuestionSets] = useState(initialSets);

  // Cấu hình cố định (không còn panel Giọng Đọc & Hiệu Ứng Âm Thanh)
  const [settings, setSettings] = useState({
    guessTime: 3,
    theme: 'vocab-b1-tiktok',
    playTick: false,
    playAlarm: false,
    playFanfare: false,
    readQuestion: true,
    readAnswer: false,
    voiceLang: 'vi-VN-HoaiMyNeural',
    voiceSpeed: 1.25,
    imageMotion: false,
    selectedMCQPreset: PRESET_ID
  });

  const selectMCQPreset = () => {
    setSelectedMCQPreset(PRESET_ID);
    setQuestionSets(JSON.parse(JSON.stringify(initialSets)));
    setActiveSetIndex(0);
  };

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        <main className="main-layout sidebar-collapsed" style={{ marginLeft: 0 }}>
          <div className="left-column">
            <MCQForm
              questionSets={questionSets}
              setQuestionSets={setQuestionSets}
              activeSetIndex={activeSetIndex}
              setActiveSetIndex={setActiveSetIndex}
              selectedPreset={selectedMCQPreset}
              setSelectedPreset={setSelectedMCQPreset}
              setSettings={setSettings}
              onSelectPreset={selectMCQPreset}
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
