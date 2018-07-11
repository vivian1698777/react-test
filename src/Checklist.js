import React, { Component } from 'react';
import { connect } from 'react-redux';
import {compose} from 'recompose/compose';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import SortByAlpha from '@material-ui/icons/SortByAlpha';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import FormHelperText from '@material-ui/core/FormHelperText';
import Fuse from 'fuse.js';
import * as actionCreators from './action';


class CheckboxList extends React.Component {

  constructor(props) {
    super(props);
    this.nextId = 1;
  }

  // this.isDateUpwardShown
  get isDateUpwardShown() {
    // const { data, classes } = this.props; //example of data-transfered
    const { sortingState } = this.props;
    return sortingState.sortDate === 1 && sortingState.sortBy === 1;
  }
  // this.isDateDownwardShown
  get isDateDownwardShown() {
    const { sortingState } = this.props;
    return sortingState.sortDate === -1 && sortingState.sortBy === 1;
  }
  // this.isDateUpwardShown
  get isNameUpwardShown() {
    const { sortingState } = this.props;
    return sortingState.sortName === -1 && sortingState.sortBy === 2;
  }
  // this.isDateDownwardShown
  get isNameDownwardShown() {
    const { sortingState } = this.props;
    return sortingState.sortName === 1 && sortingState.sortBy === 2;
  }

  errorInfoNoRepeatInputFunc(value) {
    const {errors, callUpdate} = this.props;
    return errors.errorInfoNoRepeatInput !== false && callUpdate.editing === value.id;
  }

  errorInfoNoSpaceInputFunc(value) {
    const {errors, callUpdate} = this.props;
    return errors.errorInfoNoSpaceInput !== false && callUpdate.editing === value.id;
  }

  onClickAdd = () => {
    const { onItemAdd, callUpdate, onInputReset, onErrorAddNoSpace, onErrorAddNoRepeat, onErrorNormal, } = this.props;
    const newId = this.nextId;
    this.nextId += 1;
    const textAdd = callUpdate.inputValue.trim();

    const dateNow = new Date();

    if(textAdd === ""){
      onInputReset({});
      onErrorAddNoSpace({});
      return;
    } else {
      onErrorNormal({});
    }

    const sameCheck = callUpdate.todos.find(function(item, index, array){
      return item.name === textAdd;  
    });

    if (sameCheck!==undefined){
      onErrorAddNoRepeat({});
      return;
    } else {
      onErrorNormal({});
    }

    onItemAdd(
      {
        AddId: newId,
        AddName: textAdd,
        AddDate: dateNow,
      },
    );

    onInputReset({});
  }


  handleTextChange = (event) => {
    const {onItemSerNothing, callUpdate, onItemSerResult, onInputTarget, onErrorNormal} = this.props;
    const { errorInputLine, errorInfoNoRepeat, errorInfoNoSpace } = this.state;
    if (event.target instanceof HTMLInputElement) {
      onInputTarget({
        InputTargetUpdate: event.target.value
      });

      onErrorNormal({});
    }

    if (event.target.value === '') {
      onItemSerNothing({});
    } else {
      const options = {
        keys: ['name']
      };
      const fuse = new Fuse(callUpdate.newTodos, options); 
      const result = fuse.search(event.target.value);

      onItemSerResult(
        {
          ResultUpdate: result,
        },
      );

    }
    onErrorNormal({});
  }

  textChange = (item,editText) => {
    const {onItemEdit, onErrorNormal} = this.props;

    onItemEdit(
      {
        EditItem: item,
        EditText: editText,
      },
    );
    onErrorNormal({});
    onErrorNormal({});

  }

  textChangeBind = (value) => {
    const {onItemEdit, callUpdate, onErrorInputNoSpace, onErrorInputNoRepeat, onErrorNormal, onInputEditing} = this.props;

    if(callUpdate.editing===-1){
        onItemEdit(
          {
            EditItem: value,
            EditText: value.name,
          }
        )
        onInputEditing(
          {
            InputEditingUpdate: callUpdate.editing === value.id ? -1 : value.id,
          }
        )
    }else{
      const sameCheck = callUpdate.newTodos.find(function(item, index, array){
        return item.name === callUpdate.editingValue && item.id !== callUpdate.editing;
      });
      if (sameCheck){
        onErrorInputNoRepeat({});
        return;
      } else if (callUpdate.editingValue.trim() === "") {
        onErrorInputNoSpace({});
        return;
      }
      onItemEdit(
        {
          EditItem: value,
          EditText: value.name,
        },
      );
      onErrorNormal({});
      onErrorNormal({});
      onInputEditing(
        {
          InputEditingUpdate: callUpdate.editing === value.id ? -1 : value.id,
        }
      )
    }
  }

