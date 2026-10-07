import theme01Bg from '../assets/themes/theme-01.svg'
import theme02Bg from '../assets/themes/theme-02.svg'
import theme03Bg from '../assets/themes/theme-03.svg'
import theme04Bg from '../assets/themes/theme-04.svg'

export interface HeroPillar {
  id: string
  title: string
  overview: string
}

export interface PublicationPlaceholder {
  title: string
  journal: string
  year: string
  doi?: string
  link?: string
}

export interface ResearchTheme {
  index: string
  title: string
  detail: string
  bgImage: string
  lead: string
  areas: string[]
  context: string
  publications: PublicationPlaceholder[]
}

export const heroPillars: HeroPillar[] = [
  {
    id: 'reticular-chemistry',
    title: 'Reticular Chemistry',
    overview: 'Framework editing and atomic-level precision design of porphyrin-based crystalline networks.',
  },
  {
    id: 'cofs-and-mofs',
    title: 'COFs and MOFs',
    overview: 'Hierarchical architectures spanning gels, aerogels, monoliths, thin films, and continuous membranes.',
  },
  {
    id: 'applications',
    title: 'Applications',
    overview: 'Artificial photosynthesis, solar photocatalysis, environmental adsorption, and targeted NanoCOF drug delivery characterized via SEM & TEM.',
  },
]

export const researcher = {
  name: 'Dr. Sumanta Chowdhury',
  shortName: 'Sumanta Chowdhury',
  role: 'Postdoctoral Researcher',
  affiliation: 'CEISAM · University of Nantes',
  location: 'Nantes, France',
  identity: 'Reticular Chemistry · COFs and MOFs · Applications',
  introduction: 'Interested in Reticular Chemistry research discipline, extending but not limited to Air, Water, Soil and Physiology.',
  currentResearch: {
    project: 'POWER-CO₂',
    funder: 'CNRS',
    description: 'Developing photo/electroactive MOF and COF-based materials for solar-driven CO₂ reduction.',
  },
}

export const researchThemes: ResearchTheme[] = [
  {
    index: '01',
    title: 'MOF and COF',
    detail: 'Crystalline porous networks, framework editing, and hierarchically structured architectures.',
    bgImage: theme01Bg,
    lead: 'Designing atomically precise frameworks through molecular building block synthesis, post-synthetic framework editing, and processing into functional gels, aerogels, monoliths, and thin films.',
    areas: ['Porphyrin-Based MOFs & COFs', 'Framework Editing', 'COF Gels, Aerogels & Monoliths', 'Thin Films & Continuous Membranes'],
    context: 'A molecular-design foundation connecting modular chemistry with functional porosity, structural integrity, and tunable pore environments.',
    publications: [
      {
        title: 'Porphyrin-Based Metal-Organic Frameworks for Solar Energy Conversion',
        journal: 'J. Am. Chem. Soc.',
        year: '2024',
        doi: '10.1021/jacs.xxxx',
        link: 'https://doi.org',
      },
      {
        title: 'Ultrathin Covalent Organic Framework Membranes for High-Flux Molecular Separation',
        journal: 'Angew. Chem. Int. Ed.',
        year: '2023',
        doi: '10.1002/anie.xxxx',
        link: 'https://doi.org',
      },
    ],
  },
  {
    index: '02',
    title: 'CO2 Conversion & Catalysis',
    detail: 'Photo- and electroactive molecular frameworks for solar energy conversion and artificial photosynthesis.',
    bgImage: theme02Bg,
    lead: 'Developing functional framework-based platforms for catalytic and solar-driven carbon dioxide conversion.',
    areas: ['Solar-Driven CO₂ Reduction', 'Molecular Catalysts & Active Centers', 'Photoelectrocatalytic Systems', 'Artificial Photosynthesis'],
    context: 'Current postdoctoral research through the CNRS-funded POWER-CO₂ project at CEISAM, University of Nantes.',
    publications: [
      {
        title: 'Photocatalytic CO₂ Reduction via Engineered Photoactive Covalent Organic Frameworks',
        journal: 'Nature Catalysis',
        year: '2024',
        doi: '10.1038/s41929-xxxx',
        link: 'https://doi.org',
      },
      {
        title: 'Charge-Separation Dynamics in Metalloporphyrin Frameworks for Artificial Photosynthesis',
        journal: 'ACS Catalysis',
        year: '2023',
        doi: '10.1021/acscatal.xxxx',
        link: 'https://doi.org',
      },
    ],
  },
  {
    index: '03',
    title: 'Adsorption Chemistry',
    detail: 'High-capacity porous networks for volatile capture, gas separation, and environmental remediation.',
    bgImage: theme03Bg,
    lead: 'Engineering porous framework monoliths and aerogels toward volatile radioiodine removal and air/water pollutant trapping.',
    areas: ['Volatile Radioiodine Capture', 'Gas Separation & Purification', 'Environmental Air & Water Remediation', 'Porous Aerogels for Long-term Trapping'],
    context: 'Focus of upcoming Marie Skłodowska-Curie Actions (MSCA) project VIOLET at Universidad Autónoma de Madrid.',
    publications: [
      {
        title: 'Volatile Radioiodine Removal by Covalent-Organic Aerogels: Mechanism and Long-Term Trapping',
        journal: 'Adv. Mater.',
        year: '2025',
        doi: '10.1002/adma.xxxx',
        link: 'https://doi.org',
      },
      {
        title: 'Hierarchically Porous Frameworks for High-Capacity Gas Adsorption and Selective Capture',
        journal: 'Chem. Sci.',
        year: '2023',
        doi: '10.1039/xxxx',
        link: 'https://doi.org',
      },
    ],
  },
  {
    index: '04',
    title: 'Therapeutic Applications',
    detail: 'Biocompatible nanoscale COFs for stimuli-responsive drug delivery and physiological therapy.',
    bgImage: theme04Bg,
    lead: 'Tailoring NanoCOFs and porous matrices for targeted anticancer drug delivery and physiological release.',
    areas: ['NanoCOF Drug Delivery', 'Stimuli-Responsive Drug Release', 'Anticancer Nanomedicine', 'Electron Microscopy (SEM / TEM) Characterization'],
    context: 'Biomedical applications extending reticular chemistry into nanoscale therapeutic transport and cellular targeting.',
    publications: [
      {
        title: 'Nanoscale Covalent Organic Frameworks for Targeted Anticancer Drug Delivery and In Vivo Imaging',
        journal: 'Biomaterials',
        year: '2024',
        doi: '10.1016/j.biomaterials.xxxx',
        link: 'https://doi.org',
      },
      {
        title: 'Cellular Uptake and Biodistribution of Functionalized Nano-Porous Vehicles',
        journal: 'ACS Nano',
        year: '2023',
        doi: '10.1021/acsnano.xxxx',
        link: 'https://doi.org',
      },
    ],
  },
]

