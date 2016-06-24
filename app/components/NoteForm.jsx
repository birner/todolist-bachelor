import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import ListActions from '../actions/ListActions';

export default class ListForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      text: ''
    };
    this.changeContent = this.changeContent
      .bind(this);
    this.handleSubmit = this.handleSubmit
      .bind(this);
    this.addNote = this.addNote
      .bind(this);
  };
  render () {
    return (
      <form className="noteForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="New Task" value={this.state.text} onChange={this.changeContent}/>
        <input type="submit" value="+"/>
      </form>
    );
  }
  handleSubmit (e) {
    e.preventDefault();
    const text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.addNote(text);
    this.setState({text: ''})
  }
  changeContent (e) {
    this.setState({text: e.target.value})
  }
  addNote(text){
    const listId = this.props.list.id;
    const note = NoteActions.create({task: text});

    ListActions.attachToList({noteId: note.id, listId});
  };
}
