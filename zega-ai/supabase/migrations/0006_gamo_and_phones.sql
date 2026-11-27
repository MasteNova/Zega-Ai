-- =====================================================================
-- Add publicly listed hotel reception phones (unverified until called)
-- and documented Gamo numbers + market vocabulary (unverified until
-- native-speaker review & audio recording).
-- =====================================================================

update public.service_providers set phone = '+251 974 292 929' where name = 'Haile Resort Arba Minch';
update public.service_providers set phone = '+251 468 811 895' where name = 'Emerald Resort Arba Minch';
update public.service_providers set phone = '+251 468 812 158' where name = 'Mora Heights Hotel';
update public.service_providers set phone = '+251 944 720 435' where name = 'Paradise Lodge Arba Minch';

insert into public.phrases (category, english, amharic, transliteration, gamo, dialect, verification_status, notes) values
  ('market', '1 (One)', 'አንድ', 'And', 'Issinno / Ista', 'Gamo (General)', 'unverified', 'Pre-nominal: issi. Confirm spelling & audio.'),
  ('market', '2 (Two)', 'ሁለት', 'Hulet', 'Nam''a / Na''''a', 'Gamo (General)', 'unverified', 'Pre-nominal: nam''i. Confirm spelling & audio.'),
  ('market', '3 (Three)', 'ሦስት', 'Sost', 'Heeddza', 'Gamo (General)', 'unverified', 'Pre-nominal: heeddzi. Confirm spelling & audio.'),
  ('market', '4 (Four)', 'አራት', 'Arat', 'Oidda', 'Gamo (General)', 'unverified', 'Pre-nominal: oiddi. Confirm spelling & audio.'),
  ('market', '5 (Five)', 'አምስት', 'Amist', 'Ichchacha', 'Gamo (General)', 'unverified', 'Confirm spelling & audio.'),
  ('market', '6 (Six)', 'ስድስት', 'Sidist', 'Usuppuna', 'Gamo (General)', 'unverified', 'Confirm spelling & audio.'),
  ('market', '7 (Seven)', 'ሰባት', 'Sebat', 'Laappuna', 'Gamo (General)', 'unverified', 'Confirm spelling & audio.'),
  ('market', '8 (Eight)', 'ስምንት', 'Simint', 'Ospuna', 'Gamo (General)', 'unverified', 'Confirm spelling & audio.'),
  ('market', '9 (Nine)', 'ዘጠኝ', 'Zetegn', 'Uddupuna', 'Gamo (General)', 'unverified', 'Confirm spelling & audio.'),
  ('market', '10 (Ten)', 'አሥር', 'Asir', 'Tamma', 'Gamo (General)', 'unverified', 'Pre-nominal: tammi. Crucial for fares.'),
  ('market', '20 (Twenty)', 'ሃያ', 'Haya', 'Nam''i tamma', 'Gamo (General)', 'unverified', 'Confirm spelling & audio.'),
  ('market', '100 (One hundred)', 'መቶ', 'Meto', 'Ts''eeta', 'Gamo (General)', 'unverified', 'Crucial for bajaj contracts & market prices.'),
  ('market', '1,000 (One thousand)', 'ሺህ', 'Shih', 'Kuma', 'Gamo (General)', 'unverified', 'Crucial for boat/day-trip prices.'),
  ('shopping', 'Banana', 'ሙዝ', 'Muz', 'Muuze', 'Gamo (Arba Minch)', 'unverified', 'Arba Minch signature fruit; confirm audio.'),
  ('shopping', 'Lemon / Lime', 'ሎሚ', 'Lomi', 'Loome', 'Gamo (Arba Minch)', 'unverified', 'Common in Sikela market; confirm audio.'),
  ('food', 'Coffee pot', 'ጀበና', 'Jebena', 'Jabana', 'Gamo (General)', 'unverified', 'Traditional coffee ceremony; confirm audio.');
