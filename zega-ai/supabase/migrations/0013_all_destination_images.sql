-- =====================================================================
-- Populate remaining 5 destination cards with HTTP-200 verified
-- Wikimedia Commons photos so every destination has a real image.
-- =====================================================================

update public.destinations
set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Swayne''s_hartebeest_(Alcelaphus_buselaphus_swaynei)_herd.jpg?width=900'
where slug = 'maze-national-park';

update public.destinations
set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Chencha_01.jpg?width=900'
where slug in ('mount-guge', 'ochollo-village');

update public.destinations
set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Main_street_in_Arba_Minch,_Ethiopia.jpg?width=900'
where slug = 'shecha-area';

update public.destinations
set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Banana_Harvest,_Ethiopia_(8049495329).jpg?width=900'
where slug = 'sile-banana-plantations';
