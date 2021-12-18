
import './App.css';
import db from './firebase';
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import Map from './Map';
import { findNearest, orderByDistance } from 'geolib'

function App() {
  const [busevi, setBusevi] = useState([])
  const [stanice, setStanice] = useState([])

  const [firstLocation, setFirstLocation] = useState()
  const [secondLocation, setSecondLocation] = useState()

  const [nearestA, setNearestA] = useState()
  const [nearestB, setNearestB] = useState()
  const [orderedStationsA, setOrderedStationsA] = useState()
  const [orderedStationsB, setOrderedStationsB] = useState()


  const [foundedBus, setFoundedBus] = useState()
  const [filteredBuses, setFilteredBuses] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      const dataBusevi = await getDocs(collection(db, 'busevi'))
      setBusevi(dataBusevi.docs.map(doc => ({...doc.data(), id: doc.id})))

      const dataStanice = await getDocs(collection(db, 'stanice'))
      setStanice(dataStanice.docs.map(doc => ({...doc.data()})))
    }
    fetchData();
  }, [])

  useEffect(() => {
    if(firstLocation, secondLocation)
    findNearestStations()
  }, [firstLocation, secondLocation])

  const findNearestStations = () => {
    const x = orderByDistance({...firstLocation}, //Users nearest station
      stanice.map(stanica => ({
        latitude: stanica.location.latitude,
        longitude: stanica.location.longitude
      }))
    )
    setOrderedStationsA(x)
    const y = orderByDistance({...secondLocation}, //Selected place nearest station
      stanice.map(stanica => ({
        latitude: stanica.location.latitude,
        longitude: stanica.location.longitude
      }))
    )
    setOrderedStationsB(y)

    //After we got a location of the nearest one, lets get its name ↓
    stanice.map(stanica => {  //setNearestA(stanica) setNearestB(stanica)
      if((stanica.location.longitude, stanica.location.latitude) === (x[0].longitude,x[0].latitude)) {
        setNearestA(stanica)
      }
      else if ((stanica.location.longitude, stanica.location.latitude) === (y[0].longitude,y[0].latitude)) {
        setNearestB(stanica)
      }
    })
  }
  useEffect(() => {
    if(nearestA && nearestB) {
      getBus()
    }
  }, [nearestA, nearestB])

  const getBus = () => { //setFoundedBus(bus)
    const reqBusevi = busevi.filter(bus => bus.stanice.includes(nearestA.name && nearestB.name))
    if(reqBusevi === null) {

    }else {
      setFoundedBus(reqBusevi[0])
      setFilteredBuses(reqBusevi)
    }
    
  }
  return (
    <div className="app">
      {filteredBuses.map(bus => (
        <h2 key={bus.id} >{bus.name}</h2>
      ))}
      <div className="map">
        <Map stanice = {stanice} foundedBus = {foundedBus} firstLocation = {firstLocation} setFirstLocation = {setFirstLocation} secondLocation = {secondLocation} setSecondLocation = {setSecondLocation} nearestA = {nearestA} nearestB = {nearestB} />
      </div>
    </div>
  );
}

export default App;
