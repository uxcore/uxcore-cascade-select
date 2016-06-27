/**
 * CascadeSelect Component for uxcore
 * @author changming
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
const React = require('react');
class CascadeSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>uxcore-cascade-select component</div>
    );
  }
}

CascadeSelect.defaultProps = {
};


// http://facebook.github.io/react/docs/reusable-components.html
CascadeSelect.propTypes = {
};

CascadeSelect.displayName = 'CascadeSelect';

module.exports = CascadeSelect;
