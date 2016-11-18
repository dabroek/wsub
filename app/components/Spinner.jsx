import React, { Component, PropTypes } from 'react';
import SpinJS from 'spin.js';

class Spinner extends Component {
  
  componentDidMount() {
    const { color, config } = this.props;
    const spinConfig = {
      // a few sensible defaults
      width: 2,
      radius: 10,
      length: 7,
      // color should not overwrite config
      color,
      // config will overwrite anything else
      ...config,
    };

    this.spinner = new SpinJS(spinConfig);
    this.spinner.spin(this.refs.container);
  }

  componentWillUnmount() {
    this.spinner.stop();
  }

  render() {
    return <span ref="container"/>;
  }
}

Spinner.propTypes = {
  // This object is passed in wholesale as the spinner config
  config: PropTypes.object,
  // This is a quick way to overwrite just the color on the config
  color: PropTypes.string.isRequired,
}

Spinner.defaultProps = {
  config: {},
  color: 'black',
}

export default Spinner