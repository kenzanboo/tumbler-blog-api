/*
 * HomeReducer
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
  CHANGE_BLOG,
  CHANGE_TAG
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  blog: '',
  tag: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_BLOG:
      return state
        .set('blog', action.name);
    case CHANGE_TAG:
      return state
        .set('tag', action.name);
    default:
      return state;
  }
}

export default homeReducer;
