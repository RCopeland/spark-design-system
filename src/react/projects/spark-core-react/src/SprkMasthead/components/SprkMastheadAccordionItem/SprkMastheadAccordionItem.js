import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SprkIcon from '../../../SprkIcon/SprkIcon';

class SprkMastheadAccordionItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: this.props.link.defaultOpen || false,
      height: this.props.link.defaultOpen ? 'auto': 0};
    this.toggleAccordionOpen = this.toggleAccordionOpen.bind(this);
  }

  toggleAccordionOpen() {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
      height: !prevState.isOpen ? 'auto' : 0
    }));
  }

  render() {
    const {link, ...rest} = this.props;
    const {isOpen, height} = this.state;
    return (
        <li
          className={classNames(
            "sprk-c-MastheadAccordion__item",
            { "sprk-c-MastheadAccordion__item--open": isOpen },
            { "sprk-c-MastheadAccordion__item--active": link.isActive },
            link.additionalClasses,
            )} {...rest}>
          { (link.subNavLinks && link.containerText) &&
          <React.Fragment>
            <a href="#nogo" className="sprk-c-MastheadAccordion__summary" onClick={this.toggleAccordionOpen}>
              <span className="sprk-b-TypeBodyOne sprk-c-MastheadAccordion__heading">
                {link.containerText}
              </span>
              <SprkIcon additionalClasses={classNames({'sprk-c-Icon--open': isOpen})} iconType="chevron-down" />
            </a>
            <AnimateHeight duration={300} height={height}>
              <ul className="sprk-b-List sprk-b-List--bare sprk-c-MastheadAccordion__details">
                {link.subNavLinks.map((subnavlink, id) => {
                  return (
                    <li key={id}>
                      {subnavlink}
                    </li>
                  );
                })}
              </ul>
            </AnimateHeight>
          </React.Fragment>
        }
        { !link.subNavLinks && link.link }
        </li>
    );
  }
}

SprkMastheadAccordionItem.propTypes = {};

export default SprkMastheadAccordionItem;
