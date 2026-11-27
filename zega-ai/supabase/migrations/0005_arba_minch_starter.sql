-- =====================================================================
-- Arba Minch Production-Starter Dataset (UNVERIFIED baselines)
-- All rows keep is_verified = false / confidence = 'unverified' until
-- ground-truthed on-site via /admin.
-- =====================================================================

-- 1. 18 Real Arba Minch & Gamo Zone Destinations
insert into public.destinations
  (slug, name, category_id, description, lat, lng, entry_fee_min, entry_fee_max, opening_hours, visit_minutes, interests, accessibility, safety_notes, local_tips, is_verified)
values
  ('lake-chamo-boat-safari', 'Lake Chamo Boat Landing (Crocodile Market)', 'water',
   'Official boat jetty for Lake Chamo wildlife trips to see Nile crocodiles, hippos, and waterbirds.',
   5.9675, 37.5680, 0, 500, '07:00-17:00', 150, '{nature,wildlife,water}',
   'Easy access by bajaj or car to the jetty; boarding requires stepping into open motorboats.',
   'Keep hands and feet inside the boat at all times; active Nile crocodile and hippo habitat. Wear a life jacket.',
   'Book boats only through the official boat association at the jetty. Morning (07:30-10:30) has calmer water. Split boat cost among 4-6 passengers.', false),

  ('nech-sar-national-park', 'Nech Sar National Park (Main Gate / HQ)', 'nature',
   'Flagship national park of grasslands, escarpment views, and wildlife between Lakes Abaya and Chamo.',
   6.0040, 37.5580, 100, 500, '06:30-17:30', 240, '{nature,wildlife}',
   'Requires high-clearance 4WD for the Nech Sar plains.',
   'Stay with a licensed scout/guide; heat and rough terrain.',
   'Separate EWCA fees apply for Ethiopian residents, foreign residents, and international tourists, plus mandatory scout and 4WD vehicle fees.', false),

  ('forty-springs', 'Forty Springs (Arba Minch Forest)', 'nature',
   'Lush groundwater forest at the base of the escarpment near park HQ, home to baboons and colobus monkeys.',
   5.9960, 37.5610, null, null, '07:00-17:30', 90, '{nature,wildlife}',
   'Shaded forest trails; uneven ground near the springs.',
   'Do not carry open food bags; baboons will snatch them. Slippery paths in rainy season.',
   'Local guides available at the entrance; great morning walk from Shecha.', false),

  ('crocodile-ranch', 'Arba Minch Crocodile Ranch', 'wildlife',
   'Conservation ranch along the road toward Lake Chamo raising Nile crocodiles of many ages.',
   5.9890, 37.5675, 50, 200, '08:00-17:00', 60, '{wildlife}',
   'Flat walking paths, easy for most visitors.',
   'Stay behind barriers at all enclosures.',
   'Quick, easy stop to combine with a Lake Chamo boat trip.', false),

  ('bridge-of-god', 'Bridge of God (Ye Egziabher Dildiy)', 'viewpoint',
   'Natural hilly land bridge separating reddish Lake Abaya and blue Lake Chamo inside Nech Sar Park.',
   6.0250, 37.6050, null, null, '07:00-17:00', 120, '{nature,viewpoint}',
   'Requires 4WD and Nech Sar Park entry.',
   'Steep drops on the ridge; follow park scout instructions.',
   'Best photographed in late afternoon light.', false),

  ('dorze-village', 'Dorze Village (Weaving & Bamboo Homes)', 'culture',
   'Gamo highland village (~30 km uphill) famous for elephant-shaped bamboo huts, cotton weaving, and kocho.',
   6.1915, 37.5740, 200, 1000, '08:00-17:30', 180, '{culture,nature}',
   'Paved/gravel uphill road accessible by car or minibus; village paths are uneven dirt trails.',
   'Highland temperatures drop quickly in the afternoon; carry a sweater and drinking water.',
   'Visit on Monday or Thursday for Dorze market day. Ask permission before photographing weavers or inside homes, and agree on guide fees upfront.', false),

  ('chencha-weaving-coop', 'Chencha Town & Weaving Cooperative', 'culture',
   'Historic Gamo highland town just past Dorze known for authentic handwoven gabi and netela.',
   6.2500, 37.5700, null, null, '08:00-17:00', 120, '{culture,shopping,market}',
   'Accessible by minibus or car on the highland road.',
   'Cooler mountain weather; bring a warm layer.',
   'Best visited on market days (Tuesday & Saturday) for traditional textiles.', false),

  ('ochollo-village', 'Ochollo Village', 'culture',
   'Dramatic cliffside terraced village in the Gamo Highlands overlooking Lake Abaya.',
   6.1830, 37.6970, null, null, '08:00-17:00', 180, '{culture,nature,viewpoint}',
   'Steep uphill footpaths; good walking shoes and water are essential.',
   'Cliffside paths can be slippery when wet.',
   'Combine with a local guide from the village entrance.', false),

  ('arba-minch-market', 'Sikela Main Market (Arba Minch Lower Town)', 'market',
   'Bustling commercial heart of Arba Minch famous for bananas, mangoes, spices, and local textiles.',
   6.0365, 37.5515, null, null, '07:30-18:00', 90, '{culture,shopping,market}',
   'Flat, busy market lanes.',
   'Keep phones and wallets in front pockets in crowded aisles.',
   'Carry small ETB bills; ask prices politely.', false),

  ('shecha-area', 'Shecha Town Center (Upper Town)', 'culture',
   'Cooler upper part of Arba Minch overlooking both lakes; hub for resorts, cafes, and evening walks.',
   6.0085, 37.5425, null, null, '24/7', 60, '{culture,food}',
   'Paved main road; steep hill connecting down to Sikela.',
   'Use caution walking unlit side streets at night.',
   'Great base for viewpoints and access to Nech Sar Park HQ.', false),

  ('paradise-lodge-viewpoint', 'Paradise Lodge Viewpoint & Terrace', 'viewpoint',
   'Panoramic sunset viewpoint over Lake Abaya, Lake Chamo, and the Bridge of God.',
   6.0038, 37.5485, null, null, '07:00-21:30', 90, '{viewpoint,food}',
   'Easy bajaj or car access to the lodge entrance.',
   null,
   'Non-guests can visit the terrace for coffee, juice, or lunch.', false),

  ('haile-resort-viewpoint', 'Haile Resort Arba Minch Viewpoint', 'viewpoint',
   'Hilltop resort terrace with sweeping views of both lakes, dining, and pool day-pass options.',
   6.0012, 37.5515, null, null, '07:00-22:00', 90, '{viewpoint,food}',
   'Paved access road and accessible main terrace.',
   null,
   'Reliable Wi-Fi and dining for travelers needing a rest.', false),

  ('amu-main-campus', 'Arba Minch University (Main Campus & Kulfo River)', 'culture',
   'Green campus famous for water technology and engineering, near the scenic Kulfo River crossing.',
   6.0650, 37.5605, null, null, '08:00-17:00', 60, '{culture,nature}',
   'Flat campus grounds; frequent shared bajaj access from Sikela.',
   null,
   'Carry ID for campus gate entry.', false),

  ('sile-banana-plantations', 'Sile & Chamo Leto Banana Plantations', 'nature',
   'Massive banana and mango farms south of Arba Minch along the Konso road.',
   5.8950, 37.5050, null, null, '08:00-17:00', 90, '{nature,food}',
   'Highway roadside access.',
   'Watch for highway traffic when stopping.',
   'Great stop for fresh fruit and rural photography on the way south.', false),

  ('konso-cultural-landscape', 'Konso Cultural Landscape (UNESCO Site)', 'culture',
   'Ancient walled villages (paletas), stone terraces, and carved wooden waka statues ~90 km south of Arba Minch.',
   5.3330, 37.4330, null, null, '08:00-17:00', 300, '{culture,viewpoint}',
   '1.5-2 hour drive south; village lanes are stone-paved and uneven.',
   'Carry sun protection and water.',
   'Hire a licensed local Konso guide at Karat.', false),

  ('maze-national-park', 'Maze National Park', 'wildlife',
   'Wildlife sanctuary ~110-130 km northwest of Arba Minch protecting endemic Swayne''s hartebeest, oribi, and hot springs.',
   6.4400, 37.1900, null, null, '06:30-17:30', 360, '{wildlife,nature}',
   '4WD strongly recommended, especially after rain.',
   'Remote park; bring plenty of water, fuel, and a local scout.',
   'Full-day trip; start at dawn for best wildlife sightings.', false),

  ('mount-guge', 'Mount Guge (Gamo Highlands)', 'viewpoint',
   'Highest peak in the Gamo Highlands (~3,568 m), ideal for serious hikers.',
   6.2000, 37.3330, null, null, '06:00-17:00', 360, '{nature,viewpoint}',
   'Strenuous mountain trekking trails.',
   'Go with a local guide; weather shifts fast at high altitude.',
   'Start early and pack rain gear and warm layers.', false),

  ('lake-abaya-shore', 'Lake Abaya Shoreline (North of Park)', 'water',
   'Ethiopia''s second-largest lake, known for reddish-brown mineral-rich water and pelicans/fish eagles.',
   6.0850, 37.6200, null, null, '07:00-17:30', 90, '{nature,wildlife,water}',
   'Unpaved tracks near the shoreline.',
   'Do NOT swim due to crocodiles and bilharzia risk.',
   'Great early-morning birding spot.', false)
