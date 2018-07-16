import { combineReducers } from 'redux';

const initState = {
  checked: [],
  anchorEl: null,
  sortBy: 1,
  sortName: 1,
  sortDate: 1,
  editing: -1,
  inputValue: '',
  editingValue: '',
  todos: [],
  newTodos: [],
};

const initErrors = {
  errorInfoNoSpaceInput: false,
  errorInfoNoRepeatInput: false,
  errorInputLine: false,
  errorInfoNoSpace: false,
  errorInfoNoRepeat: false,
};

function errors(state = initErrors, action) {
  switch (action.type) {
    case 'ERROR_ADD_NO_SPACE':
    {
      const newState = {
        errorInfoNoSpaceInput: false,
        errorInfoNoRepeatInput: false,
        errorInputLine: true,
        errorInfoNoSpace: true,
        errorInfoNoRepeat: false,
      };
      return newState;
    }
    case 'ERROR_ADD_NO_REPEAT':
    {
      const newState = {
        errorInfoNoSpaceInput: false,
        errorInfoNoRepeatInput: false,
        errorInputLine: true,
        errorInfoNoRepeat: true,
        errorInfoNoSpace: false,
      };
      return newState;
    }
    case 'ERROR_NORMAL':
    {
      const newState = {
        errorInfoNoSpaceInput: false,
        errorInfoNoRepeatInput: false,
        errorInputLine: false,
        errorInfoNoSpace: false,
        errorInfoNoRepeat: false,
      };
      return newState;
    }
    case 'ERROR_INPUT_NO_SPACE':
    {
      const newState = {
        errorInfoNoSpaceInput: true,
        errorInfoNoRepeatInput: false,
        errorInputLine: false,
        errorInfoNoSpace: false,
        errorInfoNoRepeat: false,
      };
      return newState;
    }
    case 'ERROR_INPUT_NO_REPEAT':
    {
      const newState = {
        errorInfoNoSpaceInput: false,
        errorInfoNoRepeatInput: true,
        errorInputLine: false,
        errorInfoNoSpace: false,
        errorInfoNoRepeat: false,
      };
      return newState;
    }
    default:
      return state;
  }
}

function listItems(state = initState, action) {
  switch (action.type) {
    case 'ADD_ITEM':
    {
      const newState = {
        ...state,
        todos: [
          ...state.newTodos,
          {
            id: action.val.id,
            name: action.val.name,
            date: action.val.date,
          },
        ],
        newTodos: [
          ...state.newTodos,
          {
            id: action.val.id,
            name: action.val.name,
            date: action.val.date,
          },
        ],
      };
      return newState;
    }
    case 'DEL_ITEM':
    {
      const { newTodos } = state;
      const index = newTodos.findIndex(
        newTodo => newTodo.id === action.val,
      );
      newTodos.splice(index, 1);
      const newState = {
        ...state,
        todos: newTodos,
        newTodos,
      };
      return newState;
    }
    case 'EDIT_ITEM':
    {
      const { todos, newTodos } = state;
      const index = newTodos.findIndex(
        newTodo => newTodo.id === action.val.editItem.id,
      );
      todos[index].name = action.val.editingValue;
      const newState = {
        ...state,
        todos: newTodos,
        newTodos,
        editingValue: action.val.editingValue,
      };
      console.log(action.val.editItem);
      return newState;
    }
    case 'SEARCH_NOTHING':
    {
      const { newTodos } = state;
      const newState = {
        ...state,
        todos: newTodos,
        newTodos,
      };
      return newState;
    }
    case 'SEARCH_RESULT':
    {
      const newState = {
        ...state,
        todos: action.val.todosResult,
      };
      return newState;
    }
    case 'INPUT_RESET':
    {
      const newState = {
        ...state,
        inputValue: '',
      };
      return newState;
    }
    case 'INPUT_TARGET':
    {
      const newState = {
        ...state,
        inputValue: action.val.inputValue,
      };
      return newState;
    }
    case 'INPUT_EDITING':
    {
      const newState = {
        ...state,
        editing: action.val.editing,
      };
      return newState;
    }
    case 'CHECKED':
    {
      const newState = {
        ...state,
        checked: action.val.checked,
      };
      return newState;
    }
    default:
      return state;
  }
}

function sorting(state = initState, action) {
  switch (action.type) {
    case 'SORT_STATE':
    {
      const { newTodos } = state;
      const newState = {
        ...state,
        todos: newTodos,
        newTodos,
      };
      return newState;
    }
    case 'SORT_ANCHOR':
    {
      const newState = {
        ...state,
        anchorEl: action.val.anchorEl,
      };
      return newState;
    }
    case 'SORT_BY':
    {
      const newState = {
        ...state,
        sortBy: action.val.sortBy,
      };
      return newState;
    }
    case 'SORT_NAME':
    {
      const newState = {
        ...state,
        sortName: action.val.sortName,
      };
      return newState;
    }
    case 'SORT_DATE':
    {
      const newState = {
        ...state,
        sortDate: action.val.sortDate,
      };
      return newState;
    }
    default:
      return state;
  }
}

const itemApp = combineReducers({
  listItems,
  sorting,
  errors,
});

export default itemApp;
