// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
]

// Document types
import page from './documents/page'
import project from './documents/project'
import service from './documents/service'

const documents = [page, project, service]

// Singleton document types
import home from './singletons/home'
import information from './singletons/information'
import listWork from './singletons/listWork'
import settings from './singletons/settings'

const singletons = [home, listWork, settings, information]

// Block content
import bodyBonTemps from './blocks/bodyBonTemps'
import bodySimple from './blocks/bodySimple'

const blocks = [bodyBonTemps, bodySimple]

// Object types
import footer from './objects/global/footer'
import header from './objects/global/header'
import linkExternal from './objects/global/linkExternal'
import linkInternal from './objects/global/linkInternal'
import linkSocial from './objects/global/linkSocial'
import links from './objects/global/links'
import menu from './objects/global/menu'
import moduleCenteredText from './objects/module/centeredText'
import moduleImageText from './objects/module/imageText'
import moduleImageVideo from './objects/module/imageVideo'
import mediaImage from './objects/module/mediaImage'
import mediaImageResponsive from './objects/module/mediaImageResponsive'
import mediaVideo from './objects/module/mediaVideo'
import mediaVideoResponsive from './objects/module/mediaVideoResponsive'
import modulePageImageVideo from './objects/module/pageImageVideo'
import moduleTextColumn from './objects/module/textColumn'
import seo from './objects/seo/seo'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoDescription from './objects/seo/description'
import video from './objects/module/video'

const objects = [
  footer,
  header,
  links,
  linkExternal,
  linkInternal,
  linkSocial,
  menu,
  moduleCenteredText,
  moduleImageText,
  moduleImageVideo,
  mediaImage,
  mediaImageResponsive,
  mediaVideo,
  mediaVideoResponsive,
  modulePageImageVideo,
  moduleTextColumn,
  seo,
  seoHome,
  seoPage,
  seoDescription,
  video,
]

export const schemaTypes = [...annotations, ...singletons, ...objects, ...blocks, ...documents]
