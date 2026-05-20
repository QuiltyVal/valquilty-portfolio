export const TRIGRAM_ORDER = ["111", "110", "101", "100", "011", "010", "001", "000"];

export const TRIGRAMS = {
  "111": { name: "Qian", ru: "Небо", glyph: "☰" },
  "110": { name: "Dui", ru: "Озеро", glyph: "☱" },
  "101": { name: "Li", ru: "Огонь", glyph: "☲" },
  "100": { name: "Zhen", ru: "Гром", glyph: "☳" },
  "011": { name: "Xun", ru: "Ветер", glyph: "☴" },
  "010": { name: "Kan", ru: "Вода", glyph: "☵" },
  "001": { name: "Gen", ru: "Гора", glyph: "☶" },
  "000": { name: "Kun", ru: "Земля", glyph: "☷" },
};

const KING_WEN_TABLE = {
  "111": { "111": 1, "110": 43, "101": 14, "100": 34, "011": 9, "010": 5, "001": 26, "000": 11 },
  "110": { "111": 10, "110": 58, "101": 38, "100": 54, "011": 61, "010": 60, "001": 41, "000": 19 },
  "101": { "111": 13, "110": 49, "101": 30, "100": 55, "011": 37, "010": 63, "001": 22, "000": 36 },
  "100": { "111": 25, "110": 17, "101": 21, "100": 51, "011": 42, "010": 3, "001": 27, "000": 24 },
  "011": { "111": 44, "110": 28, "101": 50, "100": 32, "011": 57, "010": 48, "001": 18, "000": 46 },
  "010": { "111": 6, "110": 47, "101": 64, "100": 40, "011": 59, "010": 29, "001": 4, "000": 7 },
  "001": { "111": 33, "110": 31, "101": 56, "100": 62, "011": 53, "010": 39, "001": 52, "000": 15 },
  "000": { "111": 12, "110": 45, "101": 35, "100": 16, "011": 20, "010": 8, "001": 23, "000": 2 },
};

