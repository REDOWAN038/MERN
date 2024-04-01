import React from 'react'
import PageTitle from '../components/PageTitle'
import Sidebar from '../components/Sidebar'

const Home = () => {
  return (
    <>
        <PageTitle title='Home' />
        <div className="container flex-space-around">
            <div className='sidebar-container'>
                <Sidebar/>
            </div>
            <div className='main-container'>
                <h1>Products</h1>
            </div>
        </div>
    </>
  )
}

export default Home