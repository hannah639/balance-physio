export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. "Pilates Teacher" or "Consultant Neurological Physiotherapist"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'profileUrl',
      title: 'Profile Page URL',
      type: 'url',
      description: 'Optional — link to a full bio page',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers show first (e.g. 1, 2, 3...)',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
}
