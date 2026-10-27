// Utility để parse file JSON & CSV nhập câu hỏi trắc nghiệm

// Parse CSV text into array of objects
export function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const parseLine = (line) => {
    const result = [];
    let start = 0;
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '"') {
        inQuotes = !inQuotes;
      } else if (line[i] === ',' && !inQuotes) {
        let field = line.substring(start, i).trim();
        if (field.startsWith('"') && field.endsWith('"')) {
          field = field.substring(1, field.length - 1).replace(/""/g, '"');
        }
        result.push(field);
        start = i + 1;
      }
    }
    let lastField = line.substring(start).trim();
    if (lastField.startsWith('"') && lastField.endsWith('"')) {
      lastField = lastField.substring(1, lastField.length - 1).replace(/""/g, '"');
    }
    result.push(lastField);
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = values[index] !== undefined ? values[index] : '';
    });
    rows.push(rowObj);
  }

  return rows;
}

// Parse file content (JSON or CSV) for MCQ Questions
export function parseMCQFile(fileContent, fileName) {
  let rawList = [];

  if (fileName.endsWith('.json')) {
    const parsed = JSON.parse(fileContent);
    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (parsed.questions && Array.isArray(parsed.questions)) {
      rawList = parsed.questions;
    } else if (parsed.items && Array.isArray(parsed.items)) {
      rawList = parsed.items;
    }
  } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    rawList = parseCSV(fileContent);
  } else {
    throw new Error('Định dạng file không hỗ trợ. Vui lòng tải file .json hoặc .csv');
  }

  if (!rawList || rawList.length === 0) {
    throw new Error('File không chứa dữ liệu câu hỏi hợp lệ.');
  }

  const formatted = rawList.map((item, idx) => ({
    question: item.question || item.cau_hoi || item.q || `Câu hỏi ${idx + 1}?`,
    optionA: item.optionA || item.option_a || item.dap_an_a || item.a || 'Đáp án A',
    optionB: item.optionB || item.option_b || item.dap_an_b || item.b || 'Đáp án B',
    optionC: item.optionC || item.option_c || item.dap_an_c || item.c || 'Đáp án C',
    optionD: item.optionD || item.option_d || item.dap_an_d || item.d || 'Đáp án D',
    correctOption: (item.correctOption || item.correct_option || item.dap_an_dung || item.correct || 'A').toString().toUpperCase().trim().charAt(0),
    explanation: item.explanation || item.giai_thich || item.hint || '',
    image: item.image || item.img || item.hinh_anh || item.flag || ''
  }));

  return formatted;
}

