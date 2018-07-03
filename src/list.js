import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
// import SearchIcon from '@material-ui/icons/Search';
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

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  typography: {
    margin: theme.spacing.unit * 2,
  },

});

class CheckboxList extends React.Component {
  constructor(props) {
    super(props);
    this.nextId = 1;
    this.state = {
      errorInfoNoSpaceInput:false,
      errorInfoNoRepeatInput:false,
      errorInputLine:false,
      errorInfoNoRepeat:false,
      errorInfoNoSpace:false,
      sortName:1,
      sortDate:1,
      sortBy: 1,
      inputValue: "",
      editingValue: "",
      editing: -1,
      checked: [],
      todos: [],
      newTodos: [],
      anchorEl: null,
    }
  }
  // this.isDateUpwardShown
  get isDateUpwardShown() {
    // const { data, classes } = this.props; //example of data-transfered
    const { sortDate, sortBy } = this.state;
    return sortDate === 1 && sortBy === 1;
  }
  // this.isDateDownwardShown
  get isDateDownwardShown() {
    const { sortDate, sortBy } = this.state;
    return sortDate === -1 && sortBy === 1;
  }
  // this.isDateUpwardShown
  get isNameUpwardShown() {
    const { sortName, sortBy } = this.state;
    return sortName === -1 && sortBy === 2;
  }
  // this.isDateDownwardShown
  get isNameDownwardShown() {
    const { sortName, sortBy } = this.state;
    return sortName === 1 && sortBy === 2;
  }

  errorInfoNoRepeatInputFunc(value) {
    const { errorInfoNoRepeatInput, editing } = this.state;
    return errorInfoNoRepeatInput !== false && editing === value.id;
  }

  errorInfoNoSpaceInputFunc(value) {
    const { errorInfoNoSpaceInput, editing } = this.state;
    return errorInfoNoSpaceInput !== false && editing === value.id;
  }

  onClickAdd = () => {
    const newId = this.nextId;
    this.nextId += 1;
    var textAdd = this.state.inputValue.trim();
    let { todos, errorInputLine, errorInfoNoRepeat, errorInfoNoSpace, newTodos } = this.state;
    if(textAdd === ""){
      this.setState({inputValue:"", todos: newTodos, errorInputLine: true, errorInfoNoSpace: true });
      return;
    } else {
      this.setState({ errorInputLine: false, errorInfoNoSpace: false });
    }

    let sameCheck = todos.find(function(item, index, array){
      return item.name === textAdd;  
    });

    if (sameCheck!==undefined){
      this.setState({ errorInputLine: true, errorInfoNoRepeat: true })
      return;
    } else {
      this.setState({ errorInputLine: false, errorInfoNoRepeat: false })
    }

    var dateNow = new Date();
    
    this.setState({
      inputValue: "",
      todos: [
        ...this.state.newTodos,
        {
          id: newId,
          name: textAdd,
          date: dateNow
          //name: `I am ${newId}`,  // 'I am ' + newId
        },
      ],
      newTodos: [
        ...this.state.newTodos,
        {
          id: newId,
          name: textAdd,
          date: dateNow
          //name: `I am ${newId}`,  // 'I am ' + newId
        },
      ]
    })
  };

  handleSameCheck = () => {
    let { todos, errorInputLine } = this.state;
    var textAdd = this.state.inputValue;
    let sameCheck = todos.find(function(item, index, array){
      return item.name === textAdd;  
    });

    if (sameCheck!==undefined){
      this.setState({ errorInputLine: true })
      return;
    }
      this.setState({ errorInputLine: false })
    }


