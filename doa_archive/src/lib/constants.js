export const ENTRY_TYPES = ['personnel', 'location', 'document', 'event']

export const CLASSIFICATION_LEVELS = ['unclassified', 'restricted', 'ultra']

export const ROUTES = {
  HOME: '/',
  ENTRY: '/entry/:slug',
  entry: (slug) => `/entry/${slug}`,
  BOOKER: '/booker',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
}
