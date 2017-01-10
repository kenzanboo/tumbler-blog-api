/**
 * Gets the repositories of the user from Github
 */
import _ from 'lodash';
import { format } from 'url';
import config from '../../config/config';
import secrets from '../../config/secrets';
import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_REPOS } from 'containers/App/constants';
import { reposLoaded, repoLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { selectBlog, selectTag } from 'containers/HomePage/selectors';

const getTagUrl = ({ tag }) => {
  const uriOptions = {
    protocol: 'https',
    hostname: `${config.apiUrl.tumbler}/tagged`,
    query: {
      tag,
      api_key: secrets.apiKey.tumbler,
      limit: 5
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
      api_key: secrets.apiKey.tumbler,
      limit: 5
    }
  };
  return format(uriOptions);
};


/**
 * Github repos request/response handler
 */
export function* getRepos() {
  const blog = yield select(selectBlog());
  const tag = yield select(selectTag());
  let requestURL;
  if (blog) {
    requestURL = getBlogUrl({ blog, tag });
  } else {
    requestURL = getTagUrl({ tag });
  }

  try {
    // Call our request helper (see 'utils/request')
    console.log(requestURL); // todo remove
    const response = yield call(request, requestURL);
    // /posts and /tagged calls have slightly different placement of posts
    const repos = _.get(response, 'response.posts') || _.get(response, 'response');
    console.log(repos); // todo remove
    yield put(reposLoaded(repos, blog));
  } catch (err) {
    console.log('ERROR', err);
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
