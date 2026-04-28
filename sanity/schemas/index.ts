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
import body from './blocks/body'
import bodyBonTemps from './blocks/bodyBonTemps'
import bodySimple from './blocks/bodySimple'
import bodyTextTerms from './blocks/bodyTextTerms'

const blocks = [body, bodyBonTemps, bodySimple, bodyTextTerms]

// Object types
import footer from './objects/global/footer'
import header from './objects/global/header'
import linkExternal from './objects/global/linkExternal'
import linkInternal from './objects/global/linkInternal'
import linkSocial from './objects/global/linkSocial'
import links from './objects/global/links'
import notFoundPage from './objects/global/notFoundPage'
import menu from './objects/global/menu'
import heroHome from './objects/hero/home'
import heroPage from './objects/hero/page'
import moduleAccordion from './objects/module/accordion'
import accordionBody from './objects/module/accordionBody'
import accordionGroup from './objects/module/accordionGroup'
import moduleCenteredText from './objects/module/centeredText'
import moduleGrid from './objects/module/grid'
import gridItems from './objects/module/gridItem'
import moduleImageText from './objects/module/imageText'
import moduleImageVideo from './objects/module/imageVideo'
import mediaImage from './objects/module/mediaImage'
import mediaImageResponsive from './objects/module/mediaImageResponsive'
import mediaVideo from './objects/module/mediaVideo'
import mediaVideoResponsive from './objects/module/mediaVideoResponsive'
import moduleInformationClients from './objects/module/informationClients'
import moduleInformationImageVideo from './objects/module/informationImageVideo'
import modulePageImageVideo from './objects/module/pageImageVideo'
import modulePageTextColumn from './objects/module/pageTextColumn'
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
  notFoundPage,
  heroHome,
  heroPage,
  menu,
  moduleAccordion,
  accordionBody,
  accordionGroup,
  moduleCenteredText,
  moduleGrid,
  gridItems,
  moduleImageText,
  moduleImageVideo,
  mediaImage,
  mediaImageResponsive,
  mediaVideo,
  mediaVideoResponsive,
  moduleInformationClients,
  moduleInformationImageVideo,
  modulePageImageVideo,
  modulePageTextColumn,
  moduleTextColumn,
  seo,
  seoHome,
  seoPage,
  seoDescription,
  video,
]

export const schemaTypes = [...annotations, ...singletons, ...objects, ...blocks, ...documents]