  onBlurInput = (id, blurInputValue) => {
    const {callUpdate, onStateSorting, onErrorNormal, onErrorInputNoRepeat, onErrorInputNoSpace, onInputEditing, onSortingAnchor, sortingState } = this.props;
    const index = callUpdate.newTodos.findIndex(
      newTodo => newTodo.id === id
    );
    
    const sameCheck = callUpdate.newTodos.find(function(item, index, array){
      return item.name === callUpdate.editingValue && item.id !== id;
    });

    if (sameCheck){
      onErrorInputNoRepeat({});
      onInputEditing(
        {
          InputEditingUpdate: id,
        }
      )
      return;
    } else if (callUpdate.editingValue.trim() === "") {
      onErrorInputNoSpace({});
      onInputEditing(
        {
          InputEditingUpdate: id,
        }
      )
      return;
    }
    callUpdate.newTodos[index].name = blurInputValue.trim();
    onStateSorting({});
    onErrorNormal({});
    onInputEditing(
      {
        InputEditingUpdate: -1,
      }
    )

    if (sortingState.sortBy === 2) {

      callUpdate.newTodos.sort(function(a, b){
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1*sortingState.sortName;
        }
        if (nameA > nameB) {
          return -1*sortingState.sortName;
        }
        return 0;
      })
    } else if (sortingState.sortBy === 1) {
      const {sortDate} = this.state;
      callUpdate.newTodos.sort(function (a, b) {
        return (b.date - a.date)*-1*sortingState.sortDate ;
      });
    }
    onStateSorting({});
    onSortingAnchor({
      AnchorUpdate: null,
    });
  }

  handleToggle = value => () => {
    const { onChecked, callUpdate } = this.props;
    const currentIndex = callUpdate.checked.findIndex(item => item.id === value.id);
    const newChecked = [...callUpdate.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onChecked({
      CheckedUpdate: newChecked,
    });
  };

  SortByName = () => {

    const {onStateSorting, callUpdate, onSortingAnchor, onSortingBy, onSortingName, sortingState, onItemSerNothing } = this.props;
    const {sortName} = this.state;

    callUpdate.newTodos.sort(function(a, b){
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1*sortingState.sortName;
      }
      if (nameA > nameB) {
        return 1*sortingState.sortName;
      }

      return 0;
    })

    onStateSorting({});
    onSortingAnchor({
      AnchorUpdate: null,
    })
    onSortingBy({
      SortByUpdate: 2,
    })
    onSortingName({
      SortNameUpdate: sortingState.sortName*-1,
    })
    onItemSerNothing({});
  }

  SortByDate = () => {
    const {onStateSorting, callUpdate, onSortingAnchor, onSortingBy, onSortingDate, sortingState} = this.props;
    const {sortDate} = this.state;

    callUpdate.newTodos.sort(function (a, b) {
      return (b.date - a.date)*sortingState.sortDate ;
    });

    onStateSorting({});
    onSortingAnchor({
      AnchorUpdate: null,
    })
    onSortingBy({
      SortByUpdate: 1,
    })
    onSortingDate({
      SortDateUpdate: sortingState.sortDate*-1
    })
  }

  handleOpen = event => {
    const {onSortingAnchor} = this.props;
    onSortingAnchor({
      AnchorUpdate: event.currentTarget,
    })
  };

  handleClose = () => {
    const {onSortingAnchor} = this.props;
    onSortingAnchor({
      AnchorUpdate: null,
    })
  };



  render() {
    const { 
            onItemEdit, onItemDel, callUpdate, 
            errors: { errorInputLine, errorInfoNoSpace, errorInfoNoRepeat, errorInfoNoSpaceInput, errorInfoNoRepeatInput }, 
            sortingState:{anchorEl},sortingState 
          } = this.props;


    return (
      <div>
        <Input
            type="text"
            value={callUpdate.inputValue}
            onChange={this.handleTextChange}
            onKeyPress={event => { if (event.key === "Enter") { this.onClickAdd();}} }
            placeholder="enter task"
            inputProps={{
              'aria-label': 'Description',
            }}
            className="addInput"
            error={ errorInputLine }
        />
        
        <Button 
            onClick={this.onClickAdd}
            variant="contained" 
            color="primary" 
            disableRipple={true}
        >
            Add item
        </Button>

        <FormHelperText 
            id="name-error-text"
            className="name-error-text"
            style={{ display: errorInfoNoRepeat === false && 'none' }}
        >
          Your list name cannot be repeated.
        </FormHelperText>

        <FormHelperText 
            id="name-error-text"
            className="name-error-text"
            style={{ display: errorInfoNoSpace === false && 'none' }}
        >
          Your value cannot be empty.
        </FormHelperText>

        <div className="listDiv">

          <div className="filterListDiv"
               style={{ display: callUpdate.todos.length === 0 && 'none' }}
          >
            <FormControl >
              <IconButton onClick={this.handleOpen}
              >
                <SortByAlpha className="SortByAlpha"
                />
              </IconButton>
            </FormControl>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={this.handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Paper style={{ margin: 0 }}>
                <MenuList role="menu">
                  <MenuItem className="sortList" 
                            onClick={this.SortByDate}
                            style={{ backgroundColor: sortingState.sortBy === 1 && '#F5F5F5'}}
                  >
                    Time
                    <ArrowUpward
                            className="ArrowUpward" 
                            style={{ display: !this.isDateUpwardShown && 'none' }}
                    />
                    <ArrowDownward
                            className="ArrowUpward" 
                            style={{ display: !this.isDateDownwardShown && 'none' }}
                    />
                  </MenuItem>
                  
                  <MenuItem className="sortList" 
                            onClick={this.SortByName}
                            style={{ backgroundColor: sortingState.sortBy === 2 && '#F5F5F5'}}
                  >
                    Name
                    <ArrowUpward
                            className="ArrowUpward" 
                            style={{ display: !this.isNameUpwardShown && 'none' }}
                    />
                    <ArrowDownward
                            className="ArrowUpward" 
                            style={{ display: !this.isNameDownwardShown && 'none' }}
                    />
                  </MenuItem>
                </MenuList>
              </Paper>

            </Popover>
          </div>
          
          <List>
            {
              callUpdate.todos.map((value,index) => {
              return <ListItem
                key={index}
                role={undefined}
                dense
              >
                <Checkbox
                  checked={callUpdate.checked.indexOf(value) !== -1}
                  onClick={this.handleToggle(value)}
                  tabIndex={-1}
                  disableRipple
                />

                <ListItemText
                  className='ListItemText'
                >

                  <input
                    autoFocus={callUpdate.editing}
                    value={callUpdate.editingValue}
                    onChange={(event) =>  this.textChange(value, event.target.value)}
                    className="valinput"
                    style={{ display: callUpdate.editing !== value.id && 'none' }}
                    onBlur={(event) => this.onBlurInput(value.id, event.target.value)}
                  />
                  <span
                    style={{ display: callUpdate.editing === value.id && 'none' }}
                  >
                    {value.name}
                  </span>
                  <span
                        className="listValueDate"
                  >
                    {value.date.getFullYear()}/{value.date.getMonth()}/{value.date.getDate()}
                  </span>

                  <FormHelperText 
                    id="name-error-text"
                    className="name-error-text-input"
                    style={{ display: !this.errorInfoNoRepeatInputFunc(value) && 'none' }}
                   >
                    Your list name cannot be repeated.
                  </FormHelperText>

                  <FormHelperText 
                    id="name-error-text"
                    className="name-error-text-input-space"
                    style={{ display: !this.errorInfoNoSpaceInputFunc(value) && 'none' }}
                  >
                    Your value cannot be empty.          
                  </FormHelperText>
                </ListItemText>

                <ListItemSecondaryAction>
                  <IconButton aria-label="Create">
                    <CreateIcon
                      onClick={() => this.textChangeBind(value)}
                    />
                  </IconButton>
                  <IconButton aria-label="Delete">
                    <DeleteIcon
                      onClick={() => onItemDel(value.id)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            })}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    callUpdate: state.listItems,
    errors: state.errors,
    sortingState: state.sorting,
   }
);

export default connect(mapStateToProps, actionCreators)(CheckboxList);
