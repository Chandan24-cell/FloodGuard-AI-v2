import React, {useState} from 'react'
import MapContainer from './components/MapContainer'
import TimeSlider from './components/TimeSlider'

export default function App(){
  const [timestamp, setTimestamp] = useState(0)
  return (
    <div className="app-root">
      <MapContainer initialTimestamp={timestamp} onTimestampChange={setTimestamp} />
      <div className="controls">
        <TimeSlider value={timestamp} onChange={setTimestamp} />
      </div>
    </div>
  )
}
