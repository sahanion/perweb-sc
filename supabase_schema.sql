-- ==============================================================================
-- SUPABASE SCHEMA SETUP FOR COLLABORATIONS & MENTORSHIP
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- 1. Create the Collaborators Table
create table if not exists public.collaborators (
  id text primary key,
  name text not null,
  position text,
  department text,
  institute text,
  year_from text not null,
  year_till text not null,
  project_title_1 text,
  project_title_2 text,
  project_title_3 text,
  publication_link_1 text,
  publication_link_2 text,
  photo text,
  google_scholar text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.collaborators enable row level security;

-- 3. Policy: Public can view collaborators (read-only for visitors)
create policy "Allow public read access"
  on public.collaborators
  for select
  using (true);

-- 4. Policy: Only authenticated admin users can Insert, Update, and Delete
create policy "Allow authenticated admin full access"
  on public.collaborators
  for all
  to authenticated
  using (true)
  with check (true);

-- 5. Seed Existing Collaborators (Optional but recommended to populate the database)
insert into public.collaborators (
  id, name, position, department, institute, year_from, year_till,
  project_title_1, project_title_2, project_title_3, publication_link_1, publication_link_2, photo, google_scholar
) values
(
  'prem-felix-siril', 'Prem Felix Siril', 'Professor', 'School of Chemical Science', 'IIT Mandi', '2018', 'Lifetime',
  'Development of Pristine Graphene as a Catalyst Support',
  'Investigating Structure-Activity Relationships in Reticular Framework Materials through a Multiscale Isoreticular Chemistry Approach',
  'Sustainable Green Hydrogen Production from Glycerol using Continuous Flow Photoreforming: Process and Catalyst Development',
  null, null,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', ''
),
(
  'jaspreet-kaur-randhawa', 'Jaspreet Kaur Randhawa', 'Professor', 'School of Mechanical and Materials Engineering', 'IIT Mandi', '', '',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', ''
),
(
  'aditi-halder', 'Aditi Halder', 'Professor', 'School of Chemical Science', 'IIT Mandi', '2018', '2024',
  null, null, null,
  'https://www.sciencedirect.com/science/article/abs/pii/S2213343722005474?via%3Dihub',
  'https://pubs.acs.org/aaemcq/article-abstract/5/11/13480/412252/Graphene-Supported-Palladium-Nanostructures-as?redirectedFrom=fulltext',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', ''
),
(
  'abhishek-sharma', 'Abhishek Sharma', '', '', '', '2022', '2024',
  'Structural simulation of betaketoenamine linked Covalent Organic Frameworks', null, null,
  'https://www.sciencedirect.com/science/article/abs/pii/S0021979724005617', null,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'fabrice-odobel', 'Fabrice Odobel', 'Professor, CNRS Research Director', 'Département Chimie', 'CEISAM, Nantes University', '2025', 'Ongoing',
  'POWER-CO2 [COF and MOF based molecular materials for solar driven photocatalytic carbon dioxide reduction]', null, null, null, null,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'stefan-haacke', 'Stefan Haacke', 'Professor', 'PCMS & Télécom Physique Strasbourg', 'Strasbourg University', '2026', '2027',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', ''
),
(
  'partha-pratim-das', 'Partha Pratim Das', 'Assistant Professor', 'Department of Chemistry', 'MAHE, Manipal University', '2021', 'Ongoing',
  'Rietveld refinement and structural information of MOFs and COFs', null, null,
  'https://pubs.acs.org/inocaj/article-abstract/62/9/3875/323128/Systematic-Thiol-Decoration-in-a-Redox-Active-UiO?redirectedFrom=fulltext',
  'https://pubs.rsc.org/ma/article/5/1/136/812525/Pore-interface-engineering-improves-doxorubicin',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', ''
),
(
  'stephane-diring', 'Stephane Diring', 'CNRS Researcher', 'Département Chimie', 'CEISAM, Nantes University', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', ''
),
(
  'simon-pascal', 'Simon Pascal', 'CNRS Research Director', 'Département Chimie', 'CEISAM, Nantes University', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'marc-robert', 'Marc Robert', 'Professor, CNRS Research Director', '', 'Sorbonne University', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'pierre-emannuel-petit', 'Pierre Emannuel Petit', 'Personnel d''un organisme de recherche', 'X-ray Diffraction', 'Institut des Matériaux Jean Rouxel (IMN)', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', ''
),
(
  'vasilis-nikolaou', 'Vasilis Nikolaou', 'Associate Editor at Springer Nature', '', '', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', ''
),
(
  'emmanouil-nikoloudakis', 'Emmanouil Nikoloudakis', 'Researcher', 'Chemistry department', 'University of Crete, Greece', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', ''
),
(
  'georgios-charalambidis', 'Georgios Charalambidis', 'Associate Researcher', 'Chemistry department', 'Theoretical and Physical Chemistry Institute, National Hellenic Research Foundation, Athens, Greece', '2026', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'raja-rathinam', 'Raja Rathinam', 'Researcher', 'Département Chimie', 'CEISAM, Nantes University', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', ''
),
(
  'mohammed-boujtita', 'Mohammed Boujtita', 'Enseignant-Chercheur', 'Département Chimie', 'CEISAM, Nantes University', '2025', 'Ongoing',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'felix-zamora', 'Felix Zamora', 'Professor, Vice Rector', 'Department of Inorganic Chemistry', 'Universidad Autonoma Madrid', '2024', '2029',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', ''
),
(
  'javier-troyano-prieto', 'Javier Troyano Prieto', 'Raman y carvajal fellow', 'Department of Inorganic Chemistry', 'Universidad Autonoma Madrid', '2024', '2029',
  null, null, null, null, null,
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', ''
)
on conflict (id) do nothing;

-- ==============================================================================
-- 6. GALLERY POSTS TABLE SETUP
-- ==============================================================================

create table if not exists public.gallery_posts (
  id text primary key,
  title text not null,
  description text,
  post_date text,
  location text,
  read_time text default '3 min read',
  photo_1 text not null,
  caption_1 text,
  photo_2 text,
  caption_2 text,
  photo_3 text,
  caption_3 text,
  photo_4 text,
  caption_4 text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for gallery_posts
alter table public.gallery_posts enable row level security;

-- Policy: Public can view gallery posts
create policy "Allow public read access on gallery_posts"
  on public.gallery_posts
  for select
  using (true);

-- Policy: Only authenticated admin users can Insert, Update, and Delete gallery posts
create policy "Allow authenticated admin full access on gallery_posts"
  on public.gallery_posts
  for all
  to authenticated
  using (true)
  with check (true);

-- Seed initial gallery posts
insert into public.gallery_posts (
  id, title, description, post_date, location, read_time,
  photo_1, caption_1, photo_2, caption_2, photo_3, caption_3, photo_4, caption_4,
  order_index
) values (
  'ichhe-gaon-hills',
  'Into the Quiet Hills, A Place Called Ichhe Gaon',
  'Some places you visit, and some quietly stay with you. Ichhe Gaon (ইচ্ছেগাঁও) was one of those places for me that lingers in my memory. Tucked away in the hills of North Bengal, Ichhe Gaon feels wonderfully removed from everyday life. There were no crowds, no rush, just pine forests, mist rolling over the valleys, and warm mountain hospitality.',
  'Jan 29, 2019',
  'Ichhe Gaon, Kalimpong, West Bengal',
  '3 min read',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
  'Sunlight filtering through the dense pine canopies of North Bengal',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'Clear skies and mountain cottages overlooking the Kalimpong ridge',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'Distant snow-capped Himalayan peaks catching the first morning light',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'Evening mist descending through the village trails and valleys',
  0
) on conflict (id) do nothing;


