import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Checklist extends React.Component {
  constructor(props) {
    super(props);
    this.newItem = React.createRef();
    this.nextId = 4;

    this.state = {
      editing: -1,  // 目前編輯的id
      todos: [ // todo 項目們
        { id: 1, name: 'hello', number: 1, completed: false },
        { id: 2, name: 'great', number: 2, completed: true },
        { id: 3, name: 'world', number: 3, completed: false },
      ],
    };

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  onClickAdd() {
    const newId = this.nextId;
    this.nextId += 1;
    const newNum = Math.floor(Math.random() * 500);

    this.setState({
      todos: [
        ...this.state.todos,
        {
          id: newId,
          name: this.newItem.current.value,  // 'I am ' + newId
          number: newNum,
          completed: false,
        },
      ],
    });
  }

  onDelete(index) {
    const { todos } = this.state;
    this.setState({ todos: [...todos.slice(0, index), ...todos.slice(index + 1)] });
  }

  onChangeText(index, value) {
    const { todos } = this.state;;
    todos[index].name = value;

    this.setState({ todos });
  }

  toggleEditing(id) {
    const { editing } = this.state;

    this.setState({
      editing: editing === id ? -1: id,
    });
  }

  toggleCheckbox(index) {
    const { todos } = this.state;
    const checked = !!todos[index].checked;
    const target = todos[index]; // { xxxxx }

    const obj = { a: 'apple' };

    this.setState({
      todos: [
        ...todos.slice(0, index),
        { ...target, checked: !checked },
        ...todos.slice(index + 1),
      ]
    });
  };

  render() {
    const { classes } = this.props;
    let { todos, editing } = this.state;

    return (
      <div className={classes.root}>
        <TextField
          id="newItem"
          name="newItem"
          innerRef={this.newItem}
        />
        <Button variant="contained" color="primary" className={classes.button} onClick={this.onClickAdd}>
          Add item
        </Button>
        <List>
          {todos.map((todo, index) => {
            return (
              <ListItem
                key={index}
                className={classes.listItem}
              >
                <Checkbox
                  checked={!!todo.checked}
                  onChange={(event) => {event.stopPropagation(); this.toggleCheckbox(index);}}
                />
                <ListItemText>
                  <TextField
                    className={classes.textField}
                    defaultValue={todo.name}
                    onChange={event => {event.stopPropagation(); this.onChangeText(index, event.target.value)}}
                    style={{ display: editing !== todo.id && 'none' }}
                    onBlur={this.toggleEditing}
                  />
                  <span style={{ display: editing === todo.id && 'none' }}>{todo.name}</span>
                   ,{todo.number}, {todo.completed ? '已完成' : '未完成'}
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Create">
                    <CreateIcon onClick={() => this.toggleEditing(todo.id)} />
                  </IconButton>
                  <IconButton aria-label="Delete">
                    <DeleteIcon onClick={() => this.onDelete(index)} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Checklist);
