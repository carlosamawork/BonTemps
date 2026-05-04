// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'home', 'listWork', 'information']

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  {type: 'home'},
  {type: 'page'},
  {type: 'project'},
  {type: 'information'},
]

// API version to use when using the Sanity client within the studio
// https://www.sanity.io/help/studio-client-specify-api-version
export const SANITY_API_VERSION = '2022-10-25'
