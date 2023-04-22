export * from './path'
export * from './fade'
export * from './zoom'
export * from './flip'
export * from './slide'
export * from './scale'
export * from './bounce'
export * from './rotate'
export * from './actions'
export * from './container'
export * from './transition'
export * from './background'

// fuction that removes special characters from a string
export const removeSpecialCharacters = (str: string) => {
    return str.replace(/[^a-zA-Z0-9]/g, '')
}
