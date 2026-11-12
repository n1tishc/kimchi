import { useState } from 'react'
import './app.css'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { WorkflowPage } from './pages/WorkflowPage'

export default function App() {
  const [view, setView] = useState('home')
  const [workflowKey, setWorkflowKey] = useState(0)
  // Lifted out of WorkflowPage so a "New dish" remount resets the rest of the
  // workflow but leaves the cuisine choice in place, matching the original.
  const [cuisine, setCuisine] = useState('any')

  function goHome() {
    setView('home')
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  function beginCooking() {
    setView('workflow')
    window.requestAnimationFrame(() => {
      document.querySelector('#workflow')?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  function startOver() {
    setWorkflowKey((key) => key + 1)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  return (
    <div className="min-h-[100svh] pb-24 bg-ground">
      <a
        className="fixed top-2 left-2 z-20 px-3.5 py-2.5 text-paper-fixed bg-ink-fixed font-bold -translate-y-[160%] transition-transform duration-150 focus:translate-y-0"
        href={view === 'home' ? '#how-it-works' : '#workflow'}
      >
        Skip to content
      </a>
      {/* The whole page is one cloth: every section below is pieced onto the last. */}
      <div className="w-[min(100%-20px,1440px)] mx-auto">
        <Header view={view} onGoHome={goHome} onPrimaryAction={view === 'home' ? beginCooking : startOver} />
        <HomePage hidden={view !== 'home'} onStartCooking={beginCooking} />
        <WorkflowPage
          key={workflowKey}
          hidden={view !== 'workflow'}
          onStartOver={startOver}
          cuisine={cuisine}
          onCuisineChange={setCuisine}
        />
      </div>
    </div>
  )
}
