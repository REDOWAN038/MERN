import React from 'react'
import {Helmet} from "react-helmet";


const PageTitle = (props) => {
  return (
    <div>
        <Helmet>
            <title>{props.title}</title>
        </Helmet>
    </div>
  )
}

export default PageTitle