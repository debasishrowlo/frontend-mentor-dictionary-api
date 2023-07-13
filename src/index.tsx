import React, { useEffect, useState, useRef, FormEvent } from "react"
import { createRoot } from "react-dom/client"
import classnames from "classnames"
import { Listbox, Transition } from "@headlessui/react"

import Logo from "./icons/Logo"
import MoonIcon from "./icons/Moon"

import arrowDownIcon from "./assets/images/icon-arrow-down.svg"
import searchIcon from "./assets/images/icon-search.svg"
import playIcon from "./assets/images/icon-play.svg"
import newWindowIcon from "./assets/images/icon-new-window.svg"
import confusedEmojiIcon from "./assets/images/confused-emoji.svg"

import "./index.css"

type Word = {
  value: string,
  phonetic: string,
  audio?: string,
  meanings: Array<{
    partOfSpeech: string,
    definitions: Array<{
      value: string,
      example?: string,
    }>,
    synonyms: string[],
  }>,
  sourceUrls: string[],
}

type APIResponse = Array<{
  word: string,
  phonetic: string,
  phonetics: Array<{
    text: string,
    audio: string,
    sourceUrl?: string,
    license?: {
      name: string,
      url: string,
    },
  }>
  meanings: Array<{
    partOfSpeech: string,
    definitions: Array<{
      definition: string,
      synonyms: string[],
      antonyms: string[],
      example?: string,
    }>,
    synonyms: string[],
    antonyms: string[],
  }>,
  license: {
    name: string,
    url: string,
  },
  sourceUrls: string[],
}>

const enum themes {
  light = "light",
  dark = "dark",
}

const fontTypes:{ [key:string]: string } = {
  sans: "sans",
  serif: "serif",
  mono: "mono",
}

const getFontName = (fontType:string) => {
  if (fontType === fontTypes.serif) {
    return "Serif"
  }

  if (fontType === fontTypes.sans) {
    return "Sans Serif"
  }

  if (fontType === fontTypes.mono) {
    return "Mono"
  }

  return null
}

const getDefaultTheme = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return themes.dark
  } else {
    return themes.light
  }
}

