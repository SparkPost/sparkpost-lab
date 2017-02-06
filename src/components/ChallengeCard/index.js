import React, { Component } from 'react';
import _ from 'lodash';

class ChallengeCard extends Component {
  renderPlayerCard() {
    return (
      <div className="panel">
        { !this.props.unlocked ? <div className="panel__overlay flex middle-xs center-xs"><span className="fa fa-lock panel__lock"></span></div> : '' }
        <div className="panel__body">
          <div className="clearfix">
            <h4 className="float--left">{ this.props.name }</h4>
            { this.props.completed ? <p className="float--right text--bold text--green"><span className="fa fa-check-circle"></span> completed</p> : '' }
            { !this.props.unlocked ? <p className="float--right text--bold"><span className="fa fa-lock"></span> locked</p> : '' }
            { this.props.unlocked && !this.props.completed ? <p className="float--right text--bold text--mustard text--muted"><span className="fa fa-tasks"></span> up next</p> : '' }
          </div>
          { this.renderInstructions() }
        </div>
        { this.props.completed ? this.renderCompletedNote() : this.renderLinks() }
      </div>);
  }

  renderGenericCard() {
    return (
      <div className="panel">
        <div className="panel__body">
          <div className="clearfix">
            <h4 className="float--left">{ this.props.name }</h4>
          </div>
          { this.renderInstructions() }
        </div>
        { this.renderLinks() }
      </div>);
  }

  renderInstructions() {
    return (<p dangerouslySetInnerHTML={{ __html: this.props.instructions(this.props) }}></p>);
  }

  renderCompletedNote() {
    return (
      <div className="panel__body paddingTop--xs paddingBottom--xs">
        <h5>Come see us to get your prize</h5>
      </div>
    );
  }

  renderLinks() {
    return this.props.links ? <div className="panel__body paddingTop--xs paddingBottom--xs">{_.map(this.props.links, (link, title) => {
      return (<a key={ title } href={ link } className="marginRight--md">
      <span className="fa fa-info-circle"></span>&nbsp;{ title }</a>);
    })}</div> : '';
  }

  render() {
    return this.props.isPlayer ? this.renderPlayerCard() : this.renderGenericCard();
  }
}

export default ChallengeCard;
