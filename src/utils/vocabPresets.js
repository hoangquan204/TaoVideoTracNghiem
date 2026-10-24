// Presets cho Dạng Video Từ Vựng Theo Danh Sách (Vocab List Video - Phong cách BIGO & Lingo BiBi)

export const DEFAULT_LINGOBIBI_VOCAB_JSON = {
  "id": "vocab-lingobibi-family-10",
  "channel": "Lingo BiBi",
  "themeStyle": "lingobibi",
  "themeColor": "pink",
  "logo": "/logo_lingo_bibi.png",
  "title": "10 TỪ VỰNG VỀ GIA ĐÌNH",
  "subtitle": "Học Tiếng Anh siêu dễ cùng Lingo BiBi! 🎀",
  "category": "Gia đình",
  "headerIcon": "👨‍👩‍👧‍👦",
  "voice": "en-US-AnaNeural",
  "voiceSpeed": 1.25,
  "timePerWord": 4.0,
  "mascotName": "Lingo BiBi",
  "items": [
    { "id": 1, "vi": "Bố / Cha", "en": "Father", "ipa": "/ˈfɑː.ðər/", "icon": "👨" },
    { "id": 2, "vi": "Mẹ", "en": "Mother", "ipa": "/ˈmʌð.ər/", "icon": "👩" },
    { "id": 3, "vi": "Anh / Em trai", "en": "Brother", "ipa": "/ˈbrʌð.ər/", "icon": "👦" },
    { "id": 4, "vi": "Chị / Em gái", "en": "Sister", "ipa": "/ˈsɪs.tər/", "icon": "👧" },
    { "id": 5, "vi": "Ông", "en": "Grandfather", "ipa": "/ˈɡræn.fɑː.ðər/", "icon": "👴" },
    { "id": 6, "vi": "Bà", "en": "Grandmother", "ipa": "/ˈɡræn.mʌð.ər/", "icon": "👵" },
    { "id": 7, "vi": "Chú / Bác", "en": "Uncle", "ipa": "/ˈʌŋ.kəl/", "icon": "🧔" },
    { "id": 8, "vi": "Cô / Dì", "en": "Aunt", "ipa": "/ɑːnt/", "icon": "👩‍🦱" },
    { "id": 9, "vi": "Anh chị em họ", "en": "Cousin", "ipa": "/ˈkʌz.ən/", "icon": "🧒" },
    { "id": 10, "vi": "Em bé", "en": "Baby", "ipa": "/ˈbeɪ.bi/", "icon": "👶" }
  ]
};

export const DEFAULT_VOCAB_JSON = {
  "id": "vocab-cooking-10",
  "channel": "BIGO",
  "themeStyle": "bigo",
  "themeColor": "blue",
  "logo": "/logo2.png",
  "title": "10 TỪ VỰNG VỀ NẤU ĂN",
  "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
  "category": "Nấu ăn",
  "headerIcon": "👨‍🍳",
  "voice": "en-US-AnaNeural",
  "voiceSpeed": 1.25,
  "timePerWord": 4.0,
  "mascotName": "BIGO",
  "items": [
    { "id": 1, "vi": "Nấu", "en": "Cook", "ipa": "/kʊk/", "icon": "🍲" },
    { "id": 2, "vi": "Chiên", "en": "Fry", "ipa": "/fraɪ/", "icon": "🍳" },
    { "id": 3, "vi": "Luộc", "en": "Boil", "ipa": "/bɔɪl/", "icon": "🥦" },
    { "id": 4, "vi": "Nướng", "en": "Bake", "ipa": "/beɪk/", "icon": "🍗" },
    { "id": 5, "vi": "Hấp", "en": "Steam", "ipa": "/stiːm/", "icon": "🥟" },
    { "id": 6, "vi": "Thái", "en": "Chop", "ipa": "/tʃɒp/", "icon": "🥒" },
    { "id": 7, "vi": "Băm", "en": "Mince", "ipa": "/mɪns/", "icon": "🥩" },
    { "id": 8, "vi": "Gọt", "en": "Crack", "ipa": "/kræk/", "icon": "🥔" },
    { "id": 9, "vi": "Trộn", "en": "Mix", "ipa": "/mɪks/", "icon": "🥗" },
    { "id": 10, "vi": "Khuấy", "en": "Whisk", "ipa": "/wɪsk/", "icon": "🥣" }
  ]
};

