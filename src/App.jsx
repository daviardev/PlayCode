import { useRef } from 'react'

import { $$ } from './libs/dom'

import Header from './components/Header'

import Split from 'react-split'
import Linter from 'monaco-js-linter'
import Editor from '@monaco-editor/react'

import { useWindowSize } from './hooks/useWindowSize'

import { encode, decode } from 'js-base64'

const App = () => {
  const editorRef = useRef(null)
  const size = useWindowSize()
  const WIDTH_MOBILE = 480

  let linter

  const isMobile = size.width < WIDTH_MOBILE

  window.console.log = (...data) => {
    return ParseResultHTML(...data)
  }

  const GetCodeFromURL = () => {
    try {
      const { pathname } = window.location
      const hashCode = pathname.slice(1)
      return hashCode ? decode(hashCode) : null
    } catch {
      return null
    }
  }

  const DEFAULT_VALUE = GetCodeFromURL() || `// Bienvenido a JS Play Code - Un Playground de JavaScript en la Web
  
  const HelloWorld = () => '👋🌎'
  HelloWorld()
`

  let throttlePause

  const UpdateURL = code => {
    const hashedCode = encode(code)
    window.history.replaceState(null, null, `/${hashedCode}`)
  }

  const Throttle = (callback, time) => {
    if (throttlePause) return

    throttlePause = true

    setTimeout(() => {
      callback()
      throttlePause = false
    }, time)
  }

  const FormatDocument = () => {
    editorRef.current.getAction('editor.action.formatDocument').run()
  }

  const HandleInit = (editor, monaco) => {
    editorRef.current = editor

    linter = new Linter(editor, monaco, {
      esversion: 11
    })
    editor.focus()

    editor.getValue() && ShowResult()
  }

  const ToggleLinter = () => {
    linter.watch()
  }

  const ShowResult = () => {
    const code = editorRef.current.getValue()
    UpdateURL(code)

    if (!code) {
      $$('#output').innerHTML = ''
      return
    }
    let result = ''

    code
      .trimEnd()
      .split(/\r?\n|\r|\n/g)
      .reduce((acc, line) => {
        if (line.trim() === '') {
          result += '\n'
          return acc + '\n'
        }

        const htmlPart = acc + line

        if (
          line ||
          line === '' ||
          !line.startsWith(/\/\//) ||
          !line.startsWith(/\/*/)
        ) {
          try {
            const html = eval(htmlPart)
            result += ParseResultHTML(html) + '\n'
          } catch (err) {
            if (err.toString().match(/ReferenceError/gi)) {
              result += err
            }
            result += '\n'
          }
        }
        return htmlPart + '\n'
      }, '')

    $$('#output').innerHTML = result
  }

  const ParseResultHTML = html => {
    if (typeof html === 'object') {
      return JSON.stringify(html)
    }
    if (typeof html === 'string') {
      if (html.match(/^[''].*['']$/)) return html
      return `'${html}'`
    }
    if (typeof html === 'function') {
      return html()
    }
    if (typeof html === 'symbol') {
      return html.toString()
    }
    if (typeof html === 'undefined') {
      return ''
    }
    return html
  }

  const HandleEditorChange = () => {
    Throttle(ShowResult, 500)
  }
  return (
    <>
      <Header />
      <div className='toolbar'>
        <button
          onClick={FormatDocument}
          title='Dar formato al documento'
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
          >
            <path d='M14 6h14v2H14zm0 6h14v2H14zm-7 6h21v2H7zm0 6h21v2H7zM4 13.59 7.29 10 4 6.41 5.42 5l4.62 5-4.62 5L4 13.59z' />
            <path
              data-name='&lt;Transparent Rectangle&gt;'
              d='M0 0h32v32H0z'
              fill='none'
            />
          </svg>
        </button>
        <button onClick={ToggleLinter} title='Dar formato'>
          Linter
        </button>
      </div>
      <Split
        className='split'
        direction={isMobile ? 'vertical' : 'horizontal'}
        minSize={200}
        gutterSize={isMobile ? 6 : 3}
      >
        <div>
          <Editor
            className='editor'
            language='javascript'
            theme='vs-dark'
            defaultValue={DEFAULT_VALUE}
            onMount={HandleInit}
            onChange={HandleEditorChange}
            loading=''
            options={{
              automaticLayout: true,
              formatOnPaste: true,
              minimap: {
                enabled: false
              },
              inlineSuggest: {
                enabled: true
              },
              overviewRulerLanes: 0,
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
                handleMouseWheel: false
              }
            }}
          />
        </div>

        <div>
          <div id='output' />
        </div>
      </Split>
    </>
  )
}

export default App
