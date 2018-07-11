import { combineReducers } from 'redux';

const initState = {
    errorInfoNoSpaceInput:false,
    errorInfoNoRepeatInput:false,
    errorInputLine:false,
    errorInfoNoSpace:false,
    errorInfoNoRepeat:false,
    checked: [],
    anchorEl: null,
    sortBy: 1,
    sortName:1,
    sortDate:1,
    editing: -1,
    inputValue:"",
    editingValue:"",
    todos:[],
    newTodos:[],
}

function errors(state = initState, action) {
    switch (action.type) {
        case 'ERROR_ADD_NO_SPACE' :
        {
            let newState = {
                errorInfoNoSpaceInput:false,
                errorInfoNoRepeatInput:false,
                errorInputLine: true,
                errorInfoNoSpace: true,
                errorInfoNoRepeat: false,
            }
            return newState;
        }
        case 'ERROR_ADD_NO_REPEAT' :
        {
            let newState = {
                errorInfoNoSpaceInput:false,
                errorInfoNoRepeatInput:false,
                errorInputLine: true,
                errorInfoNoRepeat: true,
                errorInfoNoSpace: false,
            }
            return newState;
        }
        case 'ERROR_NORMAL':
        {
            let newState = {
                errorInfoNoSpaceInput:false,
                errorInfoNoRepeatInput:false,
                errorInputLine: false,
                errorInfoNoSpace: false,
                errorInfoNoRepeat: false,
            }
            return newState;
        }
        case 'ERROR_INPUT_NO_SPACE':
        {
            let newState = {
                errorInfoNoSpaceInput:true,
                errorInfoNoRepeatInput:false,
                errorInputLine: false,
                errorInfoNoSpace: false,
                errorInfoNoRepeat: false,
            }
            return newState;
        }
        case 'ERROR_INPUT_NO_REPEAT':
        {
            let newState = {
                errorInfoNoSpaceInput:false,
                errorInfoNoRepeatInput:true,
                errorInputLine: false,
                errorInfoNoSpace: false,
                errorInfoNoRepeat: false,
            }
            return newState;
        }
        // case 'ERROR_INPUT_NORMAL':
        // {
        //     let newState = {
        //         errorInfoNoSpaceInput:false,
        //         errorInfoNoRepeatInput:false,
        //         errorInputLine: false,
        //         errorInfoNoRepeat: false,
        //         errorInfoNoSpace: false,
        //     }
        //     return newState;
        // }
        default:
        return state;
    }
}

function listItems(state = initState, action) {
  switch (action.type) {
    case 'ADD_ITEM':
    {
        const todos = state.todos;
        const newTodos = state.newTodos;
        let newState = {
            ...state,
            todos:[
              ...state.newTodos,
              {
              id: action.AddObj.AddId,
              name: action.AddObj.AddName,
              date: action.AddObj.AddDate,
              }
            ],
            newTodos:[
              ...state.newTodos,
              {
              id: action.AddObj.AddId,
              name: action.AddObj.AddName,
              date: action.AddObj.AddDate,
              }
            ]
        }
        return newState;    
    }
    case 'DEL_ITEM':
    {
        const todos = state.todos;
        const newTodos = state.newTodos;
        const index = newTodos.findIndex(
        newTodo => newTodo.id === action.DelObj
        );
        newTodos.splice(index, 1);
        let newState = {
            ...state,
            todos:newTodos,
            newTodos:newTodos,
        }
        return newState;
    }
    case 'EDIT_ITEM':
    {
        const todos = state.todos;
        const newTodos = state.newTodos;
        const index = newTodos.findIndex(
            newTodo => newTodo.id === action.EditObj.EditItem.id
          );
        todos[index].name = action.EditObj.EditText;
        let newState = {
            ...state,
            todos:newTodos,
            newTodos:newTodos,
            editingValue: action.EditObj.EditText,
        }
        return newState;
    }
    case 'SEARCH_NOTHING':
    {
        const todos = state.todos;
        const newTodos = state.newTodos;
        let newState = {
            ...state,
            todos:newTodos,
            newTodos:newTodos,
        }
        return newState;
    }
    case 'SEARCH_RESULT':
    {
        const todos = state.todos;
        let newState = {
            ...state,
            todos: action.SerResultObj.ResultUpdate,
        }
        return newState;
    }
    case 'INPUT_RESET':
    {
        const inputValue = state.inputValue;
        let newState = {
            ...state,
            inputValue:"",
        }
        return newState;
    }
    case 'INPUT_TARGET':
    {
        const inputValue = state.inputValue;
        let newState = {
            ...state,
            inputValue:action.InputTargetObj.InputTargetUpdate,
        }
        return newState;
    }
    case 'INPUT_EDITING':
    {
        let newState = {
            ...state,
            editing:action.InputEditingObj.InputEditingUpdate,
        }
        return newState;
    }
    case 'CHECKED':
    {
        const checked = state.checked;
        let newState = {
            ...state,
            checked:action.CheckedObj.CheckedUpdate,
        }
        return newState;
    }
    default:
      return state;
  }
}

function sorting(state = initState, action) {
    switch (action.type) {
        case 'SORT_STATE' :
        {
            const todos = state.todos;
            const newTodos = state.newTodos;
            let newState = {
                ...state,
                todos:newTodos,
                newTodos:newTodos,
            }
            return newState;
        }
        case 'SORT_ANCHOR' :
        {
            let newState = {
                ...state,
                anchorEl:action.AnchorObj.AnchorUpdate,
            }
            return newState;
        }
        case 'SORT_BY' :
        {
            let newState = {
                ...state,
                sortBy:action.SortByObj.SortByUpdate,
            }
            return newState;
        }
        case 'SORT_NAME' :
        {
            let newState = {
                ...state,
                sortName:action.SortNameObj.SortNameUpdate,
            }
            return newState;
        }
        case 'SORT_DATE' :
        {
            let newState = {
                ...state,
                sortDate:action.SortDateObj.SortDateUpdate,
            }
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