const App = () => {
  const firstRenderRef = useRef(true)

  const [query, setQuery] = useState("")
  const [font, setFont] = useState(fontTypes.serif)
  const [theme, setTheme] = useState<themes>(getDefaultTheme())
  const [word, setWord] = useState<Word>({
    value: "keyboard",
    phonetic: "/ˈkiːbɔːd/",
    audio: "https://api.dictionaryapi.dev/media/pronunciations/en/keyboard-us.mp3",
    meanings: [
      {
        partOfSpeech: "noun",
        definitions: [
          { value: "(etc.) A set of keys used to operate a typewriter, computer etc.", },
          { value: "A component of many instruments including the piano, organ, and harpsichord consisting of usually black and white keys that cause different tones to be produced when struck.", },
          { value: "A device with keys of a musical keyboard, used to control electronic sound-producing devices which may be built into or separate from the keyboard device.", },
        ],
        synonyms: ["electronic keyboard"],
      },
      {
        partOfSpeech: "verb",
        definitions: [
          {
            value: "To type on a computer keyboard.",
            example: "Keyboarding is the part of this job I hate the most.",
          },
        ],
        synonyms: [],
      },
    ],
    sourceUrls: [
      "https://en.wiktionary.org/wiki/keyboard",
      "https://en.wiktionary.org/wiki/keyboard",
    ],
  });
  const [errorVisible, setErrorVisible] = useState(false)

  const darkModeEnabled = theme === themes.dark

  const search = async (word:string) => {
    if (notFoundErrorVisible) {
      setNotFoundErrorVisible(false)
    }

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

    if (!response.ok) {
      if (response.status === 404) {
        setNotFoundErrorVisible(true)
        return
      }

      console.error("Something went wrong")
      return
    }

    const responseJSON:APIResponse = await response.json()

    const data = responseJSON[0]

    let partialResult:Partial<Word> = {
      value: data.word,
      phonetic: data.phonetic,
      sourceUrls: data.sourceUrls,
    }

    const phoneticWithAudio = data.phonetics.find((phonetic) => {
      return phonetic.audio !== ""
    })
    if (phoneticWithAudio) {
      partialResult.audio = phoneticWithAudio.audio
    }

    partialResult.meanings = data.meanings.map((meaning:any) => {
      return {
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((definition:any) => {
          let result:any = {
            value: definition.definition,
          }

          if (definition.example) {
            result.example = definition.example
          }

          return result
        }),
        synonyms: meaning.synonyms,
      }
    })

    const result:Word = partialResult as Word
    setWord(result)
  }

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()

    if (query === "") {
      setErrorVisible(true)
      return
    }

    search(query)
  }

  const handleSynonymClick = (synonym:string) => {
    setQuery(synonym)
    search(synonym)
    window.scrollTo(0, 0)
  }

  const getFontClassName = (fontType:string) => {
    if (fontType === fontTypes.serif) {
      return "font-serif"
    }

    if (fontType === fontTypes.sans) {
      return "font-sans"
    }

    if (fontType === fontTypes.mono) {
      return "font-mono"
    }

    return null
  }

  const toggleTheme = () => {
    setTheme(theme === themes.dark ? themes.light : themes.dark)
  }

  useEffect(() => {
    const firstRender = firstRenderRef.current

    if (!firstRender) { document.documentElement.classList.add("animate-all") }
    if (theme === themes.dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    setTimeout(() => {
      document.documentElement.classList.remove("animate-all")
    }, 500)

    if (firstRender) { firstRenderRef.current = false }
  }, [theme])

  return (
    <div className={`p-6 max-w-[736px] mx-auto md:px-9 md:py-14 lg:px-0 ${getFontClassName(font)}`}>
      <div className="flex justify-between">
        <Logo className="w-6 stroke-current text-gray-300 md:w-8" />
        <div className="flex items-center">
          <div className="h-full relative z-10">
            <Listbox value={font} onChange={setFont}>
              <Listbox.Button className="h-full px-4 flex items-center">
                <span className="text-14 font-bold dark:text-white md:text-18">{getFontName(font)}</span>
                <img src={arrowDownIcon} className="w-3 ml-4" />
              </Listbox.Button>
              <Transition
                enter="transition-transform duration-200 ease-out"
                enterFrom="-translate-y-2"
                enterTo="translate-y-0"
                leave="transition duration-100 ease-out"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="-translate-y-2 opacity-0"
              >
                <Listbox.Options className="w-44 mt-2 py-4 absolute z-10 top-full right-4 bg-white dark:bg-gray-600 rounded-2xl dropdown-shadow">
                  {Object.keys(fontTypes).map((fontKey) => (
                    <Listbox.Option 
                      key={fontKey}
                      value={fontKey}
                      className={`${getFontClassName(fontKey)} px-6 py-2 text-14 font-bold dark:text-white hover:text-purple whitespace-nowrap cursor-pointer transition-colors duration-200 md:text-18`}
                    >
                      {getFontName(fontKey)}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
          <button 
            type="button" 
            className="h-full pl-4 border-l border-gray-100 dark:border-gray-200 flex items-center outline-none"
            onClick={() => toggleTheme()}
          >
            <div className="w-10 h-5 px-1 flex items-center bg-gray-300 dark:bg-purple rounded-full">
              <div className="w-full h-full relative">
                <div className={classnames("w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-500", {
                  "left-0 translate-x-0": !darkModeEnabled,
                  "left-full -translate-x-full": darkModeEnabled,
                })}></div>
              </div>
            </div>
            <MoonIcon className="ml-3 w-5 stroke-current text-gray-300 dark:text-purple" />
          </button>
        </div>
      </div>
      <div className="mt-6 md:mt-12">
        <form onSubmit={(e:FormEvent) => handleSubmit(e)} className="flex relative bg-gray-100 dark:bg-gray-600 rounded-2xl">
          <input 
            type="text" 
            className="w-full pl-6 pr-14 py-3 border border-transparent focus:border-purple bg-transparent font-bold dark:text-white rounded-2xl outline-none caret-purple transition-colors duration-200 md:text-20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="h-full px-6 py-4 absolute top-0 right-0">
            <img src={searchIcon} className="w-4 h-4" />
          </button>
        </form>
      </div>
      {(word !== null && !notFoundErrorVisible) && (
        <>
          <div className="mt-6 flex justify-between items-center md:mt-10">
            <div>
              <p className="text-32 font-bold dark:text-white md:text-64">{word.value}</p>
              <p className="text-18 text-purple md:mt-1 md:text-24">{word.phonetic}</p>
            </div>
            <button type="button">
              <img src={playIcon} className="w-12 md:w-20" />
            </button>
          </div>
          {word.meanings.map((meaning, index) => (
            <div key={index} className="mt-7 md:mt-10">
              <div className="flex items-center">
                <p className={classnames("text-18 font-bold dark:text-white md:text-24", {
                  "italic": font === fontTypes.serif
                })}>{meaning.partOfSpeech}</p>
                <div className="ml-4 grow border-t border-gray-200 dark:border-gray-400" />
              </div>
              <div className="mt-8 md:mt-10">
                <p className="text-gray-300 md:text-20">Meaning</p>
                <ul className="mt-4 pl-4 list-disc md:mt-6 md:pl-9">
                  {meaning.definitions.map((definition, index) => (
                    <li key={index} className="mt-3 first:mt-0 text-purple">
                      <p className="text-gray-500 dark:text-white md:text-18">{definition.value}</p>
                      {definition.example && (
                        <p className="mt-3 text-gray-300 md:text-18">&#8220;{definition.example}&#8221;</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {(meaning.synonyms.length > 0) && (
                <p className="mt-6 md:mt-10 lg:mt-16">
                  <span className="text-gray-300 md:text-20">Synonyms</span>
                  <span className="ml-6">
                    {meaning.synonyms.map((synonym, index) => (
                      <button
                        type="button"
                        onClick={() => handleSynonymClick(synonym)}
                        key={index}
                        className="mr-3 font-bold text-purple md:text-20"
                      >
                        {synonym}
                      </button>
                    ))}
                  </span>
                </p>
              )}
            </div>
          ))}
          {(word.sourceUrls.length > 0) && (
            <div className="mt-8 border-t md:mt-10 pt-6 md:pt-5 md:flex">
              <p className="text-14">
                <span className="border-b border-gray-300 text-gray-300">Source</span>
              </p>
              <div className="mt-2 md:ml-5 md:mt-0">
                {word.sourceUrls.map((url, index) => (
                  <p key={index} className="mt-1 first:mt-0 flex items-center text-14">
                    <a href={url} target="_blank" className="dark:text-white underline">{url}</a>
                    <img src={newWindowIcon} className="w-3 ml-2" />
                  </p>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {notFoundErrorVisible && (
        <div className="mt-[132px]">
          <img src={confusedEmojiIcon} className="w-10 mx-auto md:w-14 lg:w-16" />
          <p className="mt-6 text-center font-bold text-16 dark:text-white md:mt-8 md:text-20 lg:mt-11">No definitions found</p>
          <p className="mt-3 text-center text-gray-300 text-14 md:mt-4 md:text-18 lg:mt-6">Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.</p>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById("app")
const root = createRoot(container)
root.render(<App />)