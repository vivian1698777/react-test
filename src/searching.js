import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Fuse from 'fuse.js';

class Searching extends React.Component {
  constructor (props) {
    super(props);
    this.searchClick = this.searchClick.bind(this);

    // this.onClick = this.onClick.bind(this);

    this.state = {
      inputValue: "",
      todos: [
      ]
    }
  }

  searchClick() {
    // var textSearch = this.state.inputValue;

    const {todos} = this.state;
    
    var options = {
      keys: ['name']
    };
    var fuse = new Fuse(todos, options); // "todos" is the item array
    var result = fuse.search(this.state.inputValue);
    

    var newData = Object.keys(todos).map(function(key) {
      return { name: todos[key]};
    }) 
    console.log(todos);

    this.setState({ todos: result })
  };


  render() {
    const { classes } = this.props;
    let todos = this.state.todos;
    

    return (
      <div className="">
        <Input
            type="text"
            value={this.state.inputValue}
            onChange={event => this.setState({ inputValue: event.target.value })}
            placeholder="enter key words"
            inputProps={{
              'aria-label': 'Description',
            }}
            className="searchInput"
        />
        <Button 
            onClick={this.searchClick}
            variant="contained" 
            color="primary" 
            // className={classes.button}
        >
            Add item
        </Button>
      </div>
    );
  }
}



// export default withStyles(styles)(searching);
export default Searching;