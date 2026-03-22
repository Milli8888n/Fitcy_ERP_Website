// Auto-generated Sanity GROQ Queries
// Generated: 2026-02-05T15:42:02.675Z

// ============================================================================
// Club Queries
// ============================================================================

// Get all clubs
export const GET_ALL_CLUBS = `
  *[_type == "club"] | order(title asc) {
    _id,
    title,
    slug,
    location,
    heroImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      hotspot,
      crop
    },
    description,
    openingHours,
    facilities[]
  }
`;

// Get single club by slug
export const GET_CLUB_BY_SLUG = (slug: string) => `
  *[_type == "club" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    location,
    heroImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      hotspot,
      crop
    },
    description,
    openingHours,
    facilities[],
    gallery[] {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    amenities[] {
      title,
      description,
      icon
    }
  }
`;

// Get featured clubs
export const GET_FEATURED_CLUBS = `
  *[_type == "club" && featured == true] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    location,
    heroImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`;

// ============================================================================
// Class Queries
// ============================================================================

// Get all classes
export const GET_ALL_CLASSES = `
  *[_type == "class"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    duration,
    intensity,
    instructor->{
      _id,
      name,
      photo {
        asset->{
          _id,
          url
        }
      }
    },
    image {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`;

// Get classes by intensity
export const GET_CLASSES_BY_INTENSITY = (intensity: string) => `
  *[_type == "class" && intensity == "${intensity}"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    duration,
    intensity,
    image {
      asset->{
        _id,
        url
      }
    }
  }
`;

// ============================================================================
// Home Slide Queries
// ============================================================================

// Get all home slides
export const GET_HOME_SLIDES = `
  *[_type == "homeSlide"] | order(order asc) {
    _id,
    title,
    subtitle,
    backgroundImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      hotspot,
      crop
    },
    theme,
    cta {
      label,
      url
    }
  }
`;

// ============================================================================
// Instructor Queries
// ============================================================================

// Get all instructors
export const GET_ALL_INSTRUCTORS = `
  *[_type == "instructor"] | order(name asc) {
    _id,
    name,
    bio,
    photo {
      asset->{
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    specialties[]
  }
`;

// Get instructor by ID
export const GET_INSTRUCTOR_BY_ID = (id: string) => `
  *[_type == "instructor" && _id == "${id}"][0] {
    _id,
    name,
    bio,
    photo {
      asset->{
        _id,
        url
      }
    },
    specialties[],
    "classes": *[_type == "class" && references(^._id)] {
      _id,
      title,
      slug
    }
  }
`;

// ============================================================================
// Helper Functions
// ============================================================================

// Build image URL with Sanity CDN optimization
export function buildImageUrl(
  imageRef: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  }
): string {
  const projectId = 'z6ex5ahr';
  const dataset = 'production';
  
  // Extract asset ID from reference
  const assetId = imageRef.replace('image-', '').replace('-jpg', '').replace('-png', '');
  
  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}.jpg`;
  
  const params = new URLSearchParams();
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.quality) params.append('q', options.quality.toString());
  if (options?.format) params.append('fm', options.format);
  if (options?.fit) params.append('fit', options.fit);
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

// ============================================================================
// Usage Examples
// ============================================================================

/*
// In a Nuxt page/component:
import { useSanityClient } from '@nuxtjs/sanity';
import { GET_ALL_CLUBS, GET_HOME_SLIDES } from '~/queries/groq-queries';

const sanity = useSanityClient();

// Fetch clubs
const clubs = await sanity.fetch(GET_ALL_CLUBS);

// Fetch single club
const club = await sanity.fetch(GET_CLUB_BY_SLUG('porto'));

// Fetch home slides
const slides = await sanity.fetch(GET_HOME_SLIDES);

// Build optimized image URL
const imageUrl = buildImageUrl(club.heroImage.asset._ref, {
  width: 1920,
  height: 1080,
  quality: 80,
  format: 'webp',
  fit: 'crop'
});
*/
