import React, { Component, PropTypes } from 'react';
import BEMHelper from 'react-bem-helper';

const TAB_SPACES = 4;

const classes = new BEMHelper({
  name: 'IndexPage'
});

export class IndexPage extends Component {
  constructor() {
    super();

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onArrowPress = this.onArrowPress.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      focused: false,
      contentRows: [],
      cursorLocation: {
        x: 0,
        y: 0,
      },
    };
  }

  onArrowPress(e) {
    const { contentRows } = this.state;
    const { x, y } = this.state.cursorLocation;

    if (e.keyCode === 8) {
        console.log(x,contentRows[y].length);
        if (x === contentRows[y].length) {
            contentRows[y] = contentRows[y].substring(0, contentRows[y].length - 1);
	    console.log(contentRows[y]);
	    this.setState({ contentRows, cursorLocation: { y, x: x - 1 } });
	    return;
        } else if (x < contentRows[y].length && x !== 0) {
	    const rightSide = contentRows[y].substring(x + 1, contentRows[y].length);
	    const leftSide = contentRows[y].substring(0, x-1);
	    contentRows[y] = leftSide + rightSide;
	    console.log(contentRows[y]);
	    this.setState({ contentRows, cursorLocation: { y, x: x - 1} });
	    return;
	} else if (x === 0) {
	    if (y === 0) {
		return;
	    } else { 
		if (contentRows[y].length > 0) {
		    const remain = contentRows[y].substring(0, contentRows[y].length);
		    contentRows[y-1] += remain;
		    contentRows.splice(y,1);
		    this.setState({ contentRows, cursorLocation: { x: contentRows[y].length,  y: y - 1 } }) ;
		    return;
		} else {
		    contentRows.splice(y,1);
		    this.setState({ contentRows, cursorLocation: { x: contentRows[y].length, y: y - 1} });
		    return;
		}
	    }
	}
    }

    // tab: prevent from escaping
    if (e.keyCode === 9) {
      e.preventDefault();
      for (let i = 0; i < TAB_SPACES; i += 1) {
        this.onKeyPress({ keyCode: 32, preventDefault() {} });
      }
    }

    // left: decrement x
    if (e.keyCode === 37) {
      // Prevent scroll effects.
      e.preventDefault();

      // If beginning of line, go to end of previous line.
      if (x === 0) {
        // Beginning of file, do nothing.
        if (y === 0) {
          return;
        }

        const previousLine = contentRows[y - 1];
        this.setState({ cursorLocation: { y: y -1, x: previousLine.length } });
        return;
      }

      // Simple case: decrement x.
      this.setState({ cursorLocation: { y, x: x - 1 } });
      return;
    }

    // right: increment x
    if (e.keyCode === 39) {
      // Prevent scroll effects.
      e.preventDefault();

      if (x === contentRows[y].length) {
        // End of file, do nothing.
        if (y + 1 === contentRows.length) {
          return;
        }

        // End of line, go to next line.
        this.setState({ cursorLocation: { x: 0, y: y + 1 } });
        return;
      }

      // Simple case: increment 1.
      this.setState({ cursorLocation: { y, x: x + 1 } });
    }

    // up: decrement y
    if (e.keyCode === 38) {
      // Prevent scroll effects.
      e.preventDefault();

      // Beginning of file, do nothing.
      if (y === 0) {
        return;
      }

      if (contentRows[y - 1].length < x) {
        this.setState({ cursorLocation: { x: contentRows[y - 1].length, y: y - 1 } });
        return;
      }

      this.setState({ cursorLocation: { x, y: y - 1 } });
      return;
    }

    if (e.keyCode === 40) {
      // Prevent scroll effects.
      e.preventDefault();

      // End of file, do nothing.
      if (y + 1 === contentRows.length) {
        return;
      }

      if (contentRows[y + 1].length < x) {
        this.setState({ cursorLocation: { x: contentRows[y + 1].length, y: y + 1 } });
        return;
      }

      this.setState({ cursorLocation: { x, y: y + 1 } });
      return;
    }
  }

  onKeyPress(e) {
    const { contentRows } = this.state;
    const { x, y } = this.state.cursorLocation;
    const code = e.keyCode || e.charCode;

    // return: increment y and reset x to zero
    if (code === 13) {
      if (x === contentRows[y].length) { // Insert new empty row
        contentRows.splice(y + 1, 0, '');
      } else { // Insert new row containing rest of line
        const restOfLine = contentRows[y].slice(x);
        contentRows[y] = contentRows[y].substring(0, contentRows[y].length - restOfLine.length);
        contentRows.splice(y + 1, 0, restOfLine);
      }

      this.setState({ contentRows, cursorLocation: { x: 0, y: y + 1 } });
      return;
    }

    if (code === 32) {
      // Stop page from jumping down.
      e.preventDefault();
    }

    if (contentRows.length >= y && !contentRows[y]) {
      contentRows[y] = '';
    }

    // Insert the character into the location specifed by the cursor.
    let currentRow = contentRows[y];
    const character = String.fromCharCode(code);
    if (x === currentRow.length) {
      currentRow += character;
    } else if (x === 0) {
      currentRow = character + currentRow;
    } else {
      const before = currentRow.substring(0, x);
      const after = currentRow.substring(x);
      currentRow = before + character + after;
    }
    contentRows[y] = currentRow;

    this.setState({ contentRows, cursorLocation: { y, x: x + 1 } });
  }

  onFocus() {
    this.setState({ focused: true });
    document.addEventListener('keypress', this.onKeyPress);
    // Arrow events are only triggered on keydown.
    document.addEventListener('keydown', this.onArrowPress);
  }

  onBlur() {
    this.setState({ focused: false });
    document.removeEventListener('keypress', this.onKeyPress);
  }

  renderRow(row, i) {
    const { focused, cursorLocation: { x, y } } = this.state;
    const isCursorRow = i === y && focused;

    const renderLetter = (letter, key) =>
      <span {...classes('letter', isCursorRow && key === x ? 'is-cursor' : '')} key={key}>{letter}</span>;
    return (
      <div key={i} {...classes('row')}>
        {row.split('').map(renderLetter)}
        {isCursorRow && row.length <= x ? renderLetter('', x) : null}
      </div>
    );
  }

  render() {
    const { focused, contentRows, cursorLocation: { y } } = this.state;
    return (
      <div
        {...classes()}
        tabIndex={-1}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        <div {...classes('view')}>
          {contentRows.map(this.renderRow)}
          {!contentRows.length && focused ? this.renderRow('', 0) : null}
        </div>
      </div>
    );
  }
}

export default IndexPage;
