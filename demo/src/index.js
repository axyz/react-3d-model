import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>react-3d-model Demo</h1>
      <Example updateOnResize style={{ width: '100%', height: '480px' }}/>
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
      <br / >
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