on conflict (slug) do update set
  name = excluded.name,
  category_id = excluded.category_id,
  description = excluded.description,
  lat = excluded.lat,
  lng = excluded.lng,
  entry_fee_min = excluded.entry_fee_min,
  entry_fee_max = excluded.entry_fee_max,
  opening_hours = excluded.opening_hours,
  visit_minutes = excluded.visit_minutes,
  interests = excluded.interests,
  accessibility = excluded.accessibility,
  safety_notes = excluded.safety_notes,
  local_tips = excluded.local_tips;

-- 2. 18 Baseline Transport Routes (unverified until field survey)
insert into public.transport_routes
  (origin, destination, vehicle_type, fare_min, fare_max, distance_km, conditions, source, confidence, is_verified)
values
  ('Sikela Center', 'Shecha Center', 'bajaj', 25, 50, 4.5, 'Shared per seat (uphill); higher during rush hour or rain.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Center', 'Shecha Center', 'bajaj', 100, 200, 4.5, 'Private contract (kontrat), daytime.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Shecha Center', 'Sikela Center', 'bajaj', 20, 40, 4.5, 'Shared per seat (downhill).', 'baseline_estimate_nov2026', 'unverified', false),
  ('Arba Minch Airport (AMH)', 'Sikela Center', 'bajaj', 150, 300, 5.0, 'Private contract from outside airport gate.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Arba Minch Airport (AMH)', 'Shecha / Resorts', 'taxi', 400, 800, 8.5, 'Private hotel/airport taxi; negotiate before boarding.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Center', 'AMU Main Campus', 'bajaj', 20, 40, 3.8, 'Shared commuter route, frequent all day.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Center', 'Crocodile Ranch', 'bajaj', 150, 300, 6.0, 'Private contract one-way; arrange wait/return for extra.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Center', 'Lake Chamo Boat Landing', 'bajaj', 250, 450, 8.5, 'Private contract one-way; bumpy last stretch.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Shecha Center', 'Lake Chamo Boat Landing', 'bajaj', 200, 400, 6.5, 'Private contract one-way.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Shecha Center', 'Nech Sar Park HQ / Forty Springs', 'bajaj', 80, 150, 2.5, 'Private contract; or 20-30 min walk.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Shecha Center', 'Paradise Lodge / Haile Resort', 'bajaj', 50, 120, 1.5, 'Private short ride; walkable in 15-20 min.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Bus Station', 'Dorze Village', 'minibus', 100, 200, 30.0, 'Shared minibus per seat; departs when full.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Center', 'Dorze Village (Round Trip)', 'taxi', 2500, 4500, 60.0, 'Private car/4WD half-day hire with waiting time.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Bus Station', 'Chencha Town', 'minibus', 120, 250, 37.0, 'Shared minibus per seat, frequent on market days.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Sikela Bus Station', 'Konso (Karat)', 'minibus', 300, 550, 90.0, 'Shared public minibus; morning departures are fastest.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Arba Minch', 'Ochollo Junction / Village', 'minibus', 100, 250, 22.0, 'Shared minibus toward Chencha/Lante + short hike or local bajaj.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Lake Chamo Landing', 'Crocodile Market (Round Trip)', 'boat', 2500, 5500, 12.0, 'Whole-boat hire (4-8 passengers); verify official association tariff.', 'baseline_estimate_nov2026', 'unverified', false),
  ('Shecha Center', 'Forty Springs Forest Gate', 'foot', 0, 0, 2.2, 'Scenic downhill walk (~25 min); carry water for uphill return.', 'baseline_estimate_nov2026', 'unverified', false);

