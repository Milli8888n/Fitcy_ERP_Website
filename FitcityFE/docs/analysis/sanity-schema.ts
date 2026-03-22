// Auto-generated Sanity Schema Types
// Generated: 2026-02-06T07:07:50.172Z


// Club Interface
export interface Club {
  title: string;
  slug: { current: string };
  location?: string;
  heroImage?: SanityImage;
  description?: string;
  openingHours?: string;
  facilities?: string[];
}

// Class Interface
export interface Class {
  title: string;
  slug: { current: string };
  description?: string;
  duration?: number;
  intensity?: string;
  instructor?: Instructor;
  image?: SanityImage;
}

// Instructor Interface
export interface Instructor {
  name: string;
  bio?: string;
  photo?: SanityImage;
  specialties?: string[];
}

// HomeSlide Interface
export interface HomeSlide {
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImage;
  theme?: string;
  cta?: {
    label: string;
    url: string
  };
}

// Sanity Image Type
export interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

// Sanity Schema Definitions
import { defineType, defineField } from 'sanity';

export const clubSchema = defineType({
  name: 'club',
  title: 'Club',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'HeroImage',
      type: 'image',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'openingHours',
      title: 'OpeningHours',
      type: 'string',
    }),
    defineField({
      name: 'facilities',
      title: 'Facilities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});

export const classSchema = defineType({
  name: 'class',
  title: 'Class',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'number',
    }),
    defineField({
      name: 'intensity',
      title: 'Intensity',
      type: 'string',
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
});

export const instructorSchema = defineType({
  name: 'instructor',
  title: 'Instructor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
    }),
    defineField({
      name: 'specialties',
      title: 'Specialties',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
});

export const homeslideSchema = defineType({
  name: 'homeslide',
  title: 'HomeSlide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'BackgroundImage',
      type: 'image',
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: { list: ["light","dark","stream","pilates","nutrition"] },
    }),
    defineField({
      name: 'cta',
      title: 'Cta',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'url', type: 'string' },
      ],
    }),
  ],
});

