export interface GalleryPost {
  id: string
  title: string
  description?: string
  date?: string
  location?: string
  readTime?: string
  photo1: string // mandatory
  caption1?: string
  photo2?: string
  caption2?: string
  photo3?: string
  caption3?: string
  photo4?: string
  caption4?: string
  orderIndex?: number
  createdAt?: string
}

export const defaultGalleryPosts: GalleryPost[] = [
  {
    id: 'ichhe-gaon-hills',
    title: 'Into the Quiet Hills, A Place Called Ichhe Gaon',
    description:
      'Some places you visit, and some quietly stay with you. Ichhe Gaon (ইচ্ছেগাঁও) was one of those places for me that lingers in my memory. Tucked away in the hills of North Bengal, Ichhe Gaon feels wonderfully removed from everyday life. There were no crowds, no rush, just pine forests, mist rolling over the valleys, and warm mountain hospitality.',
    date: 'Jan 29, 2019',
    location: 'Ichhe Gaon, Kalimpong, West Bengal',
    readTime: '3 min read',
    photo1:
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
    caption1: 'Sunlight filtering through the dense pine canopies of North Bengal',
    photo2:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption2: 'Clear skies and mountain cottages overlooking the Kalimpong ridge',
    photo3:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption3: 'Distant snow-capped Himalayan peaks catching the first morning light',
    photo4:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    caption4: 'Evening mist descending through the village trails and valleys',
    orderIndex: 0,
    createdAt: '2019-01-29T10:00:00Z',
  },
  {
    id: 'nantes-scientific-cover-art',
    title: 'Designing Cover Art for Reticular Framework Chemistry',
    description:
      'A collection of scientific illustrations, cover art designs, and 3D molecular renders created for journal frontispieces. Bridging rigorous crystallographic topology with visual storytelling in solar energy conversion, photocatalysis, and functional framework design.',
    date: 'Oct 14, 2024',
    location: 'CEISAM, University of Nantes, France',
    readTime: '4 min read',
    photo1:
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    caption1: 'Inside cover illustration concept for RSC Environmental Science',
    photo2:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    caption2: 'Photoreactor continuous-flow synthesis bench at CEISAM Laboratory',
    photo3:
      'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80',
    caption3: 'Crystallographic lattice model with coordinated zirconium nodes',
    photo4: '',
    caption4: '',
    orderIndex: 1,
    createdAt: '2024-10-14T15:30:00Z',
  },
]

