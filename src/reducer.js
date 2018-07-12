import { combineReducers } from 'redux';

const initState = {
  errorInfoNoSpaceInput: false,
  errorInfoNoRepeatInput: false,
  errorInputLine: false,
  errorInfoNoSpace: false,
  errorInfoNoRepeat: false,
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

function errors(state = initState, action) {
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
            id: action.AddObj.AddId,
            name: action.AddObj.AddName,
            date: action.AddObj.AddDate,
          },
        ],
        newTodos: [
          ...state.newTodos,
          {
            id: action.AddObj.AddId,
            name: action.AddObj.AddName,
            date: action.AddObj.AddDate,
          },
        ],
      };
      return newState;
    }
    case 'DEL_ITEM':
    {
      const { newTodos } = state;
      const index = newTodos.findIndex(
        newTodo => newTodo.id === action.DelObj,
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
        newTodo => newTodo.id === action.EditObj.EditItem.id,
      );
      todos[index].name = action.EditObj.EditText;
      const newState = {
        ...state,
        todos: newTodos,
        newTodos,
        editingValue: action.EditObj.EditText,
      };
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
        todos: action.SerResultObj.ResultUpdate,
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
        inputValue: action.InputTargetObj.InputTargetUpdate,
      };
      return newState;
    }
    case 'INPUT_EDITING':
    {
      const newState = {
        ...state,
        editing: action.InputEditingObj.InputEditingUpdate,
      };
      return newState;
    }
    case 'CHECKED':
    {
      const newState = {
        ...state,
        checked: action.CheckedObj.CheckedUpdate,
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
        anchorEl: action.AnchorObj.AnchorUpdate,
      };
      return newState;
    }
    case 'SORT_BY':
    {
      const newState = {
        ...state,
        sortBy: action.SortByObj.SortByUpdate,
      };
      return newState;
    }
    case 'SORT_NAME':
    {
      const newState = {
        ...state,
        sortName: action.SortNameObj.SortNameUpdate,
      };
      return newState;
    }
    case 'SORT_DATE':
    {
      const newState = {
        ...state,
        sortDate: action.SortDateObj.SortDateUpdate,
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
