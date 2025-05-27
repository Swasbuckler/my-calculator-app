import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer( state, { type, payload } ) {
  
  switch ( type ) {

    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOutput: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === '0' && state.currentOutput === '0') {
        return state;
      }
      if (payload.digit === '.' && state.currentOutput.includes('.')) {
        return state;
      }

      return {
        ...state,
        currentOutput: `${state.currentOutput || ''}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOutput == null && state.previousOutput == null) {
        return state;
      }
      if (state.currentOutput == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOutput == null) {
        return {
          ...state,
          currentOutput: null,
          previousOutput: state.currentOutput,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        currentOutput: null,
        previousOutput: evaluate( state ),
        operation: payload.operation,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOutput: null,
          overwrite: false,
        };
      }
      if (state.currentOutput == null) {
        return state;
      }
      if (state.currentOutput.length === 1) {
        return {
          ...state,
          currentOutput: null,
        };
      }

      return {
        ...state,
        currentOutput: state.currentOutput.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (state.currentOutput == null || state.previousOutput == null || state.operation == null) {
        return state;
      }
    
      return {
        ...state,
        currentOutput: evaluate( state ),
        previousOutput: null,
        operation: null,
        overwrite: true,
      };

    default:
      console.log('Unexpected Action.');
      return state;

  }

}

function evaluate({ currentOutput, previousOutput, operation }) {

  const previous = parseFloat( previousOutput );
  const current = parseFloat( currentOutput );

  if (isNaN( previous ) || isNaN( current )) {
    return '';
  }

  let computation = '';
  switch (operation) {

    case '÷':
      computation = previous / current;
      break;

    case '*':
      computation = previous * current;
      break;

    case '+':
      computation = previous + current;
      break;

    case '-':
      computation = previous - current;
      break;

    default:
      console.log('Unexpected Computation');

  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

function formatOutput( output ) {
  
  if (output == null) {
    return;
  }

  const [ integer, decimal ] = output.split('.');

  if (decimal == null) {
    return INTEGER_FORMATTER.format(integer);
  }

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {

  const [ { currentOutput, previousOutput, operation }, dispatch ] = useReducer( reducer, {} );

  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-output'>
          { formatOutput(previousOutput) } { operation }
        </div>
        <div className='current-output'>
          { formatOutput(currentOutput) }
        </div>
      </div>
      <button 
        className='span-two'
        onClick={ () => dispatch({ type: ACTIONS.CLEAR }) }
      >
        AC
      </button>
      <button
        onClick={ () => dispatch({ type: ACTIONS.DELETE_DIGIT }) }
      >
        DEL
      </button>
      <OperationButton operation='÷' dispatch={ dispatch } />
      <DigitButton digit='1' dispatch={ dispatch } />
      <DigitButton digit='2' dispatch={ dispatch } />
      <DigitButton digit='3' dispatch={ dispatch } />
      <OperationButton operation='*' dispatch={ dispatch } />
      <DigitButton digit='4' dispatch={ dispatch } />
      <DigitButton digit='5' dispatch={ dispatch } />
      <DigitButton digit='6' dispatch={ dispatch } />
      <OperationButton operation='+' dispatch={ dispatch } />
      <DigitButton digit='7' dispatch={ dispatch } />
      <DigitButton digit='8' dispatch={ dispatch } />
      <DigitButton digit='9' dispatch={ dispatch } />
      <OperationButton operation='-' dispatch={ dispatch } />
      <DigitButton digit='.' dispatch={ dispatch } />
      <DigitButton digit='0' dispatch={ dispatch } />
      <button 
        className='span-two'
        onClick={ () => dispatch({ type: ACTIONS.EVALUATE }) }
      >
        =
      </button>
    </div>
  );
}

export default App;
