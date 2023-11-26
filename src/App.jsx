import { useRef } from 'react'

import { $$ } from './libs/dom'

import Editor from '@monaco-editor/react'

const DEFAULT_VALUE = `
// Bienvenido a JS Play Code - Un Playground de JavaScript en la Web

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

  const HandleInit = editor => {
    editorRef.current = editor
    editor.focus()

    editor.getValue() && ShowResult()
  }

  const ShowResult = () => {
    const code = editorRef.current.getValue()
    const lines = code.trim().split(/\r?\n|\r|\n/g).length

    if (!code) {
      $$('#output').innerHTML = ''
      return
    }

    let result = window.innerWidth > 860 ? '\n'.repeat(lines - 1) : ''

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
      <section className='container'>
        <div>
          <Editor
            className='editor'
            language='javascript'
            theme='vs-dark'
            onMount={HandleInit}
            defaultValue={DEFAULT_VALUE}
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
      </section>
    </>
  )
}

export default App
