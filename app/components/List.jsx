import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteForm from './NoteForm.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import ListStore from '../stores/ListStore';
import ListActions from '../actions/ListActions';
import Editable from './Editable.jsx';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(!targetProps.list.notes.length) {
      ListActions.attachToList({
        listId: targetProps.list.id,
        noteId: sourceId
      });
    }
  }
};

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class List extends React.Component {
  render() {
    const {connectDropTarget, list, ...props} = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className="list-header" onClick={this.activateListEdit}>
          {/*<div className="List-add-note">
            <button onClick={this.addNote}>+</button>
          </div>*/}
          <Editable className="list-name" editing={list.editing}
            value={list.name} onEdit={this.editName} />
          <div className="list-delete">
            <button onClick={this.deleteList}>x</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(list.notes)
          }}
        >
          <Notes
            onValueClick={this.activateNoteEdit}
            onEdit={this.editNote}
            onDelete={this.deleteNote} />
        </AltContainer>
        <NoteForm list={this.props.list}/>
      </div>
    );
  }
  editNote(id, task) {
    // Don't modify if trying to set an empty value
    if(!task.trim()) {
      NoteActions.update({id, editing: false});

      return;
    }

    NoteActions.update({id, task, editing: false});
  }
  deleteNote = (noteId, e) => {
    e.stopPropagation();

    const listId = this.props.list.id;

    ListActions.detachFromList({listId, noteId});
    NoteActions.delete(noteId);
  };
  editName = (name) => {
    const listId = this.props.list.id;

    // Don't modify if trying to set an empty value
    if(!name.trim()) {
      ListActions.update({id: listId, editing: false});

      return;
    }

    ListActions.update({id: listId, name, editing: false});
  };
  deleteList = () => {
    const listId = this.props.list.id;

    ListActions.delete(listId);
  };
  activateListEdit = () => {
    const listId = this.props.list.id;

    ListActions.update({id: listId, editing: true});
  };
  activateNoteEdit(id) {
    NoteActions.update({id, editing: true});
  }
}
