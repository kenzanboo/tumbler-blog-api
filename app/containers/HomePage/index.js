/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import H2 from 'components/H2';
import Input from './Input';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import RepoListItem from 'containers/RepoListItem';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeBlog, changeTag } from './actions';
import { selectBlog, selectTag } from './selectors';
import { selectAddedRepo, selectRepos, selectLoading, selectError } from 'containers/App/selectors';
import Button from 'components/Button'


export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.blog && this.props.blog.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    let mainContent = null;

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);

    // Show an error if there is one
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (this.props.repos !== false) {
      mainContent = (<List items={this.props.repos} component={RepoListItem} />);
    }

    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'A React.js Boilerplate application homepage' },
          ]}
        />
        <div>

          <Section>
            <H2>
              Tumbler API
            </H2>
            <Form onSubmit={this.props.onSubmitForm}>
              <label htmlFor="blog">
                <FormattedMessage {...messages.blogMessage} />
                <Input
                  id="blog"
                  type="text"
                  placeholder="kenzanboo"
                  value={this.props.blog}
                  onChange={this.props.onChangeBlog}
                />
              </label>
            </Form>
            <Form onSubmit={this.props.onSubmitForm}>
              <label htmlFor="tag">
                <FormattedMessage {...messages.tagMessage} />
                <Input
                  id="tag"
                  type="text"
                  placeholder="gif"
                  value={this.props.tag}
                  onChange={this.props.onChangeTag}
                />
              </label>
            </Form>
            <Button onClick={this.props.onSubmitForm}>Search</Button>
            {mainContent}

            <List items={this.props.addedRepo} component={RepoListItem} componentProps={{ removeButton: true }}/>
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeBlog: (evt) => dispatch(changeBlog(evt.target.value)),
    onChangeTag: (evt) => dispatch(changeTag(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: selectRepos(),
  blog: selectBlog(),
  tag: selectTag(),
  loading: selectLoading(),
  error: selectError(),
  addedRepo: selectAddedRepo(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
