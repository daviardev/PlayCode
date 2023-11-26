import { useRef } from 'react'

import { $$ } from './libs/dom'

import Editor from '@monaco-editor/react'

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
  }

  const ShowResult = () => {
    $$('#output').innerHTML = ''

    const code = editorRef.current.getValue()
    const lines = code.trim().split(/\r?\n|\r|\n/g).length

    $$('#output').innerHTML = '\n'.repeat(lines - 1)

    try {
      const html = eval(code)

      if (!html && html !== false && html !== 0) {
        $$('#output').innerHTML = ''
      }

      switch (typeof html) {
        case 'object':
          $$('#output').innerHTML += JSON.stringify(html)
          break

        case 'string':
          $$('#output').innerHTML += `'${html}'`
          break

        case 'function':
          $$('#output').innerHTML += html()
          break

        default:
          $$('#output').innerHTML += html
          break
      }
    } catch (err) {
      $$('#output').innerHTML += err
    }
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
