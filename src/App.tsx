import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import CanvasSurface from './components/CanvasSurface'

function App() {
  return (
    <ReactFlowProvider>
      <CanvasSurface />
    </ReactFlowProvider>
  )
}

export default App
