export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Site Title (browser tab)',
      type: 'string',
      description: 'Shown in the browser tab and as the default page title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Shown in Google search results — keep under 160 characters',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Preview image when the site is shared on Facebook, LinkedIn, WhatsApp etc. Recommended 1200x630px',
      options: { hotspot: true },
    },
    {
      name: 'gaId',
      title: 'Google Analytics Measurement ID',
      type: 'string',
      description: 'e.g. G-XXXXXXXXXX (leave blank to disable)',
    },
    {
      name: 'gtmId',
      title: 'Google Tag Manager ID',
      type: 'string',
      description: 'e.g. GTM-XXXXXXX (leave blank to disable)',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
}