export const researchJourney = [
  'Molecular Design',
  'Framework Engineering',
  'Functional Materials',
  'Applications',
]

export const positions = [
  {
    period: '01/2025 — present',
    role: 'Postdoctoral Researcher',
    institution: 'CEISAM, UMR CNRS 6230 · University of Nantes · Nantes, France',
    detail: 'CNRS-funded POWER-CO₂ programme: COF and MOF-based molecular materials for solar-driven photocatalytic carbon dioxide reduction.',
    status: 'Current',
  },
  {
    period: '02/2027 — 02/2029',
    role: 'Marie Skłodowska-Curie Actions Fellow',
    institution: 'Universidad Autónoma de Madrid · Madrid, Spain',
    detail: 'VIOLET: Volatile radioiodine removal by covalent-organic-aerogels towards long-term encapsulation and trapping.',
    status: 'Upcoming',
  },
  {
    period: '03/2024 — 09/2024',
    role: 'Project Associate-I Researcher',
    institution: 'School of Chemical Science · Indian Institute of Technology Mandi · India',
    detail: 'DST-SERB funded work on sustainable green hydrogen production from glycerol by continuous-flow photoreforming.',
    status: 'Research position',
  },
  {
    period: '08/2018 — 07/2020',
    role: 'Junior & Senior Research Fellow',
    institution: 'School of Chemical Science · Indian Institute of Technology Mandi · India',
    detail: 'DST-SERB funded project: development of pristine graphene as a catalyst support.',
    status: 'Research fellowship',
  },
]

export const academics = [
  {
    period: '2018 — 2024',
    degree: 'Ph.D. in Chemistry',
    institution: 'School of Chemical Science · Indian Institute of Technology Mandi · India',
    detail: 'Investigating structure–activity relationships in reticular framework materials through a multiscale isoreticular chemistry approach.',
  },
  {
    period: '2015 — 2017',
    degree: 'M.Sc. in Organic Chemistry',
    institution: 'Behala College · University of Calcutta · India',
    detail: 'Postgraduate project on a core/shell Ru@SiO₂ catalyst for organo-nanocatalysis.',
  },
  {
    period: '2010 — 2014',
    degree: 'B.Sc. in Chemistry (Honours)',
    institution: 'Asutosh College · University of Calcutta · India',
    detail: '',
  },
]

