import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import strings from '../strings'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

const MenuItem = styled.div`
  margin-left: 1em;
  padding: 20px;
  cursor: pointer;
  
  a {
    padding: 20px;
    color: white;
    text-decoration: none;
  }

  :hover {
    border-bottom: 4px white solid;
  }

  ${(props) => props.active && css`
    border-bottom: 4px white solid;
  `}
`

const getUrl = () => window.location.pathname

export default (props) => {
  return (
    <React.Fragment>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='title' color='inherit'>{strings.TITLE}</Typography>
          <MenuItem active={getUrl() === '/'}><Link to='/'>Synchronize Facilities</Link></MenuItem>
          <MenuItem active={getUrl() === '/migrations'}><Link to='/migrations'>Migrate DHAMIS Data</Link></MenuItem>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}