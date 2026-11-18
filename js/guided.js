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
};

const guided = { active: false, scenario: "greetings", idx: 0, done: false };

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
  const count = guided.done
    ? guidedEl("span", "guided-step", "Completed")
    : guidedEl("span", "guided-step", `Step ${guided.idx + 1} of ${scene.steps.length}`);
  card.appendChild(count);
  return card;
}

function guidedRender() {
  const chat = $("chat");
  chat.innerHTML = "";
  chat.appendChild(guidedHeader());

  if (guided.done) {
    guidedFinishCard();
    return;
  }

  const scene = GUIDED_SCENES[guided.scenario];
  const step = scene.steps[guided.idx];
  const partner = guidedBubble("assistant", step.partner);
  partner.bubble.title = "Click to listen";
  partner.bubble.addEventListener("click", () => speakArabic(step.partner.ar));
  chat.appendChild(partner.wrap);

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

  $("chat").querySelector(".guided-options")?.remove();
  const picked = guidedBubble("user", { ar: opt.ar, tr: opt.tr, en: opt.en, tip: opt.tip });
  $("chat").appendChild(picked.wrap);
  speakArabic(opt.ar);
  if (typeof touchGoal === "function") touchGoal();

  guided.idx += 1;
  if (guided.idx >= scene.steps.length) {
    guided.done = true;
    if (typeof touchStreak === "function") touchStreak();
  }

  setTimeout(() => {
    if (!guided.active) return;
    guidedRender();
    if (!guided.done) {
      const step2 = GUIDED_SCENES[guided.scenario].steps[guided.idx];
      speakArabic(step2.partner.ar);
    }
  }, 420);
}

function guidedFinishCard() {
  const chat = $("chat");
  const card = guidedEl("div", "guided-finish");
  card.appendChild(guidedEl("div", "guided-finish-icon", "🎉"));
  card.appendChild(guidedEl("h3", "", "Scene complete"));
  card.appendChild(
    guidedEl("p", "", `You finished “${GUIDED_SCENES[guided.scenario].title}”. Say it once more out loud and it will stick.`)
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
    "Guided practice never corrects you. With an AI key you get free conversation, corrections and pronunciation scoring. " +
    '<button class="link" id="btn-guided-key">Add a key</button>';
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
  const chat = $("chat");
  chat.querySelector(".guided-options")?.remove();
  const bubble = guidedBubble("user", { ar: text });
  chat.appendChild(bubble.wrap);
  if (typeof touchGoal === "function") touchGoal();
  guided.idx += 1;
  if (guided.idx >= GUIDED_SCENES[guided.scenario].steps.length) {
    guided.done = true;
    if (typeof touchStreak === "function") touchStreak();
  }
  setTimeout(() => guided.active && guidedRender(), 300);
}

function guidedExit() {
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
};
