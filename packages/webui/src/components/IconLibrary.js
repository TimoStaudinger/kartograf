import * as icons from 'mdi-material-ui'

export const indexedIcons = icons

export const allIcons = Object.keys(icons)
  .map(key => ({name: key, component: icons[key]}))