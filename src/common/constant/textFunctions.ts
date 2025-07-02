import { ArabicString } from 'arabic-utils'
import { filterXSS } from 'xss'
let removeDiacritics = (value: string): string => {
    let removedDiacritics = ArabicString(value).removeDiacritics()
    removedDiacritics = ArabicString(removedDiacritics).normalizeAlef()
    removedDiacritics = ArabicString(removedDiacritics).removeTatweel()
    removedDiacritics = ArabicString(removedDiacritics).removeSuperscriptAlef()
    removedDiacritics =
        ArabicString(removedDiacritics).normalizeSuperscriptAlef()
    removedDiacritics = ArabicString(removedDiacritics).normalize()
    // Remove all hamza characters
    removedDiacritics = removedDiacritics.replace(/أ/g, 'ا')
    removedDiacritics = removedDiacritics.replace(/إ/g, 'ا')
    removedDiacritics = removedDiacritics.replace(/ؤ/g, 'و')
    removedDiacritics = removedDiacritics.replace(/ئ/g, 'ء')
    removedDiacritics = removedDiacritics.replace(/أ|إ|ؤ|ئ/g, 'ا')

    const words = removedDiacritics.split(' ')
    const uniqueWords = words.map((word) =>
        Array.from(new Set(word.split(' ')))
    )
    const uniqueWordsString = uniqueWords.map((word) => word.join(''))
    const uniqueWordsText = uniqueWordsString.join(' ')
    const cleanedWord = uniqueWordsText.replace(
        /[.,،"'-*&^#@!()_+><~}{:;!@#$^*()|~{}_\-\[\]]/g,
        ''
    )
    return cleanedWord
}

function removeExtraSpaces(inputString: string): string {
    return inputString.replace(/\s+/g, ' ').trim()
}
let cleanMyText = (value: string): string => {
    let filterFromXss = filterXSS(value.trim() as string, {
        whiteList: {},
        stripIgnoreTag: true,
    }).toString()
    let removeDiacriticsFromValue = removeDiacritics(filterFromXss)
    let removeAllExtra = removeExtraSpaces(removeDiacriticsFromValue)
    return removeAllExtra
}

let generateCombinations = (input: string) => {
    const words = input.split(' ')
    const combinations = new Set()

    const totalCombinations = 1 << words.length

    for (let i = 1; i < totalCombinations; i++) {
        let combination = []

        for (let j = 0; j < words.length; j++) {
            if (i & (1 << j)) {
                combination.push(words[j])
            }
        }
        combinations.add(combination.join(' '))
    }

    return Array.from(combinations).sort(
        (a: string, b: string) => b.split(' ').length - a.split(' ').length
    )
}

export { removeDiacritics, cleanMyText, generateCombinations }
