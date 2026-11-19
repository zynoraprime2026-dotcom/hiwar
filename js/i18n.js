/* Hiwar interface languages — English (default) and Arabic (RTL).
 *
 * The markup is written in English and stays that way: this file translates the
 * rendered strings at runtime and can put every one of them back, so switching
 * language never touches the DOM structure or the app's own logic.
 *
 * Arabic strings are matched on their English source text. Anything not in the
 * table is left as-is, which is deliberate: the tutor's own replies, scenario
 * content and dictionary entries come from data, not from the interface.
 */
(function () {
  "use strict";

  var KEY = "hiwar_lang";

  var ATOMIC = {
    // ── chrome ──────────────────────────────────────────────────────────────
    "Skip to the message box": "تخطَّ إلى مربع الرسائل",
    "Hiwar": "حوار",
    "Scenario": "الموقف",
    "Greetings & Introductions": "التحيات والتعريف بالنفس",
    "Level": "المستوى",
    "Beginner": "مبتدئ",
    "Intermediate": "متوسط",
    "Advanced": "متقدّم",
    "Arabic": "العربية",
    "Modern Standard": "الفصحى",
    "Egyptian 🇪🇬": "المصرية 🇪🇬",
    "Levantine 🇱🇧": "الشامية 🇱🇧",
    "Mode": "الوضع",
    "💬 Chat": "💬 محادثة",
    "🧭 Guided": "🧭 موجَّه",
    "🎧 Repeat": "🎧 ترديد",
    "English": "الإنجليزية",
    "Translit.": "النقل الحرفي",
    "On": "مُفعّل",
    "Off": "مُعطّل",
    "New chat": "محادثة جديدة",

    // ── repeat panel ────────────────────────────────────────────────────────
    "Listen to the phrase, then repeat it out loud": "استمع إلى العبارة ثم ردّدها بصوت مسموع",
    "🔊 Listen": "🔊 استمع",
    "🎤 Repeat it": "🎤 ردّدها",
    "➡️ New phrase": "➡️ عبارة جديدة",

    // ── dictionary ──────────────────────────────────────────────────────────
    "Dictionary": "المعجم",
    "Browse by letter, alif to yāʾ — or search in Arabic or English":
      "تصفّح بالحرف من الألف إلى الياء، أو ابحث بالعربية أو الإنجليزية",
    "← Back to chat": "← رجوع إلى المحادثة",

    // ── composer / hints ────────────────────────────────────────────────────
    "Listening…": "أستمع…",
    "AI key is optional — guided practice works without one.":
      "مفتاح الذكاء الاصطناعي اختياري — التدريب الموجَّه يعمل بدونه.",
    "AI key": "مفتاح الذكاء الاصطناعي",

    // ── install modal ───────────────────────────────────────────────────────
    "Install Hiwar": "تثبيت حوار",
    "🤖 Android (Chrome)": "🤖 أندرويد (كروم)",
    "🍎 iPhone / iPad (Safari)": "🍎 آيفون / آيباد (سفاري)",
    "💻 Windows desktop app": "💻 تطبيق ويندوز",
    "🌐 Chrome or Edge on a laptop": "🌐 كروم أو إيدج على الحاسوب",

    // ── settings ────────────────────────────────────────────────────────────
    "Settings": "الإعدادات",
    "API Base URL": "عنوان الواجهة البرمجية",
    "API Key": "المفتاح",
    "Model": "النموذج",
    "Daily goal (practice steps per day)": "الهدف اليومي (خطوات التدريب في اليوم)",
    "Auto-speak assistant replies aloud": "نطق ردود المعلّم تلقائيًا",
    "Save": "حفظ",
    "Your practice data": "بيانات تدريبك",
    "⬇️ Export backup": "⬇️ تصدير نسخة احتياطية",
    "⬆️ Restore backup": "⬆️ استعادة نسخة احتياطية",
    "⚠️ Report a mistake": "⚠️ أبلغ عن خطأ",
    "· free for the Ummah · no accounts, no tracking":
      "· مجاني للأمة · بلا حسابات · بلا تتبّع",
    "Interface language": "لغة الواجهة",

    // ── study ───────────────────────────────────────────────────────────────
    "Study": "المذاكرة",
    "🎯 Vocabulary quiz": "🎯 اختبار المفردات",
    "🔁 Mistakes flashcards": "🔁 بطاقات الأخطاء",
    "← Back": "← رجوع",
    "Next": "التالي",
    "🔁 Common mistakes": "🔁 أخطاء شائعة",
    "🗂️ My vocabulary": "🗂️ مفرداتي",
    "Looking up…": "أبحث…",
    "💾 Save to vocabulary": "💾 احفظ في المفردات",

    // ── summary / welcome ───────────────────────────────────────────────────
    "Session summary": "ملخّص الجلسة",
    "Generating recap…": "أُعِدّ الملخّص…",
    "Welcome to Hiwar": "مرحبًا بك في حوار",
    "Start free practice": "ابدأ التدريب المجاني",
    "Guided dialogues you can do right now. No setup, no key.":
      "حوارات موجَّهة تبدأها الآن، بلا إعداد وبلا مفتاح.",
    "Use the AI tutor": "استخدم المعلّم الذكي",
    "Free conversation with corrections and voice. Needs your own API key.":
      "محادثة حرّة مع تصحيح ونطق، وتحتاج مفتاحك الخاص.",
    "Your level": "مستواك",
    "Daily goal": "الهدف اليومي",
    "5 replies": "٥ ردود",
    "10 replies": "١٠ ردود",
    "20 replies": "٢٠ ردود",
    "You can switch between the two at any time, and your progress is kept on this device only.":
      "يمكنك التنقّل بين الوضعين في أي وقت، وتقدّمك محفوظ على هذا الجهاز وحده.",

    // ── attributes ──────────────────────────────────────────────────────────
    "Practice streak": "سلسلة التدريب",
    "Daily practice goal": "الهدف اليومي",
    "Daily practice goal — change it in Settings": "الهدف اليومي — غيّره من الإعدادات",
    "Study: mistakes, vocabulary and quizzes": "المذاكرة: الأخطاء والمفردات والاختبارات",
    "Dictionary: browse alif to yāʾ or search": "المعجم: تصفّح من الألف إلى الياء أو ابحث",
    "Install Hiwar on your phone or computer": "ثبّت حوار على هاتفك أو حاسوبك",
    "Practice scene": "موقف التدريب",
    "Dialect of the tutor": "لهجة المعلّم",
    "Show/hide English translations": "إظهار/إخفاء الترجمة الإنجليزية",
    "Show/hide Latin transliteration": "إظهار/إخفاء النقل الحرفي",
    "Conversation with the tutor": "المحادثة مع المعلّم",
    "Speak in Arabic": "تحدّث بالعربية",
    "Type in Arabic… اكتب بالعربية": "اكتب بالعربية…",
    "Send": "إرسال",
    "Close": "إغلاق"
  };

  /* Blocks whose English is a sentence broken up by <b> and <a>. Translating those
     fragments one by one would scramble the word order, so the whole block is
     replaced instead, then put back on the way out. */
  var BLOCKS = {
    "#modal-install .modal-note": function () {
      return "ثبّت حوار كتطبيق عادي: أيقونته الخاصة، وفتح بشاشة كاملة، وعمل دون إنترنت.";
    },
    "#modal-install .install-steps": function () {
      return [
        "<h3>🤖 أندرويد (كروم)</h3>",
        "<ol>",
        "<li>اضغط قائمة <b>⋮</b> (أعلى يمين كروم)</li>",
        "<li>اختر <b>تثبيت التطبيق</b> أو <b>إضافة إلى الشاشة الرئيسية</b></li>",
        "</ol>",
        "<h3>🍎 آيفون / آيباد (سفاري)</h3>",
        "<ol>",
        '<li>اضغط زر <b>المشاركة</b> <span class="arabic">(⬆️)</span></li>',
        "<li>انزل للأسفل واضغط <b>إضافة إلى الشاشة الرئيسية</b></li>",
        "<li>اضغط <b>إضافة</b></li>",
        "</ol>",
        "<h3>💻 تطبيق ويندوز</h3>",
        "<ol>",
        '<li>افتح <a href="https://github.com/zynoraprime2026-dotcom/hiwar/releases/latest" target="_blank" rel="noopener">صفحة الإصدارات</a></li>',
        "<li>نزّل <b>Hiwar Setup</b> للتثبيت العادي، أو النسخة <b>المحمولة</b> .exe للتشغيل دون تثبيت</li>",
        "<li>لا حاجة إلى صلاحيات المدير — يمكن التثبيت للمستخدم وحده</li>",
        "</ol>",
        "<h3>🌐 كروم أو إيدج على الحاسوب</h3>",
        "<ol>",
        "<li>اضغط <b>أيقونة التثبيت</b> في شريط العنوان، أو من قائمة المتصفح اختر <b>تثبيت حوار</b></li>",
        "<li>يفتح في نافذته الخاصة ويعمل دون إنترنت</li>",
        "</ol>"
      ].join("");
    },
    "#modal-welcome .welcome-lead": function () {
      return "تحدّث العربية بصوت مسموع، وأخطئ، واحصل على تصحيح رفيق. بلا حساب، ولا شيء يُرفع، ويعمل دون إنترنت.";
    },
    "#modal-welcome .welcome-note": function () {
      return "يمكنك التنقّل بين الوضعين في أي وقت، وتقدّمك محفوظ على هذا الجهاز وحده.";
    }
  };

  var originals = new WeakMap(); // node/attribute holder -> original value
  var blockOriginals = new Map(); // selector -> original innerHTML
  var current = "en";
  var observers = [];

  function remembered(node) {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    return originals.get(node);
  }

  function translateText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !/[A-Za-z]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        var parent = n.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest("script,style,.arabic")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var original = remembered(n);
      var key = original.trim();
      if (!key) return;
      var hit = ATOMIC[key];
      if (!hit) return;
      n.nodeValue = original.replace(key, hit);
    });
  }

  function translateAttrs(root) {
    var ATTRS = ["placeholder", "title", "aria-label"];
    root.querySelectorAll("*").forEach(function (el) {
      ATTRS.forEach(function (attr) {
        var value = el.getAttribute(attr);
        if (!value) return;
        var store = el.dataset.langOrig || (el.dataset.langOrig = "{}");
        var map;
        try {
          map = JSON.parse(store);
        } catch (e) {
          map = {};
        }
        if (!(attr in map)) {
          map[attr] = value;
          el.dataset.langOrig = JSON.stringify(map);
        }
        var hit = ATOMIC[value.trim()];
        if (hit) el.setAttribute(attr, hit);
        else if (map[attr]) el.setAttribute(attr, map[attr]);
      });
    });
  }

  function applyBlocks() {
    Object.keys(BLOCKS).forEach(function (selector) {
      var el = document.querySelector(selector);
      if (!el) return;
      if (!blockOriginals.has(selector)) blockOriginals.set(selector, el.innerHTML);
      el.innerHTML = BLOCKS[selector]();
    });
  }

  function restoreBlocks() {
    blockOriginals.forEach(function (html, selector) {
      var el = document.querySelector(selector);
      if (el) el.innerHTML = html;
    });
    blockOriginals.clear();
  }

  function restoreText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      var n = walker.currentNode;
      if (originals.has(n)) n.nodeValue = originals.get(n);
    }
  }

  function restoreAttrs(root) {
    root.querySelectorAll("[data-lang-orig]").forEach(function (el) {
      var map;
      try {
        map = JSON.parse(el.dataset.langOrig);
      } catch (e) {
        return;
      }
      Object.keys(map).forEach(function (attr) {
        el.setAttribute(attr, map[attr]);
      });
      delete el.dataset.langOrig;
    });
  }

  function setDocumentLanguage(lang) {
    var html = document.documentElement;
    html.lang = lang === "ar" ? "ar" : "en";
    html.dir = lang === "ar" ? "rtl" : "ltr";
    document.title =
      lang === "ar"
        ? "حوار — معلّم المحادثة العربية"
        : "Hiwar — Arabic Conversation Tutor";
  }

  function setLang(lang) {
    var next = lang === "ar" ? "ar" : "en";
    var root = document.body;
    if (next === current && originals) {
      // still re-apply: dynamic markup may have been re-rendered since
    }
    if (next === "ar") {
      translateText(root);
      translateAttrs(root);
      applyBlocks();
      translateText(root); // strings that live inside a replaced block
    } else {
      restoreBlocks();
      restoreText(root);
      restoreAttrs(root);
    }
    current = next;
    setDocumentLanguage(next);
    if (next === "ar") startWatching();
    else stopWatching();
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* private mode: language just won't persist */
    }
    observers.forEach(function (fn) {
      try {
        fn(next);
      } catch (e) {
        /* a listener must never break the switch */
      }
    });
    return next;
  }

  function t(english) {
    if (current !== "ar") return english;
    return ATOMIC[english] || english;
  }

  /* The app re-renders panels (quiz, dictionary, summary) long after load, so a
     light observer re-applies the table to fresh markup. It is only installed
     while Arabic is active, and the guard stops our own edits from re-triggering
     it. */
  var observer = null;
  var applying = false;
  var timer = null;

  function startWatching() {
    if (observer) return;
    observer = new MutationObserver(function () {
      if (applying || current !== "ar") return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        applying = true;
        translateText(document.body);
        translateAttrs(document.body);
        setTimeout(function () {
          applying = false;
        }, 0);
      }, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function stopWatching() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
    clearTimeout(timer);
  }

  window.HiwarI18n = {
    get lang() {
      return current;
    },
    t: t,
    setLang: setLang,
    onChange: function (fn) {
      observers.push(fn);
    },
    /* Re-run translation after the app renders new markup (a fresh quiz, a new
       panel) without flipping the whole document again. */
    refresh: function () {
      if (current === "ar") {
        translateText(document.body);
        translateAttrs(document.body);
      }
    }
  };

  var saved = "en";
  try {
    saved = localStorage.getItem(KEY) === "ar" ? "ar" : "en";
  } catch (e) {
    saved = "en";
  }
  current = "en";
  setDocumentLanguage(saved);
  if (saved === "ar") {
    document.addEventListener("DOMContentLoaded", function () {
      setLang("ar");
    });
  }
})();
