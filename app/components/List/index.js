import React from 'react';

import Ul from './Ul';
import Wrapper from './Wrapper';

function List(props) {
  const ComponentToRender = props.component;
  let content = (<div></div>);

  // If we have items, render them
  if (props.items) {
    content = props.items.map((item, index) => (
      <ComponentToRender key={`item-${index}`} item={item} {...props.componentProps}/>
    ));
  } else {
    // Otherwise render a single component
    content = (<ComponentToRender {...props.componentProps}/>);
  }

  return (
    <Wrapper>
      <Ul>
        {content}
      </Ul>
    </Wrapper>
  );
}

List.propTypes = {
  component: React.PropTypes.func.isRequired,
  componentProps: React.PropTypes.object,
  items: React.PropTypes.array,
};

export default List;
