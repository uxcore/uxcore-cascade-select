const React = require('react');

class SuperComponent extends React.Component {
  prefixCls(name) {
    const { prefixCls } = this.props;
    return `${prefixCls}-${name}`;
  }
}

SuperComponent.propTypes = {
  prefixCls: React.PropTypes.string,
};

export default SuperComponent;
