-- =====================================================================
-- Update destinations with verified Wikipedia/Mapcarta coordinates,
-- real Wikimedia Commons image URLs (HTTP 200 verified), and realistic
-- EWCA / Lake Chamo fee baselines.
-- =====================================================================

update public.destinations set
  lat = 6.0333, lng = 37.5833,
  entry_fee_min = 100, entry_fee_max = 200,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nechisar_National_Park.JPG?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'nech-sar-national-park';

update public.destinations set
  lat = 5.8333, lng = 37.5500,
  entry_fee_min = 1500, entry_fee_max = 2500,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Chamo_01.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'lake-chamo-boat-safari';

update public.destinations set
  lat = 6.0300, lng = 37.5800,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Natural_pool_in_Arba_Minch.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'forty-springs';

update public.destinations set
  lat = 6.0257, lng = 37.5988,
  is_verified = true, last_verified_at = now()
where slug = 'crocodile-ranch';

update public.destinations set
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Arba_Minch,_Chamo_and_Abaya.jpg?width=900'
where slug = 'bridge-of-god';

update public.destinations set
  lat = 6.2197, lng = 37.5685,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dorze_house.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'dorze-village';

update public.destinations set
  lat = 6.2500, lng = 37.5670,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Dorze_huts.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'chencha-weaving-coop';

update public.destinations set
  lat = 6.0333, lng = 37.5500,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Monument_in_Arba_Minch.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'arba-minch-market';

update public.destinations set
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nechisar_National_Park_01.jpg?width=900'
where slug in ('paradise-lodge-viewpoint', 'haile-resort-viewpoint');

update public.destinations set
  lat = 6.0651, lng = 37.5618,
  is_verified = true, last_verified_at = now()
where slug = 'amu-main-campus';

update public.destinations set
  lat = 5.3397, lng = 37.4419,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Agricultural_terraces_in_the_Konso_Cultural_Landscape.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'konso-cultural-landscape';

update public.destinations set
  lat = 6.4167, lng = 37.2333,
  is_verified = true, last_verified_at = now()
where slug = 'maze-national-park';

update public.destinations set
  lat = 6.2600, lng = 37.8833,
  image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Abaya_01.jpg?width=900',
  is_verified = true, last_verified_at = now()
where slug = 'lake-abaya-shore';
