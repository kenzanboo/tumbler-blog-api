/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import {
  ADD_REPO,
  REMOVE_REPO,
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
} from './constants';
import { fromJS, List } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  addedRepo: new Set(),
  updatedTimeStamp: 0,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_REPO:
      const updatedSet = state.get('addedRepo').add(action.repo);
      return state
        .set('addedRepo', updatedSet)
        .set('updatedTimeStamp', new Date()); // this is required for Set to update and trigger component update
        //something to do with immutable objects and sets not realizing there is an update
    case REMOVE_REPO:
      state.get('addedRepo').delete(action.repo); // delete does not return original as per documentation. returns true
      return state
        .set('updatedTimeStamp', new Date()); // this is required for Set to update and trigger component update
    //something to do with immutable objects and sets not realizing there is an update
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