export const HEXAGRAMS = {
  1: { number: 1, name: "Qian", ru: "Творчество", keyword: "сила начала" },
  2: { number: 2, name: "Kun", ru: "Исполнение", keyword: "принятие и почва" },
  3: { number: 3, name: "Zhun", ru: "Начальная трудность", keyword: "рост через сопротивление" },
  4: { number: 4, name: "Meng", ru: "Незрелость", keyword: "учение без спешки" },
  5: { number: 5, name: "Xu", ru: "Ожидание", keyword: "выдержка и питание сил" },
  6: { number: 6, name: "Song", ru: "Конфликт", keyword: "граница и спор" },
  7: { number: 7, name: "Shi", ru: "Войско", keyword: "дисциплина и порядок" },
  8: { number: 8, name: "Bi", ru: "Сближение", keyword: "союз и выбор центра" },
  9: { number: 9, name: "Xiao Chu", ru: "Малое накопление", keyword: "тонкая сдерживающая сила" },
  10: { number: 10, name: "Lu", ru: "Поступь", keyword: "осторожное движение" },
  11: { number: 11, name: "Tai", ru: "Мир", keyword: "согласование потоков" },
  12: { number: 12, name: "Pi", ru: "Застой", keyword: "разрыв между уровнями" },
  13: { number: 13, name: "Tong Ren", ru: "Единомышленники", keyword: "общность и открытость" },
  14: { number: 14, name: "Da You", ru: "Большое владение", keyword: "сила, которой нужно управлять" },
  15: { number: 15, name: "Qian", ru: "Скромность", keyword: "точная мера" },
  16: { number: 16, name: "Yu", ru: "Воодушевление", keyword: "энергия, требующая формы" },
  17: { number: 17, name: "Sui", ru: "Следование", keyword: "настройка на ход вещей" },
  18: { number: 18, name: "Gu", ru: "Исправление испорченного", keyword: "работа с наследием" },
  19: { number: 19, name: "Lin", ru: "Приближение", keyword: "рост влияния" },
  20: { number: 20, name: "Guan", ru: "Созерцание", keyword: "видение сверху" },
  21: { number: 21, name: "Shi He", ru: "Укус", keyword: "решение через разрезание узла" },
  22: { number: 22, name: "Bi", ru: "Украшение", keyword: "форма и поверхность" },
  23: { number: 23, name: "Bo", ru: "Расщепление", keyword: "снятие лишнего" },
  24: { number: 24, name: "Fu", ru: "Возврат", keyword: "первый импульс восстановления" },
  25: { number: 25, name: "Wu Wang", ru: "Невинность", keyword: "естественное действие" },
  26: { number: 26, name: "Da Chu", ru: "Большое накопление", keyword: "удержанная мощь" },
  27: { number: 27, name: "Yi", ru: "Питание", keyword: "чем питается система" },
  28: { number: 28, name: "Da Guo", ru: "Великое превышение", keyword: "перегрузка конструкции" },
  29: { number: 29, name: "Kan", ru: "Бездна", keyword: "повторная опасность" },
  30: { number: 30, name: "Li", ru: "Сцепление", keyword: "ясность и зависимость" },
  31: { number: 31, name: "Xian", ru: "Влияние", keyword: "взаимное притяжение" },
  32: { number: 32, name: "Heng", ru: "Постоянство", keyword: "долгая форма" },
  33: { number: 33, name: "Dun", ru: "Уход", keyword: "стратегическое отступление" },
  34: { number: 34, name: "Da Zhuang", ru: "Великая мощь", keyword: "сила под контролем" },
  35: { number: 35, name: "Jin", ru: "Продвижение", keyword: "выход на свет" },
  36: { number: 36, name: "Ming Yi", ru: "Поражение света", keyword: "сохранить ясность внутри" },
  37: { number: 37, name: "Jia Ren", ru: "Семья", keyword: "внутренний порядок" },
  38: { number: 38, name: "Kui", ru: "Противоположность", keyword: "разные взгляды" },
  39: { number: 39, name: "Jian", ru: "Препятствие", keyword: "обходной путь" },
  40: { number: 40, name: "Xie", ru: "Освобождение", keyword: "развязка напряжения" },
  41: { number: 41, name: "Sun", ru: "Уменьшение", keyword: "снять лишнюю нагрузку" },
  42: { number: 42, name: "Yi", ru: "Увеличение", keyword: "рост через вклад" },
  43: { number: 43, name: "Guai", ru: "Прорыв", keyword: "решительное объявление" },
  44: { number: 44, name: "Gou", ru: "Встреча", keyword: "сильное неожиданное влияние" },
  45: { number: 45, name: "Cui", ru: "Собирание", keyword: "центр притяжения" },
  46: { number: 46, name: "Sheng", ru: "Подъем", keyword: "поступательное восхождение" },
  47: { number: 47, name: "Kun", ru: "Истощение", keyword: "давление и внутренняя опора" },
  48: { number: 48, name: "Jing", ru: "Колодец", keyword: "общий источник" },
  49: { number: 49, name: "Ge", ru: "Перемена", keyword: "смена кожи" },
  50: { number: 50, name: "Ding", ru: "Котел", keyword: "сосуд превращения" },
  51: { number: 51, name: "Zhen", ru: "Гром", keyword: "встряска и пробуждение" },
  52: { number: 52, name: "Gen", ru: "Гора", keyword: "остановка" },
  53: { number: 53, name: "Jian", ru: "Развитие", keyword: "медленное укоренение" },
  54: { number: 54, name: "Gui Mei", ru: "Невеста", keyword: "неравная позиция" },
  55: { number: 55, name: "Feng", ru: "Изобилие", keyword: "полдень перед спадом" },
  56: { number: 56, name: "Lu", ru: "Странник", keyword: "движение без полного дома" },
  57: { number: 57, name: "Xun", ru: "Проникновение", keyword: "мягкая настойчивость" },
  58: { number: 58, name: "Dui", ru: "Радость", keyword: "обмен и легкость" },
  59: { number: 59, name: "Huan", ru: "Рассеяние", keyword: "растворить блок" },
  60: { number: 60, name: "Jie", ru: "Ограничение", keyword: "рамка, которая помогает" },
  61: { number: 61, name: "Zhong Fu", ru: "Внутренняя правда", keyword: "доверие изнутри" },
  62: { number: 62, name: "Xiao Guo", ru: "Малое превышение", keyword: "точность в малом" },
  63: { number: 63, name: "Ji Ji", ru: "После завершения", keyword: "порядок требует ухода" },
  64: { number: 64, name: "Wei Ji", ru: "До завершения", keyword: "порог перед сборкой" },
};

