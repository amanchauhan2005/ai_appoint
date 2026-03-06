import React from 'react'
import Header from '../components/Header'
import Specialitymenu from '../components/Specialitymenu'
import Topdoctor from '../components/Topdoctor'
import Banner from '../components/Banner'
function Home() {
  return (
    <div>
      <Header/>
      <Specialitymenu/>
      <Topdoctor/>
      <Banner/>
      
    </div>
  )
}

export default Home