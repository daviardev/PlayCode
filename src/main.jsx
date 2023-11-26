import ReactDOM from 'react-dom/client'

import App from './App.jsx'

import { $$ } from './libs/dom.js'

import './index.css'

ReactDOM.createRoot($$('#root')).render(
  <App />
)