const LINE_LABELS = {
  6: { ru: "старая инь", kind: "yin", changing: true, mark: "x" },
  7: { ru: "молодая ян", kind: "yang", changing: false, mark: "" },
  8: { ru: "молодая инь", kind: "yin", changing: false, mark: "" },
  9: { ru: "старая ян", kind: "yang", changing: true, mark: "o" },
};

export function buildLinesFromBits(bits) {
  if (!Array.isArray(bits) || bits.length < 18) {
    throw new Error("I Ching reading requires at least 18 bits.");
  }

  return bits.slice(0, 18).reduce((lines, _, index) => {
    if (index % 3 !== 0) return lines;

    const lineBits = bits.slice(index, index + 3).map((bit) => (bit ? 1 : 0));
    const coinValues = lineBits.map((bit) => (bit ? 3 : 2));
    const value = coinValues.reduce((sum, coin) => sum + coin, 0);
    const metadata = LINE_LABELS[value];

    lines.push({
      index: lines.length + 1,
      bits: lineBits,
      coinValues,
      value,
      kind: metadata.kind,
      changing: metadata.changing,
      label: metadata.ru,
      mark: metadata.mark,
    });

    return lines;
  }, []);
}

export function getHexagramFromLines(lines, { changed = false } = {}) {
  const lineValues = lines.map((line) => {
    if (!changed || !line.changing) return line.kind === "yang" ? 1 : 0;
    return line.kind === "yang" ? 0 : 1;
  });

  const lowerKey = lineValues.slice(0, 3).join("");
  const upperKey = lineValues.slice(3, 6).join("");
  const number = KING_WEN_TABLE[upperKey]?.[lowerKey];

  if (!number) {
    throw new Error(`Unknown hexagram for upper ${upperKey} and lower ${lowerKey}.`);
  }

  return {
    ...HEXAGRAMS[number],
    upper: TRIGRAMS[upperKey],
    lower: TRIGRAMS[lowerKey],
    upperKey,
    lowerKey,
    binary: lineValues.join(""),
  };
}

export function createReadingFromBits(bits, question = "") {
  const lines = buildLinesFromBits(bits);
  const primary = getHexagramFromLines(lines);
  const changingLines = lines.filter((line) => line.changing).map((line) => line.index);
  const hasChangingLines = changingLines.length > 0;
  const relating = hasChangingLines ? getHexagramFromLines(lines, { changed: true }) : null;

  return {
    question: String(question || "").trim(),
    bits: bits.slice(0, 18).map((bit) => (bit ? 1 : 0)),
    lines,
    changingLines,
    primary,
    relating,
  };
}

export function fallbackInterpretation(reading) {
  const changing = reading.changingLines.length
    ? `Движение идет через линии ${reading.changingLines.join(", ")} и ведет к гексаграмме ${reading.relating.number} «${reading.relating.ru}».`
    : "Меняющихся линий нет: ситуация больше похожа на устойчивое поле, чем на быстрый перелом.";

  return {
    headline: `${reading.primary.number}. ${reading.primary.ru}`,
    core: `Главная тема расклада: ${reading.primary.keyword}. Нижняя триграмма ${reading.primary.lower.ru} показывает внутренний импульс, верхняя ${reading.primary.upper.ru} показывает внешнюю форму ситуации.`,
    movement: changing,
    changingLines: reading.lines
      .filter((line) => line.changing)
      .map((line) => ({
        line: line.index,
        text: line.value === 6
          ? "Инь достигла предела и готова перейти в ян: слабое место может стать точкой действия."
          : "Ян достиг предела и готов перейти в инь: избыток силы просит паузы, меры или смены тактики.",
      })),
    practice: "Смотри на расклад как на карту внимания: что нужно удержать, где снять давление, какой маленький шаг уже созрел.",
    caution: "Это символическая интерпретация, а не предсказание и не замена профессиональному совету.",
    source: "local-fallback",
  };
}
