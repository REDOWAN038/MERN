import React from 'react'

const Footer = () => {
  return (
    <footer className='footer flex-space-around'>
        <div className='flex-space-around'>
            <form action="submit">
                <label htmlFor="subscribe">Subscribe to Newsletter : </label>
                <input type="email" name="subscribe" id="subscribe" placeholder='your email address' className='footer_input' />
                <button type="submit" className='btn'>Subscribe</button>
            </form>
        </div>
        <div>
            <p>&copy; Copyright 2024 RED2724. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer