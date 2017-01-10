/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');

const selectUsername = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('username')
);
const selectTag = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('tag')
);

export {
  selectHome,
  selectUsername,
  selectTag,
};
