/* ================================================================
   Hiwar — Built-in Arabic–English dictionary (offline)
   Browse by letter (alif ا through yāʾ ي) or search.
   Entry: ar (Arabic), tr (transliteration), en (English), pos
   pos: n = noun, v = verb, adj = adjective, adv = adverb,
        phr = phrase/expression, prep = preposition,
        pron = pronoun, num = number, q = question word
   ================================================================ */

"use strict";

const DICT_LETTERS = ["ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"];

const DICT_POS = {
  n: "noun", v: "verb", adj: "adjective", adv: "adverb",
  phr: "phrase", prep: "preposition", pron: "pronoun", num: "number", q: "question word",
};

const w = (ar, tr, en, pos) => ({ ar, tr, en, pos });

const DICTIONARY = [
  /* ---- ا ---- */
  w("أب", "ab", "father", "n"),
  w("أم", "umm", "mother", "n"),
  w("أخ", "akh", "brother", "n"),
  w("أخت", "ukht", "sister", "n"),
  w("ابن", "ibn", "son", "n"),
  w("امرأة", "imraʾa", "woman", "n"),
  w("إنسان", "insān", "human being", "n"),
  w("اسم", "ism", "name", "n"),
  w("أستاذ", "ustādh", "teacher, professor", "n"),
  w("أسد", "asad", "lion", "n"),
  w("أكل", "akala", "to eat", "v"),
  w("أخذ", "akhadha", "to take", "v"),
  w("أريد", "urīd", "I want", "v"),
  w("أسف", "āsif", "sorry", "adj"),
  w("آسف", "āsif", "I'm sorry", "phr"),
  w("أهل", "ahl", "family, relatives", "n"),
  w("أهلاً وسهلاً", "ahlan wa sahlan", "welcome!", "phr"),
  w("أمس", "ams", "yesterday", "n"),
  w("أسبوع", "usbūʿ", "week", "n"),
  w("اثنان", "ithnān", "two", "num"),
  w("امتحان", "imtiḥān", "exam", "n"),
  w("إجازة", "ijāza", "holiday, vacation, leave", "n"),
  w("اقتصاد", "iqtiṣād", "economy", "n"),
  w("إذا", "idhā", "if, when", "adv"),
  w("أيضاً", "ayḍan", "also, too", "adv"),
  w("أرز", "aruzz", "rice", "n"),
  w("أرنب", "arnab", "rabbit", "n"),
  w("السلام عليكم", "as-salāmu ʿalaykum", "peace be upon you (greeting)", "phr"),

  /* ---- ب ---- */
  w("بيت", "bayt", "house, home", "n"),
  w("باب", "bāb", "door", "n"),
  w("بنت", "bint", "girl, daughter", "n"),
  w("كبير", "kabīr", "big, large, old", "adj"),
  w("بحر", "baḥr", "sea", "n"),
  w("بارد", "bārid", "cold", "adj"),
  w("بحث", "baḥth", "search, research", "n"),
  w("بائع", "bāʾiʿ", "seller, vendor", "n"),
  w("بصل", "baṣal", "onion", "n"),
  w("بطاطا", "baṭāṭā", "potato", "n"),
  w("بطيخ", "baṭṭīkh", "watermelon", "n"),
  w("برتقال", "burtuqāl", "orange (fruit)", "n"),
  w("بلد", "balad", "country, town", "n"),
  w("بنك", "bank", "bank", "n"),
  w("بريد", "barīd", "mail, post", "n"),
  w("بحيرة", "baḥīra", "lake", "n"),
  w("بخير", "bikhayr", "well, fine (in response to how are you)", "phr"),

  /* ---- ت ---- */
  w("تفاحة", "tuffāḥa", "apple", "n"),
  w("تمر", "tamr", "dates (fruit)", "n"),
  w("تلفاز", "tilfāz", "television", "n"),
  w("تاريخ", "tārīkh", "history, date", "n"),
  w("تذكرة", "tadhdhakira", "ticket", "n"),
  w("تذكر", "tadhakkara", "to remember", "v"),
  w("توقف", "tawwaqafa", "to stop", "v"),
  w("تحت", "taḥt", "under, below", "prep"),
  w("تقريباً", "taqrīban", "approximately, almost", "adv"),
  w("تلميذ", "tilmīdh", "student, pupil", "n"),
  w("تمرين", "tamrīn", "exercise, practice", "n"),
  w("ثلاثة", "thalātha", "three", "num"),

  /* ---- ث ---- */
  w("ثلاجة", "thallāja", "refrigerator", "n"),
  w("ثمن", "thaman", "price", "n"),
  w("ثوب", "thawb", "garment, dress, robe", "n"),
  w("ثعلب", "thaʿlab", "fox", "n"),
  w("ثوم", "thawm", "garlic", "n"),
  w("ثقيل", "thaqīl", "heavy", "adj"),
  w("ثانية", "thāniya", "second (time)", "n"),
  w("ثلج", "thalj", "snow, ice", "n"),
  w("ثقافة", "thaqāfa", "culture", "n"),
  w("ثمانية", "thamāniya", "eight", "num"),
  w("ثمانين", "thamānīn", "eighty", "num"),

  /* ---- ج ---- */
  w("جميل", "jamīl", "beautiful", "adj"),
  w("جيد", "jayyid", "good", "adj"),
  w("جبل", "jabal", "mountain", "n"),
  w("جمل", "jamal", "camel", "n"),
  w("جسم", "jism", "body", "n"),
  w("جريدة", "jarīda", "newspaper", "n"),
  w("جلس", "jalasa", "to sit", "v"),
  w("جاء", "jāʾa", "to come", "v"),
  w("جار", "jār", "neighbor", "n"),
  w("جواز سفر", "jawāz safar", "passport", "n"),
  w("جامعة", "jāmiʿa", "university", "n"),
  w("جبن", "jubn", "cheese", "n"),
  w("جزر", "jazar", "carrots, island", "n"),
  w("جزيرة", "jazīra", "island", "n"),
  w("جملة", "jumla", "sentence", "n"),
  w("جائع", "jāʾiʿ", "hungry", "adj"),
  w("جواب", "jawāb", "answer, reply", "n"),
  w("جنوب", "janūb", "south", "n"),

  /* ---- ح ---- */
  w("حب", "ḥubb", "love", "n"),
  w("حلو", "ḥilw", "sweet, nice", "adj"),
  w("حبيبي", "ḥabībī", "my darling, my dear", "phr"),
  w("حقيبة", "ḥaqība", "bag, suitcase", "n"),
  w("حار", "ḥārr", "hot", "adj"),
  w("حديقة", "ḥadīqa", "garden, park", "n"),
  w("حصان", "ḥiṣān", "horse", "n"),
  w("حليب", "ḥalīb", "milk", "n"),
  w("حياة", "ḥayāt", "life", "n"),
  w("حساب", "ḥisāb", "bill, account", "n"),
  w("حرف", "ḥarf", "letter (alphabet)", "n"),
  w("حقيقي", "ḥaqīqī", "real, genuine", "adj"),
  w("حسناً", "ḥasanan", "okay, alright", "adv"),
  w("حمل", "ḥamala", "to carry", "v"),
  w("حاضر", "ḥāḍir", "present, ready, okay", "adj"),
  w("حزين", "ḥazīn", "sad", "adj"),
  w("حلاق", "ḥallāq", "barber", "n"),
  w("حمد الله على السلامة", "ḥamdulillāh ʿalās-salāma", "welcome back / glad you're safe", "phr"),
  w("حلويات", "ḥalawiyyāt", "sweets, desserts", "n"),
  w("حائط", "ḥāʾiṭ", "wall", "n"),

  /* ---- خ ---- */
  w("خير", "khayr", "goodness, well-being", "n"),
  w("خبز", "khubz", "bread", "n"),
  w("خروف", "kharūf", "sheep, lamb", "n"),
  w("خضار", "khuḍār", "vegetables", "n"),
  w("خيار", "khiyār", "cucumber", "n"),
  w("خمسة", "khamsa", "five", "num"),
  w("خلف", "khalf", "behind", "prep"),
  w("خارج", "khārij", "outside", "adv"),
  w("خروج", "khurūj", "exit, departure", "n"),
  w("خريطة", "kharīṭa", "map", "n"),
  w("خصم", "khaṣm", "discount", "n"),
  w("خفيف", "khafīf", "light (weight), slight", "adj"),
  w("خزانة", "khizāna", "cupboard, wardrobe", "n"),
  w("خطر", "khaṭar", "danger", "n"),
  w("خال", "khāl", "maternal uncle", "n"),

  /* ---- د ---- */
  w("دار", "dār", "house, dwelling", "n"),
  w("درس", "dars", "lesson", "n"),
  w("دراسة", "dirāsa", "studying, study", "n"),
  w("دفتر", "daftar", "notebook", "n"),
  w("دجاج", "dajāj", "chicken (food/fowl)", "n"),
  w("دقيق", "daqīq", "flour; precise", "n"),
  w("دراجة", "darraja", "bicycle", "n"),
  w("دولة", "dawla", "state, country", "n"),
  w("دواء", "dawāʾ", "medicine", "n"),
  w("دافئ", "dāfiʾ", "warm", "adj"),
  w("دخول", "dukhūl", "entrance, entry", "n"),
  w("دقيقة", "daqīqa", "minute", "n"),
  w("دينار", "dīnār", "dinar (currency)", "n"),
  w("دكان", "dukkān", "small shop", "n"),
  w("دب", "dubb", "bear (animal)", "n"),
  w("دم", "dam", "blood", "n"),
  w("دولار", "dūlār", "dollar", "n"),

  /* ---- ذ ---- */
  w("ذهب", "dhahaba", "to go", "v"),
  w("ذهب", "dhahab", "gold", "n"),
  w("ذكر", "dhakara", "to mention", "v"),
  w("ذوق", "dhawq", "taste, elegance", "n"),
  w("ذكي", "dhakī", "smart, intelligent", "adj"),
  w("ذرة", "dhurra", "corn", "n"),
  w("ذيل", "dhayl", "tail", "n"),
  w("ذاكرة", "dhākira", "memory", "n"),
  w("ذئب", "dhiʾb", "wolf", "n"),

  /* ---- ر ---- */
  w("رجل", "rajul", "man", "n"),
  w("رأس", "raʾs", "head", "n"),
  w("رمل", "raml", "sand", "n"),
  w("رسالة", "risāla", "letter, message", "n"),
  w("ركن", "rukn", "corner", "n"),
  w("رمضان", "ramaḍān", "Ramadan", "n"),
  w("رياضة", "riyāḍa", "sports, exercise", "n"),
  w("رخيص", "rakhīṣ", "cheap", "adj"),
  w("رائع", "rāʾiʿ", "wonderful, amazing", "adj"),
  w("رائحة", "rāʾiḥa", "smell, scent", "n"),
  w("رقم", "raqam", "number", "n"),
  w("ركب", "rakiba", "to ride", "v"),
  w("رفيق", "rafīq", "companion", "n"),
  w("رحلة", "riḥla", "trip, journey", "n"),
  w("ريح", "rīḥ", "wind", "n"),
  w("رغيف", "raghīf", "loaf (of bread)", "n"),
  w("رب", "rabb", "Lord", "n"),
  w("رغبة", "raghba", "desire, wish", "n"),

  /* ---- ز ---- */
  w("زيت", "zayt", "oil", "n"),
  w("زوج", "zawj", "husband", "n"),
  w("زوجة", "zawja", "wife", "n"),
  w("زيتون", "zaytūn", "olives", "n"),
  w("زهرة", "zahra", "flower", "n"),
  w("زيارة", "ziyāra", "visit", "n"),
  w("زمن", "zaman", "time, era", "n"),
  w("زجاج", "zujāj", "glass (material)", "n"),
  w("زلزال", "zilzāl", "earthquake", "n"),
  w("زبدة", "zubda", "butter", "n"),
  w("زعتر", "zaʿtar", "thyme, za'atar", "n"),

  /* ---- س ---- */
  w("سلام", "salām", "peace, greeting", "n"),
  w("سؤال", "suʾāl", "question", "n"),
  w("سيارة", "sayyāra", "car", "n"),
  w("سوق", "sūq", "market, souq", "n"),
  w("سماء", "samāʾ", "sky", "n"),
  w("سفر", "safar", "travel", "n"),
  w("سنة", "sana", "year", "n"),
  w("سهل", "sahl", "easy; plain", "adj"),
  w("سعيد", "saʿīd", "happy", "adj"),
  w("سكر", "sukkar", "sugar", "n"),
  w("ساعة", "sāʿa", "hour, watch, clock", "n"),
  w("سباحة", "sibāḥa", "swimming", "n"),
  w("سكن", "sakana", "to live, reside", "v"),
  w("سحاب", "saḥāb", "clouds", "n"),
  w("سبب", "sabab", "reason, cause", "n"),
  w("سكين", "sikkīn", "knife", "n"),
  w("سياحة", "siyāḥa", "tourism", "n"),
  w("سبعة", "sabʿa", "seven", "num"),

  /* ---- ش ---- */
  w("شكراً", "shukran", "thank you", "phr"),
  w("شمس", "shams", "sun", "n"),
  w("شيء", "shayʾ", "thing", "n"),
  w("شهر", "shahr", "month", "n"),
  w("شاي", "shāy", "tea", "n"),
  w("شارع", "shāriʿ", "street", "n"),
  w("شجرة", "shajara", "tree", "n"),
  w("شاطئ", "shāṭiʾ", "beach", "n"),
  w("شعر", "shaʿr", "hair; poetry", "n"),
  w("شهادة", "shahāda", "certificate, degree", "n"),
  w("شكل", "shakl", "shape, form", "n"),
  w("شراب", "sharāb", "drink", "n"),
  w("شطيرة", "shaṭīra", "sandwich (Egyptian)", "n"),
  w("شاشة", "shāsha", "screen", "n"),

  /* ---- ص ---- */
  w("صباح", "ṣabāḥ", "morning", "n"),
  w("صباح الخير", "ṣabāḥ al-khayr", "good morning", "phr"),
  w("صغير", "ṣaghīr", "small, young", "adj"),
  w("صديق", "ṣadīq", "friend", "n"),
  w("صوت", "ṣawt", "voice, sound", "n"),
  w("صورة", "ṣūra", "picture, photo", "n"),
  w("صحة", "ṣiḥḥa", "health", "n"),
  w("صيف", "ṣayf", "summer", "n"),
  w("صحن", "ṣaḥn", "plate, dish", "n"),
  w("صابون", "ṣābūn", "soap", "n"),
  w("صلاة", "ṣalāt", "prayer", "n"),
  w("صيدلية", "ṣaydaliyya", "pharmacy", "n"),
  w("صبر", "ṣabr", "patience", "n"),
  w("صفر", "ṣifr", "zero", "num"),
  w("صعب", "ṣaʿb", "difficult", "adj"),
  w("صفحة", "ṣafḥa", "page", "n"),
  w("صندوق", "ṣundūq", "box", "n"),
  w("صحيح", "ṣaḥīḥ", "correct; healthy", "adj"),
  w("صاحب", "ṣāḥib", "owner; friend (Egyptian)", "n"),
  w("صحراء", "ṣaḥrāʾ", "desert", "n"),

  /* ---- ض ---- */
  w("ضوء", "ḍawʾ", "light", "n"),
  w("ضيف", "ḍayf", "guest", "n"),
  w("ضحك", "ḍaḥika", "to laugh", "v"),
  w("ضيق", "ḍayyiq", "narrow, tight", "adj"),
  w("ضعيف", "ḍaʿīf", "weak", "adj"),
  w("ضغط", "ḍaghṭ", "pressure", "n"),
  w("ضروري", "ḍarūrī", "necessary", "adj"),

  /* ---- ط ---- */
  w("طعام", "ṭaʿām", "food", "n"),
  w("طيب", "ṭayyib", "good, kind; tasty", "adj"),
  w("طبيب", "ṭabīb", "doctor", "n"),
  w("طويل", "ṭawīl", "tall, long", "adj"),
  w("طائرة", "ṭāʾira", "airplane", "n"),
  w("طماطم", "ṭamāṭim", "tomatoes", "n"),
  w("طاولة", "ṭāwila", "table", "n"),
  w("طالب", "ṭālib", "student", "n"),
  w("طريقة", "ṭarīqa", "way, method", "n"),
  w("طازج", "ṭāzaj", "fresh", "adj"),
  w("طلب", "ṭalab", "request, order", "n"),
  w("طير", "ṭayr", "bird", "n"),
  w("طرف", "ṭaraf", "side, party", "n"),
  w("طقس", "ṭaqs", "weather", "n"),
  w("طريق", "ṭarīq", "road, way", "n"),
  w("طبخ", "ṭabakha", "to cook", "v"),

  /* ---- ظ ---- */
  w("ظهر", "ẓahr", "back; noon, afternoon", "n"),
  w("ظرف", "ẓarf", "envelope; circumstance", "n"),
  w("ظلام", "ẓalām", "darkness", "n"),
  w("ظل", "ẓill", "shade, shadow", "n"),
  w("ظريف", "ẓarīf", "funny, cute, witty", "adj"),
  w("ظن", "ẓanna", "to think, assume", "v"),
  w("ظفر", "ẓufr", "nail (finger)", "n"),

  /* ---- ع ---- */
  w("عربي", "ʿarabī", "Arabic; Arab", "adj"),
  w("عفواً", "ʿafwan", "excuse me; you're welcome", "phr"),
  w("عين", "ʿayn", "eye", "n"),
  w("عادة", "ʿāda", "habit; usually", "n"),
  w("علم", "ʿilm", "knowledge, science", "n"),
  w("عنب", "ʿinab", "grapes", "n"),
  w("عصير", "ʿaṣīr", "juice", "n"),
  w("عدس", "ʿads", "lentils", "n"),
  w("عشاء", "ʿashāʾ", "dinner", "n"),
  w("عسل", "ʿasal", "honey", "n"),
  w("عائلة", "ʿāʾila", "family", "n"),
  w("عاصمة", "ʿāṣima", "capital city", "n"),
  w("عالم", "ʿālam", "world", "n"),
  w("عم", "ʿamm", "paternal uncle", "n"),
  w("عامل", "ʿāmil", "worker", "n"),
  w("عيد", "ʿīd", "Eid, festival", "n"),
  w("عظيم", "ʿaẓīm", "great", "adj"),
  w("عبر", "ʿabara", "to cross", "v"),
  w("عندك", "ʿandak", "you have", "phr"),
  w("عندي", "ʿandī", "I have", "phr"),
  w("على", "ʿalā", "on, upon", "prep"),

  /* ---- غ ---- */
  w("غداً", "ghadan", "tomorrow", "adv"),
  w("غرب", "gharb", "west", "n"),
  w("غريب", "gharīb", "strange; foreign", "adj"),
  w("غرفة", "ghurfa", "room", "n"),
  w("غزال", "ghazāl", "gazelle", "n"),
  w("غداء", "ghadāʾ", "lunch", "n"),
  w("غالي", "ghālī", "expensive, dear", "adj"),
  w("غبار", "ghubār", "dust", "n"),
  w("غضب", "ghaḍab", "anger", "n"),
  w("غني", "ghanī", "rich", "adj"),
  w("غيمة", "ghayma", "cloud", "n"),

  /* ---- ف ---- */
  w("في", "fī", "in", "prep"),
  w("فندق", "funduq", "hotel", "n"),
  w("فطور", "fuṭūr", "breakfast", "n"),
  w("فم", "fam", "mouth", "n"),
  w("فرح", "faraḥ", "joy, happiness", "n"),
  w("فتاة", "fatāt", "girl, young woman", "n"),
  w("فرن", "farn", "oven", "n"),
  w("فكرة", "fikra", "idea", "n"),
  w("فرصة", "fursa", "chance, opportunity", "n"),
  w("فوق", "fawq", "above, over", "prep"),
  w("فيل", "fīl", "elephant", "n"),
  w("فراولة", "farawla", "strawberry", "n"),
  w("فلفل", "filfil", "pepper", "n"),
  w("فستان", "fusṭān", "dress", "n"),
  w("فضة", "fiḍḍa", "silver", "n"),
  w("فاتورة", "fātūra", "bill, invoice", "n"),
  w("فهد", "fahd", "leopard, cheetah", "n"),
  w("فصل", "faṣl", "season; chapter", "n"),
  w("فلوس", "fulūs", "money (Egyptian/Levantine)", "n"),
  w("فهم", "fahima", "to understand", "v"),

  /* ---- ق ---- */
  w("كتاب", "kitāb", "book", "n"),
  w("قلب", "qalb", "heart", "n"),
  w("قلم", "qalam", "pen", "n"),
  w("قهوة", "qahwa", "coffee", "n"),
  w("قمر", "qamar", "moon", "n"),
  w("قديم", "qadīm", "old, ancient", "adj"),
  w("قريب", "qarīb", "near, soon", "adj"),
  w("قصير", "qaṣīr", "short", "adj"),
  w("قطة", "qiṭṭa", "cat", "n"),
  w("قمح", "qamḥ", "wheat", "n"),
  w("قال", "qāla", "to say", "v"),
  w("قابل", "qābila", "to meet", "v"),
  w("قانون", "qānūn", "law", "n"),
  w("قصة", "qiṣṣa", "story", "n"),
  w("قسم", "qism", "section, department", "n"),
  w("قائمة", "qāʾima", "list, menu", "n"),
  w("قناة", "qanāh", "channel", "n"),
  w("قصر", "qaṣr", "palace", "n"),
  w("قبعة", "qubbaʿa", "hat", "n"),
  w("قليل", "qalīl", "little, few", "adj"),
  w("قوي", "qawī", "strong", "adj"),
  w("قدم", "qadam", "foot", "n"),

  /* ---- ك ---- */
  w("كيف", "kayf", "how", "q"),
  w("كثير", "kathīr", "many, much, a lot", "adj"),
  w("كل", "kull", "all, every", "pron"),
  w("كلمة", "kalima", "word", "n"),
  w("كان", "kāna", "to be (was)", "v"),
  w("كنيسة", "kanīsa", "church", "n"),
  w("كرسي", "kursī", "chair", "n"),
  w("كلب", "kalb", "dog", "n"),
  w("كم", "kam", "how much, how many", "q"),
  w("كوب", "kūb", "cup, glass", "n"),
  w("كأس", "kas", "drinking glass", "n"),
  w("كريم", "karīm", "generous, noble", "adj"),
  w("كنافة", "kunāfa", "kunafa (dessert)", "n"),
  w("كتف", "katif", "shoulder", "n"),

  /* ---- ل ---- */
  w("ليمون", "laymūn", "lemon", "n"),
  w("ليل", "layl", "night", "n"),
  w("لوحة", "lawḥa", "painting, board, sign", "n"),
  w("لغة", "lugha", "language", "n"),
  w("لذيذ", "ladhīdh", "delicious", "adj"),
  w("لحم", "laḥm", "meat", "n"),
  w("لعب", "laʿiba", "to play", "v"),
  w("لقاء", "liqāʾ", "meeting", "n"),
  w("لطيف", "laṭīf", "kind, gentle, nice", "adj"),
  w("لوز", "lawz", "almonds", "n"),
  w("لازم", "lāzim", "necessary, must (Egyptian/Levantine)", "adj"),
  w("لون", "lawn", "color", "n"),
  w("ليلة", "layla", "night, evening", "n"),
  w("لبن", "laban", "yogurt drink; milk", "n"),
  w("لسان", "lisān", "tongue; language", "n"),

  /* ---- م ---- */
  w("ماء", "māʾ", "water", "n"),
  w("مدينة", "madīna", "city", "n"),
  w("مدرسة", "madrasa", "school", "n"),
  w("مفتاح", "miftāḥ", "key", "n"),
  w("مطار", "maṭār", "airport", "n"),
  w("مطعم", "maṭʿam", "restaurant", "n"),
  w("مركز", "markaz", "center", "n"),
  w("مساء", "masāʾ", "evening", "n"),
  w("مساء الخير", "masāʾ al-khayr", "good evening", "phr"),
  w("مسجد", "masjid", "mosque", "n"),
  w("مساعدة", "musāʿada", "help, assistance", "n"),
  w("مسافر", "musāfir", "traveler", "n"),
  w("مريض", "marīḍ", "sick, ill", "adj"),
  w("مطبخ", "maṭbakh", "kitchen", "n"),
  w("مقهى", "maqha", "café", "n"),
  w("ممتاز", "mumtāz", "excellent", "adj"),
  w("من", "min", "from", "prep"),
  w("ملح", "milḥ", "salt", "n"),
  w("ممنوع", "mamnūʿ", "prohibited, not allowed", "adj"),
  w("مهرجان", "mihrajān", "festival", "n"),
  w("موسيقى", "mūsīqā", "music", "n"),
  w("ممرضة", "mumarriḍa", "nurse", "n"),
  w("ملك", "malik", "king", "n"),
  w("مهم", "muhimm", "important", "adj"),
  w("موز", "mawz", "bananas", "n"),
  w("مبروك", "mabrūk", "congratulations", "phr"),
  w("متجر", "matjar", "shop, store", "n"),
  w("مقابلة", "muqābala", "interview, meeting", "n"),
  w("مسرح", "masraḥ", "theater", "n"),
  w("مشكلة", "mushkila", "problem", "n"),
  w("مطر", "maṭar", "rain", "n"),
  w("موعد", "mawʿid", "appointment, date, time", "n"),
  w("موظف", "muwaẓẓaf", "employee, official", "n"),
  w("ماذا", "mādhā", "what", "q"),
  w("مفتوح", "maftūḥ", "open", "adj"),
  w("مغلق", "mughlaq", "closed", "adj"),
  w("مرحباً", "marḥaban", "hello, welcome", "phr"),
  w("مثل", "mithl", "like, similar to", "prep"),

  /* ---- ن ---- */
  w("نعم", "naʿam", "yes", "adv"),
  w("نهر", "nahr", "river", "n"),
  w("نافذة", "nāfida", "window", "n"),
  w("نجم", "najm", "star", "n"),
  w("نار", "nār", "fire", "n"),
  w("نسي", "nasiya", "to forget", "v"),
  w("نشيط", "nashīṭ", "active, energetic", "adj"),
  w("نصف", "niṣf", "half", "n"),
  w("نعناع", "naʿnāʿ", "mint", "n"),
  w("نقود", "nuqūd", "money", "n"),
  w("نور", "nūr", "light", "n"),
  w("نوم", "nawm", "sleep", "n"),
  w("نهاية", "nihāya", "end", "n"),
  w("نظيف", "naẓīf", "clean", "adj"),
  w("نكتة", "nikta", "joke", "n"),
  w("نظر", "naẓara", "to look", "v"),
  w("نص", "naṣṣ", "text", "n"),

  /* ---- ه ---- */
  w("هو", "huwa", "he", "pron"),
  w("هي", "hiya", "she", "pron"),
  w("هم", "hum", "they", "pron"),
  w("هذا", "hādhā", "this (m)", "pron"),
  w("هذه", "hādhihi", "this (f)", "pron"),
  w("هاتف", "hātif", "phone", "n"),
  w("هدية", "hadiyya", "gift, present", "n"),
  w("هرم", "haram", "pyramid", "n"),
  w("هنا", "hunā", "here", "adv"),
  w("هواء", "hawāʾ", "air", "n"),
  w("هدوء", "hudūʾ", "calm, quiet", "n"),
  w("هلال", "hilāl", "crescent", "n"),
  w("هناك", "hunāka", "there", "adv"),

  /* ---- و ---- */
  w("واحد", "wāḥid", "one", "num"),
  w("وردة", "warda", "rose, flower", "n"),
  w("ورقة", "waraqa", "piece of paper; leaf", "n"),
  w("وزير", "wazīr", "minister", "n"),
  w("وسادة", "wisāda", "pillow", "n"),
  w("وداع", "widāʿ", "farewell", "n"),
  w("وسط", "wasṭ", "middle, center", "n"),
  w("وضع", "waḍʿ", "situation, condition", "n"),
  w("وطن", "waṭan", "homeland", "n"),
  w("ولد", "walad", "boy", "n"),
  w("وقت", "waqt", "time", "n"),
  w("والدين", "wālidayn", "parents", "n"),

  /* ---- ي ---- */
  w("يد", "yad", "hand", "n"),
  w("يوم", "yawm", "day", "n"),
  w("يمين", "yamīn", "right (side)", "n"),
  w("يسار", "yasār", "left (side)", "n"),
  w("ياسمين", "yāsmīn", "jasmine", "n"),
  w("يابس", "yābis", "dry", "adj"),
  w("يساعد", "yusāʿid", "to help", "v"),
];

