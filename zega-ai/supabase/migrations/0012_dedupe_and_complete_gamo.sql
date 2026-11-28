-- =====================================================================
-- Deduplicate public.phrases, add UNIQUE (category, english) index, and
-- upsert all unique Standard Gamotstso phrases + pronunciation guides.
-- =====================================================================

-- 1. Remove duplicate (category, english) rows, keeping the newest/richest row
delete from public.phrases a
using public.phrases b
where a.id < b.id
  and a.category = b.category
  and a.english = b.english;

create unique index if not exists phrases_cat_eng_uniq on public.phrases (category, english);

-- 2. Upsert all unique phrases with Standard Gamotstso & easy pronunciation guides
insert into public.phrases (category, english, amharic, transliteration, gamo, dialect, verification_status, notes) values
  -- directions (7)
  ('directions', 'Lake Chamo', 'ጫሞ ሀይቅ', 'Chamo Hayk', 'Caamo Abbaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ch''ah-moh Ahb-bah. Abbaa means lake.'),
  ('directions', 'Lake Abaya', 'አባያ ሀይቅ', 'Abaya Hayk', 'Abbaayyaa Abbaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ahb-bahy-yah Ahb-bah. Northern lake bordering Arba Minch.'),
  ('directions', 'Nech Sar National Park', 'ነጭ ሳር ብሔራዊ ፓርክ', 'Nech Sar Park', 'Nechisaar Paarkkiyaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Neh-chee-sahr Pahrk-kee-yah. Local poetic name: Booththa Maataa.'),
  ('directions', 'Bus Station (Menahariya)', 'መናኸሪያ', 'Menahariya', 'Otoobise Essaa Sohuwaa (Manaahariyaa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Oh-toh-bee-seh Ehs-sah Soh-hoo-wah. Everyone in Sikela knows Manaahariyaa.'),
  ('directions', 'Where is …?', '… የት ነው?', '… yet new?', '… awaanee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: … ah-wah-neh? Place the destination first.'),
  ('directions', 'Where is the bathroom?', 'መጸዳጃ ቤት የት ነው?', 'Metsedaja bet yet new?', 'Sheeshsha keettay awaanee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Shehsh-shah keht-tahy ah-wah-neh? Polite: Aaxiyo sohoy awaanee?'),
  ('directions', 'Turn left / right / straight', 'ወደ ግራ / ቀኝ / ቀጥታ', 'Wede gira / kegn / ketita', 'Hadirssakko / Ushachchakko / Suure ba.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hah-deers-sahk-koh / Oo-shahch-chahk-koh / Soo-reh bah.'),

  -- emergency (6)
  ('emergency', 'Help me!', 'እርዱኝ! / ድረሱልኝ!', 'Erdugn! / Diresulign!', 'Tana maaddite! / Tana maadda!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nah mahd-dee-teh! Polite (-ite) / Casual (-a).'),
  ('emergency', 'Help!', 'እርዳታ!', 'Erdata!', 'Maaddite! / Maadda!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Mahd-dee-teh! Short shout for immediate attention.'),
  ('emergency', 'Call the police', 'ፖሊስ ጥሩ', 'Polis tiru', 'Polise xeesite! / Polise xeesa!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Poh-lee-seh t''eh-see-teh! (x = ejective t'').'),
  ('emergency', 'I need a doctor / hospital', 'ሐኪም / ሆስፒታል እፈልጋለሁ', 'Hakim / Hospital efeligalehu', 'Taassi daktare / hospitale koshshees.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tahs-see dahk-tah-reh / hohs-pee-tah-leh kohsh-shehs.'),
  ('emergency', 'I need a doctor', 'ዶክተር ያስፈልገኛል', 'Doctor yasfelignal', 'Taassi daktare koshshees.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tahs-see dahk-tah-reh kohsh-shehs.'),
  ('emergency', 'I am lost', 'መንገድ ጠፍቶብኛል', 'Menged teftobignal', 'Taani ogiyaa balaas.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nee oh-gee-yah bah-lahs. Lit: I missed the road.'),

  -- food (12)
  ('food', 'Food', 'ምግብ', 'Migib', 'Quumaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: K''oo-mah (q = ejective k'').'),
  ('food', 'Food / Menu', 'ምግብ / ሜኑ', 'Migib / Menu', 'Quumaa / Quumaa Maaraa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: K''oo-mah / K''oo-mah Mah-rah. Urban cafes also know Meenuwaa.'),
  ('food', 'Fish', 'ዓሣ', 'Asa', 'Moluwaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Moh-loo-wah. Lake Chamo Nile perch / tilapia.'),
  ('food', 'Water', 'ውሃ', 'Wiha', 'Haattaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Haht-tah. Bottled water: Haayland haattaa.'),
  ('food', 'Water, please', 'ውሃ እባክህ', 'Wuha ebakh', 'Hayyanaa, haattaa ehite.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, haht-tah eh-hee-teh (casual: eha).'),
  ('food', 'Coffee pot', 'ጀበና', 'Jebena', 'Jabanaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Jah-bah-nah. Traditional clay coffee pot.'),
  ('food', 'Coffee, please', 'ቡና እባክህ', 'Buna ebakh', 'Hayyanaa, tukkiyaa ehite.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, took-kee-yah eh-hee-teh (casual: eha).'),
  ('food', 'Tea', 'ሻይ', 'Shay', 'Shaayiyaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Shah-yee-yah. Spiced tea: qimam shaayiyaa.'),
  ('food', 'Mango / Avocado', 'ማንጎ / አቮካዶ', 'Mango / Avokado', 'Maanguwaa / Abokaaduwaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Mahn-goo-wah / Ah-boh-kah-doo-wah.'),
  ('food', 'I am hungry / thirsty', 'ርቦኛል / ጠምቶኛል', 'Ribognal / Temtognal', 'Taani koshshays / Taani saamays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nee kohsh-shahys / sah-mahys.'),
  ('food', 'It is delicious!', 'በጣም ጣፋጭ ነው!', 'Betam tafach new!', 'Daro mal''''ees!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Dah-roh mahl-ehs!'),
  ('food', 'The bill, please', 'ሂሳብ እባክህ', 'Hisab ebakh', 'Hayyanaa, hisaabiyaa ehite.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, hee-sah-bee-yah eh-hee-teh (casual: eha).'),

  -- general & greetings (17)
  ('general', 'Yes', 'አዎ', 'Awo', 'Ee', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Eh (drawn out slightly).'),
  ('general', 'No', 'አይደለም', 'Aydelem', 'CHii (or Aakkay)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ch''ee / Ahk-kahy.'),
  ('greetings', 'Yes / No', 'አዎ / አይ', 'Awo / Ay', 'Ee / CHii', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Eh / Ch''ee.'),
  ('greetings', 'Hello / Peace', 'ሰላም', 'Selam', 'Saro!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh! (Lit: Peace!).'),
  ('greetings', 'How are you?', 'ደህና ነህ? / ደህና ነሽ?', 'Dehna neh? / nesh?', 'Saro de''eetii? / Saro de''ay?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh deh-eh-tee? Polite / Casual.'),
  ('greetings', 'Good morning', 'እንደምን አደርክ / አደርሽ', 'Endemin aderk / adersh', 'Saro aqqidetii? / Saro aqqadii?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh ahk''-k''ee-deh-tee?'),
  ('greetings', 'Good afternoon / evening', 'እንደምን ዋልክ / ዋልሽ', 'Endemin walk / walsh', 'Saro pe''idetii? / Saro pe''adii?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh peh-ee-deh-tee?'),
  ('greetings', 'I am fine, thank you', 'ደህና ነኝ፣ አመሰግናለሁ', 'Dehna negn, ameseginalehu', 'Saro, galatays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh, gah-lah-tahys.'),
  ('greetings', 'Thank you', 'አመሰግናለሁ', 'Ameseginalehu', 'Galatays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Gah-lah-tahys (Plural: Galatoos).'),
  ('greetings', 'Thank you very much', 'በጣም አመሰግናለሁ', 'Betam ameseginalehu', 'Daro galatays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Dah-roh gah-lah-tahys.'),
  ('greetings', 'Please / Excuse me', 'እባክህ / ይቅርታ', 'Ebakh / Yikirta', 'Hayyanaa / Atto giite', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah / Aht-toh gee-teh (casual: Atto ga).'),
  ('greetings', 'What is your name?', 'ስምህ ማን ነው?', 'Simih man new?', 'Intte sunttay oonee? / Ne sunttay oonee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Een-teh soont-tahy oh-neh?'),
  ('greetings', 'My name is...', 'ስሜ ... ይባላል', 'Sime ... yibalal', 'Ta sunttay …', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah soont-tahy …'),
  ('greetings', 'I don''t understand', 'አልገባኝም', 'Algebagnim', 'Taassi gelibeenna.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tahs-see geh-lee-behn-nah.'),
  ('greetings', 'Do you speak English?', 'እንግሊዝኛ ትናገራለህ?', 'Engilizigna tinageraleh?', 'Ingilizetstso haasayeetii? / … haasayay?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Een-gee-lee-zeht-soh hah-sah-yeh-tee?'),
  ('greetings', 'Goodbye / Stay in peace', 'ደህና ሁን / በሰላም', 'Dehna hun / Beselam', 'Saro de''ite! / Saro de''a!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh deh-ee-teh! (Said to the person staying).'),
  ('greetings', 'Goodbye', 'ደህና ሁን', 'Dehna hun', 'Saro de''ite! / Saro biite!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sah-roh deh-ee-teh! / Sah-roh bee-teh!'),

  -- hotels, market, shopping (11)
  ('hotels', 'Where is a hotel?', 'ሆቴል የት አለ?', 'Hotel yet ale?', 'Hoteelay awaanee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hoh-teh-lahy ah-wah-neh?'),
  ('market', 'How much is this?', 'ይህ ስንት ነው?', 'Yih sint new?', 'Hagee woysee? (or Hagee appunee?)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hah-geh woy-seh?'),
  ('market', 'How much is it?', 'ስንት ነው?', 'Sint new?', 'Gatii woysee? (or Woysee?)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Gah-tee woy-seh?'),
  ('market', 'That is too expensive', 'ይህ በጣም ውድ ነው', 'Yih betam wid new', 'Hagee daro al''o.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hah-geh dah-roh ahl-oh.'),
  ('market', 'It is too expensive', 'በጣም ውድ ነው', 'Betam wid new', 'Daro al''o.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Dah-roh ahl-oh.'),
  ('market', 'Please reduce the price', 'እባክህ ቀንስልኝ', 'Ebakh kenisilegn', 'Hayyanaa, gatiyaa guuttite.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, gah-tee-yah goot-tee-teh (casual: guutta).'),
  ('market', 'What is the final price?', 'የመጨረሻ ዋጋ ስንት ነው?', 'Yemecheresha waga sint new?', 'Wurssetta gatii woysee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Woors-seht-tah gah-tee woy-seh?'),
  ('market', 'I want to buy bananas', 'ሙዝ መግዛት እፈልጋለሁ', 'Muz megzat efeligalehu', 'Taani muuziyaa shammanawu koyays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nee moo-zee-yah shahm-mah-nah-woo koy-ahys.'),
  ('market', 'Do you have change?', 'ዝርዝር አለህ?', 'Zirzir aleh?', 'Meezzaa miishshii de''ii?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Mehz-zah meesh-shee deh-ee? (Loanword: Zarzzaree de''ii?).'),
  ('market', 'Can I pay with Telebirr?', 'በቴሌብር መክፈል እችላለሁ?', 'Be-Telebirr mekfel echilalehu?', 'Telebirriyan qanxxanawu danddayaynaa?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Teh-leh-beer-ree-yahn k''ahn-t''ah-nah-woo dahn-dah-yahy-nah?'),
  ('market', 'I am just looking, thank you', 'እያየሁ ብቻ ነው፣ አመሰግናለሁ', 'Eyayehu bicha new, ameseginalehu', 'Taani coo be''ays, galatays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nee choh beh-ahys, gah-lah-tahys.'),
  ('shopping', 'Lemon / Lime', 'ሎሚ', 'Lomi', 'Loomiyaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Loh-mee-yah.'),
  ('shopping', 'Banana', 'ሙዝ', 'Muz', 'Muuziyaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Moo-zee-yah.'),

  -- market numbers (18)
  ('market', '1 (One)', 'አንድ', 'And', 'Issuwaa (Issi birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ees-soo-wah. Before Birr: Issi birraa.'),
  ('market', '2 (Two)', 'ሁለት', 'Hulet', 'Nam''''aa (Nam''''u birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Nahm-ah. Before Birr: Nam''''u birraa.'),
  ('market', '3 (Three)', 'ሦስት', 'Sost', 'Heezzaa (Heezzu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hehz-zah. Before Birr: Heezzu birraa.'),
  ('market', '4 (Four)', 'አራት', 'Arat', 'Oyddaa (Oyddu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Oyd-dah. Before Birr: Oyddu birraa.'),
  ('market', '5 (Five)', 'አምስት', 'Amist', 'Ichchashaa (Ichchashu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Eech-chah-shah.'),
  ('market', '6 (Six)', 'ስድስት', 'Sidist', 'Usuppunaa (Usuppun birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Oo-soop-poo-nah.'),
  ('market', '7 (Seven)', 'ሰባት', 'Sebat', 'Laappunaa (Laappun birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Lahp-poo-nah.'),
  ('market', '8 (Eight)', 'ስምንት', 'Simint', 'Hosppunaa (Hosppun birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hohsp-poo-nah.'),
  ('market', '9 (Nine)', 'ዘጠኝ', 'Zetegn', 'Uddupunaa (Uddupun birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ood-doo-poo-nah.'),
  ('market', '10 (Ten)', 'አሥር', 'Asir', 'Tammaa (Tammu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tahm-mah. Typical short shared bajaj fare.'),
  ('market', '20 (Twenty)', 'ሃያ', 'Haya', 'Laatamaa (Laatamu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Lah-tah-mah.'),
  ('market', '30 (Thirty)', 'ሠላሳ', 'Selasa', 'Hastamaa (Hastamu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hahs-tah-mah.'),
  ('market', '40 (Forty)', 'አርባ', 'Arba', 'Oytamaa (Oytamu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Oy-tah-mah. Arba Minch = Oytamu Pulttuwaa.'),
  ('market', '50 (Fifty)', 'ሃምሳ', 'Hamsa', 'Ishatamaa (Ishatamu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ee-shah-tah-mah.'),
  ('market', '100 (One hundred)', 'መቶ', 'Meto', 'Xeetaa (Issi xeetu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: T''eh-tah.'),
  ('market', '200 (Two hundred)', 'ሁለት መቶ', 'Hulet meto', 'Nam''''u xeetaa (Nam''''u xeetu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Nahm-oo t''eh-tah.'),
  ('market', '500 (Five hundred)', 'አምስት መቶ', 'Amist meto', 'Ichchashu xeetaa (Ichchashu xeetu birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Eech-chah-shoo t''eh-tah.'),
  ('market', '1,000 (One thousand)', 'ሺህ', 'Shih', 'Sha''aa (Issi sha''u birraa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Shah-ah.'),

  -- transportation (9)
  ('transportation', 'Where is the bajaj stand?', 'የባጃጅ መነሻ የት ነው?', 'Ye-bajaj menesha yet new?', 'Bajaaje essaa sohoy awaanee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Bah-jah-jeh ehs-sah soh-hoy ah-wah-neh?'),
  ('transportation', 'How much to Shecha?', 'ወደ ሼቻ ስንት ነው?', 'Wede Shecha sint new?', 'Shechaa baanawu woysee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Sheh-chah bah-nah-woo woy-seh? Upper town.'),
  ('transportation', 'How much to Sikela?', 'ወደ ሲቀላ ስንት ነው?', 'Wede Sikela sint new?', 'Siiqelaa baanawu woysee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: See-k''eh-lah bah-nah-woo woy-seh? Lower town.'),
  ('transportation', 'Take me to Lake Chamo', 'ወደ ጫሞ ሀይቅ ውሰደኝ', 'Wede Chamo Hayk wusedegn', 'Tana Caamo Abbaa efite. / … efa.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nah Ch''ah-moh Ahb-bah eh-fee-teh.'),
  ('transportation', 'Shared or private contract?', 'በጋራ ነው ወይስ ኮንትራት?', 'Begara new weyis kontrat?', 'Issippeeyye woykko kontiraatee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Ees-seep-pehy-yeh woyk-koh kohn-tee-rah-teh?'),
  ('transportation', 'Stop here, please', 'እዚህ አቁም፣ እባክህ', 'Ezih akum, ebakh', 'Hayyanaa, hagan essite. / … essa.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, hah-gahn ehs-see-teh.'),
  ('transportation', 'Wait for me here', 'እዚህ ጠብቀኝ', 'Ezih tebikegn', 'Tana hagan naagite. / … naaga.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Tah-nah hah-gahn nah-gee-teh.'),
  ('transportation', 'Go slowly, please', 'እባክህ ቀስ ብለህ ንዳ', 'Ebakh kes bileh nida', 'Hayyanaa, loddan biite. / … ba.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, lohd-dahn bee-teh.'),
  ('transportation', 'Please take me to …', 'እባክዎ ወደ … ይውሰዱኝ', 'Ibakwo wed … yiwisedugn', 'Hayyanaa, tana … efite. / … efa.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Pronunciation: Hay-yah-nah, tah-nah … eh-fee-teh.')
on conflict (category, english) do update set
  amharic = coalesce(excluded.amharic, public.phrases.amharic),
  transliteration = coalesce(excluded.transliteration, public.phrases.transliteration),
  gamo = excluded.gamo,
  dialect = excluded.dialect,
  notes = excluded.notes;