-- 3. 35 Real Tourism Phrases (Gamo requires native-speaker verification & audio)
insert into public.phrases (category, english, amharic, transliteration, gamo, verification_status, notes) values
  ('greetings', 'Hello / Peace', 'ሰላም', 'Selam', 'Saro', 'unverified', 'Verify Gamo spelling with native speaker'),
  ('greetings', 'Good morning', 'እንደምን አደርክ / አደርሽ', 'Endemin aderk (m) / adersh (f)', 'Saro aqqadii?', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'Good afternoon / evening', 'እንደምን ዋልክ / ዋልሽ', 'Endemin walk (m) / walsh (f)', 'Saro pe''adii?', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'How are you?', 'ደህና ነህ? / ደህና ነሽ?', 'Dehna neh? (m) / nesh? (f)', 'Saro de''ay?', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'I am fine, thank you', 'ደህና ነኝ፣ አመሰግናለሁ', 'Dehna negn, ameseginalehu', 'Saro de''ays, galatays', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'Thank you very much', 'በጣም አመሰግናለሁ', 'Betam ameseginalehu', 'Keehi galatays', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'Please / Excuse me', 'እባክህ / ይቅርታ', 'Ebakh / Yikirta', 'Hayyana / Maro', 'unverified', 'Verify Gamo context & record audio'),
  ('greetings', 'Yes / No', 'አዎ / አይ', 'Awo / Ay', 'Ee / Aykke', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'Goodbye / Stay in peace', 'ደህና ሁን / በሰላም', 'Dehna hun / Beselam', 'Saro de''a', 'unverified', 'Verify Gamo spelling & record audio'),
  ('greetings', 'My name is...', 'ስሜ ... ይባላል', 'Sime ... yibalal', 'Ta sunttay ...', 'unverified', 'Verify Gamo spelling & record audio'),

  ('transportation', 'Where is the bajaj stand?', 'የባጃጅ መነሻ የት ነው?', 'Ye-bajaj menesha yet new?', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'How much to Shecha?', 'ወደ ሼቻ ስንት ነው?', 'Wede Shecha sint new?', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'How much to Sikela?', 'ወደ ሲቀላ ስንት ነው?', 'Wede Sikela sint new?', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'Take me to Lake Chamo', 'ወደ ጫሞ ሀይቅ ውሰደኝ', 'Wede Chamo Hayk wusedegn', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'Shared or private contract?', 'በጋራ ነው ወይስ ኮንትራት?', 'Begara new weyis kontrat?', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'Stop here, please', 'እዚህ አቁም፣ እባክህ', 'Ezih akum, ebakh', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'Wait for me here', 'እዚህ ጠብቀኝ', 'Ezih tebikegn', null, 'unverified', 'Gamo pending native translation'),
  ('transportation', 'Go slowly, please', 'እባክህ ቀስ ብለህ ንዳ', 'Ebakh kes bileh nida', null, 'unverified', 'Gamo pending native translation'),

  ('market', 'How much is this?', 'ይህ ስንት ነው?', 'Yih sint new?', 'Hayssi aappunee?', 'unverified', 'Verify Gamo spelling & record audio'),
  ('market', 'That is too expensive', 'ይህ በጣም ውድ ነው', 'Yih betam wid new', null, 'unverified', 'Gamo pending native translation'),
  ('market', 'Please reduce the price', 'እባክህ ቀንስልኝ', 'Ebakh kenisilegn', null, 'unverified', 'Gamo pending native translation'),
  ('market', 'What is the final price?', 'የመጨረሻ ዋጋ ስንት ነው?', 'Yemecheresha waga sint new?', null, 'unverified', 'Gamo pending native translation'),
  ('market', 'I want to buy bananas', 'ሙዝ መግዛት እፈልጋለሁ', 'Muz megzat efeligalehu', null, 'unverified', 'Gamo pending native translation'),
  ('market', 'Do you have change?', 'ዝርዝር አለህ?', 'Zirzir aleh?', null, 'unverified', 'Gamo pending native translation'),
  ('market', 'Can I pay with Telebirr?', 'በቴሌብር መክፈል እችላለሁ?', 'Be-Telebirr mekfel echilalehu?', null, 'unverified', 'Gamo pending native translation'),
  ('market', 'I am just looking, thank you', 'እያየሁ ብቻ ነው፣ አመሰግናለሁ', 'Eyayehu bicha new, ameseginalehu', null, 'unverified', 'Gamo pending native translation'),

  ('food', 'Water, please', 'ውሃ እባክህ', 'Wuha ebakh', 'Haatta', 'unverified', 'Haatta = water; verify polite phrasing'),
  ('food', 'Food / Menu', 'ምግብ / ሜኑ', 'Migib / Menu', 'Kuma', 'unverified', 'Kuma = food; verify phrasing'),
  ('food', 'Coffee, please', 'ቡና እባክህ', 'Buna ebakh', 'Tukke', 'unverified', 'Verify Gamo coffee phrasing'),
  ('directions', 'Where is the bathroom?', 'መጸዳጃ ቤት የት ነው?', 'Metsedaja bet yet new?', null, 'unverified', 'Gamo pending native translation'),
  ('directions', 'Turn left / right / straight', 'ወደ ግራ / ቀኝ / ቀጥታ', 'Wede gira / kegn / ketita', null, 'unverified', 'Gamo pending native translation'),

  ('emergency', 'Help me!', 'እርዱኝ! / ድረሱልኝ!', 'Erdugn! / Diresulign!', null, 'unverified', 'Priority native Gamo audio'),
  ('emergency', 'Call the police', 'ፖሊስ ጥሩ', 'Polis tiru', null, 'unverified', 'Priority native Gamo audio'),
  ('emergency', 'I need a doctor / hospital', 'ሐኪም / ሆስፒታል እፈልጋለሁ', 'Hakim / Hospital efeligalehu', null, 'unverified', 'Priority native Gamo audio'),
  ('emergency', 'I am lost', 'መንገድ ጠፍቶብኛል', 'Menged teftobignal', null, 'unverified', 'Priority native Gamo audio');

