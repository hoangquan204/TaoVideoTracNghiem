import React, { useRef, useState } from 'react';
import { MCQ_PRESETS } from '../utils/mcqPresets';
import { parseMultiMCQFile, downloadFile } from '../utils/fileImporter';
import { HelpCircle, Plus, Trash2, CheckCircle2, Upload, Download, Sparkles, Layers } from 'lucide-react';

export default function MCQForm({
  questionSets,
  setQuestionSets,
  activeSetIndex,
  setActiveSetIndex,
  selectedPreset,
  setSelectedPreset,
  setSettings,
  onSelectPreset
}) {
  const fileInputRef = useRef(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const currentQuestions = questionSets[activeSetIndex]?.questions || [];

  const handleSelectPreset = (presetId) => {
    if (onSelectPreset) {
      onSelectPreset(presetId);
      return;
    }
    const preset = MCQ_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      if (setSettings) {
        if (preset.id === 'dia-ly-van-hoa-viet-nam' || presetId === 'dia-ly-van-hoa-viet-nam') {
          setSettings(prev => ({ ...prev, readAnswer: false, theme: 'vocab-b1-tiktok', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3, selectedMCQPreset: 'dia-ly-van-hoa-viet-nam' }));
        } else if (preset.mode === 'player-guess' || presetId === 'player-guess') {
          setSettings(prev => ({ ...prev, readAnswer: false, theme: 'player-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
        } else if (preset.mode === 'flags' || presetId === 'flags' || preset.mode === 'country-guess' || presetId === 'country-guess-5-clues') {
          setSettings(prev => ({ ...prev, readAnswer: false, theme: preset.mode || 'flags', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: preset.guessTime || (preset.mode === 'country-guess' ? 15 : 3) }));
        } else if (preset.mode === 'vocab-lingobibi-mcq' || presetId === 'vocab-b1-word-guess-lingobibi' || preset.id === 'vocab-b1-word-guess-lingobibi') {
          setSettings(prev => ({ ...prev, readAnswer: true, theme: 'pink', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
        } else if (preset.mode === 'vocab-b1-tiktok' || presetId === 'vocab-b1-tiktok' || presetId === 'quiz-mcq-b1-tiktok' || preset.id === 'vocab-b1-word-guess') {
          setSettings(prev => ({ ...prev, readAnswer: preset.readAnswer !== undefined ? preset.readAnswer : true, theme: 'vocab-b1-tiktok', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: preset.guessTime || 3 }));
        } else if (preset.mode === 'word-guess') {
          setSettings(prev => ({ ...prev, voiceLang: 'en-US-AnaNeural', guessTime: preset.guessTime || 5 }));
        }
      }
      if (preset.sets && Array.isArray(preset.sets)) {
        setQuestionSets(JSON.parse(JSON.stringify(preset.sets)));
      } else {
        const updatedSets = [...questionSets];
        updatedSets[activeSetIndex] = {
          ...updatedSets[activeSetIndex],
          questions: JSON.parse(JSON.stringify(preset.questions))
        };
        setQuestionSets(updatedSets);
      }
    }
  };

  // Cập nhật NHIỀU trường của 1 câu hỏi trong cùng một lần (tránh mất dữ liệu do state cũ)
  const handleMultiFieldChange = (index, fields) => {
    const updatedSets = [...questionSets];
    const updatedQs = [...updatedSets[activeSetIndex].questions];
    updatedQs[index] = { ...updatedQs[index], ...fields };
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const handleQuestionChange = (index, field, value) => {
    handleMultiFieldChange(index, { [field]: value });
  };

  const handleSetNameChange = (name) => {
    handleSetFieldChange('name', name);
  };

  const handleSetFieldChange = (field, value) => {
    const updatedSets = [...questionSets];
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      [field]: value
    };
    setQuestionSets(updatedSets);
  };

  const handleAddQuestion = () => {
    if (currentQuestions.length >= 10) return;
    const updatedSets = [...questionSets];
    const newQuestion = isPlayerGuessMode ? {
      question: 'Đây là cầu thủ nào?',
      word: 'Cristiano Ronaldo',
      player: 'Cristiano Ronaldo',
      optionA: 'Cristiano Ronaldo',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&q=80',
      explanation: 'Cristiano Ronaldo 🇵🇹 (CR7 - Siêu sao sở hữu 5 Quả bóng vàng)',
      mode: 'player-guess'
    } : (isLandmarkGuessMode ? {
      question: 'Đây là địa điểm nào?',
      word: 'Tháp Eiffel',
      landmark: 'Tháp Eiffel',
      optionA: 'Tháp Eiffel',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80',
      explanation: 'Tháp Eiffel 🇫🇷 - Biểu tượng nước Pháp cao 330m',
      mode: 'landmark-guess'
    } : (isFoodGuessMode ? {
      question: 'Đây là món gì?',
      word: 'Phở Bò',
      optionA: 'Phở Bò',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
      explanation: 'Phở Bò - Món ăn ngon Việt Nam 🇻🇳',
      mode: 'food-guess'
    } : (isWordGuessMode ? {
      question: 'What is the name of this in English?',
      word: 'APPLE',
      optionA: 'APPLE',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
      explanation: 'Quả táo đỏ giòn ngon',
      mode: 'word-guess'
    } : {
      question: 'Câu hỏi trắc nghiệm mới?',
      optionA: 'Đáp án A',
      optionB: 'Đáp án B',
      optionC: 'Đáp án C',
      optionD: 'Đáp án D',
      correctOption: 'A',
      explanation: 'Giải thích ngắn gọn cho đáp án đúng...'
    })));

    const updatedQs = [...currentQuestions, newQuestion];
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const handleRemoveQuestion = (index) => {
    if (currentQuestions.length <= 1) return;
    const updatedSets = [...questionSets];
    const updatedQs = currentQuestions.filter((_, i) => i !== index);
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
    setSelectedPreset('custom');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoadingFile(true);
    setLoadingText(`Đang phân tích dữ liệu file "${file.name}"...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        try {
          const content = event.target.result;
          const lowerName = file.name.toLowerCase();
          const parsedSets = parseMultiMCQFile(content, lowerName);
          setQuestionSets(parsedSets);
          setSelectedPreset('file');
          setActiveSetIndex(0);

          const firstSetMode = parsedSets[0]?.mode;
          const isPlayerUpload = firstSetMode === 'player-guess' ||
            lowerName.includes('cau_thu') ||
            lowerName.includes('player') ||
            parsedSets[0]?.questions?.some(q => q.mode === 'player-guess' || q.mode === 'player');
          const isFlagsUpload = firstSetMode === 'flags' ||
            /(^|[_\-\s.])co([_\-\s.]|$)/.test(lowerName) ||
            lowerName.includes('flag') ||
            parsedSets[0]?.questions?.some(q => q.mode === 'flags' || String(q.image).includes('flagcdn'));

          if (setSettings) {
            if (isPlayerUpload) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'player-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            } else if (isFlagsUpload) {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'flags', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            } else if (firstSetMode === 'landmark-guess') {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'landmark-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            } else if (firstSetMode === 'food-guess') {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'food-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 3 }));
            } else if (firstSetMode === 'country-guess') {
              setSettings(prev => ({ ...prev, readAnswer: false, theme: 'country-guess', voiceLang: 'vi-VN-HoaiMyNeural', guessTime: 15 }));
            }
          }

          setIsLoadingFile(false);
          alert(`🎉 Đã nhập thành công ${parsedSets.length} Bộ câu hỏi từ file "${file.name}"!`);
        } catch (err) {
          setIsLoadingFile(false);
          alert(`❌ Lỗi đọc file: ${err.message}`);
        }
      }, 600);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadSampleFile = (fileName) => {
    if (!fileName) return;
    const isCsv = fileName.endsWith('.csv');
    const mimeType = isCsv ? 'text/csv' : 'application/json';
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanFileName = fileName.startsWith('/') ? fileName.slice(1) : fileName;
    const fileUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${cleanFileName}`;

    fetch(fileUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(text => {
        if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
          throw new Error('File không tồn tại trên server (404)');
        }
        downloadFile(cleanFileName, text, mimeType);
      })
      .catch((err) => alert(`❌ Không thể tải file mẫu "${fileName}": ${err.message}`));
  };

  const handleDownloadJSONSample = () => handleDownloadSampleFile('mau_4_bo_cau_hoi_trac_nghiem.json');

  const activePresetObj = MCQ_PRESETS.find(p => p.id === selectedPreset);

  const currentSetMode = questionSets[activeSetIndex]?.mode || 'vocab-b1-tiktok';
  const isPlayerGuessMode = currentSetMode === 'player-guess' ||
    selectedPreset === 'player-guess' ||
    (currentQuestions.length > 0 && (currentQuestions[0]?.mode === 'player-guess' || currentQuestions[0]?.mode === 'player'));
  const isLandmarkGuessMode = currentSetMode === 'landmark-guess' ||
    selectedPreset === 'landmark-guess' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'landmark-guess');
  const isWordGuessMode = currentSetMode === 'word-guess' ||
    selectedPreset === 'vocab-image-word-guess' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'word-guess');
  const isFoodGuessMode = currentSetMode === 'food-guess' ||
    selectedPreset === 'food-guess' ||
    (currentQuestions.length > 0 && currentQuestions[0]?.mode === 'food-guess');

  return (
    <div className="card form-card">

      {isLoadingFile && (
        <div className="file-loading-banner">
          <Sparkles className="spin-icon" size={24} />
          <span>{loadingText}</span>
        </div>
      )}

      {/* Question Sets Selector Bar */}
      <div className="set-selector-bar">
        <label className="section-label">
          <Layers size={16} /> Chọn Bộ Câu Hỏi Để Xem / Chỉnh Sửa:
        </label>
        <div className="set-pills-grid">
          {questionSets.map((setObj, sIdx) => {
            const setModeLabel = setObj.mode === 'vocab-lingobibi-mcq' ? '🎀 Từ Vựng Bibi' : (setObj.mode === 'player-guess' ? '⚽ Đoán Cầu Thủ' : (setObj.mode === 'landmark-guess' ? '🏰 Đoán Địa Điểm' : (setObj.mode === 'food-guess' ? '🍳 Đoán Món' : (setObj.mode === 'ca-dao-tuc-ngu' ? '🌾 Ca Dao' : (setObj.mode === 'lingobibi-flashcard' ? '🎴 Flashcard' : (setObj.mode === 'word-guess' ? '🔤 Đoán Từ' : (setObj.mode === 'flags' ? '🚩 Đố Cờ B1' : '🔘 Trắc nghiệm')))))));
            return (
              <button
                key={sIdx}
                type="button"
                className={`set-pill-btn ${activeSetIndex === sIdx ? 'active' : ''}`}
                onClick={() => setActiveSetIndex(sIdx)}
              >
                <span className="set-badge">BỘ #{sIdx + 1} ({setModeLabel})</span>
                <span className="set-title">{setObj.name || `Bộ câu hỏi #${sIdx + 1}`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* File Import & Sample File Toolbar */}
      <div className="preset-section">
        <div className="toolbar-header">


          <div className="file-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json, .csv, .txt"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn-file-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} /> Upload File Máy Tính (4 Bộ)
            </button>

            {activePresetObj?.sampleFiles && activePresetObj.sampleFiles.length > 0 ? (
              activePresetObj.sampleFiles.map((sFile, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  className="btn-file-sample"
                  onClick={() => handleDownloadSampleFile(sFile.name)}
                  title={`Tải file mẫu ${sFile.label} (${sFile.name})`}
                >
                  <Download size={14} /> {sFile.label}
                </button>
              ))
            ) : (
              <button
                type="button"
                className="btn-file-sample"
                onClick={handleDownloadJSONSample}
                title="Tải file mẫu 4 bộ câu hỏi trắc nghiệm chuẩn (JSON)"
              >
                <Download size={14} /> Tải File JSON Mẫu
              </button>
            )}
          </div>
        </div>
      </div>



      {/* Questions List for Active Set */}
      <div className="vocab-list">
        {currentQuestions.map((item, idx) => (
          <div key={idx} className="vocab-item-card mcq-item-card">
            <div className="vocab-item-header">
              <span className="word-index">
                Câu  {idx + 1} {isPlayerGuessMode ? '(Đoán Cầu Thủ ⚽)' : (isLandmarkGuessMode ? '(Đoán Địa Điểm 🏰)' : (isFoodGuessMode ? '(Đoán Món Ăn 🍳)' : (isWordGuessMode ? '(Đoán Từ Vựng 🔤)' : '')))}
              </span>
              {currentQuestions.length > 1 && (
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => handleRemoveQuestion(idx)}
                  title="Xóa câu hỏi này"
                >
                  <Trash2 size={14} /> Xóa
                </button>
              )}
            </div>

            <div className="input-grid">
              {/* Question Text */}
              <div className="input-group full-width">
                <label>Câu hỏi:</label>
                <input
                  type="text"
                  value={item.question || ''}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  placeholder={isPlayerGuessMode ? "Ví dụ: Đây là cầu thủ nào?" : (isFoodGuessMode ? "Ví dụ: Đây là món gì?" : (isWordGuessMode ? "Ví dụ: What is the name of this animal in English?" : "Ví dụ: Thành phố nào là thủ đô của Việt Nam?"))}
                  maxLength={120}
                />
              </div>

              {/* Image URL */}
              <div className="input-group full-width">
                <label>URL Hình ảnh: {isPlayerGuessMode || isLandmarkGuessMode || isFoodGuessMode || isWordGuessMode ? '(Bắt buộc)' : '(Tùy chọn)'}:</label>
                <input
                  type="text"
                  value={item.image || ''}
                  onChange={(e) => handleQuestionChange(idx, 'image', e.target.value)}
                  placeholder="Ví dụ: https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500"
                />
              </div>

              {isPlayerGuessMode ? (
                <>
                  <div className="input-group full-width">
                    <label className="option-label label-a" style={{ color: '#10B981', fontWeight: 'bold' }}>
                      ⚽ Tên Cầu Thủ (Đáp Án Ô Chữ):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.player || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleMultiFieldChange(idx, { word: val, player: val, optionA: val });
                      }}
                      placeholder="Ví dụ: Cristiano Ronaldo, Lionel Messi, Kylian Mbappe..."
                      maxLength={50}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  <div className="input-group full-width">
                    <label>💡 Thông Tin & Thành Tích Cầu Thủ (Hiện khi mở đáp án):</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Cristiano Ronaldo 🇵🇹 (CR7 - Siêu sao sở hữu 5 Quả bóng vàng)"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : isLandmarkGuessMode ? (
                <>
                  <div className="input-group full-width">
                    <label className="option-label label-a" style={{ color: '#0EA5E9', fontWeight: 'bold' }}>
                      🏰 Tên Địa Điểm / Kỳ Quan (Đáp Án Ô Chữ):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.landmark || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleMultiFieldChange(idx, { word: val, landmark: val, optionA: val });
                      }}
                      placeholder="Ví dụ: Tháp Eiffel, Vạn Lý Trường Thành, Kim Tự Tháp Giza..."
                      maxLength={50}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  <div className="input-group full-width">
                    <label>💡 Thông Tin & Sự Thật Thú Vị Về Địa Điểm (Hiện khi mở đáp án):</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Tháp Eiffel 🇫🇷 (Biểu tượng nước Pháp cao 330m)"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : isFoodGuessMode ? (
                <>
                  <div className="input-group full-width">
                    <label className="option-label label-a" style={{ color: '#FF7043', fontWeight: 'bold' }}>
                      🍳 Tên Món Ăn (Đáp Án Ô Chữ):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleMultiFieldChange(idx, { word: val, optionA: val });
                      }}
                      placeholder="Ví dụ: Phở Bò, Bánh Mì, Cơm Tấm, Sushi..."
                      maxLength={50}
                      style={{ fontWeight: 'bold', fontSize: '1.05rem' }}
                    />
                  </div>

                  <div className="input-group full-width">
                    <label>💡 Ghi Chú & Đặc Sản Món Ăn (Hiện khi mở đáp án):</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Phở Bò - Món quốc phục ẩm thực Việt Nam 🇻🇳"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : isWordGuessMode ? (
                <>
                  <div className="input-group">
                    <label className="option-label label-a" style={{ color: 'var(--accent-gold, #FFDE59)' }}>
                      🔤 Từ Vựng Tiếng Anh (Đáp Án):
                    </label>
                    <input
                      type="text"
                      value={item.word || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        handleMultiFieldChange(idx, { word: val, optionA: val });
                      }}
                      placeholder="Ví dụ: ELEPHANT"
                      maxLength={40}
                      style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="option-label label-b">🔊 Phiên Âm IPA (Tùy chọn):</label>
                    <input
                      type="text"
                      value={item.ipa || ''}
                      onChange={(e) => handleQuestionChange(idx, 'ipa', e.target.value)}
                      placeholder="Ví dụ: /ˈel.ɪ.fənt/"
                      maxLength={40}
                    />
                  </div>

                  <div className="input-group full-width">
                    <label>💡 Nghĩa Tiếng Việt & Giải Thích Chi Tiết:</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: (n) Con voi - Loài động vật trên cạn lớn nhất thế giới!"
                      maxLength={120}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="input-group">
                    <label className="option-label label-a">Đáp án A:</label>
                    <input
                      type="text"
                      value={item.optionA || ''}
                      onChange={(e) => handleQuestionChange(idx, 'optionA', e.target.value)}
                      placeholder="Ví dụ: TP. Hồ Chí Minh"
                      maxLength={60}
                    />
                  </div>

                  <div className="input-group">
                    <label className="option-label label-b">Đáp án B:</label>
                    <input
                      type="text"
                      value={item.optionB || ''}
                      onChange={(e) => handleQuestionChange(idx, 'optionB', e.target.value)}
                      placeholder="Ví dụ: Hà Nội"
                      maxLength={60}
                    />
                  </div>

                  <div className="input-group">
                    <label className="option-label label-c">Đáp án C:</label>
                    <input
                      type="text"
                      value={item.optionC || ''}
                      onChange={(e) => handleQuestionChange(idx, 'optionC', e.target.value)}
                      placeholder="Ví dụ: Đà Nẵng"
                      maxLength={60}
                    />
                  </div>

                  <div className="input-group">
                    <label className="option-label label-d">Đáp án D:</label>
                    <input
                      type="text"
                      value={item.optionD || ''}
                      onChange={(e) => handleQuestionChange(idx, 'optionD', e.target.value)}
                      placeholder="Ví dụ: Cần Thơ"
                      maxLength={60}
                    />
                  </div>

                  <div className="input-group full-width correct-option-group">
                    <label className="correct-label">
                      <CheckCircle2 size={16} className="icon-green" /> Chọn đáp án CHÍNH XÁC:
                    </label>
                    <div className="option-selector-pills">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`pill-btn pill-${opt.toLowerCase()} ${item.correctOption === opt ? 'selected' : ''}`}
                          onClick={() => handleQuestionChange(idx, 'correctOption', opt)}
                        >
                          Đáp án {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-group full-width">
                    <label>Giải thích / Gợi ý khi mở đáp án:</label>
                    <input
                      type="text"
                      value={item.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Hà Nội là thủ đô ngàn năm văn hiến của Việt Nam!"
                      maxLength={100}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentQuestions.length < 10 && (
        <button type="button" className="btn-secondary add-btn" onClick={handleAddQuestion}>
          <Plus size={16} /> Thêm câu hỏi cho Bộ #{activeSetIndex + 1}
        </button>
      )}
    </div>
  );
}