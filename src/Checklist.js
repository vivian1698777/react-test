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
    listItemsPackage: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    errorAddNoSpace: PropTypes.func,
    errorAddNoRepeat: PropTypes.func,
    errorNormal: PropTypes.func,
    resetInput: PropTypes.func,
    sortState: PropTypes.func,
    errorInputNoRepeat: PropTypes.func,
    errorInputNoSpace: PropTypes.func,
    editInput: PropTypes.func,
    sortAnchor: PropTypes.func,
    sortingPackage: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    searchNothing: PropTypes.func,
    searchResult: PropTypes.func,
    isChangeInput: PropTypes.func,
    editItem: PropTypes.func,
    isChecked: PropTypes.func,
    sortingDate: PropTypes.func,
    sortingBy: PropTypes.func,
    sortingName: PropTypes.func,
    errorsPackage: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    addItem: Function.prototype,
    delItem: Function.prototype,
    listItemsPackage: Object.prototype,
    errorAddNoSpace: Function.prototype,
    errorAddNoRepeat: Function.prototype,
    errorNormal: Function.prototype,
    resetInput: Function.prototype,
    sortState: Function.prototype,
    errorInputNoRepeat: Function.prototype,
    errorInputNoSpace: Function.prototype,
    editInput: Function.prototype,
    sortAnchor: Function.prototype,
    sortingPackage: Object.prototype,
    searchNothing: Function.prototype,
    searchResult: Function.prototype,
    isChangeInput: Function.prototype,
    editItem: Function.prototype,
    isChecked: Function.prototype,
    sortingDate: Function.prototype,
    sortingBy: Function.prototype,
    sortingName: Function.prototype,
    errorsPackage: Object.prototype,
  }

  constructor(props) {
    super(props);
    this.nextId = 1;

    this.onClickAdd = this.onClickAdd.bind(this);
  }

  onClickAdd = () => {
    const {
      addItem, listItemsPackage, resetInput, errorAddNoSpace, errorAddNoRepeat, errorNormal,
    } = this.props;
    const newId = this.nextId;
    this.nextId += 1;
    const textAdd = listItemsPackage.inputValue.trim();

    const dateNow = new Date();

    if (textAdd === '') {
      resetInput({});
      errorAddNoSpace({});
      return;
    }
    errorNormal({});

    const sameCheck = listItemsPackage.todos.find(function (item) {
      return item.name === textAdd;
    });

    console.log(listItemsPackage.todos);
    if (sameCheck !== undefined) {
      errorAddNoRepeat({});
      return;
    }
    console.log(123);

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
      listItemsPackage, sortState, errorNormal, errorInputNoRepeat, errorInputNoSpace,
      editInput, sortAnchor, sortingPackage,
    } = this.props;
    const index = listItemsPackage.newTodos.findIndex(
      newTodo => newTodo.id === id,
    );

    const sameCheck = listItemsPackage.newTodos.find(function (item) {
      return item.name === listItemsPackage.editingValue.trim() && item.id !== id;
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
    if (listItemsPackage.editingValue.trim() === '') {
      errorInputNoSpace({});
      editInput(
        {
          editing: id,
        },
      );
      return;
    }
    listItemsPackage.newTodos[index].name = blurInputValue.trim();
    sortState({});
    errorNormal({});
    editInput(
      {
        editing: -1,
      },
    );

    if (sortingPackage.sortBy === 2) {
      listItemsPackage.newTodos.sort(function (a, b) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1 * sortingPackage.sortName;
        }
        if (nameA > nameB) {
          return -1 * sortingPackage.sortName;
        }
        return 0;
      });
    } else if (sortingPackage.sortBy === 1) {
      // const {sortDate} = this.state;
      listItemsPackage.newTodos.sort(function (a, b) {
        return (b.date - a.date) * -1 * sortingPackage.sortDate;
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
    const { sortingPackage } = this.props;
    return sortingPackage.sortDate === 1 && sortingPackage.sortBy === 1;
  }

  // this.isDateDownwardShown
  get isDateDownwardShown() {
    const { sortingPackage } = this.props;
    return sortingPackage.sortDate === -1 && sortingPackage.sortBy === 1;
  }

  // this.isDateUpwardShown
  get isNameUpwardShown() {
    const { sortingPackage } = this.props;
    return sortingPackage.sortName === -1 && sortingPackage.sortBy === 2;
  }

  // this.isDateDownwardShown
  get isNameDownwardShown() {
    const { sortingPackage } = this.props;
    return sortingPackage.sortName === 1 && sortingPackage.sortBy === 2;
  }

  handleTextChange = (event) => {
    const {
      searchNothing, listItemsPackage, searchResult, isChangeInput, errorNormal,
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
      const fuse = new Fuse(listItemsPackage.newTodos, options);
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
      editItem, listItemsPackage, errorInputNoSpace, errorInputNoRepeat,
      errorNormal, editInput,
    } = this.props;
    if (listItemsPackage.editing === -1) {
      editItem({
        editItem: value,
        editingValue: value.name,
      });

      editInput({
        editing: listItemsPackage.editing === value.id ? -1 : value.id,
      });
    } else {
      const sameCheck = listItemsPackage.newTodos.find(function (item) {
        return item.name === listItemsPackage.editingValue.trim() && item.id !== listItemsPackage.editing;
      });
      if (sameCheck) {
        errorInputNoRepeat({});
        return;
      }
      if (listItemsPackage.editingValue.trim() === '') {
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
          editing: listItemsPackage.editing === value.id ? -1 : value.id,
        },
      );
    }
  }

  handleToggle = value => () => {
    const { isChecked, listItemsPackage } = this.props;
    const currentIndex = listItemsPackage.checked.findIndex(item => item.id === value.id);
    const newChecked = [...listItemsPackage.checked];

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
      sortState, listItemsPackage, sortAnchor, sortingBy,
      sortingName, sortingPackage, searchNothing,
    } = this.props;
    listItemsPackage.newTodos.sort(function (a, b) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1 * sortingPackage.sortName;
      }
      if (nameA > nameB) {
        return 1 * sortingPackage.sortName;
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
      sortName: sortingPackage.sortName * -1,
    });

    searchNothing({});
  }

  sortByDate = () => {
    const {
      sortState, listItemsPackage, sortAnchor, sortingBy,
      sortingDate, sortingPackage, searchNothing,
    } = this.props;

    listItemsPackage.newTodos.sort(function (a, b) {
      return (b.date - a.date) * sortingPackage.sortDate;
    });

    sortState({});
    sortAnchor({
      anchorEl: null,
    });
    sortingBy({
      sortBy: 1,
    });
    sortingDate({
      sortDate: sortingPackage.sortDate * -1,
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
    const { errorsPackage, listItemsPackage } = this.props;
    return errorsPackage.errorInfoNoRepeatInput !== false && listItemsPackage.editing === value.id;
  }

  errorInfoNoSpaceInputFunc(value) {
    const { errorsPackage, listItemsPackage } = this.props;
    return errorsPackage.errorInfoNoSpaceInput !== false && listItemsPackage.editing === value.id;
  }

  render() {
    const {
      delItem, listItemsPackage,
      errorsPackage: {
        errorInputLine, errorInfoNoSpace, errorInfoNoRepeat,
      },
      sortingPackage: { anchorEl }, sortingPackage,
    } = this.props;

    return (
      <div>
        <Input
          type="text"
          value={listItemsPackage.inputValue}
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

          <div
            className="filterListDiv"
            style={{ display: listItemsPackage.todos.length === 0 && 'none' }}
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
                    style={{ backgroundColor: sortingPackage.sortBy === 1 && '#F5F5F5' }}
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
                    style={{ backgroundColor: sortingPackage.sortBy === 2 && '#F5F5F5' }}
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
              listItemsPackage.todos.map((value, index) => {
                return (
                  <ListItem
                    key={index}
                    role={undefined}
                    dense
                  >
                    <Checkbox
                      checked={listItemsPackage.checked.indexOf(value) !== -1}
                      onClick={this.handleToggle(value)}
                      tabIndex={-1}
                      disableRipple
                    />

                    <ListItemText
                      className="ListItemText"
                    >

                      <input
                        autoFocus={listItemsPackage.editing}
                        value={listItemsPackage.editingValue}
                        onChange={event => this.textChange(value, event.target.value)}
                        className="valinput"
                        style={{ display: listItemsPackage.editing !== value.id && 'none' }}
                        onBlur={event => this.onBlurInput(value.id, event.target.value)}
                      />
                      <span
                        style={{ display: listItemsPackage.editing === value.id && 'none' }}
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
                );
              })}
          </List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listItemsPackage: state.listItems,
    errorsPackage: state.errors,
    sortingPackage: state.sorting,
  }
};

export default connect(mapStateToProps, actionCreators)(CheckboxList);