export const publications = [
  { type: 'Review', year: '2025', title: 'A Decade-Long Journey in Design Strategies and Structure–Property Relationships of Covalent Organic Framework Nanocarriers for Anticancer Drug Delivery', citation: 'Small · 2025 · e05835', authors: 'Rathi, P.; Chowdhury, S.; Siril, P. F.' },
  { type: 'Full paper', year: '2024', title: 'Electrospun Nanofiber Supported Nano/Mesoscale Covalent Organic Frameworks Boost Iodine Sorption', citation: 'Small · 2024 · 21, 2409495', authors: 'Chowdhury, S.; Hasnat, A.; Rathi, P.; Saha, S.; Randhawa, J. K.; Siril, P. F.' },
  { type: 'Full paper', year: '2024', title: 'Fine-Tuning Covalent Organic Frameworks for Structure-Activity Correlation via Adsorption and Catalytic Studies', citation: 'Journal of Colloid and Interface Science · 2024 · 665, 988', authors: 'Chowdhury, S.; Sharma, A.; Das, P. P.; Rathi, P.; Siril, P. F.' },
  { type: 'Review', year: '2024', title: 'Emerging Trends in Membrane-Based Wastewater Treatment: Electrospun Nanofibers and Reticular Porous Adsorbents as Key Components', citation: 'Environmental Science: Water Research & Technology · 2024 · 10, 29', authors: 'Kumar, M.; Chowdhury, S.; Randhawa, J. K.' },
  { type: 'Communication', year: '2024', title: 'Pore-Interface Engineering Improves Doxorubicin Loading to Triazine-Based Covalent Organic Framework', citation: 'Materials Advances · 2024 · 5, 136', authors: 'Rathi, P.; Chowdhury, S.; Das, P. P.; Keshri, A. K.; Chaudhary, A.; Siril, P. F.' },
  { type: 'Full paper', year: '2023', title: 'Systematic Thiol Decoration in a Redox-Active UiO-66-(SH)₂ Metal–Organic Framework: A Case Study Under Oxidative and Reductive Conditions', citation: 'Inorganic Chemistry · 2023 · 62, 3875', authors: 'Chowdhury, S.; Sharma, P.; Kundu, K.; Das, P. P.; Rathi, P.; Siril, P. F.' },
  { type: 'Full paper', year: '2024', title: 'Mechanically Pulverized Covalent Organic Framework as a Metal-Free Photocatalyst for Fenton-Like Degradation of Organic Pollutants and Hexavalent Chromium Reduction', citation: 'Journal of Environmental Chemical Engineering · 2024 · 12, 112006', authors: 'Gogoi, R.; Jena, S. K.; Singh, A.; Sharma, K.; Khanna, K.; Chowdhury, S.; Sharma, R.; Siril, P. F.' },
  { type: 'Review', year: '2022', title: 'Environmental Concerns and Long-Term Solutions for Solar-Powered Water Desalination', citation: 'Journal of Cleaner Production · 2022 · 345, 131180', authors: 'Kumar, S.; Kumar, M.; Chowdhury, S.; Rajpurohit, B. S.; Randhawa, J. K.' },
  { type: 'Full paper', year: '2022', title: 'Enhanced Photocatalytic Activity of Hierarchical C/ZnO Nanocomposite Derived from Solvothermally Restructured Zn-BTC Microspheres', citation: 'Journal of Environmental Chemical Engineering · 2022 · 10, 107674', authors: 'Sharma, K.; Kaushik, R.; Pandey, P. K.; Chowdhury, S.; Gogoi, R.; Singh, A.; Halder, A.; Siril, P. F.' },
  { type: 'Full paper', year: '2022', title: 'Graphene-Supported Palladium Nanostructures as Highly Active Catalysts for Formic Acid Oxidation Reaction', citation: 'ACS Applied Energy Materials · 2022 · 5, 13480', authors: 'Pramanick, B.; Kumar, T.; Chowdhury, S.; Halder, A.; Siril, P. F.' },
  { type: 'Full paper', year: '2021', title: 'Intermediate Organic–Inorganic Hybrid with Highly Accessible Pore Structure and Proton Conductivity: Journey from Inorganic Oxide to Metal–Organic Framework', citation: 'ACS Applied Energy Materials · 2021 · 4, 6082', authors: 'Sharma, K.; Pandey, P. K.; Chowdhury, S.; Naithani, N.; Gogoi, R.; Siril, P. F.' },
]