  onBlurInput = (id, inputValue) => {
    const { todos, newTodos, editingValue, sortBy, editing } = this.state;
    const index = newTodos.findIndex(
      newTodo => newTodo.id === id
    );
    
    let sameCheck = newTodos.find(function(item, index, array){
      return item.name === editingValue && item.id !== id;
    });

    if (sameCheck){
      this.setState({
        editing: id,
        errorInfoNoRepeatInput: true,
      });
      return;
    } else if (editingValue.trim() === "") {
      this.setState({
        editing: id,
        errorInfoNoSpaceInput: true,
      });
      return;
    }
    newTodos[index].name = inputValue;
    this.setState({
      errorInfoNoRepeatInput: false,
      errorInfoNoSpaceInput: false,
      editing: -1,
      newTodos: newTodos,
      todos: newTodos,
    });

    if (sortBy === 2) {
      let {sortName, sortNameBk} = this.state;

      newTodos.sort(function(a, b){
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1*sortName;
        }
        if (nameA > nameB) {
          return -1*sortName;
        }
        return 0;
      })
    } else if (sortBy === 1) {
      var {sortDate, sortDateBk} = this.state;
      newTodos.sort(function (a, b) {
        return (b.date - a.date)*-1*sortDate ;
      });
    }
    this.setState({ newTodos:newTodos, todos:newTodos, anchorEl: null })
  }

  onDelete = (id) => {
    const { newTodos } = this.state;
    const index = newTodos.findIndex(
      newTodo => newTodo.id === id
    );
    newTodos.splice(index, 1);
    this.setState({ 
      newTodos: newTodos,
      todos: newTodos,
    })
  };

  textChange = (id, value) => {
    const { todos, editingValue } = this.state;
    const index = todos.findIndex(
      todo => todo.id === id
    );

    todos[index].name = value;
    this.setState({ 
      todos: todos,
      editingValue: todos[index].name,
      errorInfoNoRepeatInput: false,
      errorInfoNoSpaceInput: false
     });
  }

  textChangeBind = (value) => {
    const { editing, editingValue, newTodos } = this.state;
    if(editing===-1){
      this.setState({
        editing: editing === value.id ? -1 : value.id,
        editingValue: value.name,
      });
    }else{
      let sameCheck = newTodos.find(function(item, index, array){
        return item.name === editingValue && item.id !== value.id;
      });
      if (sameCheck){
        this.setState({ errorInfoNoRepeatInput: true })
        return;
      } else if (editingValue.trim() === "") {
        this.setState({ errorInfoNoSpaceInput: true, errorInfoNoRepeatInput: false })
        return;
      }
      this.setState({
        editing: editing === value.id ? -1 : value.id,
        editingValue: value.name,
        errorInfoNoRepeatInput: false,
        errorInfoNoSpaceInput: false,
      });
    }
  }

  // https://pjchender.blogspot.com/2017/01/es6-object-destructuring.html


  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.findIndex(item => item.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  searchClick = (event) => {

    const {todos} = this.state;
    var {newTodos} = this.state;

    let { errorInputLine, errorInfoNoRepeat, errorInfoNoSpace } = this.state;
    var textAdd = this.state.inputValue;
    let sameCheck = newTodos.find(function(item, index, array){
      return item.name === textAdd;  
    });

    this.setState({ inputValue: event.target.value, errorInputLine: false, errorInfoNoRepeat: false, errorInfoNoSpace: false })  

    if (event.target.value === '') {
      this.setState({ todos: newTodos })
    } else {
      const options = {
        keys: ['name']
      };
      const fuse = new Fuse(newTodos, options); 
      const result = fuse.search(event.target.value);

      console.log(result);
      this.setState({ todos: result })
    }
    
  };

  SortByName = () => {

    let newTodos = [...this.state.newTodos];
    var {sortName, sortNameBk} = this.state;

    newTodos.sort(function(a, b){
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1*sortName;
      }
      if (nameA > nameB) {
        return 1*sortName;
      }

      return 0;
    })

    this.setState({ newTodos:newTodos, todos:newTodos, sortName:sortName*-1, anchorEl: null, sortBy: 2 })
  }

  SortByDate = () => {
    let newTodos = [...this.state.newTodos];
    var {sortDate, sortDateBk} = this.state;

    newTodos.sort(function (a, b) {
      return (b.date - a.date)*sortDate ;
    });

    this.setState({ newTodos:newTodos, todos:newTodos, sortDate:sortDate*-1, anchorEl: null, sortBy: 1 })
  }

  handleOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };



  render() {
    console.log('todos', this.state.todos);
    console.log('newTodos', this.state.newTodos);
    const { classes } = this.props;
    let { todos, editing, editingValue, errorInputLine, errorInfoNoSpace, errorInfoNoRepeat, sortName, sortDate, sortBy } = this.state;
    const { anchorEl } = this.state;

    var textAdd = this.state.inputValue;
    let sameCheck = todos.find(function(item, index, array){
      return item.name === textAdd;  
    });

    return (
      <div className={classes.root}>
        <Input
            type="text"
            value={this.state.inputValue}
            onChange={event => this.searchClick(event)}
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
            className={classes.button}
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

        {/* <div className="searchDiv">
          <Input
              type="text"
              value={this.state.searchValue}
              onChange={(event) => this.searchClick(event)}
              placeholder="enter key words"
              inputProps={{
                'aria-label': 'Description',
              }}
              className="searchInput"
              disableUnderline="true"
          />
          <SearchIcon
            className="SearchIcon"
            color="disabled"
          />
        </div> */}

        <div className="listDiv">

          <div className="filterListDiv"
               style={{ display: todos.length === 0 && 'none' }}
          >
            <FormControl className={classes.formControl} >
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
                            style={{ backgroundColor: sortBy === 1 && '#F5F5F5'}}
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
                            style={{ backgroundColor: sortBy === 2 && '#F5F5F5'}}
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
            {todos.map((value, index) => {
              return <ListItem
                key={index}
                role={undefined}
                dense
                // button
                className={classes.listItem}
              >
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  onClick={this.handleToggle(value)}
                  tabIndex={-1}
                  disableRipple
                />

                <ListItemText
                  className='ListItemText'
                >

                  <input
                    autoFocus={editing}
                    value={editingValue}
                    onChange={(event) => this.textChange(value.id, event.target.value)}
                    className="valinput"
                    style={{ display: editing !== value.id && 'none' }}
                    onBlur={(event) => this.onBlurInput(value.id, event.target.value)}
                  />
                  <span
                    style={{ display: editing === value.id && 'none' }}
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
                      onClick={() => this.onDelete(value.id)}
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

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxList);
