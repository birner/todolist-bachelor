import AltContainer from 'alt-container';
import React from 'react';
import Lists from './Lists.jsx';
import ListForm from './ListForm.jsx';
import ListActions from '../actions/ListActions';
import ListStore from '../stores/ListStore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
  render() {
    return (
      <div>
        <div className="header">
          <span className="app-name">TodoList</span>
          <ListForm type="add-list"/>
        </div>

        <AltContainer
          stores={[ListStore]}
          inject={{
            lists: () => ListStore.getState().lists || []
          }}
        >
          <Lists />
        </AltContainer>
      </div>
    );
  }
}
