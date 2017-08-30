import { h, Component } from 'preact';

const enum Operator {
  Divide,
  Multiply,
  Subtract,
  Add,
}

const enum Keys {
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Decimal,
  Clear,
  Negate,
  Percent,
  Divide,
  Multiply,
  Subtract,
  Add,
  Execute,
}

const keyOrder = [
  Keys.Clear,
  Keys.Negate,
  Keys.Percent,
  Keys.Divide,
  Keys.Seven,
  Keys.Eight,
  Keys.Nine,
  Keys.Multiply,
  Keys.Four,
  Keys.Five,
  Keys.Six,
  Keys.Subtract,
  Keys.One,
  Keys.Two,
  Keys.Three,
  Keys.Add,
  Keys.Zero,
  Keys.Decimal,
  Keys.Execute,
];

function keyProps(
  value: string,
  onClick: (e: Event) => void,
  className: string | string[],
) {
  return (
    <input
      type="button"
      key={value}
      value={value}
      onClick={onClick}
      class={typeof className === 'string' ? className : className.join(' ')}
    />
  );
}

export interface State {
  accumulator?: number;
  inputBuffer?: string;
  selectedOperator?: Operator;
}

export default class Calculator extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      accumulator: 0,
      inputBuffer: undefined,
      selectedOperator: undefined,
    };
  }

  handleClear = (e: Event) => {
    this.state.inputBuffer
      ? this.setState({
          inputBuffer: undefined,
          selectedOperator: undefined,
        })
      : this.setState({
          accumulator: 0,
          selectedOperator: undefined,
        });
  };

  handleNegate = (e: Event) => {
    if (this.state.accumulator || this.state.inputBuffer) {
      this.setState({
        accumulator:
          (this.state.inputBuffer
            ? Number(this.state.inputBuffer)
            : this.state.accumulator!) * -1,
        inputBuffer: undefined,
      });
    }
  };

  handlePercent = (e: Event) => {
    if (this.state.accumulator || this.state.inputBuffer) {
      this.setState({
        accumulator:
          (this.state.inputBuffer
            ? Number(this.state.inputBuffer)
            : this.state.accumulator!) / 100,
        inputBuffer: undefined,
      });
    }
  };

  handleNumber = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    if (this.state.inputBuffer) {
      this.setState({ inputBuffer: this.state.inputBuffer + value });
    } else if (value !== '0') {
      this.setState({ inputBuffer: value });
    }
  };

  handleDecimal = (e: Event) => {
    if (!this.state.inputBuffer) {
      this.setState({ inputBuffer: '0.' });
    } else if (!this.state.inputBuffer.includes('.')) {
      this.setState({ inputBuffer: this.state.inputBuffer + '.' });
    }
  };

  handleOperator = (e: Event) => {
    const { accumulator, inputBuffer, selectedOperator } = this.state;
    if (accumulator && inputBuffer && selectedOperator) {
      this.setState({
        accumulator: this.apply(accumulator, inputBuffer, selectedOperator),
        inputBuffer: undefined,
        selectedOperator: this.pickOperator(e),
      });
    } else if (inputBuffer) {
      this.setState({
        accumulator: Number(inputBuffer),
        inputBuffer: undefined,
        selectedOperator: this.pickOperator(e),
      });
    } else {
      this.setState({
        selectedOperator: this.pickOperator(e),
      });
    }
  };

  handleExecute = (e: Event) => {
    const { accumulator, inputBuffer, selectedOperator } = this.state;
    if (accumulator && inputBuffer && selectedOperator) {
      this.setState({
        accumulator: this.apply(accumulator, inputBuffer, selectedOperator),
        inputBuffer: undefined,
        selectedOperator: undefined,
      });
    } else if (inputBuffer) {
      this.setState({
        accumulator: Number(inputBuffer),
        inputBuffer: undefined,
        selectedOperator: undefined,
      });
    } else {
      this.setState({ selectedOperator: undefined });
    }
  };

  pickOperator(e: Event) {
    switch ((e.target as HTMLInputElement).value) {
      case '÷':
        return Operator.Divide;
      case '✕':
        return Operator.Multiply;
      case '−':
        return Operator.Subtract;
      case '+':
        return Operator.Add;
    }
  }

  apply(accumulator: number, inputBuffer: string, selectedOperator: Operator) {
    const inputValue = Number(inputBuffer);
    switch (selectedOperator) {
      case Operator.Divide:
        return accumulator / inputValue;
      case Operator.Multiply:
        return accumulator * inputValue;
      case Operator.Subtract:
        return accumulator - inputValue;
      case Operator.Add:
        return accumulator + inputValue;
    }
  }

  renderKeypad() {
    return keyOrder.map(key => {
      switch (key) {
        case Keys.Clear:
          return keyProps(
            this.state.inputBuffer ? 'C' : 'AC',
            this.handleClear,
            '',
          );
        case Keys.Negate:
          return keyProps('⁺∕₋', this.handleNegate, '');
        case Keys.Percent:
          return keyProps('%', this.handlePercent, '');
        case Keys.Divide:
          return keyProps('÷', this.handleOperator, '');
        case Keys.Multiply:
          return keyProps('✕', this.handleOperator, '');
        case Keys.Subtract:
          return keyProps('−', this.handleOperator, '');
        case Keys.Add:
          return keyProps('+', this.handleOperator, '');
        case Keys.Execute:
          return keyProps('=', this.handleExecute, '');
        case Keys.Decimal:
          return keyProps('.', this.handleDecimal, '');
        case Keys.Zero:
        case Keys.One:
        case Keys.Two:
        case Keys.Three:
        case Keys.Four:
        case Keys.Five:
        case Keys.Six:
        case Keys.Seven:
        case Keys.Eight:
        case Keys.Nine:
          return keyProps(String(key), this.handleNumber, '');
      }
    });
  }

  render(_: {}, { inputBuffer, accumulator }: State) {
    return (
      <div>
        <div>
          {inputBuffer ? inputBuffer : accumulator ? String(accumulator) : '0'}
        </div>
        {this.renderKeypad()}
      </div>
    );
  }
}