export const presentations = [
  { year: '2025', type: 'Invited oral', title: 'Photocatalytic CO₂ conversion', venue: 'PEPR-SPLEEN POWER-CO₂ days · Lyon, France' },
  { year: '2025', type: 'Poster', title: 'Post-synthetic Microenvironment Tuning of Covalent Organic Frameworks for Selective CO₂ Reduction', venue: 'EuroMOF2025 · Heraklion, Crete' },
  { year: '2025', type: 'Oral', title: 'Electrospun Nanofiber Supported Nano/Mesoscale Covalent Organic Frameworks Boost Iodine Sorption', venue: 'French MOFs 2025 · Nantes, France' },
  { year: '2025', type: 'Oral', title: 'Surface Functionality in NanoCOFs Drives Enhanced Cellular Uptake in Lung Cancer Cells', venue: 'BBPore 2025 · Valencia, Spain' },
  { year: '2024', type: 'Poster', title: 'Surface-Engineered Nano/Mesoscale Imine-Linked Covalent Organic Frameworks as Next-Generation Radioiodine Adsorbents', venue: 'FARC-2024 · IIT Mandi, India' },
  { year: '2023', type: 'Poster', title: 'Can active sites promote thermocatalytic CO₂ conversion without engaging in CO₂ adsorption?', venue: 'CEES-2023 & CO₂ India Network Annual Meet · IIT Mandi, India' },
  { year: '2023', type: 'Seminar', title: 'Porous Frameworks and Reticular Nano-Synthesis', venue: 'International Adsorption Society Webinar Series · online' },
  { year: '2022', type: 'Poster', title: 'Systematic Thiol Decoration in a Redox-Active UiO-66-(SH)₂ Metal–Organic Framework', venue: 'International Symposium on Advanced Microscopy · IIT Madras, India' },
  { year: '2021', type: 'Participation', title: 'ACS Spring 2021', venue: 'Online' },
  { year: '2020', type: 'Seminar', title: 'BET Surface Area Characterization and Powder Rheology', venue: 'One Day Seminar' },
  { year: '2019', type: 'Poster', title: 'Microwave Assisted Green Synthesis of Nanostructured Zinc Glutarate as Potential Heterogeneous Catalyst for CO₂ Conversion', venue: 'MTIC XVIII · IIT Guwahati, India' },
  { year: '2019', type: 'Workshop', title: 'Gaussian16: Theory and Practice', venue: 'Hindustan International · Kolkata, India' },
]

export const contactData = {
  name: 'Dr. Sumanta Chowdhury',
  role: 'Postdoctoral Researcher · CNRS Fellow',
  affiliation: 'CEISAM (UMR CNRS 6230) · University of Nantes',
  place: 'Nantes, France',
  officeAddress: {
    institution: 'CEISAM Laboratory (UMR CNRS 6230)',
    faculty: 'Faculté des Sciences et des Techniques de Nantes',
    street: '2, rue de la Houssinière, BP 92208',
    postalCodeCity: '44322 Nantes Cedex 3',
    country: 'France',
  },
  upcomingAppointment: {
    role: 'Marie Skłodowska-Curie Actions Fellow (2027–2029)',
    project: 'VIOLET Project: Volatile Radioiodine Removal by Covalent-Organic-Aerogels',
    institution: 'Universidad Autónoma de Madrid (UAM)',
    location: 'Madrid, Spain',
  },
  emails: [
    {
      type: 'Academic Email',
      email: 'sumanta.chowdhury@univ-nantes.fr',
      note: 'Institutional & research correspondence',
      primary: true,
    },
    {
      type: 'Personal / Direct Email',
      email: 'chowdhuryraj.92@gmail.com',
      note: 'Alternative & direct communication',
      primary: false,
    },
  ],
  socials: [
    {
      name: 'LinkedIn',
      handle: 'Sumanta Chowdhury, Ph.D.',
      url: 'https://www.linkedin.com/search/results/all/?keywords=Sumanta%20Chowdhury%20CEISAM',
      category: 'Professional Network',
    },
    {
      name: 'Google Scholar',
      handle: 'Sumanta Chowdhury',
      url: 'https://scholar.google.com/citations?view_op=search_authors&mauthors=Sumanta+Chowdhury+CEISAM',
      category: 'Citations & Papers',
    },
    {
      name: 'ORCID',
      handle: '0000-0003-1289-6636',
      url: 'https://orcid.org/0000-0003-1289-6636',
      category: 'Researcher ID',
    },
    {
      name: 'X (Twitter)',
      handle: '@SumantaChowdhury',
      url: 'https://x.com/search?q=Sumanta%20Chowdhury',
      category: 'Scientific Discussion',
    },
  ],
}

