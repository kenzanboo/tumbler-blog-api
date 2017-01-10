/**
 * Gets the repositories of the user from Github
 */
import { format } from 'url';
import config from '../../config/config';
import secrets from '../../config/secrets';
import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_REPOS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { selectUsername, selectTag } from 'containers/HomePage/selectors';

const getTagUrl = ({ tag }) => {
  const uriOptions = {
    protocol: 'https',
    hostname: `${config.apiUrl.tumbler}/tagged`,
    query: {
      tag,
      api: secrets.apiKey.tumbler
    }
  };
  return format(uriOptions);
};

const getBlogUrl = ({ blog, tag }) => {
  const uriOptions = {
    protocol: 'https',
    hostname: `${config.apiUrl.tumbler}/blog/${blog}.tumblr.com/posts`,
    query: {
      tag,
      api: secrets.apiKey.tumbler
    }
  };
  return format(uriOptions);
};


/**
 * Github repos request/response handler
 */
export function* getRepos() {
  // Select username from store
  const username = yield select(selectUsername());
  const tag = yield select(selectTag());
  const requestURL = `https://api.github.com/users/${username}/repos?type=all&sort=updated`;

  console.log(getTagUrl({ tag }));
  console.log(getBlogUrl({blog: 'blog', tag }));

  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    yield put(reposLoaded(repos, username));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

/**
 * Watches for LOAD_REPOS actions and calls getRepos when one comes in.
 * By using `takeLatest` only the result of the latest API call is applied.
 */
export function* getReposWatcher() {
  yield fork(takeLatest, LOAD_REPOS, getRepos);
}

/**
 * Root saga manages watcher lifecycle
 */
export function* githubData() {
  // Fork watcher so we can continue execution
  const watcher = yield fork(getReposWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  githubData,
];
