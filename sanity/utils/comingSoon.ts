import { ValidationContext } from 'sanity'

/**
 * True when the document being edited is a "Coming soon" project placeholder.
 * Used to relax `required` validations on shared media types so a Coming soon
 * project can be saved without a finished case study. Only the `project`
 * document has a `comingSoon` field, so other document types are unaffected.
 */
export const isComingSoon = (context: ValidationContext): boolean =>
  // @ts-ignore — comingSoon only exists on the project document
  Boolean(context?.document?.comingSoon)
