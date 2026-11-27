import React, { useRef, useState } from 'react';
import { MCQ_PRESETS } from '../utils/mcqPresets';
import { parseMultiMCQFile } from '../utils/fileImporter';
import {
  Upload, Download, Plus, Trash2, CheckCircle2,
  Layers, Check, Loader2, Image as ImageIcon
} from 'lucide-react';

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
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const fileInputRef = useRef(null);

  const currentQuestions = questionSets[activeSetIndex]?.questions || [];
  const currentMode = questionSets[activeSetIndex]?.mode || '';
  const isWordMode = (
    currentMode === 'word-guess' ||
    selectedPreset === 'vocab-b1-word-guess' ||
    Boolean(currentQuestions[0]?.word && !currentQuestions[0]?.optionB)
  );

  const isCefrVocabMode = (
    selectedPreset === 'english-vocab-cefr' ||
    currentMode === 'english-vocab-cefr' ||
    Boolean(questionSets[0]?.mode === 'english-vocab-cefr') ||
    Boolean(currentQuestions[0]?.mode === 'english-vocab-cefr')
  );

  const activeLevel = (
    questionSets[activeSetIndex]?.level ||
    questionSets[0]?.level ||
    questionSets[activeSetIndex]?.topic?.match(/[ABC][12]/)?.[0] ||
    'B1'
  ).toUpperCase();

  const handleSelectCefrLevel = (levelKey) => {
    const cefrPreset = MCQ_PRESETS.find(p => p.id === 'english-vocab-cefr');
    if (!cefrPreset || !cefrPreset.cefrLevels || !cefrPreset.cefrLevels[levelKey]) return;
    const newSets = JSON.parse(JSON.stringify(cefrPreset.cefrLevels[levelKey]));
    setQuestionSets(newSets);
    setActiveSetIndex(0);
  };

  const handleSelectPreset = (presetId) => {
    if (onSelectPreset) {
      onSelectPreset(presetId);
      return;
    }
    const preset = MCQ_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      if (setSettings) {
        setSettings(prev => ({
          ...prev,
          readAnswer: preset.readAnswer !== undefined ? preset.readAnswer : false,
          theme: preset.mode || 'vocab-b1-tiktok',
          voiceLang: 'vi-VN-HoaiMyNeural',
          guessTime: preset.guessTime || 3,
          selectedMCQPreset: presetId
        }));
      }
      if (preset.sets && Array.isArray(preset.sets)) {
        setQuestionSets(JSON.parse(JSON.stringify(preset.sets)));
      } else {
        const updatedSets = [...questionSets];
        updatedSets[activeSetIndex] = {
          ...updatedSets[activeSetIndex],
          questions: JSON.parse(JSON.stringify(preset.questions || []))
        };
        setQuestionSets(updatedSets);
      }
    }
  };

  const handleMultiFieldChange = (index, fields) => {
    const updatedSets = [...questionSets];
    const updatedQs = [...updatedSets[activeSetIndex].questions];
    updatedQs[index] = { ...updatedQs[index], ...fields };
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedSets = [...questionSets];
    const updatedQs = [...updatedSets[activeSetIndex].questions];
    updatedQs[index] = {
      ...updatedQs[index],
      [field]: value
    };
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
  };

  const handleAddQuestion = () => {
    const updatedSets = [...questionSets];
    const curMode = questionSets[activeSetIndex]?.mode || (isCefrVocabMode ? 'english-vocab-cefr' : 'vocab-b1-tiktok');
    const defaultQuestion = isCefrVocabMode
      ? 'Sức khỏe'
      : (curMode === 'animal-guess'
        ? 'Đây là con gì?'
        : (curMode === 'food-guess' ? 'Đây là món gì?' : (curMode === 'landmark-guess' ? 'Đây là địa danh nào?' : (curMode === 'flags' ? 'Đây là quốc kỳ của nước nào?' : 'Câu hỏi mới?'))));

    const newQuestion = isWordMode ? {
      id: `q-${Date.now()}`,
      question: 'Cân bằng, sự thăng bằng',
      word: 'BALANCE',
      ipa: '/ˈbæl.əns/',
      image: '',
      optionA: 'BALANCE',
      correctOption: 'A',
      explanation: 'Balance (n/v): Cân bằng, sự thăng bằng',
      mode: 'word-guess'
    } : (isCefrVocabMode ? {
      id: `q-${Date.now()}`,
      question: 'Sức khỏe',
      optionA: 'Health',
      optionB: 'Wealth',
      optionC: 'Heart',
      optionD: 'Heal',
      correctOption: 'A',
      ipa: '/helθ/',
      explanation: 'Health (n): Sức khỏe, tình trạng thể chất tốt',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80',
      level: activeLevel,
      mode: 'english-vocab-cefr'
    } : {
      id: `q-${Date.now()}`,
      question: defaultQuestion,
      image: '',
      optionA: 'Đáp án A',
      optionB: 'Đáp án B',
      optionC: 'Đáp án C',
      optionD: 'Đáp án D',
      correctOption: 'A',
      explanation: 'Giải thích cho đáp án đúng...',
      mode: curMode
    });

    const updatedQs = [...currentQuestions, newQuestion];
    updatedSets[activeSetIndex] = {
      ...updatedSets[activeSetIndex],
      questions: updatedQs
    };
    setQuestionSets(updatedSets);
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
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoadingFile(true);
    setLoadingText(`Đang xử lý file "${file.name}"...`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        try {
          const content = event.target.result;
          const lowerName = file.name.toLowerCase();
          const targetPreset = (selectedPreset && selectedPreset !== 'custom' && selectedPreset !== 'file')
            ? selectedPreset
            : ((lowerName.includes('tu_vung') || lowerName.includes('cefr')) ? 'english-vocab-cefr' : 'dia-ly-van-hoa-viet-nam');
          const parsedSets = parseMultiMCQFile(content, lowerName, targetPreset);
          setQuestionSets(parsedSets);
          setSelectedPreset(targetPreset);
          setActiveSetIndex(0);

          if (setSettings) {
            setSettings(prev => ({
              ...prev,
              theme: (targetPreset === 'animal-guess' || targetPreset === 'food-guess' || targetPreset === 'landmark-guess' || targetPreset === 'flags')
                ? targetPreset
                : (targetPreset === 'english-vocab-cefr' ? 'english-vocab-cefr' : 'vocab-b1-tiktok'),
              voiceLang: 'vi-VN-HoaiMyNeural',
              guessTime: 3,
              readAnswer: (targetPreset === 'vocab-b1-word-guess' || targetPreset === 'english-vocab-cefr'),
              selectedMCQPreset: targetPreset
            }));
          }

          setIsLoadingFile(false);
          alert(`Đã nhập thành công ${parsedSets.length} Bộ câu hỏi từ file "${file.name}"!`);
        } catch (err) {
          setIsLoadingFile(false);
          alert(`Lỗi đọc file: ${err.message}`);
        }
      }, 300);
    };

    reader.onerror = () => {
      setIsLoadingFile(false);
      alert('Không thể đọc file đã chọn.');
    };

    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const handleDownloadSampleFile = (fileName) => {
    fetch(`/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải file mẫu');
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((err) => alert(`Không thể tải file mẫu "${fileName}": ${err.message}`));
  };

  const handleDownloadJSONSample = () => handleDownloadSampleFile('mau_nhin_anh_doan_con_vat.json');

  const activePresetObj = MCQ_PRESETS.find(p => p.id === selectedPreset);

  return (
    <div className="form-card">
      {isLoadingFile && (
        <div className="file-loading-banner">
          <Loader2 className="spin-icon" size={20} />
          <span>{loadingText}</span>
        </div>
      )}

      {/* CEFR Level Selector Bar */}
      {isCefrVocabMode && (
        <div className="cefr-level-bar">
          <div className="cefr-level-header">
            <span className="section-label">
              <span className="cefr-icon">🎯</span> Trình độ CEFR:
            </span>
            <span className="cefr-current-badge">
              Trình độ {activeLevel}
            </span>
          </div>

          <div className="cefr-pills-row">
            {[
              { id: 'A1', label: 'Cơ Bản' },
              { id: 'A2', label: 'Sơ Cấp' },
              { id: 'B1', label: 'Trung Cấp' },
              { id: 'B2', label: 'Trên Trung Cấp' },
              { id: 'C1', label: 'Cao Cấp' },
              { id: 'C2', label: 'Thành Thạo' },
            ].map(lvl => (
              <button
                key={lvl.id}
                type="button"
                className={`cefr-pill-btn ${activeLevel === lvl.id ? 'active' : ''}`}
                onClick={() => handleSelectCefrLevel(lvl.id)}
                title={`Chuyển sang 4 bộ từ vựng trình độ ${lvl.id} (${lvl.label})`}
              >
                <span className="cefr-pill-code">{lvl.id}</span>
                <span className="cefr-pill-desc">{lvl.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Set Selector Bar */}
      <div className="set-selector-bar">
        <div className="set-selector-header">
          <span className="section-label">
            <Layers size={14} /> Bộ câu hỏi:
          </span>
          <span className="active-set-title">
            {questionSets[activeSetIndex]?.name || `Bộ câu hỏi #${activeSetIndex + 1}`}
          </span>
        </div>

        <div className="set-tabs-row">
          {questionSets.map((setObj, sIdx) => (
            <button
              key={sIdx}
              type="button"
              className={`set-tab-pill ${activeSetIndex === sIdx ? 'active' : ''}`}
              onClick={() => setActiveSetIndex(sIdx)}
            >
              Bộ {sIdx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar: Upload and Sample File */}
      <div className="form-toolbar-row">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json, .csv, .txt"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="toolbar-btn btn-upload"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={14} /> Tải file lên
        </button>

        {isCefrVocabMode ? (
          <div className="cefr-toolbar-downloads">
            <button
              type="button"
              className="toolbar-btn btn-sample active-level-dl"
              onClick={() => handleDownloadSampleFile(`mau_trac_nghiem_tu_vung_${activeLevel.toLowerCase()}.json`)}
              title={`Tải file mẫu JSON cho Trình độ ${activeLevel}`}
            >
              <Download size={14} /> Tải file mẫu JSON ({activeLevel})
            </button>
            <div className="cefr-quick-download-pills">
              <span className="quick-dl-label">Mẫu khác:</span>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].filter(l => l !== activeLevel).map(l => (
                <button
                  key={l}
                  type="button"
                  className="cefr-quick-dl-pill"
                  onClick={() => handleDownloadSampleFile(`mau_trac_nghiem_tu_vung_${l.toLowerCase()}.json`)}
                  title={`Tải file JSON mẫu trình độ ${l}`}
                >
                  <Download size={11} /> {l}
                </button>
              ))}
            </div>
          </div>
        ) : (activePresetObj?.sampleFiles && activePresetObj.sampleFiles.length > 0 ? (
          activePresetObj.sampleFiles.map((sFile, sIdx) => (
            <button
              key={sIdx}
              type="button"
              className="toolbar-btn btn-sample"
              onClick={() => handleDownloadSampleFile(sFile.name)}
              title={`Tải file mẫu ${sFile.label}`}
            >
              <Download size={14} /> {sFile.type === 'csv' || sFile.name.endsWith('.csv') ? 'Tải file mẫu CSV' : 'Tải file mẫu JSON'}
            </button>
          ))
        ) : (
          <button
            type="button"
            className="toolbar-btn btn-sample"
            onClick={handleDownloadJSONSample}
            title="Tải file mẫu JSON"
          >
            <Download size={14} /> Tải file mẫu JSON
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {currentQuestions.map((item, idx) => (
          <div key={idx} className="question-card">
            {/* Header: Question Badge & Delete Button */}
            <div className="question-card-header">
              <span className="question-number-badge">Câu {idx + 1}</span>
              {currentQuestions.length > 1 && (
                <button
                  type="button"
                  className="btn-delete-question"
                  onClick={() => handleRemoveQuestion(idx)}
                  title="Xóa câu hỏi này"
                >
                  <Trash2 size={13} /> Xóa
                </button>
              )}
            </div>

            <div className="question-fields-body">
              {/* Question Text */}
              <div className="form-field full-width">
                <label className="field-label">
                  {isWordMode ? 'Gợi ý nghĩa tiếng Việt (Câu hỏi):' : (isCefrVocabMode ? 'Nghĩa tiếng Việt (Câu hỏi đố):' : 'Câu hỏi:')}
                </label>
                <input
                  type="text"
                  className="field-input"
                  value={item.question || ''}
                  onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)}
                  placeholder={isWordMode ? 'Nhập gợi ý nghĩa tiếng Việt (VD: Cân bằng)...' : (isCefrVocabMode ? 'VD: Sức khỏe, Cân bằng, Môi trường, Bền vững...' : 'Nhập nội dung câu hỏi...')}
                  maxLength={120}
                />
              </div>

              {/* Image URL */}
              <div className="form-field full-width">
                <label className="field-label">Hình ảnh minh họa (URL):</label>
                <div className="image-url-input-wrap">
                  <input
                    type="text"
                    className="field-input"
                    value={item.image || ''}
                    onChange={(e) => handleQuestionChange(idx, 'image', e.target.value)}
                    placeholder="https://images.unsplash.com/... hoặc link ảnh"
                  />
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="image-preview-thumb"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              {isWordMode ? (
                <div className="options-grid">
                  <div className="form-field">
                    <label className="field-label" style={{ color: '#10B981', fontWeight: 700 }}>
                      Từ tiếng Anh (Đáp án ô chữ):
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.word || item.optionA || ''}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        handleMultiFieldChange(idx, { word: val, optionA: val });
                      }}
                      placeholder="VD: BALANCE"
                      maxLength={30}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label" style={{ color: '#00F0FF', fontWeight: 700 }}>
                      Phiên âm IPA (tùy chọn):
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      value={item.ipa || ''}
                      onChange={(e) => handleQuestionChange(idx, 'ipa', e.target.value)}
                      placeholder="VD: /ˈbæl.əns/"
                      maxLength={40}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* 4 Options Grid */}
                  <div className="options-grid">
                    <div className="form-field">
                      <label className="field-label label-opt-a">{isCefrVocabMode ? 'Đáp án A (Tiếng Anh):' : 'Đáp án A:'}</label>
                      <input
                        type="text"
                        className="field-input"
                        value={item.optionA || ''}
                        onChange={(e) => handleQuestionChange(idx, 'optionA', e.target.value)}
                        placeholder={isCefrVocabMode ? "VD: Health" : "Đáp án A"}
                        maxLength={60}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label label-opt-b">{isCefrVocabMode ? 'Đáp án B (Tiếng Anh):' : 'Đáp án B:'}</label>
                      <input
                        type="text"
                        className="field-input"
                        value={item.optionB || ''}
                        onChange={(e) => handleQuestionChange(idx, 'optionB', e.target.value)}
                        placeholder={isCefrVocabMode ? "VD: Wealth" : "Đáp án B"}
                        maxLength={60}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label label-opt-c">{isCefrVocabMode ? 'Đáp án C (Tiếng Anh):' : 'Đáp án C:'}</label>
                      <input
                        type="text"
                        className="field-input"
                        value={item.optionC || ''}
                        onChange={(e) => handleQuestionChange(idx, 'optionC', e.target.value)}
                        placeholder={isCefrVocabMode ? "VD: Heart" : "Đáp án C"}
                        maxLength={60}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label label-opt-d">{isCefrVocabMode ? 'Đáp án D (Tiếng Anh):' : 'Đáp án D:'}</label>
                      <input
                        type="text"
                        className="field-input"
                        value={item.optionD || ''}
                        onChange={(e) => handleQuestionChange(idx, 'optionD', e.target.value)}
                        placeholder={isCefrVocabMode ? "VD: Heal" : "Đáp án D"}
                        maxLength={60}
                      />
                    </div>
                  </div>

                  {/* Correct Option Selector */}
                  <div className="form-field full-width correct-answer-field">
                    <label className="field-label">
                      <CheckCircle2 size={14} className="text-success" /> Đáp án chính xác:
                    </label>
                    <div className="correct-pills-row">
                      {['A', 'B', 'C', 'D'].map((opt) => {
                        const isSelected = item.correctOption === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`correct-pill-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleQuestionChange(idx, 'correctOption', opt)}
                            title={`Chọn đáp án ${opt} là đáp án đúng`}
                          >
                            {isSelected && <Check size={13} className="pill-check" />}
                            <span className="correct-opt-prefix">Đáp án </span>
                            <span className="correct-opt-letter">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* IPA Transcription input for CEFR vocabulary mode */}
                  {isCefrVocabMode && (
                    <div className="form-field full-width">
                      <label className="field-label" style={{ color: '#00F0FF', fontWeight: 700 }}>
                        🔊 Phiên âm IPA chuẩn quốc tế:
                      </label>
                      <input
                        type="text"
                        className="field-input"
                        value={item.ipa || ''}
                        onChange={(e) => handleQuestionChange(idx, 'ipa', e.target.value)}
                        placeholder="VD: /helθ/, /ˈbæl.əns/, /səˈsteɪ.nə.bəl/..."
                        maxLength={50}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Explanation */}
              <div className="form-field full-width">
                <label className="field-label">Giải thích (hiển thị khi công bố kết quả):</label>
                <input
                  type="text"
                  className="field-input"
                  value={item.explanation || ''}
                  onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                  placeholder="Giải thích ngắn gọn cho đáp án..."
                  maxLength={120}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentQuestions.length < 15 && (
        <button
          type="button"
          className="btn-add-question"
          onClick={handleAddQuestion}
        >
          <Plus size={15} /> Thêm câu hỏi
        </button>
      )}
    </div>
  );
}
