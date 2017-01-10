/**
 * RepoListItem
 *
 * Lists the name and the issue count of a repository
 */

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedNumber } from 'react-intl';

import IssueIcon from './IssueIcon';
import IssueLink from './IssueLink';
import ListItem from 'components/ListItem';
import RepoLink from './RepoLink';
import Wrapper from './Wrapper';
import { selectCurrentUser } from 'containers/App/selectors';

export class RepoListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const item = this.props.item;

    // Put together the content of the repository
    const content = (
      <Wrapper>
        <RepoLink href={item.short_url} target="_blank">
          <div>{item.blog_name}</div>
          <div>{item.summary}</div>
          <div>{item.type == 'photo' &&
            <img src={_.get(item, `photos[0].alt_sizes[3].url`)} />
          }</div>
        </RepoLink>
      </Wrapper>
    );

    // Render the content into a list item
    return (
      <ListItem key={`repo-list-item-${item.full_name}`} item={content} />
    );
  }
}

RepoListItem.propTypes = {
  item: React.PropTypes.object,
  currentUser: React.PropTypes.string,
};

export default connect(createSelector(
  selectCurrentUser(),
  (currentUser) => ({ currentUser })
))(RepoListItem);
