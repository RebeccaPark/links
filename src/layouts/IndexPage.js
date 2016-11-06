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
      contentRows: [],
      cursorLocation: {
        x: 0,
        y: 0,
      },
    };
  }

  onKeyPress(e) {
    const { contentRows } = this.state;
    const { y } = this.state.cursorLocation;
    if (e.keyCode === 13) {
	this.setState({ cursorLocation: { y: y + 1 } });
        return;
    }

    if (contentRows.length >= y && !contentRows[y]) {
      contentRows[y] = '';
    }
    
    contentRows[y] += String.fromCharCode(e.keyCode);
    this.setState({ contentRows });
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
    const { focused, contentRows } = this.state;
    return (
      <div
        {...classes()}
        tabIndex={-1}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <div {...classes('cursor', focused ? 'is-blinking' : '')}></div>
        <div {...classes('view')}>
          {contentRows.map((row, i) => <div key={i}>{row}</div>)}
        </div>
      </div>
    );
  }
}

export default IndexPage;
