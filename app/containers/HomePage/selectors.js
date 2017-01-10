/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');

const selectBlog = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('blog')
);
const selectTag = () => createSelector(
  selectHome(),
  (homeState) => homeState.get('tag')
);

export {
  selectHome,
  selectBlog,
  selectTag,
};
