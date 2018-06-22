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
      errorInputLine:false,
      errorInfoNoRepeat:false,
      errorInfoNoSpace:false,
      sortName:1,
      sortDate:1,
      sortBy: 1,
      inputValue: "",
      // searchValue: "",
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


  onBlurInput = () => {
    this.setState({
      editing: -1,
    });
    console.log("blur");
  }

  onDelete = (id) => {
    const { todos } = this.state;
    const index = todos.findIndex(
      todo => todo.id === id
    );
    todos.splice(index, 1);
    this.setState({ todos: todos })
  };

  textChange = (id, value) => {
    const { todos } = this.state;
    const text = todos.findIndex(
      todo => todo.id === id
    );

    todos[text].name = value;

    this.setState({ todos: todos });
  }

  textChangeBind = (value) => {
    const { editing } = this.state;
    this.setState({
      editing: editing === value.id ? -1 : value.id,
    });
  }

  // https://pjchender.blogspot.com/2017/01/es6-object-destructuring.html


  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
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

      this.setState({ todos: result })
    }
    
  };

  SortByName = () => {

    let todos = [...this.state.todos]
    var {sortName, sortNameBk} = this.state;

    todos.sort(function(a, b){
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

    this.setState({ todos:todos, sortName:sortName*-1, anchorEl: null, sortBy: 2 })
  }

  SortByDate = () => {
    let todos = [...this.state.todos];
    var {sortDate, sortDateBk} = this.state;

    todos.sort(function (a, b) {
      return (a.date - b.date)*sortDate ;
    });

    this.setState({ todos:todos, sortDate:sortDate*-1, anchorEl: null, sortBy: 1 })
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
    const { classes } = this.props;
    let { todos, editing, errorInputLine, errorInfoNoSpace, errorInfoNoRepeat, sortName, sortDate, sortBy } = this.state;
    const { anchorEl } = this.state;

    var textAdd = this.state.inputValue;
    let sameCheck = todos.find(function(item, index, array){
      return item.name === textAdd;  
    });

    return (
      <div className={classes.root}>
        <Input
            type="text"
            // value={this.textInput ? console.log(this.textInput) : ""}
            // ref={this.textInput}
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
            style={{ display: errorInfoNoRepeat == false && 'none' }}
        >
          Your list name cannot be repeated.
        </FormHelperText>

        <FormHelperText 
            id="name-error-text"
            className="name-error-text"
            style={{ display: errorInfoNoSpace == false && 'none' }}
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
               style={{ display: todos.length == 0 && 'none' }}
          >
            <FormControl className={classes.formControl} >
              <IconButton onClick={this.handleOpen}
              >
                <SortByAlpha className="SortByAlpha"
                                // style={{ display: sortIcon == false && 'none' }}
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
                    defaultValue={value.name}
                    onChange={(event) => this.textChange(value.id, event.target.value)}
                    className="valinput"
                    style={{ display: editing !== value.id && 'none' }}
                    onBlur={() => this.onBlurInput()}
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
                  {/* , object {value.number}, {value.completed ? '已完成' : '未完成'} */}
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