/* ---------------- Helpers ---------------- */

// Remove diacritics/tatweel and unify letter variants for matching & grouping
function normalizeAr(s) {
  return String(s || "")
    .replace(/[\u064B-\u0652\u0640\u0670]/g, "") // tashkeel + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ٱ/g, "ا")
    .trim();
}

// The dictionary letter of a word: skips the definite article "ال"
function dictLetterOf(word) {
  const n = normalizeAr(word);
  if (!n) return "";
  if (n.startsWith("ال") && n.length >= 4 && n !== "الله") return normalizeLetter(n[2]);
  return normalizeLetter(n[0]);
}
function normalizeLetter(ch) {
  return normalizeAr(ch) || ch;
}

// Arabic alphabet sort order
const LETTER_ORDER = {};
DICT_LETTERS.forEach((l, i) => (LETTER_ORDER[l] = i));

function sortedEntries() {
  return [...DICTIONARY].sort((a, b) => {
    const la = LETTER_ORDER[dictLetterOf(a.ar)] ?? 99;
    const lb = LETTER_ORDER[dictLetterOf(b.ar)] ?? 99;
    if (la !== lb) return la - lb;
    return String(a.ar).localeCompare(String(b.ar), "ar");
  });
}

// Search: Arabic, English, or transliteration; returns sorted matches
function searchDictionary(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const qAr = normalizeAr(query);
  return sortedEntries().filter((e) => {
    const ar = normalizeAr(e.ar);
    if (qAr && (ar === qAr || ar.includes(qAr))) return true;
    if (e.en.toLowerCase().includes(q)) return true;
    if (e.tr.toLowerCase().includes(q)) return true;
    return false;
  });
}

// Exact (normalized) Arabic match — used by tap-to-learn fallback
function findInDictionary(word) {
  const qAr = normalizeAr(word);
  if (!qAr) return null;
  return (
    DICTIONARY.find((e) => normalizeAr(e.ar) === qAr) ||
    DICTIONARY.find((e) => normalizeAr(e.ar).startsWith(qAr) && qAr.length >= 2) ||
    null
  );
}

// Entries grouped by dictionary letter, in alphabet order
function entriesByLetter(letter) {
  return sortedEntries().filter((e) => dictLetterOf(e.ar) === letter);
}

// Clean placeholder-free list (guards against accidental empty entries)
function dictCounts() {
  const counts = {};
  for (const e of DICTIONARY) {
    if (!e.tr || !e.en) continue;
    const l = dictLetterOf(e.ar);
    if (l) counts[l] = (counts[l] || 0) + 1;
  }
  return counts;
}
