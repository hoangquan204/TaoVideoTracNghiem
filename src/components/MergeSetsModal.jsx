import React from 'react';
import { Layers, X, Check, Film } from 'lucide-react';

export default function MergeSetsModal({
  isOpen,
  onClose,
  questionSets = [],
  selectedIndices = [],
  onToggleIndex,
  onSetIndices,
  onPreviewMerged,
  onExportMerged,
  isExporting = false
}) {
  if (!isOpen) return null;

  const totalSets = questionSets.length;
  const validIndices = selectedIndices.filter(i => i >= 0 && i < totalSets).sort((a, b) => a - b);
  const selectedSets = validIndices.map(i => questionSets[i]);
  const totalQuestions = selectedSets.reduce((sum, s) => sum + (s?.questions?.length || 0), 0);
  const selectedLabel = validIndices.map(i => `Bộ ${i + 1}`).join(' + ');

  const handleSelectAll = () => {
    onSetIndices(questionSets.map((_, i) => i));
  };

  const handleClearAll = () => {
    onSetIndices([]);
  };

  const canProceed = validIndices.length >= 2 && totalQuestions > 0 && !isExporting;

  return (
    <div className="merge-modal-overlay" onClick={onClose}>
      <div className="merge-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="merge-modal-header">
          <div className="merge-modal-title-group">
            <div className="merge-modal-icon-badge">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="merge-modal-title">Gộp Các Bộ Video Thành 1 File</h2>
              <p className="merge-modal-subtitle">
                Tích chọn các bộ bạn muốn ghép nối lại với nhau
              </p>
            </div>
          </div>
          <button
            type="button"
            className="merge-modal-close-btn"
            onClick={onClose}
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Select All / Clear All + Count */}
        <div className="merge-modal-toolbar">
          <div className="toolbar-left">
            <span className="toolbar-title">Chọn các bộ cần gộp:</span>
            <span className="toolbar-badge">
              {validIndices.length}/{totalSets} bộ đã chọn
            </span>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="toolbar-btn"
              onClick={handleSelectAll}
            >
              Chọn tất cả
            </button>
            <span className="toolbar-divider">|</span>
            <button
              type="button"
              className="toolbar-btn text-muted"
              onClick={handleClearAll}
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        {/* List of sets */}
        <div className="merge-sets-list">
          {questionSets.map((s, idx) => {
            const isChecked = validIndices.includes(idx);
            const qCount = s?.questions?.length || 0;
            const setName = s?.name || `Bộ câu hỏi #${idx + 1}`;

            return (
              <div
                key={idx}
                className={`merge-row ${isChecked ? 'active' : ''}`}
                onClick={() => onToggleIndex(idx)}
              >
                <div className={`merge-checkbox ${isChecked ? 'checked' : ''}`}>
                  {isChecked && <Check size={14} strokeWidth={3} />}
                </div>

                <div className="merge-row-body">
                  <div className="merge-row-header">
                    <span className="merge-row-badge">Bộ {idx + 1}</span>
                    <span className="merge-row-qcount">{qCount} câu</span>
                  </div>
                  <div className="merge-row-title" title={setName}>
                    {setName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer Bar */}
        <div className="merge-modal-summary">
          {validIndices.length < 2 ? (
            <span className="summary-hint-warning">
              ⚠️ Vui lòng tích chọn ít nhất 2 bộ để gộp thành 1 video
            </span>
          ) : (
            <div className="summary-hint-ready">
              <span>Ghép nối: <strong>{selectedLabel}</strong></span>
              <span className="summary-dot">•</span>
              <span>Tổng: <strong>{totalQuestions} câu hỏi</strong></span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="merge-modal-footer">
          <button
            type="button"
            className="merge-btn-secondary"
            onClick={onClose}
          >
            Đóng
          </button>

          <button
            type="button"
            className="merge-btn-primary"
            onClick={() => onExportMerged(validIndices)}
            disabled={!canProceed}
            title={validIndices.length < 2 ? 'Chọn ít nhất 2 bộ' : `Xuất 1 file video gộp (${totalQuestions} câu)`}
          >
            <Film size={16} />
            <span>
              {validIndices.length >= 2
                ? `Xuất video gộp (${totalQuestions} câu)`
                : 'Xuất video gộp'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
