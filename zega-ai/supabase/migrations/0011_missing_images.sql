-- Add real Wikimedia Commons photos for Arba Minch Crocodile Ranch and AMU Main Campus
update public.destinations
set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Crocodylus_niloticus_in_Lake_Chamo_02.jpg?width=900'
where slug = 'crocodile-ranch';

update public.destinations
set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Skyline_view_of_AMU1.jpg?width=900'
where slug = 'amu-main-campus';