// Parse file content (JSON or CSV) containing MULTIPLE MCQ Question Sets (4 sets)
export function parseMultiMCQFile(fileContent, fileName, currentPreset = '') {
  let sets = [];

  const isVietnamGeoContext = currentPreset === 'dia-ly-van-hoa-viet-nam' ||
    fileName.includes('dia_ly') || fileName.includes('dia-ly') ||
    fileName.includes('viet_nam') || fileName.includes('viet-nam') ||
    fileName.includes('mau_trac_nghiem') ||
    fileContent.includes('ĐỊA LÝ') || fileContent.includes('VIỆT NAM') || fileContent.includes('Địa Lý');

  const isAnimalContext = !isVietnamGeoContext && (currentPreset === 'animal-guess' ||
    fileName.includes('con_vat') || fileName.includes('con-vat') || fileName.includes('animal') ||
    fileContent.includes('CON VẬT') || fileContent.includes('ĐOÁN CON VẬT'));

  const isFoodContext = !isVietnamGeoContext && !isAnimalContext && (currentPreset === 'food-guess' ||
    fileName.includes('mon_an') || fileName.includes('mon-an') || fileName.includes('food') ||
    fileContent.includes('MÓN ĂN') || fileContent.includes('ĐOÁN MÓN ĂN'));

  const isFlagsContext = !isVietnamGeoContext && !isAnimalContext && !isFoodContext && (currentPreset === 'flags' ||
    fileName.includes('quoc_ky') || fileName.includes('quoc-ky') || fileName.includes('flag') ||
    fileContent.includes('QUỐC KỲ') || fileContent.includes('ĐOÁN QUỐC KỲ'));

  const isLandmarkContext = !isVietnamGeoContext && !isAnimalContext && !isFoodContext && !isFlagsContext && (
    currentPreset === 'landmark-guess' ||
    fileName.includes('dia_diem') || fileName.includes('dia-diem') || fileName.includes('landmark') || fileName.includes('thang_canh') ||
    fileContent.includes('ĐỊA ĐIỂM') || fileContent.includes('ĐOÁN ĐỊA ĐIỂM') || fileContent.includes('ĐOÁN ĐỊA DANH')
  );

  const formatItem = (item, idx, setMode = '', setObj = {}) => {
    const rawWord = item.word || item.target_word || item.targetWord || item.tu_vung || item.answer || item.ans || item.dish || item.mon_an || item.food || item.landmark || '';
    const rawCountry = item.country || item.quoc_gia || item.ten_nuoc || '';
    const rawFlag = item.flag || item.quoc_ky || item.co || '';
    const rawClues = Array.isArray(item.clues) ? item.clues : (Array.isArray(item.goi_y) ? item.goi_y : []);
    
    // Nếu đang trong bối cảnh Địa lý & Văn hóa Việt Nam, KHÔNG kích hoạt các mode đoán ảnh/cờ/món/cầu thủ
    const isAnimalItem = !isVietnamGeoContext && (item.mode === 'animal-guess' || item.mode === 'animal' || isAnimalContext ||
      (item.question && (String(item.question).toLowerCase().includes('con vật') || String(item.question).toLowerCase().includes('đây là con gì'))) ||
      (item.topic && String(item.topic).toLowerCase().includes('con vật')) ||
      !!(item.animal || item.con_vat));
    const isFlagsItem = !isVietnamGeoContext && !isAnimalItem && (item.mode === 'flags' || isFlagsContext ||
      (item.image && String(item.image).includes('flagcdn')) ||
      (item.flagUrl && String(item.flagUrl).includes('flagcdn')) ||
      (item.question && (String(item.question).toLowerCase().includes('đoán cờ') || String(item.question).toLowerCase().includes('quốc kỳ') || String(item.question).toLowerCase().includes('quốc gia nào'))));
    const isFoodItem = !isVietnamGeoContext && !isAnimalItem && !isFlagsItem && (item.mode === 'food-guess' || item.mode === 'dish-guess' || item.mode === 'food' || isFoodContext ||
      (item.question && (String(item.question).toLowerCase().includes('đoán món') || String(item.question).toLowerCase().includes('đây là món gì'))) ||
      !!(item.dish || item.mon_an));
    const isLandmarkItem = !isVietnamGeoContext && !isAnimalItem && !isFlagsItem && !isFoodItem && (
      item.mode === 'landmark-guess' || item.mode === 'place-guess' || item.mode === 'landmark' || item.mode === 'place' || isLandmarkContext ||
      (item.question && (String(item.question).toLowerCase().includes('đoán địa điểm') || String(item.question).toLowerCase().includes('đoán địa danh') || String(item.question).toLowerCase().includes('đây là địa danh nào') || String(item.question).toLowerCase().includes('đây là địa điểm nào'))) ||
      !!(item.landmark)
    );
    const isPlayerItem = !isVietnamGeoContext && !isAnimalItem && !isFlagsItem && !isFoodItem && (item.mode === 'player-guess' || item.mode === 'player' ||
      (item.question && String(item.question).toLowerCase().includes('đoán cầu thủ')) ||
      !!(item.player || item.cau_thu));
      
    const defaultItemMode = isVietnamGeoContext ? 'vocab-b1-tiktok' : (isAnimalItem ? 'animal-guess' : (isFoodItem ? 'food-guess' : (isFlagsItem ? 'flags' : (isPlayerItem ? 'player-guess' : (isLandmarkItem ? 'landmark-guess' : (rawClues.length > 0 || rawCountry ? 'country-guess' : (rawWord ? 'word-guess' : 'mcq')))))));
    const rawMode = item.mode || item.type || setMode || setObj.mode || defaultItemMode;

    const optA = item.optionA || item.option_a || item.dap_an_a || item.a || rawWord || (rawCountry || 'Đáp án A');
    const optB = item.optionB || item.option_b || item.dap_an_b || item.b || 'Đáp án B';
    const optC = item.optionC || item.option_c || item.dap_an_c || item.c || 'Đáp án C';
    const optD = item.optionD || item.option_d || item.dap_an_d || item.d || 'Đáp án D';
    const rawLandmarkWord = item.landmark || item.place || item.word || item.dish || optA;

    return {
      id: item.id || `q-${idx + 1}`,
      question: item.question || item.cau_hoi || item.q || (rawMode === 'animal-guess' ? 'Đây là con gì?' : (rawMode === 'food-guess' ? 'Đây là món gì?' : (rawMode === 'flags' ? 'Đây là quốc kỳ của nước nào?' : (rawMode === 'landmark-guess' ? 'Đây là địa danh nào?' : (rawCountry ? `Đoán Quốc Gia: ${rawCountry}` : item.word || `Câu hỏi ${idx + 1}?`))))),
      topic: item.topic || item.category || item.level || setObj.topic || (isVietnamGeoContext ? 'ĐỊA LÝ & VĂN HÓA VN' : (rawMode === 'animal-guess' ? '🐾 ĐOÁN CON VẬT' : (rawMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (rawMode === 'flags' ? '🚩 ĐOÁN QUỐC KỲ' : (rawMode === 'landmark-guess' ? '🏛️ ĐOÁN ĐỊA DANH' : (rawMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : 'TỪ VỰNG B1')))))),
      fromFlag: item.fromFlag || item.from_flag || item.source_flag || setObj.fromFlag || (isVietnamGeoContext ? '🇻🇳' : (rawMode === 'animal-guess' ? '🐾' : (rawMode === 'food-guess' ? '🍳' : (rawMode === 'flags' ? '🚩' : (rawMode === 'landmark-guess' ? '🏛️' : (rawMode === 'country-guess' ? '🌎' : '🇻🇳')))))),
      toFlag: item.toFlag || item.to_flag || item.target_flag || setObj.toFlag || (isVietnamGeoContext ? '🇻🇳' : (rawMode === 'animal-guess' ? '🦁' : (rawMode === 'food-guess' ? '🍽️' : (rawMode === 'flags' ? '🌏' : (rawMode === 'landmark-guess' ? '🌍' : (rawMode === 'country-guess' ? '🚩' : '🇺🇸')))))),
      headerTitle: item.headerTitle || item.header_title || item.subHeader || setObj.headerTitle || (isVietnamGeoContext ? 'CHỌN ĐÁP ÁN ĐÚNG' : (rawMode === 'animal-guess' ? 'ĐÂY LÀ CON GÌ?' : (rawMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (rawMode === 'flags' ? 'ĐÂY LÀ QUỐC KỲ CỦA NƯỚC NÀO?' : (rawMode === 'landmark-guess' ? 'ĐÂY LÀ ĐỊA DANH NÀO?' : (rawMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : 'TỪ NÀO CÓ NGHĨA LÀ')))))),
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      correctOption: (item.correctOption || item.correct_option || item.dap_an_dung || item.correct || item.answer || item.ans || 'A').toString().toUpperCase().trim().charAt(0),
      explanation: item.explanation || item.giai_thich || item.hint || item.meaning || item.nghia || '',
      image: item.image || item.img || item.hinh_anh || item.bg || item.background || '',
      word: isVietnamGeoContext ? '' : (rawWord || (rawMode === 'word-guess' || rawMode === 'food-guess' || rawMode === 'landmark-guess' ? rawLandmarkWord : '')),
      ipa: item.ipa || item.phien_am || '',
      mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : rawMode,
      country: rawCountry,
      flag: rawFlag,
      clues: (Array.isArray(rawClues) && rawClues.length > 0) ? rawClues : undefined
    };
  };

  if (fileName.endsWith('.json')) {
    let parsed = JSON.parse(fileContent);

    // If parsed object is not an array, unpack its sets/questions/items property
    if (!Array.isArray(parsed) && typeof parsed === 'object' && parsed !== null) {
      if (Array.isArray(parsed.sets)) {
        parsed = parsed.sets;
      } else if (Array.isArray(parsed.questions)) {
        parsed = parsed.questions;
      } else if (Array.isArray(parsed.items)) {
        parsed = parsed.items;
      } else {
        parsed = [parsed];
      }
    }

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && (parsed[0].questions || parsed[0].items)) {
        const rawSets = [];
        parsed.forEach((s, sIdx) => {
          const firstQ = (s.questions || s.items || [])[0];
          const isAnimalSet = !isVietnamGeoContext && (s.mode === 'animal-guess' || firstQ?.mode === 'animal-guess' || isAnimalContext || s.name?.toLowerCase().includes('con vật') || s.topic?.toLowerCase().includes('con vật'));
          const isFlagsSet = !isVietnamGeoContext && !isAnimalSet && (s.mode === 'flags' || firstQ?.mode === 'flags' || isFlagsContext || firstQ?.image?.includes('flagcdn') || s.name?.toLowerCase().includes('cờ') || s.topic?.toLowerCase().includes('cờ') || s.topic?.toLowerCase().includes('quốc kỳ'));
          const isFoodSet = !isVietnamGeoContext && !isAnimalSet && !isFlagsSet && (s.mode === 'food-guess' || firstQ?.mode === 'food-guess' || isFoodContext || s.topic?.toLowerCase().includes('đoán món') || s.name?.toLowerCase().includes('đoán món'));
          const isLandmarkSet = !isVietnamGeoContext && !isAnimalSet && !isFlagsSet && !isFoodSet && (s.mode === 'landmark-guess' || s.mode === 'place-guess' || firstQ?.mode === 'landmark-guess' || s.topic?.toLowerCase().includes('đoán địa điểm') || s.name?.toLowerCase().includes('đoán địa điểm'));
          
          const defaultSetMode = isVietnamGeoContext ? 'vocab-b1-tiktok' : (
            isAnimalSet ? 'animal-guess' : (
              isFoodSet ? 'food-guess' : (
                isFlagsSet ? 'flags' : (
                  isLandmarkSet ? 'landmark-guess' : (
                    firstQ?.clues?.length > 0 || firstQ?.country || firstQ?.mode === 'country-guess' ? 'country-guess' : (
                      s.questions && s.questions.some(q => q.word || q.target_word || q.mode === 'word-guess') ? 'word-guess' : ''
                    )
                  )
                )
              )
            )
          );
          const setMode = s.mode || s.type || defaultSetMode;
          const chunkSize = setMode === 'country-guess' ? 4 : 5;
          const formattedQuestions = (s.questions || s.items || []).map((q, idx) => formatItem(q, idx, setMode, s));

          const defaultSetTopic = isVietnamGeoContext ? 'ĐỊA LÝ & VĂN HÓA VN' : (
            setMode === 'animal-guess' ? '🐾 ĐOÁN CON VẬT' : (
              setMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (
                setMode === 'flags' ? '🚩 ĐOÁN QUỐC KỲ' : (
                  setMode === 'landmark-guess' ? '🏰 ĐOÁN ĐỊA ĐIỂM' : (
                    setMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : 'TỪ VỰNG B1'
                  )
                )
              )
            )
          );
          const defaultFromFlag = isVietnamGeoContext ? '🇻🇳' : (
            setMode === 'animal-guess' ? '🐾' : (
              setMode === 'food-guess' ? '🍳' : (
                setMode === 'flags' ? '🚩' : (
                  setMode === 'landmark-guess' ? '🌍' : (
                    setMode === 'country-guess' ? '🌎' : '🇻🇳'
                  )
                )
              )
            )
          );
          const defaultToFlag = isVietnamGeoContext ? '🇻🇳' : (
            setMode === 'animal-guess' ? '🦁' : (
              setMode === 'food-guess' ? '🍽️' : (
                setMode === 'flags' ? '🌏' : (
                  setMode === 'landmark-guess' ? '🏛️' : (
                    setMode === 'country-guess' ? '🚩' : '🇺🇸'
                  )
                )
              )
            )
          );
          const defaultHeaderTitle = isVietnamGeoContext ? 'CHỌN ĐÁP ÁN ĐÚNG' : (
            setMode === 'animal-guess' ? 'ĐÂY LÀ CON GÌ?' : (
              setMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (
                setMode === 'flags' ? 'ĐÂY LÀ QUỐC KỲ CỦA NƯỚC NÀO?' : (
                  setMode === 'landmark-guess' ? 'ĐÂY LÀ ĐÂY?' : (
                    setMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : 'TỪ NÀO CÓ NGHĨA LÀ'
                  )
                )
              )
            )
          );

          // If set has more questions than chunkSize (e.g. > 5 questions), split into sub-sets
          if (formattedQuestions.length > chunkSize) {
            for (let i = 0; i < formattedQuestions.length; i += chunkSize) {
              const subQuestions = formattedQuestions.slice(i, i + chunkSize);
              const partIndex = Math.floor(i / chunkSize) + 1;
              const setName = s.name || s.title || `Bộ câu hỏi #${sIdx + 1}`;
              rawSets.push({
                id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : (s.id || `set-${sIdx + 1}-${partIndex}`),
                presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : (s.presetId || setMode || ''),
                name: formattedQuestions.length > chunkSize ? `${setName} (Phần ${partIndex})` : setName,
                topic: s.topic || s.category || defaultSetTopic,
                fromFlag: s.fromFlag || s.from_flag || defaultFromFlag,
                toFlag: s.toFlag || s.to_flag || defaultToFlag,
                headerTitle: s.headerTitle || s.header_title || defaultHeaderTitle,
                mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : setMode,
                questions: subQuestions
              });
            }
          } else {
            rawSets.push({
              id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : (s.id || `set-${sIdx + 1}`),
              presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : (s.presetId || setMode || ''),
              name: s.name || s.title || `Bộ câu hỏi #${sIdx + 1}`,
              topic: s.topic || s.category || defaultSetTopic,
              fromFlag: s.fromFlag || s.from_flag || defaultFromFlag,
              toFlag: s.toFlag || s.to_flag || defaultToFlag,
              headerTitle: s.headerTitle || s.header_title || defaultHeaderTitle,
              mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : setMode,
              questions: formattedQuestions
            });
          }
        });
        sets = rawSets;
      } else {
        const defaultModeForList = isVietnamGeoContext ? 'vocab-b1-tiktok' : (
          isAnimalContext ? 'animal-guess' : (
            isFoodContext ? 'food-guess' : (
              isFlagsContext ? 'flags' : ''
            )
          )
        );
        const allQuestions = parsed.map((q, idx) => formatItem(q, idx, defaultModeForList));
        const firstMode = allQuestions[0]?.mode || defaultModeForList || (isVietnamGeoContext ? 'vocab-b1-tiktok' : '');
        const firstTopic = allQuestions[0]?.topic || (
          isVietnamGeoContext ? 'ĐỊA LÝ & VĂN HÓA VN' : (
            firstMode === 'animal-guess' ? '🐾 ĐOÁN CON VẬT' : (
              firstMode === 'food-guess' ? '🍳 ĐOÁN MÓN ĂN' : (
                firstMode === 'flags' ? '🚩 ĐOÁN QUỐC KỲ' : (
                  firstMode === 'landmark-guess' ? '🏰 ĐOÁN ĐỊA ĐIỂM' : (
                    firstMode === 'country-guess' ? '🌎 ĐOÁN QUỐC GIA' : 'TỪ VỰNG B1'
                  )
                )
              )
            )
          )
        );
        const firstHeader = allQuestions[0]?.headerTitle || (
          isVietnamGeoContext ? 'CHỌN ĐÁP ÁN ĐÚNG' : (
            firstMode === 'animal-guess' ? 'ĐÂY LÀ CON GÌ?' : (
              firstMode === 'food-guess' ? 'ĐÂY LÀ MÓN GÌ?' : (
                firstMode === 'flags' ? 'ĐÂY LÀ QUỐC KỲ CỦA NƯỚC NÀO?' : (
                  firstMode === 'landmark-guess' ? 'ĐÂY LÀ ĐÂY?' : (
                    firstMode === 'country-guess' ? 'ĐOÁN QUỐC GIA QUA 5 GỢI Ý' : 'TỪ NÀO CÓ NGHĨA LÀ'
                  )
                )
              )
            )
          )
        );
        const chunkSize = firstMode === 'country-guess' ? 4 : 5;

        for (let i = 0; i < allQuestions.length; i += chunkSize) {
          const chunk = allQuestions.slice(i, i + chunkSize);
          const isAnimal = !isVietnamGeoContext && chunk.some(q => q.mode === 'animal-guess');
          const isFood = !isVietnamGeoContext && !isAnimal && chunk.some(q => q.mode === 'food-guess' || q.mode === 'dish-guess' || q.mode === 'food');
          const isFlags = !isVietnamGeoContext && !isAnimal && !isFood && chunk.some(q => q.mode === 'flags');
          const isLandmark = !isVietnamGeoContext && !isAnimal && !isFood && !isFlags && chunk.some(q => q.mode === 'landmark-guess' || q.mode === 'place-guess' || q.mode === 'landmark');
          const hasClues = !isVietnamGeoContext && chunk.some(q => q.clues?.length > 0 || q.country || q.mode === 'country-guess');
          const hasWord = !isVietnamGeoContext && chunk.some(q => q.word || q.mode === 'word-guess');
          const chunkMode = isVietnamGeoContext ? 'vocab-b1-tiktok' : (
            isAnimal ? 'animal-guess' : (
              isFood ? 'food-guess' : (
                isFlags ? 'flags' : (
                  isLandmark ? 'landmark-guess' : (
                    hasClues ? 'country-guess' : (
                      hasWord ? 'word-guess' : firstMode
                    )
                  )
                )
              )
            )
          );

          sets.push({
            id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : `set-${sets.length + 1}`,
            presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : (chunkMode || ''),
            name: isVietnamGeoContext ? `🇻🇳 Bộ ${sets.length + 1}: Địa Lý & Văn Hóa Việt Nam` : `Bộ câu hỏi #${sets.length + 1}`,
            topic: firstTopic,
            fromFlag: isVietnamGeoContext ? '🇻🇳' : (chunkMode === 'animal-guess' ? '🐾' : (chunkMode === 'food-guess' ? '🍳' : (chunkMode === 'flags' ? '🚩' : (chunkMode === 'landmark-guess' ? '🌍' : (chunkMode === 'country-guess' ? '🌎' : '🇻🇳'))))),
            toFlag: isVietnamGeoContext ? '🇻🇳' : (chunkMode === 'animal-guess' ? '🦁' : (chunkMode === 'food-guess' ? '🍽️' : (chunkMode === 'flags' ? '🌏' : (chunkMode === 'landmark-guess' ? '🏛️' : (chunkMode === 'country-guess' ? '🚩' : '🇺🇸'))))),
            headerTitle: firstHeader,
            mode: chunkMode,
            questions: chunk
          });
        }
      }
    }
  } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    const rawRows = parseCSV(fileContent);
    if (rawRows.length > 0) {
      const hasSetCol = rawRows[0].set_name || rawRows[0].set_id || rawRows[0].bo_cau_hoi;
      if (hasSetCol) {
        const grouped = {};
        rawRows.forEach((r, idx) => {
          const setName = r.set_name || r.set_id || r.bo_cau_hoi || 'Bộ câu hỏi #1';
          if (!grouped[setName]) grouped[setName] = [];
          grouped[setName].push(formatItem(r, idx, isVietnamGeoContext ? 'vocab-b1-tiktok' : ''));
        });
        sets = Object.keys(grouped).map(setName => ({
          id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : undefined,
          presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : undefined,
          name: setName,
          topic: isVietnamGeoContext ? 'ĐỊA LÝ & VĂN HÓA VN' : 'TRẮC NGHIỆM',
          headerTitle: isVietnamGeoContext ? 'CHỌN ĐÁP ÁN ĐÚNG' : 'CHỌN ĐÁP ÁN',
          fromFlag: '🇻🇳',
          toFlag: '🇻🇳',
          mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : '',
          questions: grouped[setName]
        }));
      } else {
        const allQuestions = rawRows.map((r, idx) => formatItem(r, idx, isVietnamGeoContext ? 'vocab-b1-tiktok' : ''));
        for (let i = 0; i < allQuestions.length; i += 5) {
          const chunk = allQuestions.slice(i, i + 5);
          sets.push({
            id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : undefined,
            presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : undefined,
            name: `Bộ câu hỏi #${sets.length + 1}`,
            topic: isVietnamGeoContext ? 'ĐỊA LÝ & VĂN HÓA VN' : 'TRẮC NGHIỆM',
            headerTitle: isVietnamGeoContext ? 'CHỌN ĐÁP ÁN ĐÚNG' : 'CHỌN ĐÁP ÁN',
            fromFlag: '🇻🇳',
            toFlag: '🇻🇳',
            mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : '',
            questions: chunk
          });
        }
      }
    }
  } else {
    throw new Error('Định dạng file không hỗ trợ. Vui lòng tải file .json hoặc .csv');
  }

  if (!sets || sets.length === 0) {
    throw new Error('File không chứa dữ liệu bộ câu hỏi hợp lệ.');
  }

  // Ensure we always have 4 sets
  while (sets.length < 4) {
    const nextIdx = sets.length + 1;
    const templateSet = sets[0] || {
      id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : `set-${nextIdx}`,
      presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : '',
      name: `Bộ câu hỏi #${nextIdx}`,
      topic: isVietnamGeoContext ? 'ĐỊA LÝ & VĂN HÓA VN' : 'TỪ VỰNG B1',
      fromFlag: '🇻🇳',
      toFlag: isVietnamGeoContext ? '🇻🇳' : '🇺🇸',
      headerTitle: isVietnamGeoContext ? 'CHỌN ĐÁP ÁN ĐÚNG' : 'TỪ NÀO CÓ NGHĨA LÀ',
      mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : '',
      questions: [
        { question: `Câu hỏi bộ ${nextIdx}?`, optionA: 'Đáp án A', optionB: 'Đáp án B', optionC: 'Đáp án C', optionD: 'Đáp án D', correctOption: 'A', explanation: '', mode: isVietnamGeoContext ? 'vocab-b1-tiktok' : '' }
      ]
    };
    sets.push({
      ...JSON.parse(JSON.stringify(templateSet)),
      id: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : `set-${nextIdx}`,
      presetId: isVietnamGeoContext ? 'dia-ly-van-hoa-viet-nam' : '',
      name: `Bộ câu hỏi #${nextIdx}`
    });
  }

  return sets.slice(0, 4);
}

// Helper trigger browser download of a sample string file
export function downloadFile(filename, textContent, mimeType = 'application/json') {
  const blob = new Blob([textContent], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
