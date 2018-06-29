import React from 'react';
import PropTypes from 'prop-types';


class SuperComponent extends React.Component {
  prefixCls(name) {
    const { prefixCls } = this.props;
    return name.split(/\s/).map(i => `${prefixCls}-${i}`).join(' ');
  }
}

SuperComponent.propTypes = {
  prefixCls: PropTypes.string,
};

export default SuperComponent;
