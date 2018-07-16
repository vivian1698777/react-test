import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { compose } from 'recompose/compose';
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
  static propTypes = {
    addItem: PropTypes.func,
    delItem: PropTypes.func,
    listItems: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    errorAddNoSpace: PropTypes.func,
    errorAddNoRepeat: PropTypes.func,
    errorNormal: PropTypes.func,
    resetInput: PropTypes.func,
    sortState: PropTypes.func,
    errorInputNoRepeat: PropTypes.func,
    errorInputNoSpace: PropTypes.func,
    editInput: PropTypes.func,
    sortAnchor: PropTypes.func,
    sorting: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    searchNothing: PropTypes.func,
    searchResult: PropTypes.func,
    isChangeInput: PropTypes.func,
    editItem: PropTypes.func,
    isChecked: PropTypes.func,
    sortingDate: PropTypes.func,
    sortingBy: PropTypes.func,
    sortingName: PropTypes.func,
    errors: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    addItem: Function.prototype,
    delItem: Function.prototype,
    listItems: Object.prototype,
    errorAddNoSpace: Function.prototype,
    errorAddNoRepeat: Function.prototype,
    errorNormal: Function.prototype,
    resetInput: Function.prototype,
    sortState: Function.prototype,
    errorInputNoRepeat: Function.prototype,
    errorInputNoSpace: Function.prototype,
    editInput: Function.prototype,
    sortAnchor: Function.prototype,
    sorting: Object.prototype,
    searchNothing: Function.prototype,
    searchResult: Function.prototype,
    isChangeInput: Function.prototype,
    editItem: Function.prototype,
    isChecked: Function.prototype,
    sortingDate: Function.prototype,
    sortingBy: Function.prototype,
    sortingName: Function.prototype,
    errors: Object.prototype,
  }

  constructor(props) {
    super(props);
    this.nextId = 1;

    this.onClickAdd = this.onClickAdd.bind(this);
  }

  onClickAdd = () => {
    const {
      addItem, listItems, resetInput, errorAddNoSpace, errorAddNoRepeat, errorNormal,
    } = this.props;
    const newId = this.nextId;
    this.nextId += 1;
    const textAdd = listItems.inputValue.trim();

    const dateNow = new Date();

    if (textAdd === '') {
      resetInput({});
      errorAddNoSpace({});
      return;
    }
    errorNormal({});

    const sameCheck = listItems.todos.find(function (item) {
      return item.name === textAdd;
    });

    if (sameCheck !== undefined) {
      errorAddNoRepeat({});
      return;
    }

    errorNormal({});

    addItem(
      {
        id: newId,
        name: textAdd,
        date: dateNow,
      },
    );

    resetInput({});
  }

  onBlurInput = (id, blurInputValue) => {
    const {
      listItems, sortState, errorNormal, errorInputNoRepeat, errorInputNoSpace,
      editInput, sortAnchor, sorting,
    } = this.props;
    const index = listItems.newTodos.findIndex(
      newTodo => newTodo.id === id,
    );

    const sameCheck = listItems.newTodos.find(function (item) {
      return item.name === listItems.editingValue.trim() && item.id !== id;
    });

    if (sameCheck) {
      errorInputNoRepeat({});
      editInput(
        {
          editing: id,
        },
      );
      return;
    }
    if (listItems.editingValue.trim() === '') {
      errorInputNoSpace({});
      editInput(
        {
          editing: id,
        },
      );
      return;
    }
    listItems.newTodos[index].name = blurInputValue.trim();
    sortState({});
    errorNormal({});
    editInput(
      {
        editing: -1,
      },
    );

    if (sorting.sortBy === 2) {
      listItems.newTodos.sort(function (a, b) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1 * sorting.sortName;
        }
        if (nameA > nameB) {
          return -1 * sorting.sortName;
        }
        return 0;
      });
    } else if (sorting.sortBy === 1) {
      // const {sortDate} = this.state;
      listItems.newTodos.sort(function (a, b) {
        return (b.date - a.date) * -1 * sorting.sortDate;
      });
    }
    sortState({});
    sortAnchor({
      anchorEl: null,
    });
  }

  // this.isDateUpwardShown
  get isDateUpwardShown() {
    // const { data, classes } = this.props; //example of data-transfered
    const { sorting } = this.props;
    return sorting.sortDate === 1 && sorting.sortBy === 1;
  }

  // this.isDateDownwardShown
  get isDateDownwardShown() {
    const { sorting } = this.props;
    return sorting.sortDate === -1 && sorting.sortBy === 1;
  }

  // this.isDateUpwardShown
  get isNameUpwardShown() {
    const { sorting } = this.props;
    return sorting.sortName === -1 && sorting.sortBy === 2;
  }

  // this.isDateDownwardShown
  get isNameDownwardShown() {
    const { sorting } = this.props;
    return sorting.sortName === 1 && sorting.sortBy === 2;
  }

  handleTextChange = (event) => {
    const {
      searchNothing, listItems, searchResult, isChangeInput, errorNormal,
    } = this.props;

    // if (event.target instanceof HTMLInputElement) {
    isChangeInput({
      inputValue: event.target.value.trimLeft(),
    });

    errorNormal({});
    // }

    if (event.target.value.trim() === '') {
      searchNothing({});
    } else {
      const options = {
        keys: ['name'],
      };
      const fuse = new Fuse(listItems.newTodos, options);
      const result = fuse.search(event.target.value.trim());

      searchResult(
        {
          todosResult: result,
        },
      );
    }
    errorNormal({});
  }

  textChange = (item, editText) => {
    const { editItem, errorNormal } = this.props;

    editItem(
      {
        editItem: item,
        editingValue: editText.trimLeft(),
      },
    );
    errorNormal({});
  }

  textChangeBind = (value) => {
    const {
      editItem, listItems, errorInputNoSpace, errorInputNoRepeat,
      errorNormal, editInput,
    } = this.props;
    if (listItems.editing === -1) {
      editItem({
        editItem: value,
        editingValue: value.name,
      });

      editInput({
        editing: listItems.editing === value.id ? -1 : value.id,
      });
    } else {
      const sameCheck = listItems.newTodos.find(function (item) {
        return item.name === listItems.editingValue.trim() && item.id !== listItems.editing;
      });
      if (sameCheck) {
        errorInputNoRepeat({});
        return;
      }
      if (listItems.editingValue.trim() === '') {
        errorInputNoSpace({});

        return;
      }

      editItem(
        {
          editItem: value,
          editingValue: value.name,
        },
      );

      errorNormal({});

      editInput(
        {
          editing: listItems.editing === value.id ? -1 : value.id,
        },
      );
    }
  }

  handleToggle = value => () => {
    const { isChecked, listItems } = this.props;
    const currentIndex = listItems.checked.findIndex(item => item.id === value.id);
    const newChecked = [...listItems.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    isChecked({
      checked: newChecked,
    });
  };

  SortByName = () => {
    const {
      sortState, listItems, sortAnchor, sortingBy,
      sortingName, sorting, searchNothing,
    } = this.props;
    listItems.newTodos.sort(function (a, b) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1 * sorting.sortName;
      }
      if (nameA > nameB) {
        return 1 * sorting.sortName;
      }
      return 0;
    });
    sortState({});

    sortAnchor({
      anchorEl: null,
    });

    sortingBy({
      sortBy: 2,
    });

    sortingName({
      sortName: sorting.sortName * -1,
    });

    searchNothing({});
  }

  sortByDate = () => {
    const {
      sortState, listItems, sortAnchor, sortingBy,
      sortingDate, sorting, searchNothing,
    } = this.props;

    listItems.newTodos.sort(function (a, b) {
      return (b.date - a.date) * sorting.sortDate;
    });

    sortState({});
    sortAnchor({
      anchorEl: null,
    });
    sortingBy({
      sortBy: 1,
    });
    sortingDate({
      sortDate: sorting.sortDate * -1,
    });
    searchNothing({});
  }

  handleOpen = (event) => {
    const { sortAnchor } = this.props;
    sortAnchor({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    const { sortAnchor } = this.props;

    sortAnchor({
      anchorEl: null,
    });
  };

  errorInfoNoRepeatInputFunc(value) {
    const { errors, listItems } = this.props;
    return errors.errorInfoNoRepeatInput !== false && listItems.editing === value.id;
  }

  errorInfoNoSpaceInputFunc(value) {
    const { errors, listItems } = this.props;
    return errors.errorInfoNoSpaceInput !== false && listItems.editing === value.id;
  }

  render() {
    const {
      delItem, listItems,
      errors: {
        errorInputLine, errorInfoNoSpace, errorInfoNoRepeat,
      },
      sorting: { anchorEl }, sorting,
    } = this.props;

    return (
      <div>
        <Input
          type="text"
          value={listItems.inputValue}
          onChange={this.handleTextChange}
          onKeyPress={(event) => { if (event.key === 'Enter') { this.onClickAdd(); } }}
          placeholder="enter task"
          inputProps={{
            'aria-label': 'Description',
          }}
          className="addInput"
          error={errorInputLine}
        />

        <Button
          onClick={this.onClickAdd}
          variant="contained"
          color="primary"
          // disableRipple={true}
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

          <div
            className="filterListDiv"
            style={{ display: listItems.todos.length === 0 && 'none' }}
          >
            <FormControl>
              <IconButton onClick={this.handleOpen}>
                <SortByAlpha className="SortByAlpha" />
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
                  <MenuItem
                    className="sortList"
                    onClick={this.sortByDate}
                    style={{ backgroundColor: sorting.sortBy === 1 && '#F5F5F5' }}
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

                  <MenuItem
                    className="sortList"
                    onClick={this.SortByName}
                    style={{ backgroundColor: sorting.sortBy === 2 && '#F5F5F5' }}
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
              listItems.todos.map(value => (
                <ListItem
                  key={value.id}
                  role={undefined}
                  dense
                >
                  <Checkbox
                    checked={listItems.checked.indexOf(value) !== -1}
                    onClick={this.handleToggle(value)}
                    tabIndex={-1}
                    disableRipple
                  />

                  <ListItemText
                    className="ListItemText"
                  >

                    <input
                      // autoFocus={listItems.editing}
                      value={listItems.editingValue}
                      onChange={event => this.textChange(value, event.target.value)}
                      className="valinput"
                      style={{ display: listItems.editing !== value.id && 'none' }}
                      onBlur={event => this.onBlurInput(value.id, event.target.value)}
                    />
                    <span
                      style={{ display: listItems.editing === value.id && 'none' }}
                    >
                      {value.name}
                    </span>
                    <span
                      className="listValueDate"
                    >
                      {value.date.getFullYear()}
                      /
                      {value.date.getMonth() + 1}
                      /
                      {value.date.getDate()}
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
                        onClick={() => delItem(value.id)}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    listItems: state.listItems,
    errors: state.errors,
    sorting: state.sorting,
  }
);

export default connect(mapStateToProps, actionCreators)(CheckboxList);
