-- =====================================================================
-- DEMO SEED DATA — UNVERIFIED. Coordinates are APPROXIMATE. Fees/fares are
-- SAMPLES for development only. is_verified=false everywhere. The UI badges
-- these rows. VERIFY EVERYTHING via the Admin dashboard before production.
-- Gamo translations are intentionally NULL pending native-speaker input.
-- =====================================================================

insert into public.destination_categories (id, name_en, name_am, icon) values
  ('nature','Nature','ተፈጥሮ','trees'),
  ('wildlife','Wildlife','የዱር እንስሳት','bird'),
  ('water','Lakes & Water','ሐይቆች','waves'),
  ('culture','Culture','ባህል','landmark'),
  ('market','Markets','ገበያ','store'),
  ('viewpoint','Viewpoints','መመልከቻ','mountain'),
  ('food','Food','ምግብ','utensils'),
  ('hotel','Hotels','ሆቴሎች','bed')
on conflict (id) do nothing;

insert into public.destinations
  (slug,name,category_id,description,lat,lng,entry_fee_min,entry_fee_max,visit_minutes,interests,local_tips,safety_notes,is_verified)
values
  ('nech-sar-national-park','Nech Sar National Park','nature',
   'National park of grasslands, escarpment views and wildlife between Lakes Abaya and Chamo. DEMO description — verify details locally.',
   6.000,37.600,100,150,150,'{nature,wildlife}',
   'Go early morning for wildlife and cooler temperatures. DEMO tip.',
   'Stay with a guide; heat and rough terrain. DEMO note.',false),
  ('lake-chamo-boat-safari','Lake Chamo Boat Safari','water',
   'Boat trip on Lake Chamo known for hippos and large Nile crocodiles. DEMO description.',
   5.885,37.565,800,1200,120,'{nature,wildlife,water}',
   'Negotiate boat price before boarding; share boats to split cost. DEMO tip.',
   'Life jackets required; keep hands inside boat. DEMO note.',false),
  ('crocodile-market','Crocodile Market (Lake Chamo shore)','wildlife',
   'Shoreline viewpoint where large crocodiles bask, reached by boat. DEMO description.',
   5.900,37.540,null,null,60,'{wildlife,nature}',
   'Viewing is from the boat — never approach on land. DEMO tip.',
   'Dangerous wildlife; follow operator instructions. DEMO note.',false),
  ('crocodile-ranch','Arba Minch Crocodile Ranch','wildlife',
   'Conservation ranch near Lake Abaya raising crocodiles of many ages. DEMO description.',
   5.970,37.550,50,100,60,'{wildlife}',
   'Short visit; combine with Lake Abaya shore. DEMO tip.', null,false),
  ('forty-springs','Forty Springs (Arba Minch Chay)','nature',
   'Spring-fed forest that gives Arba Minch ("forty springs") its name. DEMO description.',
   5.990,37.570,null,null,60,'{nature,culture}',
   'Local guides available at the entrance. DEMO tip.', 'Slippery paths in rainy season. DEMO note.',false),
  ('bridge-of-god','Bridge of God Viewpoint','viewpoint',
   'Isthmus between Lakes Abaya and Chamo with sweeping views of both lakes. DEMO description.',
   6.080,37.630,null,null,45,'{nature,viewpoint}',
   'Best light late afternoon. DEMO tip.', null,false),
  ('sikela-center','Sikela Town Center','culture',
   'Upper town hub of Arba Minch — banks, shops and everyday highland life. DEMO description.',
   6.033,37.550,null,null,45,'{culture,shopping}', null,null,false),
  ('shecha-area','Shecha Area','culture',
   'Lower town near the park gateway; guesthouses and local eateries. DEMO description.',
   5.983,37.567,null,null,45,'{culture,food}', null,null,false),
  ('arba-minch-market','Arba Minch Weekly Market','market',
   'Busy market for fruit, spices, textiles and Gamo highland produce. DEMO description.',
   6.035,37.545,null,null,90,'{culture,shopping,market}',
   'Ask prices politely; small bills help. DEMO tip.', 'Watch belongings in crowds. DEMO note.',false),
  ('dorze-village','Dorze Village (day trip)','culture',
   'Gamo highland village famed for woven bamboo "elephant-trunk" huts and weaving. DEMO description.',
   6.180,37.700,null,null,240,'{culture,nature}',
   'Cooler highland climate; bring a layer. DEMO tip.', 'Winding mountain road. DEMO note.',false)
