import React from 'react'

export default function TimeSlider({value,onChange}){
  return (
    <div style={{width:320, background:'rgba(0,0,0,0.35)',padding:8,borderRadius:8}}>
      <input
        aria-label="Forecast time slider"
        type="range"
        min={0}
        max={24}
        value={value}
        onChange={(e)=>onChange(Number(e.target.value))}
        style={{width:'100%'}}
      />
      <div style={{color:'#cfe7ff',marginTop:6}}>Hour: {value}</div>
    </div>
  )
}
