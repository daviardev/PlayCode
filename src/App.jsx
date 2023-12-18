import { useRef, useState } from 'react'

import Header from '@/components/Header'
import Button from '@/components/Button'
import Share from '@/components/Share'
import Footer from '@/components/Footer'
import Console from '@/components/Console'
import Embed from '@/components/Embed'

import { DEFAULT_VALUE, WIDTH_MOBILE, EDITOR_OPTIONS } from './const'

import { FormatIcon, DownloadIcon } from '@/components/Icons'

import Split from 'react-split'
import Editor from '@monaco-editor/react'

import { useWindowSize } from '@/hooks/useWindowSize'

import { Toaster } from 'sonner'
import { encode, decode } from 'js-base64'

const App = () => {
  const editorRef = useRef(null)
  const size = useWindowSize()

  const isMobile = size.width < WIDTH_MOBILE
  const direction = isMobile ? 'vertical' : 'horizontal'
  const gutterSize = isMobile ? 6 : 3

  const [lines, setLines] = useState(0)
  const [result, setResult] = useState('')

  window.console.log = (...data) => {
    return ParseResultHTML(...data)
  }

  const GetCodeFromURL = () => {
    try {
      const { pathname } = window.location

      const hashCode = pathname.slice(1)

      return hashCode ? decode(hashCode) : null
    } catch (err) {
      console.error(err)
    }
  }

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
    const editor = editorRef.current
    editor.current.getAction('editor.action.formatDocument').run()
  }

  const HandleInit = (editor) => {
    editorRef.current = editor
    editor.focus()

    editor.getValue() && ShowResult()
  }

  const DownloadCode = () => {
    const editor = editorRef.current
    const code = editor.getValue()
    const blob = new Blob([code], {
      type: 'text/plain'
    })

    const url = window.URL.createObjectURL(blob)
    const links = document.createElement('a')

    links.download = 'main.js'
    links.href = url
    links.click()
  }

  const ShowResult = () => {
    const editor = editorRef.current
    const code = editor.getValue()

    UpdateURL(code)

    if (!code) {
      setResult('')
      return
    }
    let result = ''
    let prevLines = ''
    let prevResult = ''

    setLines(code.split(/\r?\n|\r|\n/g).length)

    code
      .trimEnd()
      .split(/\r?\n|\r|\n/g)
      .reduce((acc, line) => {
        if (line.trim() === '') {
          result += '\n'
          return acc + '\n'
        }

        const lineCode = acc + line

        if (
          line ||
          line === '' ||
          !line.startsWith(/\/\//) ||
          !line.startsWith(/\/*/)
        ) {
          try {
            const html = eval(lineCode)

            if (prevLines !== '' && line !== '' && prevLines !== line && prevResult === html) {
              result += '\n'
            } else {
              result += ParseResultHTML(html) + '\n'
            }
            prevResult = html
          } catch (err) {
            if (err.toString().match(/ReferenceError/gi)) {
              result += err
            }
            result += '\n'
          }
        }

        prevLines = line
        return lineCode + '\n'
      }, '')

    setResult(result)
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
      <Toaster
        duration={1000}
        position='top-center'
      />
      <Header />
      <div className='toolbar'>
        <Share />
        <Embed />
      </div>
      <Split
        className='split'
        direction={direction}
        minSize={200}
        gutterSize={gutterSize}
      >
        <div>
          <Editor
            className='editor'
            language='javascript'
            theme='vs-dark'
            defaultValue={GetCodeFromURL() || DEFAULT_VALUE}
            onMount={HandleInit}
            onChange={HandleEditorChange}
            loading=''
            options={EDITOR_OPTIONS}
          />
          <div className='editor-toolbar'>
            <Button
              onClick={FormatDocument}
              title='Dar formato'
            >
              <FormatIcon />
              <span className='hidden sm:block'>Dar formato</span>
            </Button>
            <Button
              onClick={DownloadCode}
              title='Descar el código en un archivo'
            >
              <DownloadIcon />
              <span className='hidden sm:block'>Descargar</span>
            </Button>
          </div>
        </div>
        <Console
          lines={lines}
          result={result}
        />
      </Split>
      <Footer />
    </>
  )
}

export default App