on conflict (slug) do nothing;

-- SAMPLE fare ranges — NOT real market data. Replace after field verification.
insert into public.transport_routes
  (origin,destination,vehicle_type,fare_min,fare_max,distance_km,conditions,source,confidence,is_verified)
values
  ('Sikela','Shecha','bajaj',50,120,4.5,'Private hire, daytime. DEMO SAMPLE.','demo_seed','unverified',false),
  ('Shecha','Sikela','bajaj',50,120,4.5,'Private hire, daytime. DEMO SAMPLE.','demo_seed','unverified',false),
  ('Sikela','Arba Minch Market','bajaj',30,80,2.0,'Shared ride may be cheaper. DEMO SAMPLE.','demo_seed','unverified',false),
  ('Sikela','Lake Chamo boat landing','bajaj',100,200,8.0,'Private hire. DEMO SAMPLE.','demo_seed','unverified',false),
  ('Shecha','Nech Sar Park gate','bajaj',40,90,2.5,'Short hop. DEMO SAMPLE.','demo_seed','unverified',false),
  ('Arba Minch','Dorze Village','taxi',1500,2500,30.0,'Round trip with waiting. DEMO SAMPLE.','demo_seed','unverified',false),
  ('Lake Chamo landing','Crocodile Market shore','boat',800,1500,null,'Per boat, negotiable, shareable. DEMO SAMPLE.','demo_seed','unverified',false);

-- Amharic below is standard; Gamo left NULL for native-speaker verification. No audio invented.
insert into public.phrases (category,english,amharic,transliteration,verification_status,notes) values
  ('greetings','Hello / Peace be with you','ሰላም','selam','unverified','Amharic standard; Gamo pending'),
  ('greetings','How are you?','እንደምን ነህ?','endemin neh','unverified','To a man; ነሽ (nesh) to a woman'),
  ('greetings','Thank you','አመሰግናለሁ','ameseginalehu','unverified',null),
  ('greetings','Goodbye','ደህና ሁን','dehna hun','unverified',null),
  ('general','Yes','አዎ','awo','unverified',null),
  ('general','No','አይደለም','aydelem','unverified',null),
  ('market','How much is it?','ስንት ነው?','sint new?','unverified',null),
  ('market','It is too expensive','በጣም ውድ ነው','betam wid new','unverified',null),
  ('transportation','Please take me to …','እባክዎ ወደ … ይውሰዱኝ','ibakwo wed … yiwisedugn','unverified',null),
  ('directions','Where is …?','… የት ነው?','… yet new?','unverified',null),
  ('food','Water','ውሃ','wiha','unverified',null),
  ('food','Food','ምግብ','migib','unverified',null),
  ('hotels','Where is a hotel?','ሆቴል የት አለ?','hotel yet ale?','unverified',null),
  ('emergency','Help!','እርዳታ!','erdata!','unverified',null),
  ('emergency','I need a doctor','ዶክተር ያስፈልገኛል','doctor yasfelignal','unverified',null),
  ('emergency','Call the police','ፖሊስ ይደውሉ','polis yedewlu','unverified',null);

insert into public.service_providers (name,category,description,location,phone,services,price_note,is_verified) values
  ('Demo Guide Association','guide','DEMO PROVIDER — replace with verified local guides.','Shecha',null,'{park tours,culture walks}','Ask for current rates',false),
  ('Demo Boat Operator','boat','DEMO PROVIDER — replace with verified operators.','Lake Chamo landing',null,'{chamo safari,crocodile viewing}','Per boat, shareable',false),
  ('Demo Bajaj Driver','bajaj','DEMO PROVIDER — replace with verified drivers.','Sikela',null,'{town transfers}','Use the fare checker',false);
