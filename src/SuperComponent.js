const React = require('react');

class SuperComponent extends React.Component {
  prefixCls(name) {
    const {prefixCls} = this.props;
    return `${prefixCls}-${name}`;
  }
}

export default SuperComponent;
