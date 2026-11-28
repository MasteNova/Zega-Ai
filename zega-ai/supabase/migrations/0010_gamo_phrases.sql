-- =====================================================================
-- Populate Standard Gamotstso draft translations for the 25 missing
-- phrases and add extended greetings, numbers, food & landmarks.
-- verification_status stays 'unverified' until native-speaker review.
-- =====================================================================

-- 1. Update existing phrases with Standard Gamotstso drafts
update public.phrases set gamo = 'Tana maaddite!', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Tana maadda! Draft — verify with native speaker & record audio.' where english = 'Help me!';
update public.phrases set gamo = 'Polise xeesite!', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Polise xeesa! Draft — verify with native speaker & record audio.' where english = 'Call the police';
update public.phrases set gamo = 'Taassi daktare / hospitale koshshees.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'I need a doctor / hospital';
update public.phrases set gamo = 'Taani ogiyaa balaas.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Lit: I missed the road. Draft — verify & record audio.' where english = 'I am lost';
update public.phrases set gamo = 'Bajaaje essaa sohoy awaanee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'Where is the bajaj stand?';
update public.phrases set gamo = 'Shechaa baanawu woysee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Alt: Shechaa gakkanaashin appunee? Draft — verify & record audio.' where english = 'How much to Shecha?';
update public.phrases set gamo = 'Siiqelaa baanawu woysee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Alt: Siiqelaa gakkanaashin appunee? Draft — verify & record audio.' where english = 'How much to Sikela?';
update public.phrases set gamo = 'Tana Caamo Abbaa efite.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Tana Caamo Abbaa efa. Draft — verify & record audio.' where english = 'Take me to Lake Chamo';
update public.phrases set gamo = 'Issippeeyye woykko kontiraatee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'Shared or private contract?';
update public.phrases set gamo = 'Hayyanaa, hagan essite.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Hayyanaa, hagan essa. Draft — verify & record audio.' where english = 'Stop here, please';
update public.phrases set gamo = 'Tana hagan naagite.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Tana hagan naaga. Draft — verify & record audio.' where english = 'Wait for me here';
update public.phrases set gamo = 'Hayyanaa, loddan biite.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Hayyanaa, loddan ba. Draft — verify & record audio.' where english = 'Go slowly, please';
update public.phrases set gamo = 'Hagee daro al''o.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Alt: Gatii daro. Draft — verify & record audio.' where english = 'That is too expensive';
update public.phrases set gamo = 'Hayyanaa, gatiyaa guuttite.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Hayyanaa, gatiyaa guutta. Draft — verify & record audio.' where english = 'Please reduce the price';
update public.phrases set gamo = 'Wurssetta gatii woysee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Alt: Wurssetta gatii appunee? Draft — verify & record audio.' where english = 'What is the final price?';
update public.phrases set gamo = 'Taani muuziyaa shammanawu koyays.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'I want to buy bananas';
update public.phrases set gamo = 'Meezzaa miishshii de''ii?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Colloquial: Zarzzaree de''ii? Draft — verify & record audio.' where english = 'Do you have change?';
update public.phrases set gamo = 'Telebirriyan qanxxanawu danddayaynaa?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'Can I pay with Telebirr?';
update public.phrases set gamo = 'Taani coo be''ays, galatays.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'I am just looking, thank you';
update public.phrases set gamo = 'Sheeshsha keettay awaanee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Polite: Aaxiyo sohoy awaanee? Draft — verify & record audio.' where english = 'Where is the bathroom?';
update public.phrases set gamo = 'Hadirssakko / Ushachchakko / Suure ba.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'Turn left / right / straight';
update public.phrases set gamo = 'Hoteelay awaanee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'Where is a hotel?';
update public.phrases set gamo = '… awaanee?', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Draft — verify with native speaker & record audio.' where english = 'Where is …?';
update public.phrases set gamo = 'Hayyanaa, tana … efite.', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Hayyanaa, tana … efa. Draft — verify & record audio.' where english = 'Please take me to …';
update public.phrases set gamo = 'Saro de''ite!', dialect = 'Gamo (Arba Minch / Standard Gamotstso)', notes = 'Casual: Saro de''a! / Saro ba! Draft — verify & record audio.' where english = 'Goodbye';

-- 2. Extended Gamo phrases: etiquette, larger numbers, food & local landmarks
insert into public.phrases (category, english, amharic, transliteration, gamo, dialect, verification_status, notes) values
  ('greetings', 'What is your name?', 'ስምህ ማን ነው?', 'Simih man new?', 'Intte sunttay oonee?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Casual: Ne sunttay oonee? Draft.'),
  ('greetings', 'I don''t understand', 'አልገባኝም', 'Algebagnim', 'Taassi gelibeenna.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('greetings', 'Do you speak English?', 'እንግሊዝኛ ትናገራለህ?', 'Engilizigna tinageraleh?', 'Ingilizetstso haasayeetii?', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Casual: Ingilizetstso haasayay? Draft.'),
  ('market', '30 (Thirty)', 'ሠላሳ', 'Selasa', 'Hastamaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('market', '40 (Forty)', 'አርባ', 'Arba', 'Oytamaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Arba Minch = Oytamu Pulttuwaa (Forty Springs).'),
  ('market', '50 (Fifty)', 'ሃምሳ', 'Hamsa', 'Ishatamaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('market', '200 (Two hundred)', 'ሁለት መቶ', 'Hulet meto', 'Nam''''u xeetaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('market', '500 (Five hundred)', 'አምስት መቶ', 'Amist meto', 'Ichchashu xeetaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('food', 'Tea', 'ሻይ', 'Shay', 'Shaayiyaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('food', 'Fish', 'ዓሣ', 'Asa', 'Moluwaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Famous Lake Chamo perch/tilapia. Draft.'),
  ('food', 'Mango / Avocado', 'ማንጎ / አቮካዶ', 'Mango / Avokado', 'Maanguwaa / Abokaaduwaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('food', 'I am hungry / thirsty', 'ርቦኛል / ጠምቶኛል', 'Ribognal / Temtognal', 'Taani koshshays / Taani saamays.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('food', 'The bill, please', 'ሂሳብ እባክህ', 'Hisab ebakh', 'Hayyanaa, hisaabiyaa eha.', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('food', 'It is delicious!', 'በጣም ጣፋጭ ነው!', 'Betam tafach new!', 'Daro mal''''ees!', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.'),
  ('directions', 'Lake Chamo', 'ጫሞ ሀይቅ', 'Chamo Hayk', 'Caamo Abbaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Landmark name in Gamo.'),
  ('directions', 'Lake Abaya', 'አባያ ሀይቅ', 'Abaya Hayk', 'Abbaayyaa Abbaa', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Landmark name in Gamo.'),
  ('directions', 'Nech Sar National Park', 'ነጭ ሳር ብሔራዊ ፓርክ', 'Nech Sar Park', 'Nechisaar Paarkkiyaa (Booththa Maataa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Booththa Maataa = White Grass.'),
  ('directions', 'Bus Station (Menahariya)', 'መናኸሪያ', 'Menahariya', 'Otoobise Essaa Sohuwaa (Manaahariyaa)', 'Gamo (Arba Minch / Standard Gamotstso)', 'unverified', 'Draft — verify & record audio.');
