const React = require('react');

class SuperComponent extends React.Component {
  prefixCls(name) {
    const { prefixCls } = this.props;
    return name.split(/\s/).map(i => `${prefixCls}-${i}`).join(' ');
  }
}

SuperComponent.propTypes = {
  prefixCls: React.PropTypes.string,
};

export default SuperComponent;
