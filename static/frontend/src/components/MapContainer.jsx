import React, {useEffect, useRef, useState} from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.REACT_APP_MAPBOX_TOKEN || ''

export default function MapContainer({initialTimestamp}){
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(()=>{
    if(!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [78.9629,20.5937],
      zoom: 4,
      pitch: 45,
      bearing: -10,
      antialias: true
    })

    map.on('load', ()=>{
      // DEM terrain (Mapbox provided) — requires token with terrain tiles
      try{
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.terrain-rgb',
          'tileSize': 512
        })
        map.setTerrain({source:'mapbox-dem',exaggeration:1.0})

        map.addLayer({
          'id':'sky',
          'type':'sky',
          'paint':{
            'sky-type':'atmosphere',
            'sky-atmosphere-sun-intensity':10
          }
        })
      }catch(e){
        // if terrain source or token not available, ignore
        console.warn('Terrain not applied', e)
      }

      // Placeholder vector source - replace with your vector tile endpoint or GeoJSON
      // Example: Mapbox tileset: 'mapbox://yourusername.yourtileset'
      map.addSource('flood-polygons', {
        type: 'geojson',
        data: {
          "type":"FeatureCollection",
          "features":[]
        }
      })

      map.addLayer({
        id: 'flood-extrusion',
        type: 'fill-extrusion',
        source: 'flood-polygons',
        paint: {
          'fill-extrusion-color': ['interpolate',['linear'],['get','predicted_depth_m'],0,'#00ffff',1,'#0077ff',2,'#ff7f00',5,'#ff0000'],
          'fill-extrusion-height': ['*',['get','predicted_depth_m'],1.0],
          'fill-extrusion-opacity': 0.7
        }
      })

      // Simple popup on hover
      const popup = new mapboxgl.Popup({closeButton:false,closeOnClick:false})
      map.on('mousemove','flood-extrusion',(e)=>{
        if(!e.features || !e.features.length) return
        const feat = e.features[0]
        const depth = feat.properties?.predicted_depth_m ?? '—'
        const pop = feat.properties?.affected_population ?? '—'
        popup.setLngLat(e.lngLat).setHTML(`<b>Depth:</b> ${depth} m<br/><b>Affected:</b> ${pop}`).addTo(map)
      })
      map.on('mouseleave','flood-extrusion',()=>popup.remove())

      mapRef.current = map
      setMapReady(true)
    })

    return ()=> map.remove()
  },[])

  // Example: update query/filter based on timestamp — depends on how your source encodes time
  useEffect(()=>{
    if(!mapRef.current) return
    const map = mapRef.current
    try{
      map.setFilter('flood-extrusion',['==',['get','timestamp'], initialTimestamp])
    }catch(e){
      // setFilter may fail if feature property not present — it's okay for prototype
    }
  },[initialTimestamp])

  return (
    <div className="map-root">
      <div className="map-container" ref={containerRef} style={{height:'100vh'}} />
      <div className="info-card">Premium 3D Map Prototype — Mapbox GL JS</div>
    </div>
  )
}
