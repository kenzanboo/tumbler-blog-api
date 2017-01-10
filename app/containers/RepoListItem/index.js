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
import { createStructuredSelector } from 'reselect';
import { addRepo } from 'containers/App/actions';
import Button from 'components/Button'

export class RepoListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const item = this.props.item;
    if (!item) { return <div></div> }
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
        <Button onClick={this.props.onAddRepo.bind(null, this.props.item)}>Add</Button>
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



export function mapDispatchToProps(dispatch) {
  return {
    onAddRepo: (repo) => dispatch(addRepo(repo)),
  };
}

const mapStateToProps = createStructuredSelector({

});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(RepoListItem);
