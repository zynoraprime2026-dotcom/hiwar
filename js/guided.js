/* ================================================================
   Hiwar (حوار) — Guided practice
   Scripted conversations that work with no account and no API key,
   fully offline. Each scene is a short exchange: the partner speaks,
   the learner picks a reply (and hears it), the scene moves on.
   The AI tutor stays available as an upgrade, never a gate.
   ================================================================ */

"use strict";

const GUIDED_SCENES = {
  greetings: {
    title: "First meeting",
    goal: "Greet someone, give your name, say where you are from and what you do.",
    steps: [
      {
        partner: {
          ar: "السَّلَامُ عَلَيْكُمْ! أَنَا خَالِد. مَا اسْمُكَ؟",
          tr: "as-salāmu ʿalaykum! anā Khālid. mā ismuka?",
          en: "Peace be upon you! I'm Khalid. What's your name?",
        },
        options: [
          {
            ar: "وَعَلَيْكُمُ السَّلَام، أَنَا عَبْدُ الرَّحْمَٰن.",
            tr: "wa ʿalaykumu s-salām, anā ʿAbd ar-Raḥmān.",
            en: "And peace be upon you, I'm Abd ar-Rahman.",
            tip: "Return the greeting in full — leaving it unanswered sounds abrupt.",
          },
          {
            ar: "أَهْلاً، اسْمِي مَرْيَم.",
            tr: "ahlan, ismī Maryam.",
            en: "Hi, my name is Maryam.",
            tip: "أَهْلاً is a warm, informal hello for everyday situations.",
          },
        ],
      },
      {
        partner: {
          ar: "أَهْلاً وَسَهْلاً! مِنْ أَيْنَ أَنْتَ؟",
          tr: "ahlan wa sahlan! min ayna anta?",
          en: "Welcome! Where are you from?",
        },
        options: [
          {
            ar: "أَنَا مِنْ غَانَا.",
            tr: "anā min Ghānā.",
            en: "I'm from Ghana.",
            tip: "مِنْ means “from”. Put the country straight after it.",
          },
          {
            ar: "أَنَا مِنْ غَانَا، وَأَنْتَ؟",
            tr: "anā min Ghānā, wa anta?",
            en: "I'm from Ghana, and you?",
            tip: "Adding وَأَنْتَ؟ hands the question back and keeps the talk going.",
          },
        ],
      },
      {
        partner: {
          ar: "أَنَا مِنْ مِصْر. مَاذَا تَعْمَل؟",
          tr: "anā min Miṣr. mādhā taʿmal?",
          en: "I'm from Egypt. What do you do?",
        },
        options: [
          {
            ar: "أَنَا طَالِب.",
            tr: "anā ṭālib.",
            en: "I'm a student.",
          },
          {
            ar: "أَعْمَلُ فِي التِّجَارَة.",
            tr: "aʿmalu fī t-tijāra.",
            en: "I work in trade.",
            tip: "أَعْمَلُ فِي… is the general pattern for “I work in …”.",
          },
        ],
      },
      {
        partner: {
          ar: "مَا شَاءَ الله! هَلْ تَتَعَلَّمُ العَرَبِيَّة؟",
          tr: "mā shāʾa llāh! hal tataʿallamu l-ʿarabiyya?",
          en: "Wonderful! Are you learning Arabic?",
        },
        options: [
          {
            ar: "نَعَمْ، أَتَعَلَّمُ كُلَّ يَوْم.",
            tr: "naʿam, ataʿallamu kulla yawm.",
            en: "Yes, I study every day.",
          },
          {
            ar: "قَلِيلاً، وَلَكِنِّي أُحِبُّ اللُّغَة.",
            tr: "qalīlan, wa lākinnī uḥibbu l-lugha.",
            en: "A little, but I love the language.",
            tip: "وَلَكِنِّ means “but”. A soft answer like this buys you time.",
          },
        ],
      },
    ],
  },

  shopping: {
    title: "In the market",
    goal: "Ask for what you want, ask the price, and bargain politely.",
    steps: [
      {
        partner: {
          ar: "أَهْلاً بِكَ فِي السُّوق! مَاذَا تُرِيد؟",
          tr: "ahlan bika fī s-sūq! mādhā turīd?",
          en: "Welcome to the market! What would you like?",
        },
        options: [
          {
            ar: "أُرِيدُ قَمِيصاً، لَوْ سَمَحْت.",
            tr: "urīdu qamīṣan, law samaḥt.",
            en: "I'd like a shirt, please.",
            tip: "لَوْ سَمَحْت is the everyday “please” that fits almost anywhere.",
          },
          {
            ar: "أَبْحَثُ عَنْ هَدِيَّة.",
            tr: "abḥathu ʿan hadiyya.",
            en: "I'm looking for a gift.",
          },
        ],
      },
      {
        partner: {
          ar: "عِنْدِي قُمُصٌ جَمِيلَة. هَذَا بِمِئَةِ رِيَال.",
          tr: "ʿindī qumuṣun jamīla. hādhā bi-miʾati riyāl.",
          en: "I have beautiful shirts. This one is 100 riyals.",
        },
        options: [
          {
            ar: "غَالِي قَلِيلاً. هَلْ يُوجَدُ أَرْخَص؟",
            tr: "ghālī qalīlan. hal yūjad arkhaṣ?",
            en: "That's a bit expensive. Is there a cheaper one?",
            tip: "Asking for a cheaper option is normal in a souq and opens the bargaining.",
          },
          {
            ar: "حَسَناً، آخُذُهُ.",
            tr: "ḥasanan, ākhudhuhu.",
            en: "Fine, I'll take it.",
          },
        ],
      },
      {
        partner: {
          ar: "هَذَا بِسَبْعِينَ. لَوْنُهُ أَزْرَق. مَا رَأْيُك؟",
          tr: "hādhā bi-sabʿīn. lawnuhu azraq. mā raʾyuk?",
          en: "This one is 70. It's blue. What do you think?",
        },
        options: [
          {
            ar: "أُفَضِّلُ اللَّوْنَ الأَبْيَض.",
            tr: "ufaḍḍilu l-lawna l-abyaḍ.",
            en: "I prefer white.",
          },
          {
            ar: "جَمِيل. سَآخُذُ هَذَا.",
            tr: "jamīl. sa-ākhudhu hādhā.",
            en: "Nice. I'll take this one.",
            tip: "سَـ at the front of a verb makes it future: “I will take”.",
          },
        ],
      },
      {
        partner: {
          ar: "تَفَضَّل. هَلْ تَدْفَعُ نَقْداً أَمْ بِالبِطَاقَة؟",
          tr: "tafaḍḍal. hal tadfaʿu naqdan am bi-l-biṭāqa?",
          en: "Here you are. Will you pay cash or by card?",
        },
        options: [
          {
            ar: "نَقْداً، تَفَضَّل.",
            tr: "naqdan, tafaḍḍal.",
            en: "Cash, here you go.",
          },
          {
            ar: "بِالبِطَاقَة، إِنْ أَمْكَن.",
            tr: "bi-l-biṭāqa, in amkan.",
            en: "By card, if possible.",
            tip: "إِنْ أَمْكَن (“if possible”) softens any request.",
          },
        ],
      },
    ],
  },

  travel: {
    title: "Finding your way",
    goal: "Ask for directions, understand the answer, and ask about the bus.",
    steps: [
      {
        partner: {
          ar: "مَرْحَباً! هَلْ تَحْتَاجُ مُسَاعَدَة؟",
          tr: "marḥaban! hal taḥtāju musāʿada?",
          en: "Hello! Do you need help?",
        },
        options: [
          {
            ar: "نَعَمْ، أَيْنَ المَحَطَّة؟",
            tr: "naʿam, ayna l-maḥaṭṭa?",
            en: "Yes, where is the station?",
            tip: "أَيْنَ means “where”. It works for any place you name.",
          },
          {
            ar: "أَبْحَثُ عَنْ فُنْدُق قَرِيب.",
            tr: "abḥathu ʿan funduq qarīb.",
            en: "I'm looking for a nearby hotel.",
          },
        ],
      },
      {
        partner: {
          ar: "المَحَطَّةُ قَرِيبَة. اِمْشِ مُبَاشَرَةً ثُمَّ اِنْعَطِفْ يَمِيناً.",
          tr: "al-maḥaṭṭatu qarība. imshi mubāsharatan thumma inʿaṭif yamīnan.",
          en: "The station is close. Walk straight, then turn right.",
        },
        options: [
          {
            ar: "شُكْراً! كَمْ تَبْعُد؟",
            tr: "shukran! kam tabʿud?",
            en: "Thanks! How far is it?",
          },
          {
            ar: "هَلْ يُمْكِنُنِي الذَّهَابُ بِالحَافِلَة؟",
            tr: "hal yumkinunī dh-dhahābu bi-l-ḥāfila?",
            en: "Can I go by bus?",
            tip: "هَلْ يُمْكِنُنِي… is a polite way to ask “can I …”.",
          },
        ],
      },
      {
        partner: {
          ar: "خَمْسُ دَقَائِقَ سَيْراً. الحَافِلَةُ رَقْم سِتَّة.",
          tr: "khamsu daqāʾiqa sayran. al-ḥāfilatu raqm sitta.",
          en: "Five minutes on foot. The bus is number six.",
        },
        options: [
          {
            ar: "أَيْنَ المَوْقِف؟",
            tr: "ayna l-mawqif?",
            en: "Where is the stop?",
          },
          {
            ar: "كَمْ سِعْرُ التَّذْكِرَة؟",
            tr: "kam siʿru t-tadhkira?",
            en: "How much is the ticket?",
            tip: "كَمْ سِعْر… is the pattern for “how much is …”.",
          },
        ],
      },
      {
        partner: {
          ar: "المَوْقِفُ هُنَاك. التَّذْكِرَةُ بِعَشَرَةِ رِيَالَات.",
          tr: "al-mawqifu hunāk. at-tadhkiratu bi-ʿasharati riyālāt.",
          en: "The stop is over there. The ticket is ten riyals.",
        },
        options: [
          {
            ar: "شُكْراً جَزِيلاً، جَزَاكَ اللهُ خَيْراً.",
            tr: "shukran jazīlan, jazāka llāhu khayran.",
            en: "Thank you very much, may God reward you.",
            tip: "جَزَاكَ اللهُ خَيْراً is the warmest everyday thank-you.",
          },
          {
            ar: "تَمَام. سَأَرْكَبُ الآن.",
            tr: "tamām. sa-arkabu l-ān.",
            en: "Great. I'll get on now.",
          },
        ],
      },
    ],
  },

  cafe: {
    title: "At the café",
    goal: "Order a drink and food, comment on it, and ask for the bill.",
    steps: [
      {
        partner: {
          ar: "أَهْلاً! مَاذَا تَشْرَب؟",
          tr: "ahlan! mādhā tashrab?",
          en: "Hello! What would you like to drink?",
        },
        options: [
          {
            ar: "قَهْوَة سَادَة، لَوْ سَمَحْت.",
            tr: "qahwa sāda, law samaḥt.",
            en: "Black coffee, please.",
          },
          {
            ar: "شَاي بِالنَّعْنَاع.",
            tr: "shāy bi-n-naʿnāʿ.",
            en: "Mint tea.",
            tip: "بِالـ attaches “with”: بِالنَّعْنَاع, with mint.",
          },
        ],
      },
      {
        partner: {
          ar: "بِالتَّأْكِيد. هَلْ تُرِيدُ شَيْئاً لِلْأَكْل؟",
          tr: "bi-t-taʾkīd. hal turīdu shayʾan li-l-akl?",
          en: "Of course. Would you like something to eat?",
        },
        options: [
          {
            ar: "نَعَمْ، كَعْكاً مِنْ فَضْلِك.",
            tr: "naʿam, kaʿkan min faḍlik.",
            en: "Yes, some cake please.",
          },
          {
            ar: "لَا، شُكْراً. القَهْوَةُ تَكْفِي.",
            tr: "lā, shukran. al-qahwatu takfī.",
            en: "No thanks. Coffee is enough.",
            tip: "A clear “no, thank you” with a reason sounds gracious, not blunt.",
          },
        ],
      },
      {
        partner: {
          ar: "تَفَضَّل. هَلْ القَهْوَةُ حُلْوَةٌ بِمِقْدَارٍ كَافٍ؟",
          tr: "tafaḍḍal. hal al-qahwatu ḥulwatun bi-miqdārin kāfin?",
          en: "Here you go. Is the coffee sweet enough?",
        },
        options: [
          {
            ar: "نَعَمْ، مُمْتَازَة. شُكْراً.",
            tr: "naʿam, mumtāza. shukran.",
            en: "Yes, excellent. Thanks.",
          },
          {
            ar: "أَفْضَلُ بِقَلِيلٍ مِنَ السُّكَّر.",
            tr: "afḍalu bi-qalīlin mina s-sukkar.",
            en: "A little more sugar would be better.",
          },
        ],
      },
      {
        partner: {
          ar: "بِالتَّأْكِيد. هَلْ تَحْتَاجُ الحِسَاب؟",
          tr: "bi-t-taʾkīd. hal taḥtāju l-ḥisāb?",
          en: "Certainly. Do you need the bill?",
        },
        options: [
          {
            ar: "نَعَمْ، الحِسَابَ مِنْ فَضْلِك.",
            tr: "naʿam, al-ḥisāba min faḍlik.",
            en: "Yes, the bill please.",
            tip: "الحِسَاب is the bill in most dialects; in Egypt you may hear الفَاتُورَة.",
          },
          {
            ar: "لَا، سَأَجْلِسُ قَلِيلاً.",
            tr: "lā, sa-ajlisu qalīlan.",
            en: "No, I'll sit a little longer.",
          },
        ],
      },
    ],
  },

  family: {
    title: "Family and small talk",
    goal: "Answer warm questions about family the way people actually do.",
    steps: [
      {
        partner: {
          ar: "كَيْفَ حَالُ عَائِلَتِك؟",
          tr: "kayfa ḥālu ʿāʾilatik?",
          en: "How is your family?",
        },
        options: [
          {
            ar: "بِخَيْر، الحَمْدُ لِلَّه.",
            tr: "bi-khayr, al-ḥamdu li-llāh.",
            en: "They're well, praise be to God.",
            tip: "Pairing بِخَيْر with الحَمْدُ لِلَّه is the natural everyday answer.",
          },
          {
            ar: "كُلُّهُمْ بِصِحَّة جَيِّدَة، شُكْراً.",
            tr: "kulluhum bi-ṣiḥḥa jayyida, shukran.",
            en: "They're all in good health, thanks.",
          },
        ],
      },
      {
        partner: {
          ar: "عِنْدَكَ أَطْفَال؟",
          tr: "ʿindaka aṭfāl?",
          en: "Do you have children?",
        },
        options: [
          {
            ar: "نَعَمْ، عِنْدِي طِفْلَان.",
            tr: "naʿam, ʿindī ṭiflān.",
            en: "Yes, I have two children.",
            tip: "عِنْدِي literally means “with me”, and it is how you say “I have”.",
          },
          {
            ar: "لَا، لَيْسَ بَعْد.",
            tr: "lā, laysa baʿd.",
            en: "No, not yet.",
          },
        ],
      },
      {
        partner: {
          ar: "مَا شَاءَ الله. كَمْ عُمْرُهُم؟",
          tr: "mā shāʾa llāh. kam ʿumruhum?",
          en: "Mashallah. How old are they?",
        },
        options: [
          {
            ar: "الثَّلَاثَةُ وَالسَّبْعَة.",
            tr: "ath-thalātha wa s-sabʿa.",
            en: "Three and seven.",
          },
          {
            ar: "صَغِيرَان، لَمْ يَدْخُلَا المَدْرَسَة بَعْد.",
            tr: "ṣaghīrān, lam yadkhulā l-madrasa baʿd.",
            en: "They're little, not in school yet.",
          },
        ],
      },
      {
        partner: {
          ar: "اللهُ يَحْفَظُهُم لَك. سَلِّمْ عَلَيْهِم.",
          tr: "allāhu yaḥfaẓuhum lak. sallim ʿalayhim.",
          en: "May God protect them for you. Give them my greetings.",
        },
        options: [
          {
            ar: "آمِين، وَسَأُسَلِّم. شُكْراً.",
            tr: "āmīn, wa sa-usallim. shukran.",
            en: "Amen, I will. Thank you.",
          },
          {
            ar: "جَزَاكَ اللهُ خَيْراً، وَبَارَكَ فِيك.",
            tr: "jazāka llāhu khayran, wa bāraka fīk.",
            en: "May God reward you and bless you.",
            tip: "سَلِّمْ عَلَيْهِم (“greet them for me”) is a warm way to close.",
          },
        ],
      },
    ],
  },

  work: {
    title: "At an appointment",
    goal: "Arrive for a meeting, explain your business, and agree the next step.",
    steps: [
      {
        partner: {
          ar: "صَبَاحُ الخَيْر. عِنْدَكَ مَوْعِد؟",
          tr: "ṣabāḥu l-khayr. ʿindaka mawʿid?",
          en: "Good morning. Do you have an appointment?",
        },
        options: [
          {
            ar: "نَعَمْ، عِنْدِي مَوْعِدُ السَّاعَةِ العَاشِرَة.",
            tr: "naʿam, ʿindī mawʿidu s-sāʿati l-ʿāshira.",
            en: "Yes, I have a ten o'clock appointment.",
          },
          {
            ar: "لَا، أُرِيدُ أَنْ أَحْجِزَ مَوْعِداً.",
            tr: "lā, urīdu an aḥjiza mawʿidan.",
            en: "No, I'd like to book one.",
            tip: "أُرِيدُ أَنْ + verb is the standard “I want to …”.",
          },
        ],
      },
      {
        partner: {
          ar: "تَفَضَّل، اجْلِس. مَا المَوْضُوع؟",
          tr: "tafaḍḍal, ijlis. mā l-mawḍūʿ?",
          en: "Please, sit down. What is it about?",
        },
        options: [
          {
            ar: "أُرِيدُ مُنَاقَشَةَ العَرْضِ الجَدِيد.",
            tr: "urīdu munāqashati l-ʿarḍi l-jadīd.",
            en: "I'd like to discuss the new offer.",
          },
          {
            ar: "عِنْدِي سُؤَال عَنِ العَقْد.",
            tr: "ʿindī suʾāl ʿani l-ʿaqd.",
            en: "I have a question about the contract.",
            tip: "عَنِ before a word starting with “al-” is how “about” attaches.",
          },
        ],
      },
      {
        partner: {
          ar: "بِالتَّأْكِيد. هَلْ لَدَيْكَ وَقْتٌ لِلْمُنَاقَشَةِ الآن؟",
          tr: "bi-t-taʾkīd. hal ladayka waqtun li-l-munāqasha l-ān?",
          en: "Certainly. Do you have time to discuss it now?",
        },
        options: [
          {
            ar: "نَعَمْ، لَدَيَّ نِصْفُ سَاعَة.",
            tr: "naʿam, ladayya niṣfu sāʿa.",
            en: "Yes, I have half an hour.",
          },
          {
            ar: "الأَفْضَلُ غَداً بَعْدَ الظُّهْر.",
            tr: "al-afḍalu ghadan baʿda ẓ-ẓuhr.",
            en: "Tomorrow afternoon would be better.",
          },
        ],
      },
      {
        partner: {
          ar: "حَسَناً. سَأُرْسِلُ لَكَ المَلَفَّاتِ بِالبَرِيد.",
          tr: "ḥasanan. sa-ursilu laka l-malaffāti bi-l-barīd.",
          en: "Fine. I'll email you the files.",
        },
        options: [
          {
            ar: "شُكْراً، سَأَرُدُّ عَلَيْكَ اليَوْم.",
            tr: "shukran, sa-aruddu ʿalayka l-yawm.",
            en: "Thanks, I'll reply today.",
          },
          {
            ar: "مُمْتَاز، فِي انْتِظَارِ رِسَالَتِك.",
            tr: "mumtāz, fī intiẓāri risālatik.",
            en: "Great, I'll wait for your message.",
          },
        ],
      },
    ],
  },

  free: {
    title: "Open conversation",
    goal: "Talk about your day, your plans and what you find hard.",
    steps: [
      {
        partner: {
          ar: "مَرْحَباً! كَيْفَ يَوْمُك؟",
          tr: "marḥaban! kayfa yawmuk?",
          en: "Hi! How is your day?",
        },
        options: [
          {
            ar: "يَوْمٌ جَمِيل، الحَمْدُ لِلَّه.",
            tr: "yawmun jamīl, al-ḥamdu li-llāh.",
            en: "A beautiful day, praise be to God.",
          },
          {
            ar: "مُتْعِب قَلِيلاً، وَلَكِنَّهُ جَيِّد.",
            tr: "mutʿib qalīlan, wa lākinnahu jayyid.",
            en: "A bit tiring, but good.",
          },
        ],
      },
      {
        partner: {
          ar: "مَاذَا فَعَلْتَ اليَوْم؟",
          tr: "mādhā faʿalta l-yawm?",
          en: "What did you do today?",
        },
        options: [
          {
            ar: "دَرَسْتُ العَرَبِيَّةَ صَبَاحاً.",
            tr: "darastu l-ʿarabiyyata ṣabāḥan.",
            en: "I studied Arabic this morning.",
            tip: "Arabic verbs carry the past tense inside them: دَرَسْتُ = I studied.",
          },
          {
            ar: "عَمِلْتُ ثُمَّ قَرَأْتُ كِتَاباً.",
            tr: "ʿamiltu thumma qaraʾtu kitāban.",
            en: "I worked, then read a book.",
          },
        ],
      },
      {
        partner: {
          ar: "مَا شَاءَ الله. وَمَاذَا تُحِبُّ أَنْ تَفْعَل غَداً؟",
          tr: "mā shāʾa llāh. wa mādhā tuḥibbu an tafʿal ghadan?",
          en: "Mashallah. And what would you like to do tomorrow?",
        },
        options: [
          {
            ar: "أُرِيدُ أَنْ أَتَكَلَّمَ عَرَبِيَّةً أَكْثَر.",
            tr: "urīdu an atakallama ʿarabiyyatan akthar.",
            en: "I want to speak more Arabic.",
          },
          {
            ar: "أُحِبُّ أَنْ أَزُورَ أَصْدِقَائِي.",
            tr: "uḥibbu an azūra aṣdiqāʾī.",
            en: "I'd like to visit my friends.",
          },
        ],
      },
      {
        partner: {
          ar: "هَذَا هَدَفٌ جَمِيل. مَا أَصْعَبُ شَيْءٍ فِي العَرَبِيَّة؟",
          tr: "hādhā hadafun jamīl. mā aṣʿabu shayʾin fī l-ʿarabiyya?",
          en: "That's a lovely goal. What's the hardest thing in Arabic?",
        },
        options: [
          {
            ar: "النُّطْقُ وَالإِعْرَاب.",
            tr: "an-nuṭqu wa l-iʿrāb.",
            en: "Pronunciation and case endings.",
          },
          {
            ar: "السَّمَاعُ عِنْدَمَا يَتَكَلَّمُ النَّاسُ بِسُرْعَة.",
            tr: "as-samāʿu ʿindamā yatakallamu n-nāsu bi-surʿa.",
            en: "Listening when people speak fast.",
          },
        ],
      },
    ],
  },
  numbers: {
    title: "Numbers and prices",
    goal: "Use numbers for age, family and money without freezing.",
    steps: [
      {
        partner: {
          ar: "كَمْ عُمْرُكَ؟",
          tr: "kam ʿumruka?",
          en: "How old are you?",
        },
        options: [
          { ar: "عُمْرِي ثَلَاثُونَ سَنَة.", tr: "ʿumrī thalāthūna sana.", en: "I'm thirty years old." },
          {
            ar: "عُمْرِي خَمْسَةٌ وَعِشْرُونَ سَنَة.",
            tr: "ʿumrī khamsatun wa ʿishrūna sana.",
            en: "I'm twenty-five years old.",
            tip: "Arabic counts units before tens: five-and-twenty, not twenty-five.",
          },
        ],
      },
      {
        partner: {
          ar: "وَكَمْ أَخاً لَكَ؟",
          tr: "wa kam akhan lak?",
          en: "And how many brothers do you have?",
        },
        options: [
          { ar: "لِي أَخَوَانِ.", tr: "lī akhawāni.", en: "I have two brothers." },
          {
            ar: "لِي ثَلَاثُ أَخَوَات.",
            tr: "lī thalāthu akhawāt.",
            en: "I have three sisters.",
            tip: "Two takes the dual form أَخَوَانِ; three to ten uses the plural.",
          },
        ],
      },
      {
        partner: {
          ar: "هَذَا القَمِيصُ بِأَرْبَعِينَ رِيَالاً. كَمْ تُرِيد؟",
          tr: "hādhā l-qamīṣu bi-arbaʿīna riyālan. kam turīd?",
          en: "This shirt is 40 riyals. How many do you want?",
        },
        options: [
          { ar: "أُرِيدُ وَاحِداً فَقَط.", tr: "urīdu wāḥidan faqaṭ.", en: "I want only one." },
          { ar: "أُرِيدُ اِثْنَيْن، مِنْ فَضْلِك.", tr: "urīdu ithnayn, min faḍlik.", en: "I want two, please." },
        ],
      },
      {
        partner: {
          ar: "تَفَضَّل. المَجْمُوعُ ثَمَانُونَ رِيَالاً.",
          tr: "tafaḍḍal. al-majmūʿu thamānūna riyālan.",
          en: "Here you are. The total is 80 riyals.",
        },
        options: [
          {
            ar: "هَذَا مِئَة. البَاقِي عَشَرَة.",
            tr: "hādhā miʾa. al-bāqī ʿashara.",
            en: "Here's a hundred. Ten is the change.",
            tip: "البَاقِي is the change you expect back.",
          },
          { ar: "تَفَضَّلْ، المَبْلَغُ كَامِل.", tr: "tafaḍḍal, al-mablaghu kāmil.", en: "Here, the exact amount." },
        ],
      },
    ],
  },

  time: {
    title: "Time and days",
    goal: "Ask and tell the time, and agree when to meet.",
    steps: [
      {
        partner: { ar: "كَمِ السَّاعَةُ الآن؟", tr: "kami s-sāʿatu l-ān?", en: "What time is it now?" },
        options: [
          { ar: "السَّاعَةُ الثَّالِثَة.", tr: "as-sāʿatu th-thālitha.", en: "It's three o'clock." },
          { ar: "السَّاعَةُ السَّابِعَةُ وَالنِّصْف.", tr: "as-sāʿatu s-sābiʿatu wa n-niṣf.", en: "It's half past seven." },
        ],
      },
      {
        partner: { ar: "مَتَى تَبْدَأُ الدَّرْس؟", tr: "matā tabdaʾu d-dars?", en: "When does the lesson start?" },
        options: [
          {
            ar: "تَبْدَأُ فِي الثَّامِنَة صَبَاحاً.",
            tr: "tabdaʾu fī th-thāminati ṣabāḥan.",
            en: "It starts at eight in the morning.",
            tip: "صَبَاحاً (morning) and مَسَاءً (evening) tell the hour which half of the day.",
          },
          { ar: "تَبْدَأُ بَعْدَ نِصْفِ سَاعَة.", tr: "tabdaʾu baʿda niṣfi sāʿa.", en: "It starts in half an hour." },
        ],
      },
      {
        partner: { ar: "وَأَيُّ يَوْمٍ تَتَعَلَّم؟", tr: "wa ayyu yawmin tataʿallam?", en: "And which day do you study?" },
        options: [
          { ar: "أَتَعَلَّمُ يَوْمَ الاِثْنَيْن وَالأَرْبِعَاء.", tr: "ataʿallamu yawma l-ithnayn wa l-arbiʿāʾ.", en: "I study on Monday and Wednesday." },
          { ar: "كُلَّ يَوْم عَدَا الجُمْعَة.", tr: "kulla yawm ʿadā l-jumʿa.", en: "Every day except Friday." },
        ],
      },
      {
        partner: { ar: "جَيِّد. أَرَاكَ غَداً إِنْ شَاءَ الله.", tr: "jayyid. arāka ghadan in shāʾa llāh.", en: "Good. I'll see you tomorrow, God willing." },
        options: [
          { ar: "إِنْ شَاءَ الله، إِلَى اللِّقَاء.", tr: "in shāʾa llāh, ilā l-liqāʾ.", en: "God willing, see you then." },
          { ar: "بِالتَّوْفِيق، إِلَى الغَد.", tr: "bi-t-tawfīq, ilā l-ghad.", en: "Good luck, until tomorrow." },
        ],
      },
    ],
  },

  taxi: {
    title: "Taking a taxi",
    goal: "Name your destination, agree a fare, and pay without confusion.",
    steps: [
      {
        partner: { ar: "أَهْلاً! إِلَى أَيْنَ؟", tr: "ahlan! ilā ayna?", en: "Hello! Where to?" },
        options: [
          { ar: "إِلَى المَطَار، لَوْ سَمَحْت.", tr: "ilā l-maṭār, law samaḥt.", en: "To the airport, please." },
          { ar: "إِلَى السُّوقِ القَدِيم.", tr: "ilā s-sūqi l-qadīm.", en: "To the old market." },
        ],
      },
      {
        partner: {
          ar: "المَطَارُ بَعِيد. الأُجْرَةُ خَمْسُونَ رِيَالاً.",
          tr: "al-maṭāru baʿīd. al-ujratu khamsūna riyālan.",
          en: "The airport is far. The fare is 50 riyals.",
        },
        options: [
          { ar: "حَسَناً، لَا مُشْكِلَة.", tr: "ḥasanan, lā mushkila.", en: "Fine, no problem." },
          {
            ar: "غَالِي. أَرْبَعُونَ؟",
            tr: "ghālī. arbaʿūn?",
            en: "That's a lot. Forty?",
            tip: "Naming a number with a question tone is the normal way to negotiate a fare.",
          },
        ],
      },
      {
        partner: { ar: "طَيِّب، أَرْبَعُونَ. هَلْ تَسْتَعْجِل؟", tr: "ṭayyib, arbaʿūn. hal tastaʿjil?", en: "Fine, forty. Are you in a hurry?" },
        options: [
          { ar: "نَعَمْ، رِحْلَتِي بَعْدَ سَاعَة.", tr: "naʿam, riḥlatī baʿda sāʿa.", en: "Yes, my flight is in an hour." },
          { ar: "لَا، عِنْدِي وَقْت.", tr: "lā, ʿindī waqt.", en: "No, I have time." },
        ],
      },
      {
        partner: { ar: "وَصَلْنَا. تَفَضَّل.", tr: "waṣalnā. tafaḍḍal.", en: "We've arrived. Here you are." },
        options: [
          { ar: "شُكْراً، هَذَا حِسَابُك.", tr: "shukran, hādhā ḥisābuka.", en: "Thank you, here's your fare." },
          { ar: "أَحْسَنْتَ، بَارَكَ اللهُ فِيك.", tr: "aḥsanta, bāraka llāhu fīk.", en: "Well done, may God bless you." },
        ],
      },
    ],
  },

  pharmacy: {
    title: "At the pharmacy",
    goal: "Describe a simple symptom and understand the instructions.",
    steps: [
      {
        partner: { ar: "أَهْلاً، كَيْفَ أُسَاعِدُك؟", tr: "ahlan, kayfa usāʿiduk?", en: "Hello, how can I help you?" },
        options: [
          { ar: "عِنْدِي صُدَاع شَدِيد.", tr: "ʿindī ṣudāʿ shadīd.", en: "I have a bad headache." },
          {
            ar: "أَحْتَاجُ دَوَاءً لِلسُّعَال.",
            tr: "aḥtāju dawāʾan li-s-suʿāl.",
            en: "I need something for a cough.",
            tip: "لِـ before the complaint means “for”: دَوَاء لِلسُّعَال, medicine for a cough.",
          },
        ],
      },
      {
        partner: {
          ar: "مُنْذُ مَتَى وَأَنْتَ تَشْعُرُ بِالصُّدَاع؟",
          tr: "mundhu matā wa anta tashʿuru bi-ṣ-ṣudāʿ?",
          en: "Since when have you had the headache?",
        },
        options: [
          { ar: "مُنْذُ يَوْمَيْن.", tr: "mundhu yawmayn.", en: "For two days." },
          { ar: "مُنْذُ هَذَا الصَّبَاح.", tr: "mundhu hādhā ṣ-ṣabāḥ.", en: "Since this morning." },
        ],
      },
      {
        partner: {
          ar: "خُذْ هَذَا الدَّوَاء، حَبَّة صَبَاحاً وَمَسَاءً.",
          tr: "khudh hādhā d-dawāʾ, ḥabba ṣabāḥan wa masāʾan.",
          en: "Take this medicine, one tablet morning and evening.",
        },
        options: [
          { ar: "شُكْراً. كَمْ ثَمَنُهُ؟", tr: "shukran. kam thamanuhu?", en: "Thanks. How much is it?" },
          { ar: "هَلْ لَهُ آثَار جَانِبِيَّة؟", tr: "hal lahu āthār jānibiyya?", en: "Does it have side effects?" },
        ],
      },
      {
        partner: {
          ar: "الثَّمَنُ خَمْسَةَ عَشَرَ رِيَالاً. وَإِنِ اسْتَمَرَّ الأَلَم، رَاجِعِ الطَّبِيب.",
          tr: "ath-thamanu khamsata ʿashara riyālan. wa ini stamarra l-alam, rājiʿi ṭ-ṭabīb.",
          en: "It's 15 riyals. If the pain continues, see a doctor.",
        },
        options: [
          { ar: "جَزَاكَ اللهُ خَيْراً.", tr: "jazāka llāhu khayran.", en: "May God reward you." },
          { ar: "تَمَام، سَأَفْعَل. شُكْراً.", tr: "tamām, sa-afʿal. shukran.", en: "All right, I will. Thanks." },
        ],
      },
    ],
  },

  school: {
    title: "At school",
    goal: "Introduce yourself as a student and ask what you need for class.",
    steps: [
      {
        partner: { ar: "مَرْحَباً بِكَ فِي الصَّفّ. مَا اسْمُك؟", tr: "marḥaban bika fī ṣ-ṣaff. mā ismuk?", en: "Welcome to the class. What's your name?" },
        options: [
          { ar: "اِسْمِي عَبْدُ الله، أَنَا طَالِب جَدِيد.", tr: "ismī ʿAbdullāh, anā ṭālib jadīd.", en: "My name is Abdullah, I'm a new student." },
          { ar: "اِسْمِي آمِنَة، تَشَرَّفْتُ بِلِقَائِك.", tr: "ismī Āmina, tasharraftu biliqāʾik.", en: "I'm Amina, pleased to meet you." },
        ],
      },
      {
        partner: { ar: "أَهْلاً. هَلْ تَدْرُسُ العَرَبِيَّةَ مِنْ قَبْل؟", tr: "ahlan. hal tadrusu l-ʿarabiyyata min qabl?", en: "Welcome. Have you studied Arabic before?" },
        options: [
          { ar: "نَعَمْ، دَرَسْتُ سَنَةً وَاحِدَة.", tr: "naʿam, darastu sanatan wāḥida.", en: "Yes, I studied for one year." },
          { ar: "لَا، هَذِهِ أَوَّلُ مَرَّة.", tr: "lā, hādhihi awwalu marra.", en: "No, this is my first time." },
        ],
      },
      {
        partner: {
          ar: "لَا بَأْس، سَنَبْدَأُ مِنَ الأَسَاسِيَّات. عِنْدَكَ كِتَاب؟",
          tr: "lā baʾs, sanabdaʾu mina l-asāsiyyāt. ʿindaka kitāb?",
          en: "No problem, we'll start from the basics. Do you have the book?",
        },
        options: [
          { ar: "نَعَمْ، مَعِي الكِتَاب وَالدَّفْتَر.", tr: "naʿam, maʿī l-kitāb wa d-daftar.", en: "Yes, I have the book and the notebook." },
          { ar: "لَا، أَيْنَ أَشْتَرِيه؟", tr: "lā, ayna ashtarīh?", en: "No, where can I buy it?" },
        ],
      },
      {
        partner: {
          ar: "مِنَ المَكْتَبَة هُنَاك. الدَّرْسُ غَداً فِي التَّاسِعَة.",
          tr: "mina l-maktaba hunāk. ad-darsu ghadan fī t-tāsiʿa.",
          en: "From the bookshop over there. Tomorrow's lesson is at nine.",
        },
        options: [
          { ar: "شُكْراً، سَأَكُونُ فِي الوَقْت.", tr: "shukran, sa-akūnu fī l-waqt.", en: "Thanks, I'll be on time." },
          { ar: "تَمَام، إِلَى الغَد.", tr: "tamām, ilā l-ghad.", en: "All right, until tomorrow." },
        ],
      },
    ],
  },

  mosque: {
    title: "At the mosque",
    goal: "Greet people properly and ask your way around the mosque.",
    steps: [
      {
        partner: { ar: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ الله.", tr: "as-salāmu ʿalaykum wa raḥmatu llāh.", en: "Peace and God's mercy be upon you." },
        options: [
          {
            ar: "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُه.",
            tr: "wa ʿalaykumu s-salāmu wa raḥmatu llāhi wa barakātuh.",
            en: "And upon you peace, God's mercy and His blessings.",
            tip: "The longer reply is the fuller, warmer form of the greeting.",
          },
          { ar: "وَعَلَيْكُمُ السَّلَام.", tr: "wa ʿalaykumu s-salām.", en: "And peace be upon you." },
        ],
      },
      {
        partner: {
          ar: "هَلْ هَذِهِ أَوَّلُ زِيَارَةٍ لَكَ لِلْمَسْجِد؟",
          tr: "hal hādhihi awwalu ziyāratin laka li-l-masjid?",
          en: "Is this your first visit to the mosque?",
        },
        options: [
          { ar: "نَعَمْ، أَنَا زَائِر مِنْ غَانَا.", tr: "naʿam, anā zāʾir min Ghānā.", en: "Yes, I'm a visitor from Ghana." },
          { ar: "لَا، أَزُورُهُ كُلَّ يَوْم.", tr: "lā, azūruhu kulla yawm.", en: "No, I visit every day." },
        ],
      },
      {
        partner: {
          ar: "أَهْلاً وَسَهْلاً. صَلَاةُ العَصْرِ بَعْدَ سَاعَة.",
          tr: "ahlan wa sahlan. ṣalātu l-ʿaṣri baʿda sāʿa.",
          en: "Welcome. The afternoon prayer is in an hour.",
        },
        options: [
          { ar: "شُكْراً. أَيْنَ أَتَوَضَّأ؟", tr: "shukran. ayna atawaḍḍaʾ?", en: "Thanks. Where do I perform ablution?" },
          { ar: "جَزَاكَ اللهُ خَيْراً، سَأَنْتَظِر.", tr: "jazāka llāhu khayran, sa-antaẓir.", en: "May God reward you, I'll wait." },
        ],
      },
      {
        partner: {
          ar: "المِيضَأَةُ عَلَى اليَسَار، وَالمَصَاحِفُ أَمَامَك.",
          tr: "al-mīḍaʾatu ʿalā l-yasār, wa l-maṣāḥifu amāmak.",
          en: "The ablution area is on the left, and the copies of the Qur'an are in front of you.",
        },
        options: [
          { ar: "بَارَكَ اللهُ فِيك.", tr: "bāraka llāhu fīk.", en: "May God bless you." },
          { ar: "شُكْراً جَزِيلاً.", tr: "shukran jazīlan.", en: "Thank you very much." },
        ],
      },
    ],
  },

  weather: {
    title: "Weather and seasons",
    goal: "Make small talk about heat, rain and the seasons.",
    steps: [
      {
        partner: { ar: "الجَوُّ حَارٌّ اليَوْم، أَلَيْسَ كَذَلِك؟", tr: "al-jawwu ḥārrun al-yawm, a-laysa kadhālik?", en: "It's hot today, isn't it?" },
        options: [
          { ar: "نَعَمْ، الحَرُّ شَدِيد.", tr: "naʿam, al-ḥarru shadīd.", en: "Yes, the heat is intense." },
          {
            ar: "فِعْلاً، لَكِنَّ الرِّيحَ جَمِيلَة.",
            tr: "fiʿlan, lākinna r-rīḥa jamīla.",
            en: "True, but the breeze is lovely.",
            tip: "أَلَيْسَ كَذَلِك؟ is a tag question; agreeing softly with لَكِنَّ keeps the talk going.",
          },
        ],
      },
      {
        partner: { ar: "هَلْ تُمْطِرُ فِي بَلَدِك؟", tr: "hal tumṭiru fī baladik?", en: "Does it rain in your country?" },
        options: [
          { ar: "نَعَمْ، كَثِيراً فِي الصَّيْف.", tr: "naʿam, kathīran fī ṣ-ṣayf.", en: "Yes, a lot in the summer." },
          { ar: "قَلِيلاً، وَالجَوُّ رَطْب.", tr: "qalīlan, wa l-jawwu raṭb.", en: "A little, and it's humid." },
        ],
      },
      {
        partner: { ar: "أَيُّ فَصْلٍ تُحِبُّ؟", tr: "ayyu faṣlin tuḥibb?", en: "Which season do you like?" },
        options: [
          { ar: "أُحِبُّ الشِّتَاءَ لِأَنَّهُ بَارِد.", tr: "uḥibbu sh-shitāʾa li-annahu bārid.", en: "I like winter because it's cool." },
          { ar: "أُحِبُّ الرَّبِيع، الأَزْهَارُ جَمِيلَة.", tr: "uḥibbu r-rabīʿ, al-azhāru jamīla.", en: "I like spring, the flowers are beautiful." },
        ],
      },
      {
        partner: { ar: "وَمَاذَا تَفْعَلُ فِي الحَرّ؟", tr: "wa mādhā tafʿalu fī l-ḥarr?", en: "And what do you do in the heat?" },
        options: [
          { ar: "أَشْرَبُ مَاءً كَثِيراً وَأَبْقَى فِي البَيْت.", tr: "ashrabu māʾan kathīran wa abqā fī l-bayt.", en: "I drink a lot of water and stay at home." },
          { ar: "أَذْهَبُ إِلَى البَحْرِ مَعَ الأَصْدِقَاء.", tr: "adhhabu ilā l-baḥri maʿa l-aṣdiqāʾ.", en: "I go to the sea with friends." },
        ],
      },
    ],
  },

  doctor: {
    title: "At the doctor",
    goal: "Explain a complaint, answer the doctor's questions and follow the plan.",
    steps: [
      {
        partner: { ar: "تَفَضَّل، اجْلِس. مَا الَّذِي يُزْعِجُك؟", tr: "tafaḍḍal, ijlis. mā lladhī yuzʿijuk?", en: "Please, sit. What's troubling you?" },
        options: [
          {
            ar: "أَشْعُرُ بِأَلَمٍ فِي بَطْنِي مُنْذُ ثَلَاثَةِ أَيَّام.",
            tr: "ashʿuru bi-alamin fī baṭnī mundhu thalāthati ayyām.",
            en: "I've had stomach pain for three days.",
          },
          { ar: "عِنْدِي حُمَّى وَسُعَال مُنْذُ أُسْبُوع.", tr: "ʿindī ḥummā wa suʿāl mundhu usbūʿ.", en: "I've had a fever and a cough for a week." },
        ],
      },
      {
        partner: { ar: "هَلْ أَكَلْتَ شَيْئاً غَيْرَ مُعْتَاد؟", tr: "hal akalta shayʾan ghayra muʿtād?", en: "Did you eat anything unusual?" },
        options: [
          { ar: "نَعَمْ، أَكَلْتُ سَمَكاً فِي مَطْعَم.", tr: "naʿam, akaltu samakan fī maṭʿam.", en: "Yes, I ate fish at a restaurant." },
          { ar: "لَا، طَعَامِي عَادِي.", tr: "lā, ṭaʿāmī ʿādī.", en: "No, my food has been normal." },
        ],
      },
      {
        partner: {
          ar: "سَآخُذُ لَكَ تَحْلِيلاً لِلْحُمُوضَة. خُذْ هَذِهِ الوَرَقَة.",
          tr: "sa-ākhudhu laka taḥlīlan li-l-ḥumūḍa. khudh hādhihi l-waraqa.",
          en: "I'll run an acidity test. Take this paper.",
        },
        options: [
          { ar: "أَيْنَ المَعْمَل؟", tr: "ayna l-maʿmal?", en: "Where is the lab?" },
          { ar: "كَمْ يَأْخُذُ التَّحْلِيل؟", tr: "kam yaʾkhudhu t-taḥlīl?", en: "How long does the test take?" },
        ],
      },
      {
        partner: {
          ar: "فِي الطَّابِقِ الأَوَّل. النَّتِيجَةُ بَعْدَ سَاعَة، وَنُرَاجِعُ الدَّوَاء.",
          tr: "fī ṭ-ṭābiqi l-awwal. an-natījatu baʿda sāʿa, wa nurājiʿu d-dawāʾ.",
          en: "On the first floor. The result is in an hour, then we review the medicine.",
        },
        options: [
          { ar: "شُكْراً يَا دُكْتُور.", tr: "shukran yā duktūr.", en: "Thank you, doctor." },
          {
            ar: "هَلْ أَحْتَاجُ إِلَى صِيَامٍ قَبْلَ التَّحْلِيل؟",
            tr: "hal aḥtāju ilā ṣiyāmin qabla t-taḥlīl?",
            en: "Do I need to fast before the test?",
            tip: "Always worth asking: صِيَام before a test changes the result.",
          },
        ],
      },
    ],
  },

  hotel: {
    title: "Hotel check-in",
    goal: "Check in, ask about breakfast and wifi, and sort out the room.",
    steps: [
      {
        partner: { ar: "أَهْلاً بِكَ فِي فُنْدُقِ النَّخِيل. كَيْفَ أُسَاعِدُك؟", tr: "ahlan bika fī funduqi n-nakhīl. kayfa usāʿiduk?", en: "Welcome to Al-Nakheel Hotel. How can I help?" },
        options: [
          { ar: "لَدَيَّ حَجْزٌ بِاسْمِ عَبْدِ الرَّحْمَٰن.", tr: "ladayya ḥajzun bi-ismi ʿAbd ar-Raḥmān.", en: "I have a reservation under Abd ar-Rahman." },
          { ar: "أُرِيدُ غُرْفَةً لِلَيْلَتَيْن.", tr: "urīdu ghurfatan li-l-laylatayn.", en: "I'd like a room for two nights." },
        ],
      },
      {
        partner: { ar: "تَفَضَّلْ جَوَازَ سَفَرِك. هَلْ تُفَضِّلُ غُرْفَةً هَادِئَة؟", tr: "tafaḍḍal jawāza safarik. hal tufaḍḍilu ghurfatan hādiʾa?", en: "Your passport, please. Would you prefer a quiet room?" },
        options: [
          { ar: "نَعَمْ، بَعِيداً عَنِ الشَّارِع.", tr: "naʿam, baʿīdan ʿani sh-shāriʿ.", en: "Yes, away from the street." },
          { ar: "لَا فَرْق، أَيُّ غُرْفَة.", tr: "lā farq, ayyu ghurfa.", en: "It makes no difference, any room." },
        ],
      },
      {
        partner: { ar: "الغُرْفَةُ رَقْم ثَلَاثُمِئَةٍ وَخَمْسَة، وَالفُطُورُ مِنَ السَّابِعَة.", tr: "al-ghurfatu raqm thalāthumiʾatin wa khamsa, wa l-fuṭūru mina s-sābiʿa.", en: "Room 305, and breakfast is from seven." },
        options: [
          { ar: "هَلِ الإِنْتَرْنِت مَجَّانِي؟", tr: "hal al-intarnit majjānī?", en: "Is the internet free?" },
          { ar: "هَلْ يُمْكِنُنِي الدُّخُولُ مُبَكِّراً؟", tr: "hal yumkinunī d-dukhūlu mubakkiran?", en: "Can I check in early?" },
        ],
      },
      {
        partner: {
          ar: "نَعَمْ، الإِنْتَرْنِت مَجَّانِي، وَالدُّخُولُ مُبَكِّرٌ بِعِشْرِينَ رِيَالاً.",
          tr: "naʿam, al-intarnit majjānī, wa d-dukhūlu mubakkirun bi-ʿishrīna riyālan.",
          en: "Yes, wifi is free, and early check-in is 20 riyals.",
        },
        options: [
          { ar: "لَا حَاجَة، سَأَنْتَظِرُ الوَقْتَ.", tr: "lā ḥāja, sa-antaẓiru l-waqt.", en: "No need, I'll wait for the time." },
          { ar: "حَسَناً، سَأَدْفَعُ العِشْرِينَ.", tr: "ḥasanan, sa-adfaʿu l-ʿishrīn.", en: "Fine, I'll pay the twenty." },
        ],
      },
    ],
  },

  airport: {
    title: "At the airport",
    goal: "Handle the check-in desk: documents, bags, excess weight.",
    steps: [
      {
        partner: { ar: "جَوَازُ السَّفَر وَالتَّذْكِرَة، لَوْ سَمَحْت.", tr: "jawāzu s-safar wa t-tadhkira, law samaḥt.", en: "Your passport and ticket, please." },
        options: [
          { ar: "تَفَضَّلْ، هَذِهِ تَذْكِرَتِي.", tr: "tafaḍḍal, hādhihi tadhkiratī.", en: "Here you are, this is my ticket." },
          {
            ar: "التَّذْكِرَةُ عَلَى هَاتِفِي، هَلْ هَذَا مَقْبُول؟",
            tr: "at-tadhkiratu ʿalā hātifī, hal hādhā maqbūl?",
            en: "The ticket is on my phone, is that accepted?",
          },
        ],
      },
      {
        partner: { ar: "نَعَمْ. كَمْ حَقِيبَةً سَتُسْجِّل؟", tr: "naʿam. kam ḥaqībatan satusajjil?", en: "Yes. How many bags will you check in?" },
        options: [
          { ar: "حَقِيبَةٌ وَاحِدَة فَقَط.", tr: "ḥaqībatun wāḥida faqaṭ.", en: "Just one bag." },
          { ar: "حَقِيبَتَان، وَهَذِهِ حَقِيبَةُ اليَد.", tr: "ḥaqībatāni, wa hādhihi ḥaqībatu l-yad.", en: "Two bags, and this is the hand luggage." },
        ],
      },
      {
        partner: {
          ar: "وَزْنُ الحَقِيبَةِ ثَلَاثَةٌ وَعِشْرُونَ كِيلُو. الحَدُّ عِشْرُونَ.",
          tr: "waznu l-ḥaqībati thalāthatun wa ʿishrūna kīlū. al-ḥaddu ʿishrūn.",
          en: "The bag is 23 kilos. The limit is 20.",
        },
        options: [
          { ar: "مَاذَا أَفْعَل؟", tr: "mādhā afʿal?", en: "What should I do?" },
          { ar: "هَلْ أَدْفَعُ لِلْوَزْنِ الزَّائِد؟", tr: "hal adfaʿu li-l-wazni z-zāʾid?", en: "Do I pay for the excess weight?" },
        ],
      },
      {
        partner: {
          ar: "أَخْرِجْ ثَلَاثَةَ كِيلُو، أَوْ نَدْفَعُ رَسْماً بَسِيطاً.",
          tr: "akhrij thalāthata kīlū, aw nadfaʿu rasman basīṭan.",
          en: "Take out three kilos, or we pay a small fee.",
        },
        options: [
          { ar: "سَأُخْرِجُ بَعْضَ الكُتُب.", tr: "sa-ukhriju baʿḍa l-kutub.", en: "I'll take out some of the books." },
          { ar: "أُفَضِّلُ دَفْعَ الرَّسْم.", tr: "ufaḍḍilu dafʿa r-rasm.", en: "I'd rather pay the fee." },
        ],
      },
    ],
  },

  phone: {
    title: "On the phone",
    goal: "Make a call, give your details and leave a message.",
    steps: [
      {
        partner: { ar: "أَلُو؟ السَّلَامُ عَلَيْكُمْ، مَعَكَ شَرِكَةُ النُّور.", tr: "alū? as-salāmu ʿalaykum, maʿaka sharikatu n-nūr.", en: "Hello? Peace be upon you, this is Al-Noor Company." },
        options: [
          { ar: "وَعَلَيْكُمُ السَّلَام، أَتَحَدَّثُ عَنْ طَلَبِيَّة.", tr: "wa ʿalaykumu s-salām, atahaddathu ʿan ṭalabiyya.", en: "Peace be upon you, I'm calling about an order." },
          { ar: "وَعَلَيْكُمُ السَّلَام، هَلْ مَعَكَ الأُسْتَاذُ سَعِيد؟", tr: "wa ʿalaykumu s-salām, hal maʿaka l-ustādhu Saʿīd?", en: "Peace be upon you, is Mr Saeed there?" },
        ],
      },
      {
        partner: { ar: "لَحْظَة، سَأُحَوِّلُكَ. مَا اسْمُك؟", tr: "laḥẓa, sa-uḥawwiluk. mā ismuk?", en: "One moment, I'll transfer you. What's your name?" },
        options: [
          { ar: "اِسْمِي عَبْدُ الرَّحْمَٰن، رَقْمُ طَلَبِيَّتِي أَرْبَعُمِئَةٍ وَسِتَّةٌ وَخَمْسُونَ.", tr: "ismī ʿAbd ar-Raḥmān, raqmu ṭalabiyyatī arbaʿumiʾatin wa sittatun wa khamsūn.", en: "I'm Abd ar-Rahman, my order number is 456." },
          { ar: "اِسْمِي مَرْيَم، وَأَنَا أَتَصِلُ مِنْ غَانَا.", tr: "ismī Maryam, wa anā attaṣilu min Ghānā.", en: "I'm Maryam, calling from Ghana." },
        ],
      },
      {
        partner: {
          ar: "شُكْراً. الخَطُّ مَشْغُولٌ الآن، هَلْ أُسَجِّلُ رِسَالَة؟",
          tr: "shukran. al-khaṭṭu mashghūlun al-ān, hal usajjilu risāla?",
          en: "Thank you. The line is busy now, may I take a message?",
        },
        options: [
          {
            ar: "نَعَمْ، أَرْجُو أَنْ يَتَّصِلَ بِي بَعْدَ الظُّهْر.",
            tr: "naʿam, arjū an yattaṣila bī baʿda ẓ-ẓuhr.",
            en: "Yes, please ask him to call me after noon.",
            tip: "أَرْجُو (“I request”) is the polite verb for asking a favour on the phone.",
          },
          { ar: "سَأُعَاوِدُ الاِتِّصَالَ لَاحِقاً، شُكْراً.", tr: "sa-uʿāwidu l-ittiṣāla lāḥiqan, shukran.", en: "I'll call back later, thanks." },
        ],
      },
      {
        partner: { ar: "تَمَام، سَأُبَلِّغُهُ. هَلْ رَقْمُكَ نَفْسُهُ؟", tr: "tamām, sa-uballighuhu. hal raqmuka nafsuhu?", en: "Fine, I'll pass it on. Is your number the same?" },
        options: [
          { ar: "نَعَمْ، نَفْسُ الرَّقْم.", tr: "naʿam, nafsu r-raqm.", en: "Yes, the same number." },
          { ar: "لَا، هَذَا رَقْمِي الجَدِيد، سَأُعْطِيكَ إِيَّاه.", tr: "lā, hādhā raqmī l-jadīd, sa-uʿṭīka iyyāh.", en: "No, this is my new number, I'll give it to you." },
        ],
      },
    ],
  },

  invitation: {
    title: "Invitations and visiting",
    goal: "Accept an invitation, offer to bring something and reply graciously.",
    steps: [
      {
        partner: { ar: "عِنْدَنَا عَشَاءٌ غَداً فِي بَيْتِنَا. هَلْ تَأْتِي؟", tr: "ʿindanā ʿashāʾun ghadan fī baytinā. hal taʾtī?", en: "We're having dinner tomorrow at our house. Will you come?" },
        options: [
          {
            ar: "بِكُلِّ سُرُور، شُكْراً لِدَعْوَتِك.",
            tr: "bi-kulli surūr, shukran lidaʿwatik.",
            en: "With pleasure, thank you for the invitation.",
            tip: "بِكُلِّ سُرُور is the warm, standard way to accept.",
          },
          { ar: "أَتَمَنَّى، لَكِنْ عِنْدِي عَمَلٌ غَداً.", tr: "atamannā, lākin ʿindī ʿamalun ghadan.", en: "I'd love to, but I have work tomorrow." },
        ],
      },
      {
        partner: {
          ar: "نَبْدَأُ فِي الثَّامِنَة مَسَاءً. هَلْ تُحِبُّ أَنْ تُحْضِرَ شَيْئاً؟",
          tr: "nabdaʾu fī th-thāminati masāʾan. hal tuḥibbu an tuḥḍira shayʾan?",
          en: "We start at eight in the evening. Would you like to bring something?",
        },
        options: [
          { ar: "سَأُحْضِرُ حَلْوَى.", tr: "sa-uḥḍiru ḥalwā.", en: "I'll bring some sweets." },
          { ar: "لَا حَاجَة، سَأَحْضُرُ فَقَط.", tr: "lā ḥāja, sa-aḥḍuru faqaṭ.", en: "No need, I'll just come." },
        ],
      },
      {
        partner: { ar: "جَمِيل. عِنْدَنَا أَيْضاً ضُيُوفٌ مِنْ مِصْر.", tr: "jamīl. ʿindanā aydan ḍuyūfun min Miṣr.", en: "Lovely. We also have guests from Egypt." },
        options: [
          { ar: "مُمْتَاز، سَأَتَشَرَّفُ بِلِقَائِهِم.", tr: "mumtāz, sa-atasharrafu biliqāʾihim.", en: "Excellent, I'd be honoured to meet them." },
          { ar: "هَلْ يَتَكَلَّمُونَ الإِنْجِلِيزِيَّة؟", tr: "hal yatakallamūna l-injlīziyya?", en: "Do they speak English?" },
        ],
      },
      {
        partner: { ar: "بَعْضُهُمْ نَعَم. أَرَاكَ غَداً إِنْ شَاءَ الله.", tr: "baʿḍuhum naʿam. arāka ghadan in shāʾa llāh.", en: "Some of them, yes. I'll see you tomorrow, God willing." },
        options: [
          { ar: "إِنْ شَاءَ الله، سَأَحْضُرُ فِي الوَقْت.", tr: "in shāʾa llāh, sa-aḥḍuru fī l-waqt.", en: "God willing, I'll be there on time." },
          { ar: "شُكْراً عَلَى الدَّعْوَةِ الكَرِيمَة.", tr: "shukran ʿalā d-daʿwati l-karīma.", en: "Thank you for the kind invitation." },
        ],
      },
    ],
  },

  news: {
    title: "News and opinions",
    goal: "Give an opinion, support it, and answer a counter-argument politely.",
    steps: [
      {
        partner: {
          ar: "مَا رَأْيُكَ فِي تَطَوُّرَاتِ التَّعْلِيمِ هَذِهِ السَّنَة؟",
          tr: "mā raʾyuka fī taṭawwurāti t-taʿlīmi hādhihi s-sana?",
          en: "What's your view on how education has developed this year?",
        },
        options: [
          {
            ar: "أَرَى أَنَّ التَّقَدُّمَ مَلْمُوس، لَكِنَّ الفَجْوَةَ بَيْنَ المَدِينَةِ وَالقَرْيَةِ مَا زَالَتْ.",
            tr: "arā anna t-taqadduma malmūs, lākinna l-fajwata bayna l-madīnati wa l-qarya mā zālat.",
            en: "Progress is visible, but the gap between city and village remains.",
            tip: "Stating one gain and one gap is the shape of a balanced opinion in Arabic.",
          },
          { ar: "لَمْ أُتَابِعْ بِعُمْق، لَكِنَّ الأَرْقَامَ تُشِيرُ إِلَى تَحَسُّن.", tr: "lam utābiʿ bi-ʿumq, lākinna l-arqāma tushīru ilā taḥassun.", en: "I haven't followed closely, but the numbers suggest improvement." },
        ],
      },
      {
        partner: { ar: "وَمَا الحُلُّ فِي رَأْيِك؟", tr: "wa mā l-ḥallu fī raʾyik?", en: "And what's the solution in your view?" },
        options: [
          { ar: "الاِسْتِثْمَارُ فِي المُعَلِّمِين أَهَمُّ مِنَ المَبَانِي.", tr: "al-istithmāru fī l-muʿallimīna ahammu mina l-mabānī.", en: "Investing in teachers matters more than buildings." },
          { ar: "التَّدْرِيبُ المِهَنِيُّ لِلشَّبَابِ هُوَ الأَوْلَوِيَّة.", tr: "at-tadrību l-mihaniyyu li-sh-shabābi huwa l-awlawiyya.", en: "Vocational training for young people is the priority." },
        ],
      },
      {
        partner: { ar: "قَدْ يَرَى بَعْضُهُم أَنَّ ذَلِكَ مُكْلِف.", tr: "qad yarā baʿḍuhum anna dhālika muklif.", en: "Some might say that's expensive." },
        options: [
          {
            ar: "التَّكْلِفَةُ أَقَلُّ مِنْ ثَمَنِ جِيلٍ بِلَا مَهَارَة.",
            tr: "at-taklifatu aqallu min thamani jīlin bilā mahāra.",
            en: "The cost is less than the price of a generation without skills.",
          },
          { ar: "أُوَافِقُ جُزْئِياً، لَكِنَّ تَرْتِيبَ الأَوْلَوِيَّاتِ يَحُلُّ ذَلِك.", tr: "uwāfiqu juzʾiyyan, lākinna tartība l-awlawiyyāti yaḥullu dhālik.", en: "I partly agree, but setting priorities solves that." },
        ],
      },
      {
        partner: {
          ar: "كَلَامٌ مُتَّزِن. أَتَمَنَّى أَنْ نُكْمِلَ هَذَا الحِوَارَ لَاحِقاً.",
          tr: "kalāmun muttazin. atamannā an nukmila hādhā l-ḥiwāra lāḥiqan.",
          en: "A balanced view. I hope we can continue this discussion later.",
        },
        options: [
          { ar: "بِكُلِّ سُرُور، الحِوَارُ مَعَكَ مُفِيد.", tr: "bi-kulli surūr, al-ḥiwāru maʿaka mufīd.", en: "With pleasure, talking with you is useful." },
          { ar: "وَأَنَا أَيْضاً، إِلَى لِقَاءٍ قَرِيب.", tr: "wa anā aydan, ilā liqāʾin qarīb.", en: "Me too, until we meet soon." },
        ],
      },
    ],
  },

  story: {
    title: "Telling a story",
    goal: "Narrate something that happened, in order and with feeling.",
    steps: [
      {
        partner: { ar: "احْكِ لِي عَنْ يَوْمٍ لَا تَنْسَاه.", tr: "iḥki lī ʿan yawmin lā tansāh.", en: "Tell me about a day you'll never forget." },
        options: [
          {
            ar: "كَانَ يَوْمَ تَخَرُّجِي؛ شَعَرْتُ أَنَّ سَنَوَاتِ التَّعَبِ صَارَتْ فَرَحاً.",
            tr: "kāna yawma takharrujī; shaʿartu anna sanawāti t-taʿabi ṣārat faraḥan.",
            en: "It was my graduation day; I felt years of effort turn into joy.",
            tip: "كَانَ (“it was”) opens almost every remembered scene in Arabic.",
          },
          { ar: "يَوْمُ زَوَاجِ أُخْتِي، اِجْتَمَعَتِ العَائِلَةُ كُلُّهَا.", tr: "yawmu zawāji ukhtī, ijtamaʿati l-ʿāʾilatu kulluhā.", en: "My sister's wedding day, the whole family gathered." },
        ],
      },
      {
        partner: { ar: "وَمَاذَا حَدَثَ بَعْدَ ذَلِك؟", tr: "wa mādhā ḥadatha baʿda dhālik?", en: "And what happened after that?" },
        options: [
          { ar: "ذَهَبْنَا إِلَى بَيْتِ جَدِّي، وَبَقِينَا نَتَحَدَّثُ حَتَّى الفَجْر.", tr: "dhahabnā ilā bayti jaddī, wa baqīnā nataḥaddathu ḥattā l-fajr.", en: "We went to my grandfather's house and talked until dawn." },
          { ar: "عُدْتُ إِلَى الغُرْفَةِ مُتْعَباً، لَكِنِّي لَمْ أَنَمْ مِنَ الفَرَح.", tr: "ʿudtu ilā l-ghurfati mutʿaban, lākinnī lam anam mina l-faraḥ.", en: "I went back to my room exhausted, but couldn't sleep for joy." },
        ],
      },
      {
        partner: { ar: "مَا الشَّيْءُ الَّذِي تَعَلَّمْتَهُ مِنْ ذَلِك اليَوْم؟", tr: "mā sh-shayʾu lladhī taʿallamtahu min dhālika l-yawm?", en: "What did you learn from that day?" },
        options: [
          { ar: "تَعَلَّمْتُ أَنَّ الصَّبْرَ لَا يَضِيع.", tr: "taʿallamtu anna ṣ-ṣabra lā yaḍīʿ.", en: "I learned that patience is never wasted." },
          { ar: "أَنَّ الفَرَحَ الحَقِيقِيَّ فِي الأَهْلِ لَا فِي النَّتِيجَة.", tr: "anna l-faraḥa l-ḥaqīqiyya fī l-ahli lā fī n-natīja.", en: "That real joy is in family, not in the result." },
        ],
      },
      {
        partner: { ar: "حِكَايَةٌ جَمِيلَة، شُكْراً لِمُشَارَكَتِهَا.", tr: "ḥikāyatun jamīla, shukran limushārakatihā.", en: "A beautiful story, thank you for sharing it." },
        options: [
          { ar: "شُكْراً لِاسْتِمَاعِك.", tr: "shukran li-stimāʿik.", en: "Thank you for listening." },
          { ar: "أَتَمَنَّى أَنْ تَحْكِيَ لِي حِكَايَتَك أَيْضاً.", tr: "atamannā an taḥkiya lī ḥikāyatak aydan.", en: "I hope you'll tell me your story too." },
        ],
      },
    ],
  },
};


const SCENES = GUIDED_SCENES;

/* Label, level and AI-tutor brief for every scene, so one list drives
   both guided practice and the AI tutor. */
const SCENE_META = {
  greetings: { label: "Greetings & Introductions", level: "beginner",
    ai: { opener: "أهلاً وسهلاً! أنا أستاذ حوار. ما اسمك؟", en: "Welcome! I'm Ustadh Hiwar. What is your name?",
          brief: "The user greets you and introduces themselves. Ask their name, where they are from, and what they do." } },
  shopping: { label: "Shopping & Bargaining", level: "beginner",
    ai: { opener: "أهلاً بك في السوق! كيف أستطيع مساعدتك اليوم؟", en: "Welcome to the market! How can I help you today?",
          brief: "You are a friendly shopkeeper in a traditional souq. The user wants to buy things, ask prices, and bargain politely." } },
  travel: { label: "Travel & Directions", level: "intermediate",
    ai: { opener: "مرحباً! تبدو حائراً. هل تبحث عن مكان معين؟", en: "Hello! You look lost. Are you looking for a specific place?",
          brief: "You are a helpful local. The user is a traveler asking for directions, transport advice, and places to visit." } },
  cafe: { label: "Café & Restaurant", level: "beginner",
    ai: { opener: "أهلاً وسهلاً! تفضل، ماذا تحب أن تشرب؟", en: "Welcome! Please, what would you like to drink?",
          brief: "You are a waiter in a café. The user orders food and drinks, asks about the menu, and asks for the bill." } },
  family: { label: "Family & Small Talk", level: "intermediate",
    ai: { opener: "كيف حالك اليوم؟ كيف كانت أيامك؟", en: "How are you today? How have your days been?",
          brief: "You are a warm friend catching up. Talk about family, daily routine, weather, and plans." } },
  work: { label: "Work & Appointments", level: "intermediate",
    ai: { opener: "صباح الخير! حجزت موعداً اليوم. كيف يمكنني خدمتك؟", en: "Good morning! You booked an appointment today. How can I help you?",
          brief: "You are a receptionist at a company. The user books appointments, reschedules, and discusses simple work matters." } },
  free: { label: "Free Conversation", level: "intermediate",
    ai: { opener: "مرحباً! أنا مستعد للتحدث معك في أي موضوع. عمّ تريد أن نتحدث؟", en: "Hello! I'm ready to talk about anything. What would you like to discuss?",
          brief: "Open conversation on any topic the user chooses. Follow their lead naturally." } },
  numbers: { label: "Numbers & Prices", level: "beginner",
    ai: { opener: "أهلاً! لنتكلم بالأرقام. كم عمرك؟", en: "Hello! Let's talk in numbers. How old are you?",
          brief: "You practise numbers with the user: age, family, prices and quantities. Keep numbers clear and repeat them slowly." } },
  time: { label: "Time & Days", level: "beginner",
    ai: { opener: "كم الساعة الآن عندك؟ ومتى تبدأ يومك؟", en: "What time is it where you are? When does your day start?",
          brief: "You discuss the time, days of the week and appointments. Use times and days in every reply." } },
  taxi: { label: "Taking a Taxi", level: "beginner",
    ai: { opener: "أهلاً! تفضل، إلى أين تريد أن تذهب؟", en: "Hello! Please, where would you like to go?",
          brief: "You are a taxi driver. The user names destinations, agrees a fare and pays." } },
  pharmacy: { label: "At the Pharmacy", level: "beginner",
    ai: { opener: "أهلاً بك في الصيدلية. كيف أساعدك؟", en: "Welcome to the pharmacy. How can I help you?",
          brief: "You are a pharmacist. The user describes simple symptoms; you ask how long and give clear instructions. Never give real medical advice beyond the practice." } },
  school: { label: "At School", level: "beginner",
    ai: { opener: "مرحباً بك في الصف! هل أنت طالب جديد؟", en: "Welcome to the class! Are you a new student?",
          brief: "You are an Arabic teacher. The user is a student asking about books, lessons and times." } },
  mosque: { label: "At the Mosque", level: "beginner",
    ai: { opener: "السلام عليكم ورحمة الله. أهلاً بك في المسجد.", en: "Peace and God's mercy be upon you. Welcome to the mosque.",
          brief: "You are a welcoming person at the mosque. The user greets, asks where to perform ablution and about prayer times. Keep it respectful and simple." } },
  weather: { label: "Weather & Seasons", level: "beginner",
    ai: { opener: "الجو حار اليوم، أليس كذلك؟ كيف الطقس عندك؟", en: "It's hot today, isn't it? How is the weather where you are?",
          brief: "You make small talk about weather and seasons. Ask about the user's country and favourite season." } },
  doctor: { label: "At the Doctor", level: "intermediate",
    ai: { opener: "تفضل، اجلس. ما الذي يزعجك؟", en: "Please, sit. What's troubling you?",
          brief: "You are a clinic doctor taking a simple history: symptom, duration, food. Give general advice only and tell the user to see a real doctor. Never diagnose." } },
  hotel: { label: "Hotel Check-in", level: "intermediate",
    ai: { opener: "أهلاً بك في الفندق. هل لديك حجز؟", en: "Welcome to the hotel. Do you have a reservation?",
          brief: "You are a hotel receptionist. The user checks in, asks about breakfast, wifi and the room." } },
  airport: { label: "At the Airport", level: "intermediate",
    ai: { opener: "جواز السفر والتذكرة، لو سمحت.", en: "Passport and ticket, please.",
          brief: "You are an airline check-in agent. The user handles documents, bags and weight limits." } },
  phone: { label: "On the Phone", level: "intermediate",
    ai: { opener: "ألو؟ السلام عليكم، معك شركة النور. كيف أساعدك؟", en: "Hello? Peace be upon you, this is Al-Noor Company. How can I help?",
          brief: "You are a company receptionist on the phone. The user gives their name, order number and leaves a message." } },
  invitation: { label: "Invitations & Visiting", level: "intermediate",
    ai: { opener: "عندنا عشاء غداً في بيتنا. هل تأتي؟", en: "We're having dinner tomorrow at our house. Will you come?",
          brief: "You invite the user to dinner. Accept or decline gracefully, talk about what to bring and who else is coming." } },
  news: { label: "News & Opinions", level: "advanced",
    ai: { opener: "ما رأيك في أهم خبر سمعته هذا الأسبوع؟", en: "What do you think of the biggest news you heard this week?",
          brief: "You are a thoughtful discussion partner. The user gives opinions; you probe, offer a counter-view politely, and avoid politics that could offend." } },
  story: { label: "Telling a Story", level: "advanced",
    ai: { opener: "احكِ لي عن يوم لا تنساه.", en: "Tell me about a day you'll never forget.",
          brief: "You listen to the user narrate an event, then ask what happened next and what they learned. Encourage longer answers." } },
};

for (const [key, meta] of Object.entries(SCENE_META)) {
  if (GUIDED_SCENES[key]) Object.assign(GUIDED_SCENES[key], meta);
}

const guided = { active: false, scenario: "greetings", idx: 0, done: false, log: [] };
let pendingSay = null; // { opt, row } while the mic is open for a guided line

/* ---------- small helpers (mirror the chat bubble look) ---------- */
function guidedEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function guidedBubble(role, lines) {
  const wrap = guidedEl("div", role === "user" ? "msg user" : "msg msg-bot");
  wrap.appendChild(guidedEl("div", "avatar", role === "user" ? "🙂" : "ح"));
  const bubble = guidedEl("div", "bubble");
  if (lines.ar) bubble.appendChild(guidedEl("div", "ar", lines.ar));
  if (state.translit && lines.tr) bubble.appendChild(guidedEl("div", "tr", lines.tr));
  if (lines.en && state.translations) bubble.appendChild(guidedEl("div", "en", lines.en));
  if (lines.tip) {
    const tip = guidedEl("div", "feedback");
    tip.innerHTML = "<b>💡</b> " + escapeHtml(lines.tip);
    bubble.appendChild(tip);
  }
  wrap.appendChild(bubble);
  return { wrap, bubble };
}

/* ---------- rendering ---------- */
function guidedStart(scenario) {
  guided.active = true;
  guided.scenario = GUIDED_SCENES[scenario] ? scenario : "greetings";
  guided.idx = 0;
  guided.done = false;
  guided.log = [];
  state.mode = "guided";
  $("chat").classList.remove("hidden");
  $("composer").classList.remove("hidden");
  $("repeat-panel").classList.add("hidden");
  guidedRender();
}

function guidedHeader() {
  const scene = GUIDED_SCENES[guided.scenario];
  const card = guidedEl("div", "guided-head");
  const left = guidedEl("div", "");
  left.appendChild(guidedEl("h2", "guided-title", scene.title));
  left.appendChild(guidedEl("p", "guided-goal", scene.goal));
  card.appendChild(left);

  const level = scene.level || "beginner";
  const meta = guidedEl("div", "guided-meta");
  meta.appendChild(guidedEl("span", `guided-level guided-level-${level}`, level));
  meta.appendChild(
    guided.done
      ? guidedEl("span", "guided-step", "Completed")
      : guidedEl("span", "guided-step", `Step ${Math.min(guided.idx + 1, scene.steps.length)} of ${scene.steps.length}`)
  );
  card.appendChild(meta);
  return card;
}

function guidedPartnerBubble(lines) {
  const b = guidedBubble("assistant", lines);
  b.bubble.title = "Click to listen";
  b.bubble.addEventListener("click", () => speakArabic(lines.ar));
  return b.wrap;
}

function guidedRender() {
  const chat = $("chat");
  chat.innerHTML = "";
  chat.appendChild(guidedHeader());

  const scene = GUIDED_SCENES[guided.scenario];

  // the conversation so far stays on screen, like a real exchange
  for (const entry of guided.log) {
    if (entry.role === "partner") {
      chat.appendChild(guidedPartnerBubble(entry));
    } else {
      const b = guidedBubble("user", entry);
      chat.appendChild(b.wrap);
      guidedSayRow(b.wrap, entry);
    }
  }

  if (guided.done) {
    guidedFinishCard();
    return;
  }

  const step = scene.steps[guided.idx];
  chat.appendChild(guidedPartnerBubble(step.partner));

  const list = guidedEl("div", "guided-options");
  list.appendChild(guidedEl("p", "guided-prompt", "What would you say?"));
  step.options.forEach((opt, i) => {
    const btn = guidedEl("button", "guided-opt");
    btn.type = "button";
    btn.appendChild(guidedEl("span", "guided-opt-ar arabic", opt.ar));
    if (state.translit && opt.tr) btn.appendChild(guidedEl("span", "guided-opt-tr", opt.tr));
    if (state.translations && opt.en) btn.appendChild(guidedEl("span", "guided-opt-en", opt.en));
    btn.addEventListener("click", () => guidedChoose(i));
    list.appendChild(btn);
  });
  chat.appendChild(list);
  chat.scrollTop = chat.scrollHeight;
}

function guidedChoose(index) {
  const scene = GUIDED_SCENES[guided.scenario];
  const step = scene.steps[guided.idx];
  const opt = step.options[index];
  if (!opt) return;

  guided.log.push({ role: "partner", ...step.partner });
  guided.log.push({ role: "user", ar: opt.ar, tr: opt.tr, en: opt.en, tip: opt.tip, opt });

  guided.idx += 1;
  if (guided.idx >= scene.steps.length) {
    guided.done = true;
    if (typeof touchStreak === "function") touchStreak();
  }
  if (typeof touchGoal === "function") touchGoal();

  guidedRender();
  speakArabic(opt.ar);
  const last = $("chat").querySelectorAll(".msg.user");
  last[last.length - 1]?.scrollIntoView({ block: "nearest" });
}

/* Say the line out loud, scored on this device. No key, no upload. */
function guidedSayRow(wrap, entry) {
  if (!entry.opt) return;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    wrap.appendChild(
      guidedEl("p", "guided-note", "This browser cannot listen. Tap the Arabic line to hear it, then say it out loud.")
    );
    return;
  }

  const row = guidedEl("div", "guided-say");
  if (entry.score) {
    row.appendChild(guidedEl("p", "guided-said", "You said: " + entry.score.said));
    const bar = guidedEl("div", "score-bar");
    const fill = guidedEl("div", "score-fill");
    fill.style.width = Math.max(4, entry.score.pct) + "%";
    fill.style.background = entry.score.pct >= 80 ? "#22c55e" : entry.score.pct >= 50 ? "#f59e0b" : "#ef4444";
    bar.appendChild(fill);
    row.appendChild(bar);
    row.appendChild(
      guidedEl(
        "p",
        "guided-verdict",
        entry.score.pct >= 85
          ? "🌟 Clear — say it once more and move on."
          : entry.score.pct >= 60
          ? "💪 Close. Listen again and repeat the whole line."
          : "🌱 Take it slowly: tap the Arabic line to hear it, then repeat."
      )
    );
    if (entry.score.missed.length) {
      row.appendChild(guidedEl("p", "guided-missed", "Work on: " + entry.score.missed.join(" ")));
    }
  }

  const btn = guidedEl("button", "guided-say-btn", entry.score ? "🎤 Try again" : "🎤 Say it");
  btn.type = "button";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (typeof startListening !== "function") return;
    pendingSay = { entry };
    btn.textContent = "Listening…";
    btn.disabled = true;
    startListening();
  });
  row.appendChild(btn);
  wrap.appendChild(row);
}