-- 4. 9 Real Local Service Providers & Institutions (phone left null until confirmed)
insert into public.service_providers (name, category, description, location, phone, services, price_note, is_verified) values
  ('Paradise Lodge Arba Minch', 'hotel', 'Traditional Gamo-style bungalows with panoramic lake views and dining.', 'Shecha (Hilltop)', null, '{accommodation,panoramic dining,airport shuttle,tour desk}', 'Mid-to-upscale; restaurant open to day visitors', false),
  ('Haile Resort Arba Minch', 'hotel', 'Full-service hilltop resort overlooking Lakes Abaya and Chamo.', 'Shecha (Escarpment)', null, '{accommodation,pool,lake-view dining,airport transfer}', 'Upscale; pool day passes available', false),
  ('Emerald Resort Arba Minch', 'hotel', 'Modern resort with pool and family-friendly grounds.', 'Between Sikela & Shecha', null, '{accommodation,pool,restaurant}', 'Mid-to-upscale', false),
  ('Mora Heights Hotel', 'hotel', 'Lake-view hotel with terrace cafe in upper town.', 'Shecha', null, '{accommodation,restaurant,terrace cafe}', 'Mid-range', false),
  ('Bekele Mola Hotel', 'hotel', 'Classic hilltop viewpoint hotel and restaurant.', 'Shecha', null, '{accommodation,viewpoint,restaurant}', 'Budget-to-mid range', false),
  ('Tourist Hotel Arba Minch', 'hotel', 'Central lower-town hotel and local restaurant.', 'Sikela', null, '{accommodation,restaurant}', 'Budget-friendly', false),
  ('Lake Chamo Boat Operators Association', 'boat', 'Official motorboat tours to Crocodile Market and hippo pools.', 'Lake Chamo Jetty', null, '{chamo safari,crocodile viewing,hippo pools}', 'Fixed association boat tariff; split per group', false),
  ('Nech Sar National Park Guide & Scout Office', 'guide', 'Licensed park scouts, wildlife guides, and park entry permits.', 'Park HQ (Near Forty Springs)', null, '{wildlife guiding,park permits,4WD escort}', 'Official EWCA daily rates', false),
  ('Dorze Community Guides & Weaving Cooperative', 'cultural', 'Village heritage walk, bamboo house demo, kocho baking, and handwoven textiles.', 'Dorze Village', null, '{village walk,weaving demo,kocho baking}', 'Community tariff per visitor/group', false);
