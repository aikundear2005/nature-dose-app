import React from 'react' // 建議保留這行
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 新增這一行
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 用 BrowserRouter 把 App 包起來 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)