/* Called by the speech recogniser in app.js. Returns true when handled. */
function handleSpeech(text) {
  if (!pendingSay) return false;
  const entry = pendingSay.entry;
  pendingSay = null;
  const { score, missed } = wordSimilarity(entry.ar, text);
  entry.score = { pct: score, said: text, missed };
  if (typeof touchStreak === "function") touchStreak();
  guidedRender();
  return true;
}

function guidedFinishCard() {
  const chat = $("chat");
  const card = guidedEl("div", "guided-finish");
  card.appendChild(guidedEl("div", "guided-finish-icon", "🎉"));
  card.appendChild(guidedEl("h3", "", "Scene complete"));
  card.appendChild(
    guidedEl("p", "", `You finished “${GUIDED_SCENES[guided.scenario].title}”. Say the hardest line once more out loud and it will stick.`)
  );

  const actions = guidedEl("div", "guided-finish-actions");

  const again = guidedEl("button", "repeat-btn primary", "↻ Practise again");
  again.type = "button";
  again.addEventListener("click", () => guidedStart(guided.scenario));
  actions.appendChild(again);

  const keys = Object.keys(GUIDED_SCENES).filter((k) => k !== guided.scenario);
  const nextKey = keys[(keys.indexOf(guided.scenario) + 1) % keys.length];
  const next = guidedEl("button", "repeat-btn", "➡️ Next scene");
  next.type = "button";
  next.addEventListener("click", () => {
    state.scenario = nextKey;
    const select = $("scenario-select");
    if (select) select.value = nextKey;
    guidedStart(nextKey);
  });
  actions.appendChild(next);

  card.appendChild(actions);

  const upgrade = guidedEl("p", "guided-upgrade");
  upgrade.innerHTML =
    "Guided practice scores how clearly you say each line, but it will not hold a free conversation or correct new sentences. " +
    'An AI key unlocks that. <button class="link" id="btn-guided-key">Add a key</button>';
  card.appendChild(upgrade);

  chat.appendChild(card);
  chat.scrollTop = chat.scrollHeight;
  $("btn-guided-key")?.addEventListener("click", () => {
    if (typeof openSettings === "function") openSettings();
  });
}

/* A typed message in guided mode: accept it, no scoring, move on. */
function guidedTextAnswer(text) {
  if (!guided.active || guided.done) return;
  const scene = GUIDED_SCENES[guided.scenario];
  const step = scene.steps[guided.idx];
  if (!step) return;
  guided.log.push({ role: "partner", ...step.partner });
  guided.log.push({ role: "user", ar: text });
  guided.idx += 1;
  if (guided.idx >= scene.steps.length) {
    guided.done = true;
    if (typeof touchStreak === "function") touchStreak();
  }
  if (typeof touchGoal === "function") touchGoal();
  guidedRender();
}

function guidedExit() {
  guided.log = [];
  guided.active = false;
  guided.done = false;
  guided.idx = 0;
}

/* Expose what app.js needs. */
window.HiwarGuided = {
  scenes: GUIDED_SCENES,
  start: guidedStart,
  exit: guidedExit,
  textAnswer: guidedTextAnswer,
  isActive: () => guided.active,
  render: guidedRender,
  handleSpeech,
};
