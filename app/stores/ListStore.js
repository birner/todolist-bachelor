import uuid from 'node-uuid';
import alt from '../libs/alt';
import ListActions from '../actions/ListActions';
import update from 'react-addons-update';

class ListStore {
  constructor() {
    this.bindActions(ListActions);

    this.lists = [];
  }
  create(list) {
    const lists = this.lists;
    console.log(lists);

    list.id = uuid.v4();
    list.notes = list.notes || [];

    this.setState({
      lists: lists.concat(list)
    });
  }
  update(updatedList) {
    const lists = this.lists.map(list => {
      if(list.id === updatedList.id) {
        return Object.assign({}, list, updatedList);
      }

      return list;
    });

    this.setState({lists});
  }
  delete(id) {
    this.setState({
      lists: this.lists.filter(list => list.id !== id)
    });
  }
  attachToList({listId, noteId}) {
    const lists = this.lists.map(list => {
      if(list.notes.includes(noteId)) {
        list.notes = list.notes.filter(note => note !== noteId);
      }

      if(list.id === listId) {
        if(list.notes.includes(noteId)) {
          console.warn('Already attached note to List', lists);
        }
        else {
          list.notes.push(noteId);
        }
      }

      return list;
    });

    this.setState({lists});
  }
  detachFromList({listId, noteId}) {
    const lists = this.lists.map(list => {
      if(list.id === listId) {
        list.notes = list.notes.filter(note => note !== noteId);
      }

      return list;
    });

    this.setState({lists});
  }
  move({sourceId, targetId}) {
    const lists = this.lists;
    const sourceList = lists.filter(list => list.notes.includes(sourceId))[0];
    const targetList = lists.filter(list => list.notes.includes(targetId))[0];
    const sourceNoteIndex = sourceList.notes.indexOf(sourceId);
    const targetNoteIndex = targetList.notes.indexOf(targetId);

    if(sourceList === targetList) {
      // move at once to avoid complications
      sourceList.notes = update(sourceList.notes, {
        $splice: [
          [sourceNoteIndex, 1],
          [targetNoteIndex, 0, sourceId]
        ]
      });
    }
    else {
      // get rid of the source
      sourceList.notes.splice(sourceNoteIndex, 1);

      // and move it to target
      targetList.notes.splice(targetNoteIndex, 0, sourceId);
    }

    this.setState({lists});
  }
}

export default alt.createStore(ListStore, 'ListStore');
