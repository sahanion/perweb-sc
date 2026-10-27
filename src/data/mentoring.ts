export interface MentorshipColleague {
  id: string
  name: string
  position?: string
  department?: string
  institute?: string
  yearFrom?: string
  yearTill?: string
  projects?: string[]
  publications?: string[]
  photo: string // Placeholder photo URL — replace with actual image link later
  googleScholar: string // Google Scholar profile link — add URL here later
}

export type Colleague = MentorshipColleague

export interface MentoringPillar {
  title: string
  subtitle: string
  description: string
  iconType: 'flask' | 'microscope' | 'book'
}

export const mentoringPillars: MentoringPillar[] = [
  {
    title: 'Framework Synthesis & Design',
    subtitle: 'Reticular Architecture',
    description: 'Guiding junior researchers through solvothermal, microwave, and mechanochemical synthetic routes to produce highly crystalline MOFs and COFs.',
    iconType: 'flask',
  },
  {
    title: 'Advanced Characterization',
    subtitle: 'Structure & Nanoscale Morphology',
    description: 'Hands-on training in gas sorption isotherms (BET), powder XRD crystallography, FT-IR/NMR spectroscopy, and electron microscopy (TEM & FESEM).',
    iconType: 'microscope',
  },
  {
    title: 'Scientific Communication',
    subtitle: 'Publishing & Cover Art',
    description: 'Coaching on high-impact manuscript preparation, rigorous data presentation, scientific cover art design, and international conference talks.',
    iconType: 'book',
  },
]

// Collaborators and Mentorship Network
export const mentorshipColleagues: MentorshipColleague[] = [
  {
    id: 'prem-felix-siril',
    name: 'Prem Felix Siril',
    position: 'Professor',
    department: 'School of Chemical Science',
    institute: 'IIT Mandi',
    yearFrom: '2018',
    yearTill: 'Lifetime',
    projects: [
      'Development of Pristine Graphene as a Catalyst Support',
      'Investigating Structure-Activity Relationships in Reticular Framework Materials through a Multiscale Isoreticular Chemistry Approach',
      'Sustainable Green Hydrogen Production from Glycerol using Continuous Flow Photoreforming: Process and Catalyst Development',
    ],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'jaspreet-kaur-randhawa',
    name: 'Jaspreet Kaur Randhawa',
    position: 'Professor',
    department: 'School of Mechanical and Materials Engineering',
    institute: 'IIT Mandi',
    yearFrom: '',
    yearTill: '',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'aditi-halder',
    name: 'Aditi Halder',
    position: 'Professor',
    department: 'School of Chemical Science',
    institute: 'IIT Mandi',
    yearFrom: '2018',
    yearTill: '2024',
    projects: [],
    publications: [
      'https://www.sciencedirect.com/science/article/abs/pii/S2213343722005474?via%3Dihub',
      'https://pubs.acs.org/aaemcq/article-abstract/5/11/13480/412252/Graphene-Supported-Palladium-Nanostructures-as?redirectedFrom=fulltext',
    ],
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'abhishek-sharma',
    name: 'Abhishek Sharma',
    position: '',
    department: '',
    institute: '',
    yearFrom: '2022',
    yearTill: '2024',
    projects: [
      'Structural simulation of betaketoenamine linked Covalent Organic Frameworks',
    ],
    publications: [
      'https://www.sciencedirect.com/science/article/abs/pii/S0021979724005617',
    ],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'fabrice-odobel',
    name: 'Fabrice Odobel',
    position: 'Professor, CNRS Research Director',
    department: 'Département Chimie',
    institute: 'CEISAM, Nantes University',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [
      'POWER-CO2 [COF and MOF based molecular materials for solar driven photocatalytic carbon dioxide reduction]',
    ],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'stefan-haacke',
    name: 'Stefan Haacke',
    position: 'Professor',
    department: 'PCMS & Télécom Physique Strasbourg',
    institute: 'Strasbourg University',
    yearFrom: '2026',
    yearTill: '2027',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'partha-pratim-das',
    name: 'Partha Pratim Das',
    position: 'Assistant Professor',
    department: 'Department of Chemistry',
    institute: 'MAHE, Manipal University',
    yearFrom: '2021',
    yearTill: 'Ongoing',
    projects: [
      'Rietveld refinement and structural information of MOFs and COFs',
    ],
    publications: [
      'https://pubs.acs.org/inocaj/article-abstract/62/9/3875/323128/Systematic-Thiol-Decoration-in-a-Redox-Active-UiO?redirectedFrom=fulltext',
      'https://pubs.rsc.org/ma/article/5/1/136/812525/Pore-interface-engineering-improves-doxorubicin',
    ],
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'stephane-diring',
    name: 'Stephane Diring',
    position: 'CNRS Researcher',
    department: 'Département Chimie',
    institute: 'CEISAM, Nantes University',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'simon-pascal',
    name: 'Simon Pascal',
    position: 'CNRS Research Director',
    department: 'Département Chimie',
    institute: 'CEISAM, Nantes University',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'marc-robert',
    name: 'Marc Robert',
    position: 'Professor, CNRS Research Director',
    department: '',
    institute: 'Sorbonne University',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'pierre-emannuel-petit',
    name: 'Pierre Emannuel Petit',
    position: "Personnel d'un organisme de recherche",
    department: 'X-ray Diffraction',
    institute: 'Institut des Matériaux Jean Rouxel (IMN)',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'vasilis-nikolaou',
    name: 'Vasilis Nikolaou',
    position: 'Associate Editor at Springer Nature',
    department: '',
    institute: '',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'emmanouil-nikoloudakis',
    name: 'Emmanouil Nikoloudakis',
    position: 'Researcher',
    department: 'Chemistry department',
    institute: 'University of Crete, Greece',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'georgios-charalambidis',
    name: 'Georgios Charalambidis',
    position: 'Associate Researcher',
    department: 'Chemistry department',
    institute: 'Theoretical and Physical Chemistry Institute, National Hellenic Research Foundation, Athens, Greece',
    yearFrom: '2026',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'raja-rathinam',
    name: 'Raja Rathinam',
    position: 'Researcher',
    department: 'Département Chimie',
    institute: 'CEISAM, Nantes University',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'mohammed-boujtita',
    name: 'Mohammed Boujtita',
    position: 'Enseignant-Chercheur',
    department: 'Département Chimie',
    institute: 'CEISAM, Nantes University',
    yearFrom: '2025',
    yearTill: 'Ongoing',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'felix-zamora',
    name: 'Felix Zamora',
    position: 'Professor, Vice Rector',
    department: 'Department of Inorganic Chemistry',
    institute: 'Universidad Autonoma Madrid',
    yearFrom: '2024',
    yearTill: '2029',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
  {
    id: 'javier-troyano-prieto',
    name: 'Javier Troyano Prieto',
    position: 'Raman y carvajal fellow',
    department: 'Department of Inorganic Chemistry',
    institute: 'Universidad Autonoma Madrid',
    yearFrom: '2024',
    yearTill: '2029',
    projects: [],
    publications: [],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', // Placeholder — replace with image URL
    googleScholar: '', // Add Google Scholar link here
  },
]
