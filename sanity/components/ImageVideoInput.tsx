'use client'

import { useCallback } from 'react'
import { FormPatch, ObjectInputProps, PatchEvent, set, unset } from 'sanity'

/**
 * Custom input for module.imageVideo.
 * When the `columns` field changes, it clears the layout fields
 * that belong to the other column counts so stale values don't persist.
 */
export function ImageVideoInput(props: ObjectInputProps) {
  const { onChange, renderDefault } = props

  const handleChange = useCallback(
    (patch: FormPatch | PatchEvent | FormPatch[]) => {
      // Only intercept PatchEvent to inspect individual patches
      if (!(patch instanceof PatchEvent)) {
        onChange(patch)
        return
      }

      const patches = patch.patches
      const columnsPatch = patches.find(
        (p) => p.type === 'set' && p.path.length === 1 && p.path[0] === 'columns',
      )

      if (columnsPatch && columnsPatch.type === 'set') {
        const newColumns = columnsPatch.value as number
        const resetPatches = [
          ...(newColumns !== 1 ? [unset(['layout1col'])] : [set('optionA', ['layout1col'])]),
          ...(newColumns !== 2 ? [unset(['layout2col'])] : [set('optionA', ['layout2col'])]),
          ...(newColumns !== 3 ? [unset(['layout3col'])] : [set('optionA', ['layout3col'])]),
          unset(['reverseOrder']),
        ]
        onChange(PatchEvent.from([...patches, ...resetPatches]))
        return
      }

      onChange(patch)
    },
    [onChange],
  )

  return renderDefault({ ...props, onChange: handleChange })
}