export const VOCAB_PRESETS = [
  {
    id: "vocab-lingobibi-family-10",
    name: "🎀 10 Từ Vựng Về Gia Đình (Lingo BiBi Style - Cute Pink)",
    description: "Bộ từ vựng chủ đề Gia Đình cho kênh Lingo BiBi: Father, Mother, Brother, Sister, Grandfather...",
    data: DEFAULT_LINGOBIBI_VOCAB_JSON
  },
  {
    id: "vocab-lingobibi-school-10",
    name: "🏫 10 Từ Vựng Đồ Dùng Học Tập (Lingo BiBi Style)",
    description: "Bộ từ vựng đồ dùng học tập: Pencil, Pen, Book, Ruler, Eraser, Schoolbag, Desk, Crayon...",
    data: {
      "id": "vocab-lingobibi-school-10",
      "channel": "Lingo BiBi",
      "themeStyle": "lingobibi",
      "themeColor": "pink",
      "logo": "/logo_lingo_bibi.png",
      "title": "10 ĐỒ DÙNG HỌC TẬP",
      "subtitle": "Học Tiếng Anh siêu dễ cùng Lingo BiBi! 🎀",
      "category": "Trường học",
      "headerIcon": "🎒",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "Lingo BiBi",
      "items": [
        { "id": 1, "vi": "Bút chì", "en": "Pencil", "ipa": "/ˈpen.səl/", "icon": "✏️" },
        { "id": 2, "vi": "Bút mực", "en": "Pen", "ipa": "/pen/", "icon": "🖊️" },
        { "id": 3, "vi": "Sách", "en": "Book", "ipa": "/bʊk/", "icon": "📚" },
        { "id": 4, "vi": "Thước kẻ", "en": "Ruler", "ipa": "/ˈruː.lər/", "icon": "📏" },
        { "id": 5, "vi": "Cục tẩy", "en": "Eraser", "ipa": "/ɪˈreɪ.zər/", "icon": "🧽" },
        { "id": 6, "vi": "Cặp sách", "en": "Schoolbag", "ipa": "/ˈskuːl.bæɡ/", "icon": "🎒" },
        { "id": 7, "vi": "Cái bàn", "en": "Desk", "ipa": "/desk/", "icon": "🪑" },
        { "id": 8, "vi": "Bút màu", "en": "Crayon", "ipa": "/ˈkreɪ.ɒn/", "icon": "🖍️" },
        { "id": 9, "vi": "Kéo", "en": "Scissors", "ipa": "/ˈsɪz.əz/", "icon": "✂️" },
        { "id": 10, "vi": "Vở / Sổ tay", "en": "Notebook", "ipa": "/ˈnəʊt.bʊk/", "icon": "📓" }
      ]
    }
  },
  {
    id: "vocab-lingobibi-colors-10",
    name: "🎨 10 Từ Vựng Về Màu Sắc (Lingo BiBi Style)",
    description: "Bộ từ vựng màu sắc rực rỡ: Red, Blue, Yellow, Green, Pink, Purple, Orange, Brown...",
    data: {
      "id": "vocab-lingobibi-colors-10",
      "channel": "Lingo BiBi",
      "themeStyle": "lingobibi",
      "themeColor": "pink",
      "logo": "/logo_lingo_bibi.png",
      "title": "10 TỪ VỰNG VỀ MÀU SẮC",
      "subtitle": "Học Tiếng Anh siêu dễ cùng Lingo BiBi! 🎀",
      "category": "Màu sắc",
      "headerIcon": "🎨",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "Lingo BiBi",
      "items": [
        { "id": 1, "vi": "Màu đỏ", "en": "Red", "ipa": "/red/", "icon": "🔴" },
        { "id": 2, "vi": "Màu xanh dương", "en": "Blue", "ipa": "/bluː/", "icon": "🔵" },
        { "id": 3, "vi": "Màu vàng", "en": "Yellow", "ipa": "/ˈjel.əʊ/", "icon": "🟡" },
        { "id": 4, "vi": "Màu xanh lá", "en": "Green", "ipa": "/ɡriːn/", "icon": "🟢" },
        { "id": 5, "vi": "Màu hồng", "en": "Pink", "ipa": "/pɪŋk/", "icon": "🩷" },
        { "id": 6, "vi": "Màu tím", "en": "Purple", "ipa": "/ˈpɜː.pəl/", "icon": "🟣" },
        { "id": 7, "vi": "Màu cam", "en": "Orange", "ipa": "/ˈɒr.ɪndʒ/", "icon": "🟠" },
        { "id": 8, "vi": "Màu nâu", "en": "Brown", "ipa": "/braʊn/", "icon": "🟤" },
        { "id": 9, "vi": "Màu đen", "en": "Black", "ipa": "/blæk/", "icon": "⚫" },
        { "id": 10, "vi": "Màu trắng", "en": "White", "ipa": "/waɪt/", "icon": "⚪" }
      ]
    }
  },
  {
    id: "vocab-lingobibi-body-10",
    name: "👀 10 Từ Vựng Bộ Phận Cơ Thể (Lingo BiBi Style)",
    description: "Bộ từ vựng các bộ phận cơ thể: Eye, Ear, Nose, Mouth, Hand, Foot, Head, Hair, Arm, Leg...",
    data: {
      "id": "vocab-lingobibi-body-10",
      "channel": "Lingo BiBi",
      "themeStyle": "lingobibi",
      "themeColor": "pink",
      "logo": "/logo_lingo_bibi.png",
      "title": "10 BỘ PHẠN CƠ THỂ",
      "subtitle": "Học Tiếng Anh siêu dễ cùng Lingo BiBi! 🎀",
      "category": "Cơ thể",
      "headerIcon": "👀",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "Lingo BiBi",
      "items": [
        { "id": 1, "vi": "Đôi mắt", "en": "Eye", "ipa": "/aɪ/", "icon": "👁️" },
        { "id": 2, "vi": "Cái tai", "en": "Ear", "ipa": "/ɪər/", "icon": "👂" },
        { "id": 3, "vi": "Cái mũi", "en": "Nose", "ipa": "/nəʊz/", "icon": "👃" },
        { "id": 4, "vi": "Cái miệng", "en": "Mouth", "ipa": "/maʊθ/", "icon": "👄" },
        { "id": 5, "vi": "Bàn tay", "en": "Hand", "ipa": "/hænd/", "icon": "✋" },
        { "id": 6, "vi": "Bàn chân", "en": "Foot", "ipa": "/fʊt/", "icon": "🦶" },
        { "id": 7, "vi": "Cái đầu", "en": "Head", "ipa": "/hed/", "icon": "🗣️" },
        { "id": 8, "vi": "Mái tóc", "en": "Hair", "ipa": "/heər/", "icon": "💇" },
        { "id": 9, "vi": "Cánh tay", "en": "Arm", "ipa": "/ɑːm/", "icon": "💪" },
        { "id": 10, "vi": "Cái chân", "en": "Leg", "ipa": "/leɡ/", "icon": "🦵" }
      ]
    }
  },
  {
    id: "vocab-cooking-10",
    name: "🍳 10 Từ Vựng Về Nấu Ăn (BIGO Style)",
    description: "Bộ từ vựng hành động nấu ăn: Cook, Fry, Boil, Bake, Steam, Chop, Mince, Crack, Mix, Whisk...",
    data: DEFAULT_VOCAB_JSON
  },
  {
    id: "vocab-animals-10",
    name: "🦁 10 Từ Vựng Về Động Vật Dễ Thương (BIGO Style)",
    description: "Bộ từ vựng các loài động vật quen thuộc: Dog, Cat, Lion, Elephant, Tiger, Monkey, Bear...",
    data: {
      "id": "vocab-animals-10",
      "channel": "BIGO",
      "themeStyle": "bigo",
      "themeColor": "green",
      "logo": "/logo2.png",
      "title": "10 TỪ VỰNG VỀ ĐỘNG VẬT",
      "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
      "category": "Động vật",
      "headerIcon": "🦁",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "BIGO",
      "items": [
        { "id": 1, "vi": "Con chó", "en": "Dog", "ipa": "/dɒɡ/", "icon": "🐶" },
        { "id": 2, "vi": "Con mèo", "en": "Cat", "ipa": "/kæt/", "icon": "🐱" },
        { "id": 3, "vi": "Sư tử", "en": "Lion", "ipa": "/ˈlaɪ.ən/", "icon": "🦁" },
        { "id": 4, "vi": "Con voi", "en": "Elephant", "ipa": "/ˈel.ɪ.fənt/", "icon": "🐘" },
        { "id": 5, "vi": "Con hổ", "en": "Tiger", "ipa": "/ˈtaɪ.ɡər/", "icon": "🐯" },
        { "id": 6, "vi": "Con khỉ", "en": "Monkey", "ipa": "/ˈmʌŋ.ki/", "icon": "🐒" },
        { "id": 7, "vi": "Con gấu", "en": "Bear", "ipa": "/beər/", "icon": "🐻" },
        { "id": 8, "vi": "Con thỏ", "en": "Rabbit", "ipa": "/ˈræb.ɪt/", "icon": "🐰" },
        { "id": 9, "vi": "Cá heo", "en": "Dolphin", "ipa": "/ˈdɒl.fɪn/", "icon": "🐬" },
        { "id": 10, "vi": "Chim đại bàng", "en": "Eagle", "ipa": "/ˈiː.ɡəl/", "icon": "🦅" }
      ]
    }
  },
  {
    id: "vocab-fruits-10",
    name: "🍎 10 Từ Vựng Về Các Loại Trái Cây (BIGO Style)",
    description: "Bộ từ vựng hoa quả: Apple, Banana, Orange, Mango, Grape, Watermelon, Strawberry...",
    data: {
      "id": "vocab-fruits-10",
      "channel": "BIGO",
      "themeStyle": "bigo",
      "themeColor": "orange",
      "logo": "/logo2.png",
      "title": "10 TỪ VỰNG VỀ TRÁI CÂY",
      "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
      "category": "Hoa quả",
      "headerIcon": "🍎",
      "voice": "en-US-AnaNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "BIGO",
      "items": [
        { "id": 1, "vi": "Quả táo", "en": "Apple", "ipa": "/ˈæp.əl/", "icon": "🍎" },
        { "id": 2, "vi": "Quả chuối", "en": "Banana", "ipa": "/bəˈnɑː.nə/", "icon": "🍌" },
        { "id": 3, "vi": "Quả cam", "en": "Orange", "ipa": "/ˈɒr.ɪndʒ/", "icon": "🍊" },
        { "id": 4, "vi": "Quả xoài", "en": "Mango", "ipa": "/ˈmæŋ.ɡəʊ/", "icon": "🥭" },
        { "id": 5, "vi": "Quả nho", "en": "Grape", "ipa": "/ɡreɪp/", "icon": "🍇" },
        { "id": 6, "vi": "Dưa hấu", "en": "Watermelon", "ipa": "/ˈwɔː.təˌmel.ən/", "icon": "🍉" },
        { "id": 7, "vi": "Dâu tây", "en": "Strawberry", "ipa": "/ˈstrɔː.bər.i/", "icon": "🍓" },
        { "id": 8, "vi": "Quả dứa", "en": "Pineapple", "ipa": "/ˈpaɪnˌæp.əl/", "icon": "🍍" },
        { "id": 9, "vi": "Quả đào", "en": "Peach", "ipa": "/piːtʃ/", "icon": "🍑" },
        { "id": 10, "vi": "Quả anh đào", "en": "Cherry", "ipa": "/ˈtʃer.i/", "icon": "🍒" }
      ]
    }
  },
  {
    id: "vocab-feelings-10",
    name: "😊 10 Từ Vựng Về Cảm Xúc Hàng Ngày (BIGO Style)",
    description: "Bộ từ vựng trạng thái cảm xúc: Happy, Sad, Angry, Excited, Tired, Nervous, Proud...",
    data: {
      "id": "vocab-feelings-10",
      "channel": "BIGO",
      "themeStyle": "bigo",
      "themeColor": "pink",
      "logo": "/logo2.png",
      "title": "10 TỪ VỰNG VỀ CẢM XÚC",
      "subtitle": "Học từ vựng mỗi ngày cùng BIGO!",
      "category": "Cảm xúc",
      "headerIcon": "😊",
      "voice": "en-US-GuyNeural",
      "voiceSpeed": 1.25,
      "timePerWord": 4.0,
      "mascotName": "BIGO",
      "items": [
        { "id": 1, "vi": "Vui vẻ", "en": "Happy", "ipa": "/ˈhæp.i/", "icon": "😄" },
        { "id": 2, "vi": "Buồn bã", "en": "Sad", "ipa": "/sæd/", "icon": "😢" },
        { "id": 3, "vi": "Tức giận", "en": "Angry", "ipa": "/ˈæŋ.ɡri/", "icon": "😡" },
        { "id": 4, "vi": "Hào hứng", "en": "Excited", "ipa": "/ɪkˈsaɪ.tɪd/", "icon": "🤩" },
        { "id": 5, "vi": "Mệt mỏi", "en": "Tired", "ipa": "/taɪəd/", "icon": "😴" },
        { "id": 6, "vi": "Hồi hộp", "en": "Nervous", "ipa": "/ˈnɜː.vəs/", "icon": "😰" },
        { "id": 7, "vi": "Tự hào", "en": "Proud", "ipa": "/praʊd/", "icon": "😎" },
        { "id": 8, "vi": "Bất ngờ", "en": "Surprised", "ipa": "/səˈpraɪzd/", "icon": "😲" },
        { "id": 9, "vi": "Bình tĩnh", "en": "Calm", "ipa": "/kɑːm/", "icon": "😌" },
        { "id": 10, "vi": "Chán nản", "en": "Bored", "ipa": "/bɔːd/", "icon": "😒" }
      ]
    }
  }
];

