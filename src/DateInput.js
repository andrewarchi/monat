import React from 'react';
import Input from '@material-ui/core/Input';
import { Monat, MDY, YMD, sanitizeDelims } from './monat';

class DateInput extends React.Component {
  monat = new Monat(MDY, YMD);
  state = {
    value: '',
    savedValue: '',
    date: {}
  };

  setDate(dates, value) {
    if (dates.length === 1) {
      this.setState({ value: dates[0].toString(), date: dates[0] });
    }
    else {
      this.setState({ value: sanitizeDelims(value), date: {} });
    }
  }

  handleChange = e => {
    this.setDate(this.monat.parseNumeric(e.target.value), e.target.value);
  }

  handlePaste = e => {
    if (this.state.value === '' || (e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length)) {
      const clipboard = e.clipboardData.getData('Text');
      this.setDate(this.monat.parseDelimited(clipboard), clipboard);
    }
    e.preventDefault();
  }

  handleKeyDown = e => {
    const { value, selectionStart, selectionEnd } = e.target;
    if (selectionStart === selectionEnd) {
      const key = e.key;
      const code = e.keyCode;
      if (key === '/' || code === 111 || code === 191 || key === '-' || code === 109 || code === 189) {
        this.setDate(this.monat.insertDelim(value, selectionStart), value);
        e.preventDefault();
      }
      else if (key === 'Backspace' || code === 8) {
        if (this.monat.isDelim(value.charAt(selectionStart - 1))) {
          this.setCaretPosition(e.target, selectionStart - 1);
        }
      }
      else if (key === 'Escape' || key === 'Esc' || code === 27) {
        this.setState({ value: this.state.savedValue });
      }
      //key === 'ArrowUp' || code === 38
      //key === 'ArrowDown' || code === 40
    }
  }

  handleFocus = e => {
    e.target.select();
    this.setState({ savedValue: this.state.value });
  }

  handleBlur = e => {
    this.setDate(this.monat.setCompleted(e.target.value), e.target.value);
  }

  setCaretPosition(elem, position) {
    if (elem.createTextRange) {
      const range = elem.createTextRange();
      range.move('character', position);
      range.select();
    }
    else if (elem.setSelectionRange) {
      elem.setSelectionRange(position, position);
    }
  }

  render() {
    return (
      <Input
        value={this.state.value}
        placeholder="M/D/Y or Y-M-D"
        onChange={this.handleChange}
        onPaste={this.handlePaste}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  }
}

export default DateInput;
