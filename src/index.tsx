import { createRoot } from "react-dom/client"

import "./index.css"

const App = () => {
  return (
    <div className="text-30">Dictionary App</div>
  )
}

const container = document.getElementById("app")
const root = createRoot(container)
root.render(<App />)