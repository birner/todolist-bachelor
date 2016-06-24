import React from 'react';
import ListActions from '../actions/ListActions';

export default class ListForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
    this.changeContent = this.changeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  render() {
    return (
      <form className="listForm" onSubmit={this.handleSubmit}>
       <input
         type="text"
         placeholder="Create new TodoList"
         value={this.state.text}
         onChange={this.changeContent}
       />
       <input type="submit" value="+"/>
     </form>
    );
  }
  addList(name) {
    ListActions.create({name: name});
  }
  handleSubmit(e) {
    e.preventDefault();
    const text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.addList(text);
    this.setState({text: ''})
  }
  changeContent(e) {
    this.setState({text: e.target.value})
  }
}
