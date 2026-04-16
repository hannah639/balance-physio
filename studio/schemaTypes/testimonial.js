export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Client Description',
      type: 'string',
      description: 'e.g. "BJJ Competitor" or "Trail Runner"',
    },
    {
      name: 'avatar',
      title: 'Avatar Photo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers show first',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'avatar',
    },
  },
}
