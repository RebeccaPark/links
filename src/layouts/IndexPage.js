import React, { Component, PropTypes } from 'react';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'IndexPage'
});

export class IndexPage extends Component {
  constructor() {
    super();

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);

    this.state = {
      focused: false,
      viewContent: '',
    };
  }

  onKeyPress(e) {
    this.setState({ viewContent: this.state.viewContent + String.fromCharCode(e.keyCode) });
  }

  onFocus() {
    this.setState({ focused: true });
    document.addEventListener('keypress', this.onKeyPress);
  }

  onBlur() {
    this.setState({ focused: false });
    document.removeEventListener('keypress', this.onKeyPress);
  }

  render() {
    return (
      <div
        {...classes()}
        tabIndex={-1}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <div {...classes('cursor', this.state.focused ? 'is-blinking' : '')}></div>
        <div {...classes('view')}>{this.state.viewContent}</div>
      </div>
    );
  }
}

export default IndexPage;
