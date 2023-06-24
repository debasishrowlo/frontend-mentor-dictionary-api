import React from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

const App = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between">
        <p>L</p>
        <div className="flex">
          <p>Sans Serif</p>
          <p>toggle</p>
          <p>Icon</p>
        </div>
      </div>
      <div className="mt-6 relative">
        <input type="text" className="w-full border" />
        <p className="absolute top-0 right-0">S</p>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div>
          <p>Keyboard</p>
          <p>/keyboard/</p>
        </div>
        <div>
          Play
        </div>
      </div>
      <p className="mt-7">noun</p>
      <div className="mt-8">
        <p>Meaning</p>
        <ul>
          <li>meaning1</li>
          <li>meaning2</li>
          <li>meaning3</li>
        </ul>
      </div>
      <p className="mt-6">
        <span>Synonyms</span>
        <span className="ml-6">electronic keyboard</span>
      </p>
      <p className="mt-7">noun</p>
      <div className="mt-8">
        <p>Meaning</p>
        <ul>
          <li>To Type on a keyboard</li>
        </ul>
      </div>
      <div className="mt-8 border-t">
        <p>Source</p>
        <p>
          <a href="#">https://somelink.com/asdfasdf</a>
          <span>R</span>
        </p>
      </div>
    </div>
  );
}

const container = document.getElementById("app")
const root = createRoot(container)
root.render(<App />)