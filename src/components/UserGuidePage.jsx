import React, { useState } from 'react';
import {
  BookOpen, Video, ArrowLeft, Download, Copy, Check,
  Play, Settings, FileText, Sparkles, HelpCircle,
  ExternalLink, Layers, Monitor, Smartphone, Volume2,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { MCQ_PRESETS } from '../utils/mcqPresets';

// Danh sách các dạng video chi tiết trong cẩm nang
const GUIDE_PRESETS = [
  {
    id: 'dia-ly-van-hoa-viet-nam',
    title: 'Địa Lý & Văn Hóa Việt Nam',
    badge: 'ĐỊA LÝ & VĂN HÓA VN',
    emoji: '🇻🇳',
    desc: 'Dạng video trắc nghiệm 4 đáp án (A, B, C, D) với ảnh nền phong cảnh Unsplash sắc nét, giọng đọc tiếng Việt đọc câu hỏi và thanh đếm ngược 3 giây.',
    platforms: ['YouTube 16:9', 'TikTok / Shorts 9:16'],
    sampleFile: 'mau_trac_nghiem_dia_ly_van_hoa_viet_nam.json',
    flow: [
      { step: '1. Đọc câu hỏi', text: 'Giọng đọc tiếng Việt (Hoài My / Nam Minh) đọc to nội dung câu hỏi.' },
      { step: '2. Đếm ngược 3s', text: 'Thanh tiến trình & đồng hồ tròn đếm ngược 3 giây kèm tiếng tích tắc.' },
      { step: '3. Mở đáp án', text: 'Ô đáp án đúng đổi màu xanh lá nổi bật, hiển thị giải thích chi tiết.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Nội dung câu hỏi (VD: Vịnh Hạ Long thuộc tỉnh nào?)' },
      { name: 'optionA, B, C, D', type: 'String', desc: '4 phương án lựa chọn' },
      { name: 'correctOption', type: 'A | B | C | D', desc: 'Đáp án chính xác' },
      { name: 'image', type: 'URL', desc: 'Link ảnh nền phong cảnh HD Unsplash' },
      { name: 'explanation', type: 'String', desc: 'Lời giải thích kiến thức sau khi mở đáp án' }
    ],
    jsonSample: {
      question: "Vịnh Hạ Long - Di sản Thiên nhiên Thế giới thuộc tỉnh nào của Việt Nam?",
      optionA: "Hải Phòng",
      optionB: "Quảng Ninh",
      optionC: "Nam Định",
      optionD: "Ninh Bình",
      correctOption: "B",
      explanation: "Vịnh Hạ Long thuộc tỉnh Quảng Ninh, nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ!",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"
    }
  },
  {
    id: 'animal-guess',
    title: 'Nhìn Ảnh Đoán Con Vật',
    badge: 'ĐOÁN CON VẬT',
    emoji: '🐾',
    desc: 'Hiển thị hình ảnh con vật trong khung ảnh trung tâm, giọng đọc câu hỏi "Đây là con gì?", 4 đáp án A-B-C-D, đếm ngược 3s và mở đáp án kèm nhạc hiệu chiến thắng.',
    platforms: ['TikTok / Shorts 9:16', 'YouTube 16:9'],
    sampleFile: 'mau_nhin_anh_doan_con_vat.json',
    flow: [
      { step: '1. Đọc câu hỏi', text: 'Đọc câu hỏi: "Đây là con gì?" kèm ảnh chụp động vật chân thực.' },
      { step: '2. Đếm ngược 3s', text: 'Đồng hồ đếm ngược 3-2-1 kích thích người xem suy đoán.' },
      { step: '3. Công bố đáp án', text: 'Hộp đáp án đúng phát sáng kèm lời giải thích về tập tính loài vật.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Mặc định: "Đây là con gì?"' },
      { name: 'animal / word', type: 'String', desc: 'Tên con vật chính xác (VD: Sư tử, Gấu trúc)' },
      { name: 'optionA, B, C, D', type: 'String', desc: '4 phương án tên con vật' },
      { name: 'correctOption', type: 'A | B | C | D', desc: 'Chữ cái đáp án đúng' },
      { name: 'image', type: 'URL', desc: 'Link ảnh con vật sắc nét' },
      { name: 'explanation', type: 'String', desc: 'Thông tin thú vị về loài động vật' }
    ],
    jsonSample: {
      question: "Đây là con gì?",
      animal: "Sư tử",
      optionA: "Hổ Bengal",
      optionB: "Sư tử",
      optionC: "Báo hoa mai",
      optionD: "Mèo rừng",
      correctOption: "B",
      explanation: "Sư tử được mệnh danh là chúa sơn lâm, sống thành bầy đàn ở đồng cỏ châu Phi!",
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800"
    }
  },
  {
    id: 'food-guess',
    title: 'Nhìn Hình Đoán Món Ăn',
    badge: 'ĐOÁN MÓN ĂN',
    emoji: '🍳',
    desc: 'Dành cho ẩm thực Việt Nam & thế giới. Hình ảnh món ăn được lồng trong khung thẻ sang trọng, đặt câu hỏi "Đây là món gì?", sau 3s mở đáp án chính xác.',
    platforms: ['TikTok / Shorts 9:16', 'YouTube 16:9'],
    sampleFile: 'mau_nhin_anh_doan_mon_an.json',
    flow: [
      { step: '1. Đọc câu hỏi', text: 'Đọc: "Đây là món gì?" cùng hình ảnh món ăn đặc sản bắt mắt.' },
      { step: '2. Đếm ngược 3s', text: 'Khán giả bình luận tên món ăn trong 3 giây đếm ngược.' },
      { step: '3. Công bố đáp án', text: 'Đáp án đúng nhấp nháy xanh lá, kèm nguồn gốc đặc sản vùng miền.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Mặc định: "Đây là món gì?"' },
      { name: 'dish / word', type: 'String', desc: 'Tên món ăn đúng (VD: Phở Bò Hà Nội)' },
      { name: 'optionA, B, C, D', type: 'String', desc: '4 lựa chọn tên món ăn' },
      { name: 'correctOption', type: 'A | B | C | D', desc: 'Đáp án chính xác' },
      { name: 'image', type: 'URL', desc: 'Link ảnh món ăn độ phân giải cao' },
      { name: 'explanation', type: 'String', desc: 'Giới thiệu về hương vị hoặc nguồn gốc món ăn' }
    ],
    jsonSample: {
      question: "Đây là món gì?",
      dish: "Phở Bò Hà Nội",
      optionA: "Bún Bò Huế",
      optionB: "Phở Bò Hà Nội",
      optionC: "Hủ Tiếu Nam Vang",
      optionD: "Mì Quảng",
      correctOption: "B",
      explanation: "Phở bò là món ăn quốc hồn quốc túy của Việt Nam, nổi tiếng với nước dùng thơm lừng thảo quả!",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800"
    }
  },
  {
    id: 'landmark-guess',
    title: 'Nhìn Ảnh Đoán Địa Danh Nổi Tiếng',
    badge: 'ĐOÁN ĐỊA DANH',
    emoji: '🏛️',
    desc: 'Khám phá các kỳ quan, thắng cảnh nổi tiếng của Việt Nam và Thế giới. Khung hình trưng bày địa danh, giọng đọc "Đây là địa danh nào?", đếm ngược 3s.',
    platforms: ['YouTube 16:9', 'TikTok / Shorts 9:16'],
    sampleFile: 'mau_nhin_anh_doan_dia_diem.json',
    flow: [
      { step: '1. Đọc câu hỏi', text: 'Đọc câu hỏi: "Đây là địa danh nào?" kèm hình ảnh kỳ quan.' },
      { step: '2. Đếm ngược 3s', text: 'Vòng tròn đếm ngược 3 giây mượt mà.' },
      { step: '3. Công bố đáp án', text: 'Bật sáng đáp án đúng, hiện tên địa danh kèm thông tin lịch sử.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Mặc định: "Đây là địa danh nào?"' },
      { name: 'landmark / word', type: 'String', desc: 'Tên địa danh (VD: Tháp Eiffel, Tràng An)' },
      { name: 'optionA, B, C, D', type: 'String', desc: '4 phương án lựa chọn' },
      { name: 'correctOption', type: 'A | B | C | D', desc: 'Đáp án chính xác' },
      { name: 'image', type: 'URL', desc: 'Link ảnh địa danh' },
      { name: 'explanation', type: 'String', desc: 'Mô tả vị trí và điểm đặc sắc của địa danh' }
    ],
    jsonSample: {
      question: "Đây là địa danh nào?",
      landmark: "Tháp Eiffel (Pháp)",
      optionA: "Tháp Nghiêng Pisa",
      optionB: "Tháp Eiffel (Pháp)",
      optionC: "Tháp Đồng hồ Big Ben",
      optionD: "Tòa tháp Tokyo Tower",
      correctOption: "B",
      explanation: "Tháp Eiffel là biểu tượng kinh đô ánh sáng Paris, khánh thành năm 1889!",
      image: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800"
    }
  },
  {
    id: 'flags',
    title: 'Nhìn Cờ Đoán Quốc Gia',
    badge: 'ĐOÁN QUỐC KỲ',
    emoji: '🚩',
    desc: 'Hiển thị hình ảnh quốc kỳ của các nước, câu hỏi "Đây là quốc kỳ của nước nào?", 4 đáp án A-B-C-D, đếm ngược 3s rồi công bố kết quả.',
    platforms: ['TikTok / Shorts 9:16', 'YouTube 16:9'],
    sampleFile: 'mau_nhin_co_doan_quoc_gia.json',
    flow: [
      { step: '1. Đọc câu hỏi', text: 'Đọc: "Đây là quốc kỳ của nước nào?" kèm hình lá cờ sắc nét.' },
      { step: '2. Đếm ngược 3s', text: 'Thanh thời gian 3 giây kích thích tương tác.' },
      { step: '3. Công bố đáp án', text: 'Đáp án sáng xanh, nêu ý nghĩa biểu tượng trên quốc kỳ.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Mặc định: "Đây là quốc kỳ của nước nào?"' },
      { name: 'country / word', type: 'String', desc: 'Tên quốc gia (VD: Brazil, Nhật Bản)' },
      { name: 'optionA, B, C, D', type: 'String', desc: '4 tên quốc gia lựa chọn' },
      { name: 'correctOption', type: 'A | B | C | D', desc: 'Chữ cái đáp án đúng' },
      { name: 'image', type: 'URL', desc: 'Link ảnh cờ (khuyên dùng link flagcdn.com)' },
      { name: 'explanation', type: 'String', desc: 'Ý nghĩa màu sắc và hình vẽ trên lá cờ' }
    ],
    jsonSample: {
      question: "Đây là quốc kỳ của nước nào?",
      country: "Brazil",
      optionA: "Argentina",
      optionB: "Brazil",
      optionC: "Uruguay",
      optionD: "Colombia",
      correctOption: "B",
      explanation: "Quốc kỳ Brazil có màu vàng - xanh lá với biểu tượng chòm sao Nam Thập Tự và khẩu hiệu Trật tự và Tiến bộ!",
      image: "https://flagcdn.com/w320/br.png"
    }
  },
  {
    id: 'vocab-b1-word-guess',
    title: 'Đoán Ô Chữ B1 (Điền Chữ Cái Vào Ô)',
    badge: 'ĐOÁN Ô CHỮ B1',
    emoji: '🔤',
    desc: 'Trò chơi ô chữ tiếng Anh B1 đỉnh cao. Hiển thị gợi ý tiếng Việt + hình ảnh, các ô chữ cái ẩn (hiện chữ cái đầu). Sau 3s đếm ngược, nảy toàn bộ chữ cái, phát âm chuẩn tiếng Anh bản xứ và hiện phiên âm IPA.',
    platforms: ['YouTube 16:9 (Giao diện 2 cột)', 'TikTok / Shorts 9:16 (Dọc)'],
    sampleFile: 'mau_doan_tu_vung_word_guess.json',
    flow: [
      { step: '1. Gợi ý nghĩa', text: 'Giọng Việt đọc nghĩa tiếng Việt (VD: "Cân bằng"), ô chữ hiện chữ cái đầu [ B _ _ _ _ _ _ ].' },
      { step: '2. Đếm ngược 3s', text: 'Khán giả suy đoán từ tiếng Anh tương ứng.' },
      { step: '3. Nảy chữ & Phát âm', text: 'Tất cả ô nảy xanh [ B A L A N C E ], giọng Mỹ đọc "Balance", hiện IPA /ˈbæl.əns/.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Nghĩa tiếng Việt gợi ý (VD: Cân bằng, sự thăng bằng)' },
      { name: 'word', type: 'String', desc: 'Từ tiếng Anh cần đoán (VD: BALANCE)' },
      { name: 'ipa', type: 'String', desc: 'Ký hiệu phiên âm quốc tế IPA (VD: /ˈbæl.əns/)' },
      { name: 'image', type: 'URL', desc: 'Ảnh minh họa từ vựng' },
      { name: 'explanation', type: 'String', desc: 'Giải thích từ loại, nghĩa mở rộng và ví dụ câu' }
    ],
    jsonSample: {
      question: "Cân bằng, sự thăng bằng",
      word: "BALANCE",
      ipa: "/ˈbæl.əns/",
      explanation: "Balance (n/v): Cân bằng, sự thăng bằng trong cuộc sống và công việc.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"
    }
  },
  {
    id: 'ca-dao-tuc-ngu',
    title: 'Đố Ca Dao Tục Ngữ Việt Nam',
    badge: 'CA DAO TỤC NGỮ',
    emoji: '🌾',
    desc: 'Điền từ còn thiếu vào câu ca dao, tục ngữ dân gian Việt Nam. Giọng đọc truyền cảm, 4 đáp án từ ngữ chọn lọc, đếm ngược 3s và mở đáp án đúng.',
    platforms: ['TikTok / Shorts 9:16', 'YouTube 16:9'],
    sampleFile: 'mau_trac_nghiem_dia_ly_van_hoa_viet_nam.json',
    flow: [
      { step: '1. Đọc câu ca dao', text: 'Đọc vế câu khuyết từ (VD: "Công cha như núi Thái Sơn, Nghĩa mẹ như nước trong ... chảy ra").' },
      { step: '2. Đếm ngược 3s', text: 'Người xem chọn từ còn thiếu phù hợp vần điệu.' },
      { step: '3. Mở từ đúng', text: 'Hiện câu ca dao hoàn chỉnh và giải thích bài học đạo lý.' }
    ],
    fields: [
      { name: 'question', type: 'String', desc: 'Câu ca dao có chỗ trống "..."' },
      { name: 'optionA, B, C, D', type: 'String', desc: '4 từ lựa chọn điền vào chỗ trống' },
      { name: 'correctOption', type: 'A | B | C | D', desc: 'Đáp án chính xác' },
      { name: 'image', type: 'URL', desc: 'Ảnh làng quê, cảnh vật Việt Nam' },
      { name: 'explanation', type: 'String', desc: 'Ý nghĩa triết lý nhân sinh của câu ca dao' }
    ],
    jsonSample: {
      question: "Công cha như núi Thái Sơn / Nghĩa mẹ như nước trong ... chảy ra?",
      optionA: "nguồn",
      optionB: "sông",
      optionC: "suối",
      optionD: "hồ",
      correctOption: "A",
      explanation: "Bài ca dao nhắc nhở công ơn sinh thành dưỡng dục vô bờ bến của cha mẹ dành cho con cái!",
      image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800"
    }
  },
  {
    id: 'country-guess-5-clues',
    title: 'Đoán Quốc Gia Qua 5 Gợi Ý',
    badge: 'ĐOÁN QUỐC GIA',
    emoji: '🌎',
    desc: 'Trò chơi trí tuệ kịch tính: 5 gợi ý tuần tự xuất hiện từ khó đến dễ (vị trí địa lý, món ăn, kỳ quan, biệt danh, thủ đô), sau đó mở quốc kỳ và tên nước.',
    platforms: ['YouTube 16:9', 'TikTok / Shorts 9:16'],
    sampleFile: 'mau_doan_quoc_gia_5_goi_y.json',
    flow: [
      { step: '1. Gợi ý 1 - 5', text: 'Lần lượt mở 5 gợi ý kèm hình ảnh minh họa tương ứng.' },
      { step: '2. Suy luận', text: 'Người xem suy luận quốc gia bí ẩn qua các dữ kiện.' },
      { step: '3. Mở quốc kỳ', text: 'Hiển thị lá cờ rực rỡ và tên quốc gia chính xác.' }
    ],
    fields: [
      { name: 'country', type: 'String', desc: 'Tên quốc gia (VD: Nhật Bản, Ý)' },
      { name: 'flag', type: 'Emoji / URL', desc: 'Quốc kỳ (VD: 🇯🇵 hoặc link ảnh cờ)' },
      { name: 'clues', type: 'Array (5 items)', desc: 'Mảng 5 gợi ý, mỗi gợi ý gồm step, icon, text, image' }
    ],
    jsonSample: {
      country: "Nhật Bản",
      flag: "🇯🇵",
      clues: [
        { step: 1, icon: "🌏", text: "Quốc gia này nằm ở khu vực Đông Á.", image: "https://images.unsplash.com/photo-1540573133985-7789883c8255?w=800" },
        { step: 2, icon: "🍣", text: "Món ăn Sushi & Ramen cực kỳ nổi tiếng.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800" },
        { step: 3, icon: "🗻", text: "Có ngọn núi Phú Sĩ phủ tuyết trắng quanh năm.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800" },
        { step: 4, icon: "🌸", text: "Được mệnh danh là Xứ sở Hoa Anh Đào.", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800" },
        { step: 5, icon: "🗼", text: "Thủ đô là Tokyo sầm uất & hiện đại bậc nhất thế giới.", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800" }
      ]
    }
  }
];

export default function UserGuidePage({ onSelectPreset, onBack }) {
  const [activeTab, setActiveTab] = useState('formats'); // 'formats' | 'steps' | 'json' | 'settings' | 'faq'
  const [copiedId, setCopiedId] = useState(null);
  const [selectedFormatId, setSelectedFormatId] = useState(GUIDE_PRESETS[0].id);

  const handleCopyCode = (id, jsonText) => {
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDownloadFile = (fileName) => {
    fetch(`/${fileName}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể tải file mẫu');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => alert(`Lỗi tải file: ${err.message}`));
  };

  const currentFormat = GUIDE_PRESETS.find(f => f.id === selectedFormatId) || GUIDE_PRESETS[0];

  return (
    <div className="user-guide-page">
      {/* Top Banner */}
      <div className="guide-hero-card">
        <div className="guide-hero-top">
          <button
            type="button"
            className="guide-back-btn"
            onClick={onBack}
            title="Quay lại giao diện tạo video"
          >
            <ArrowLeft size={16} /> Quay lại tạo video
          </button>
          <span className="guide-hero-badge">CẨM NANG TOÀN DIỆN</span>
        </div>

        <h1 className="guide-hero-title">
          Hướng Dẫn Sử Dụng <span className="text-primary-gradient">Vietnam GeoQuiz Video Maker</span>
        </h1>
        <p className="guide-hero-subtitle">
          Quy trình chi tiết từ A - Z để tạo video trắc nghiệm câu hỏi, nhìn ảnh đoán, đoán ô chữ chuẩn YouTube 16:9 và TikTok/Shorts 9:16 chuyên nghiệp trong vài phút.
        </p>

        {/* Quick Nav Tabs */}
        <div className="guide-tabs-row">
          <button
            type="button"
            className={`guide-tab-pill ${activeTab === 'formats' ? 'active' : ''}`}
            onClick={() => setActiveTab('formats')}
          >
            <Video size={14} /> Các dạng video
          </button>
          <button
            type="button"
            className={`guide-tab-pill ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
          >
            <Layers size={14} /> 4 Bước tạo video
          </button>
          <button
            type="button"
            className={`guide-tab-pill ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            <FileText size={14} /> Cấu trúc file JSON
          </button>
          <button
            type="button"
            className={`guide-tab-pill ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={14} /> Tỷ lệ & Giọng đọc
          </button>
          <button
            type="button"
            className={`guide-tab-pill ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <HelpCircle size={14} /> FAQ & Khắc phục lỗi
          </button>
        </div>
      </div>

      {/* CONTENT: TAB 1 - CÁC DẠNG VIDEO */}
      {activeTab === 'formats' && (
        <div className="guide-content-section">
          <div className="guide-section-header">
            <div>
              <h2 className="guide-section-title">Chọn & Tìm hiểu từng dạng video</h2>
              <p className="guide-section-desc">Hệ thống hỗ trợ 8 dạng video chuyên biệt với giao diện canvas và kịch bản âm thanh tự động.</p>
            </div>
          </div>

          <div className="guide-formats-layout">
            {/* Left sidebar format selector */}
            <div className="guide-formats-list">
              {GUIDE_PRESETS.map((fmt) => {
                const isSelected = selectedFormatId === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    className={`guide-format-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedFormatId(fmt.id)}
                  >
                    <span className="fmt-emoji">{fmt.emoji}</span>
                    <div className="fmt-text">
                      <span className="fmt-name">{fmt.title}</span>
                      <span className="fmt-badge">{fmt.badge}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right detail card for selected format */}
            <div className="guide-format-detail-card">
              <div className="detail-card-header">
                <div className="detail-card-title-group">
                  <span className="detail-emoji">{currentFormat.emoji}</span>
                  <div>
                    <h3 className="detail-title">{currentFormat.title}</h3>
                    <div className="detail-platforms">
                      {currentFormat.platforms.map((p, pi) => (
                        <span key={pi} className="platform-tag">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="detail-header-actions">
                  <button
                    type="button"
                    className="btn-use-preset"
                    onClick={() => onSelectPreset(currentFormat.id)}
                    title="Mở ngay dạng video này trong bộ tạo video"
                  >
                    <Play size={14} /> Tạo video dạng này ngay
                  </button>
                  {currentFormat.sampleFile && (
                    <button
                      type="button"
                      className="btn-download-sample"
                      onClick={() => handleDownloadFile(currentFormat.sampleFile)}
                      title={`Tải file mẫu ${currentFormat.sampleFile}`}
                    >
                      <Download size={14} /> Tải file JSON mẫu
                    </button>
                  )}
                </div>
              </div>

              <p className="detail-description">{currentFormat.desc}</p>

              {/* Flow Timeline */}
              <div className="detail-flow-section">
                <h4 className="detail-subheading">Kịch bản phát video tự động:</h4>
                <div className="flow-steps-grid">
                  {currentFormat.flow.map((st, si) => (
                    <div key={si} className="flow-step-box">
                      <div className="flow-step-badge">{st.step}</div>
                      <p className="flow-step-text">{st.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fields Table */}
              <div className="detail-fields-section">
                <h4 className="detail-subheading">Các trường dữ liệu trong câu hỏi:</h4>
                <div className="fields-table-wrap">
                  <table className="guide-table">
                    <thead>
                      <tr>
                        <th>Tên trường</th>
                        <th>Kiểu</th>
                        <th>Ý nghĩa & Ví dụ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFormat.fields.map((f, fi) => (
                        <tr key={fi}>
                          <td><code>{f.name}</code></td>
                          <td><span className="type-badge">{f.type}</span></td>
                          <td>{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* JSON Snippet Box */}
              <div className="detail-code-section">
                <div className="code-header">
                  <span className="code-title">Ví dụ cấu trúc JSON 1 câu hỏi mẫu:</span>
                  <button
                    type="button"
                    className="code-copy-btn"
                    onClick={() => handleCopyCode(currentFormat.id, JSON.stringify(currentFormat.jsonSample, null, 2))}
                  >
                    {copiedId === currentFormat.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === currentFormat.id ? 'Đã sao chép!' : 'Sao chép JSON'}
                  </button>
                </div>
                <pre className="code-block">
                  <code>{JSON.stringify(currentFormat.jsonSample, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: TAB 2 - 4 BƯỚC TẠO VIDEO */}
      {activeTab === 'steps' && (
        <div className="guide-content-section">
          <div className="guide-section-header">
            <div>
              <h2 className="guide-section-title">Quy trình 4 bước tạo video hoàn chỉnh</h2>
              <p className="guide-section-desc">Từ ý tưởng đến video hoàn chỉnh sẵn sàng tải lên YouTube hoặc TikTok chỉ trong 4 bước đơn giản.</p>
            </div>
          </div>

          <div className="steps-cards-grid">
            <div className="workflow-card">
              <div className="workflow-number">01</div>
              <h3 className="workflow-title">Chọn Dạng Video</h3>
              <p className="workflow-desc">
                Nhấp vào danh mục ở thanh bên trái (Sidebar) để chọn thể loại bạn muốn làm: <strong>Địa Lý VN</strong>, <strong>Đoán Con Vật</strong>, <strong>Đoán Món Ăn</strong>, <strong>Địa Danh</strong>, <strong>Quốc Kỳ</strong>, hay <strong>Đoán Ô Chữ B1</strong>.
              </p>
              <div className="workflow-tip">
                Mẹo: Hệ thống tự động áp dụng chủ đề màu sắc, âm thanh và quy tắc đọc giọng nói phù hợp nhất cho dạng đó.
              </div>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">02</div>
              <h3 className="workflow-title">Soạn Nội Dung Hoặc Tải File Lên</h3>
              <p className="workflow-desc">
                Bạn có thể chọn 1 trong 2 cách:
              </p>
              <ul className="workflow-list">
                <li><strong>Cách 1:</strong> Sửa trực tiếp câu hỏi, ảnh minh họa và 4 đáp án trên giao diện form.</li>
                <li><strong>Cách 2:</strong> Bấm <em>"Tải file mẫu JSON"</em>, chỉnh sửa nhiều câu hỏi trên máy tính rồi bấm <em>"Tải file lên"</em> để nhập hàng loạt bộ câu hỏi.</li>
              </ul>
              <div className="workflow-tip">
                Mỗi bộ câu hỏi chuẩn thường gồm 5 câu để video có thời lượng Shorts từ 35 - 55 giây tối ưu retention.
              </div>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">03</div>
              <h3 className="workflow-title">Tùy Chỉnh Tỷ Lệ & Giọng Đọc</h3>
              <p className="workflow-desc">
                Ở cột bên phải bảng xem trước, bạn có thể thiết lập:
              </p>
              <ul className="workflow-list">
                <li><strong>Tỷ lệ video:</strong> Chọn <strong>9:16 Shorts/TikTok</strong> hoặc <strong>16:9 YouTube</strong>.</li>
                <li><strong>Giọng đọc (TTS):</strong> Chọn giọng nam/nữ tiếng Việt hoặc tiếng Anh chuẩn bản xứ.</li>
                <li><strong>Tốc độ đọc:</strong> 1.0x (bình thường), 1.25x (chuẩn Shorts cuốn hút).</li>
                <li><strong>Thời gian đếm ngược:</strong> Mặc định 3 giây.</li>
              </ul>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">04</div>
              <h3 className="workflow-title">Xem Trước & Xuất Video</h3>
              <p className="workflow-desc">
                Bấm nút <strong>"Phát video"</strong> để kiểm tra chuyển động, giọng đọc và hiệu ứng pháo hoa. Khi ưng ý, bấm <strong>"Xuất Video Full HD"</strong> để tải file MP4 / WebM về máy tính hoàn toàn miễn phí không chèn logo!
              </p>
              <div className="workflow-tip">
                Video được kết xuất trực tiếp bằng Canvas 60fps sắc nét và âm thanh tổng hợp không giật lag.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: TAB 3 - CẤU TRÚC FILE JSON */}
      {activeTab === 'json' && (
        <div className="guide-content-section">
          <div className="guide-section-header">
            <div>
              <h2 className="guide-section-title">Cấu trúc chuẩn file JSON tải lên</h2>
              <p className="guide-section-desc">Hệ thống hỗ trợ cả định dạng 1 bộ câu hỏi đơn giản hoặc nhiều bộ câu hỏi (Bộ 1, Bộ 2, Bộ 3...).</p>
            </div>
          </div>

          <div className="json-guide-grid">
            {/* Multiple Sets JSON */}
            <div className="json-box-card">
              <div className="json-box-header">
                <div>
                  <h3 className="json-box-title">Định dạng nhiều Bộ câu hỏi (Khuyên dùng)</h3>
                  <span className="json-box-subtitle">Cho phép chuyển đổi giữa Bộ 1, Bộ 2, Bộ 3... trong cùng 1 video</span>
                </div>
                <button
                  type="button"
                  className="code-copy-btn"
                  onClick={() => handleCopyCode('multi-json', JSON.stringify({
                    title: "Bộ câu hỏi trắc nghiệm",
                    mode: "animal-guess",
                    sets: [
                      {
                        name: "Bộ 1: Động Vật Rừng Xanh",
                        topic: "ĐOÁN CON VẬT",
                        mode: "animal-guess",
                        questions: [
                          {
                            question: "Đây là con gì?",
                            animal: "Sư tử",
                            optionA: "Hổ",
                            optionB: "Sư tử",
                            optionC: "Báo",
                            optionD: "Mèo",
                            correctOption: "B",
                            explanation: "Sư tử là chúa tể muôn loài!",
                            image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800"
                          }
                        ]
                      }
                    ]
                  }, null, 2))}
                >
                  {copiedId === 'multi-json' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === 'multi-json' ? 'Đã chép!' : 'Sao chép mẫu'}
                </button>
              </div>

              <pre className="code-block">
                <code>{`{
  "title": "Bộ câu hỏi đố vui",
  "mode": "animal-guess",
  "sets": [
    {
      "name": "Bộ 1: Tên bộ câu hỏi 1",
      "topic": "CHỦ ĐỀ HIỂN THỊ",
      "mode": "animal-guess",
      "questions": [
        {
          "question": "Câu hỏi số 1?",
          "optionA": "Đáp án A",
          "optionB": "Đáp án B",
          "optionC": "Đáp án C",
          "optionD": "Đáp án D",
          "correctOption": "A",
          "explanation": "Giải thích khi hiện kết quả",
          "image": "https://images.unsplash.com/photo-..."
        }
      ]
    },
    {
      "name": "Bộ 2: Tên bộ câu hỏi 2",
      "questions": [ ... ]
    }
  ]
}`}</code>
              </pre>
            </div>

            {/* Single Array JSON */}
            <div className="json-box-card">
              <div className="json-box-header">
                <div>
                  <h3 className="json-box-title">Định dạng 1 danh sách câu hỏi đơn giản</h3>
                  <span className="json-box-subtitle">Mảng JSON gồm các đối tượng câu hỏi trực tiếp</span>
                </div>
                <button
                  type="button"
                  className="code-copy-btn"
                  onClick={() => handleCopyCode('single-json', JSON.stringify([
                    {
                      question: "Vịnh Hạ Long thuộc tỉnh nào?",
                      optionA: "Hải Phòng",
                      optionB: "Quảng Ninh",
                      optionC: "Nam Định",
                      optionD: "Ninh Bình",
                      correctOption: "B",
                      explanation: "Vịnh Hạ Long thuộc tỉnh Quảng Ninh!",
                      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"
                    }
                  ], null, 2))}
                >
                  {copiedId === 'single-json' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === 'single-json' ? 'Đã chép!' : 'Sao chép mẫu'}
                </button>
              </div>

              <pre className="code-block">
                <code>{`[
  {
    "question": "Vịnh Hạ Long thuộc tỉnh nào?",
    "optionA": "Hải Phòng",
    "optionB": "Quảng Ninh",
    "optionC": "Nam Định",
    "optionD": "Ninh Bình",
    "correctOption": "B",
    "explanation": "Vịnh Hạ Long thuộc tỉnh Quảng Ninh!",
    "image": "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80"
  },
  {
    "question": "Câu hỏi tiếp theo?",
    "optionA": "A",
    "optionB": "B",
    "optionC": "C",
    "optionD": "D",
    "correctOption": "A",
    "explanation": "Giải thích...",
    "image": "https://..."
  }
]`}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: TAB 4 - TỶ LỆ & CÀI ĐẶT GIỌNG ĐỌC */}
      {activeTab === 'settings' && (
        <div className="guide-content-section">
          <div className="guide-section-header">
            <div>
              <h2 className="guide-section-title">Tỷ lệ khung hình & Cài đặt nâng cao</h2>
              <p className="guide-section-desc">Cách tinh chỉnh video để đạt lượng tương tác và thời gian xem trung bình cao nhất.</p>
            </div>
          </div>

          <div className="settings-comparison-grid">
            <div className="comparison-card">
              <div className="card-top-icon"><Smartphone size={24} className="text-primary" /></div>
              <h3 className="card-heading">Khung hình dọc 9:16 (1080 x 1920)</h3>
              <p className="card-desc">Tối ưu cho TikTok, YouTube Shorts, Facebook Reels và Instagram Reels.</p>
              <ul className="guide-check-list">
                <li><Check size={14} /> Thẻ ảnh minh họa trung tâm lớn, bo góc hiện đại.</li>
                <li><Check size={14} /> 4 đáp án dạng nút bấm lớn dễ tương tác chạm trên điện thoại di động.</li>
                <li><Check size={14} /> Thanh tiến trình đếm ngược 3s chạy mượt mà ngay trên màn hình.</li>
                <li><Check size={14} /> Phù hợp video ngắn thời lượng dưới 60 giây.</li>
              </ul>
            </div>

            <div className="comparison-card">
              <div className="card-top-icon"><Monitor size={24} className="text-primary" /></div>
              <h3 className="card-heading">Khung hình ngang 16:9 (1920 x 1080)</h3>
              <p className="card-desc">Tối ưu cho YouTube video chuẩn, màn hình máy tính và Smart TV.</p>
              <ul className="guide-check-list">
                <li><Check size={14} /> Bố cục 2 cột chuyên nghiệp: Cột trái ảnh lớn HD, cột phải chứa câu hỏi và đáp án.</li>
                <li><Check size={14} /> Hiệu ứng chuyển động máy quay Ken Burns mượt mà không gây nhàm chán.</li>
                <li><Check size={14} /> Dạng Ô Chữ B1 hiển thị dãy ô chữ cái, phiên âm IPA và giải thích song ngữ rộng rãi.</li>
                <li><Check size={14} /> Phù hợp video tổng hợp kiến thức từ 3 đến 10 phút.</li>
              </ul>
            </div>
          </div>

          <div className="tts-guide-box">
            <div className="tts-guide-header">
              <Volume2 size={20} className="text-primary" />
              <h3 className="tts-guide-title">Hướng dẫn thiết lập giọng đọc (TTS Engine)</h3>
            </div>
            <p className="tts-guide-desc">
              Hệ thống tích hợp công nghệ giọng đọc trí tuệ nhân tạo mượt mà tự nhiên, phát âm chuẩn cả Tiếng Việt và Tiếng Anh:
            </p>
            <div className="tts-voice-cards">
              <div className="voice-card">
                <span className="voice-name">🇻🇳 vi-VN-HoaiMyNeural (Nữ)</span>
                <p className="voice-detail">Giọng nữ miền Bắc ngọt ngào, truyền cảm, phù hợp Địa Lý, Lịch Sử, Ca Dao, Đố Vui.</p>
              </div>
              <div className="voice-card">
                <span className="voice-name">🇻🇳 vi-VN-NamMinhNeural (Nam)</span>
                <p className="voice-detail">Giọng nam trầm ấm, dõng dạc, phù hợp các video khám phá, kiến thức khoa học.</p>
              </div>
              <div className="voice-card">
                <span className="voice-name">🇺🇸 en-US-AnaNeural (Tiếng Anh)</span>
                <p className="voice-detail">Giọng nữ bản xứ Mỹ chuẩn quốc tế, tự động phát âm khi công bố từ vựng trong dạng Ô Chữ B1.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: TAB 5 - FAQ & KHẮC PHỤC LỖI */}
      {activeTab === 'faq' && (
        <div className="guide-content-section">
          <div className="guide-section-header">
            <div>
              <h2 className="guide-section-title">Câu hỏi thường gặp & Khắc phục sự cố</h2>
              <p className="guide-section-desc">Giải đáp các thắc mắc phổ biến nhất khi tạo và xuất video.</p>
            </div>
          </div>

          <div className="faq-accordion-list">
            <div className="faq-item">
              <h4 className="faq-question">1. Video sau khi xuất được lưu ở đâu?</h4>
              <p className="faq-answer">
                Khi bấm <strong>"Xuất Video Full HD"</strong>, hệ thống sẽ kết xuất trực tiếp trên trình duyệt của bạn và tự động tải file video về thư mục <code>Downloads (Tải về)</code> của máy tính dưới định dạng WebM / MP4 chất lượng cao nhất.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">2. Tại sao một số hình ảnh không tải được hoặc hiện khung xám?</h4>
              <p className="faq-answer">
                Một số trang web chặn liên kết trực tiếp (hotlink). Để ảnh luôn hiển thị sắc nét 100%, bạn nên lấy link ảnh từ các nguồn mở như <strong>Unsplash.com</strong> (nhấp chuột phải vào ảnh chọn <em>"Copy Image Address"</em>), <strong>Wikimedia Commons</strong>, hoặc dịch vụ cờ <strong>flagcdn.com</strong>.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">3. Tải file JSON lên báo lỗi "Lỗi đọc file" thì sửa thế nào?</h4>
              <p className="faq-answer">
                Lỗi thường do file JSON bị thiếu dấu phẩy <code>,</code> giữa các đối tượng hoặc thừa dấu phẩy ở phần tử cuối cùng. Cách đơn giản nhất là bấm nút <strong>"Tải file mẫu JSON"</strong> có sẵn trên website, mở bằng Notepad hoặc VS Code rồi thay nội dung câu hỏi vào.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">4. Làm thế nào để tạo video Ô Chữ B1 nằm ngang cho YouTube?</h4>
              <p className="faq-answer">
                Trong Sidebar, chọn dạng <strong>"🔤 Đoán Ô Chữ"</strong>. Tại bảng điều khiển bên phải, ở mục <strong>"Tỷ lệ khung hình"</strong>, bấm chọn biểu tượng <strong>"16:9 YouTube"</strong>. Hệ thống sẽ tự động bật giao diện 2 cột với ảnh minh họa bên trái và ô chữ nảy bên phải.
              </p>
            </div>

            <div className="faq-item">
              <h4 className="faq-question">5. Video có bị dính watermark hay bản quyền không?</h4>
              <p className="faq-answer">
                Hoàn toàn không. Video bạn tạo ra thuộc 100% quyền sở hữu của bạn, không có watermark hay logo ẩn, bạn có thể tự do đăng tải lên YouTube, TikTok, Facebook, Instagram để xây dựng kênh và kiếm tiền!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="guide-bottom-bar">
        <div className="guide-bottom-info">
          <span className="bottom-tag">SẴN SÀNG TẠO VIDEO?</span>
          <span className="bottom-title">Bắt đầu sản xuất những video trắc nghiệm cuốn hút ngay bây giờ!</span>
        </div>
        <button
          type="button"
          className="btn-start-making"
          onClick={onBack}
        >
          <Play size={16} /> Bắt đầu tạo video ngay
        </button>
      </div>
    </div>
  );
}

