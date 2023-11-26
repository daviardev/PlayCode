import { useRef } from 'react'

import { $$ } from './libs/dom'

import Split from 'react-split'
import Editor from '@monaco-editor/react'

import packageVersion from '../package.json'

import { useWindowSize } from './hooks/useWindowSize'

import { encode, decode } from 'js-base64'

const UpdateURL = code => {
  const hashedCode = encode(code)
  window.history.replaceState(null, null, `/${hashedCode}`)
}

const { version } = packageVersion

const { pathname } = window.location

const hashCode = pathname.slice(1)

const WIDTH_MOBILE = 480

const DEFAULT_VALUE = hashCode
  ? decode(hashCode)
  : `// Bienvenido a JS Play Code - Un Playground de JavaScript en la Web
  
const HelloWorld = () => '👋🌎'
HelloWorld()`

let throttlePause

const Throttle = (callback, time) => {
  if (throttlePause) return

  throttlePause = true

  setTimeout(() => {
    callback()
    throttlePause = false
  }, time)
}

const App = () => {
  const editorRef = useRef(null)
  const size = useWindowSize()

  const isMobile = size.width < WIDTH_MOBILE

  const HandleInit = editor => {
    editorRef.current = editor
    editor.focus()

    editor.getValue() && ShowResult()
  }

  const ShowResult = () => {
    const code = editorRef.current.getValue()
    UpdateURL(code)

    if (!code) {
      $$('#output').innerHTML = ''
      return
    }

    const lines = code.trim().split(/\r?\n|\r|\n/g).length
    let result = isMobile ? '' : '\n'.repeat(lines - 1)

    try {
      const html = eval(code)

      switch (typeof html) {
        case 'object':
          result += JSON.stringify(html)
          break

        case 'string':
          result += `'${html}'`
          break

        case 'function':
          result += html()
          break

        default:
          result += html
          break
      }
    } catch (err) {
      result += err
    }
    $$('#output').innerHTML = result
  }

  const HandleEditorChange = () => {
    Throttle(ShowResult, 500)
  }
  return (
    <>
      <Split
        className='split'
        direction={isMobile ? 'vertical' : 'horizontal'}
        minSize={200}
        gutterSize={isMobile ? 6 : 2}
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
      <div className='version'>v.{version}</div>
    </>
  )
}

export default App
