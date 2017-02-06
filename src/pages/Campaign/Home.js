import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config';
import challenges from '../../../server/challenges';
import ChallengeCard from '../../components/ChallengeCard';
import _ from 'lodash';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      campaign: {},
      challenges: {},
    };
  }

  componentWillMount() {
    axios.get(`${config.api_base}/api/campaigns/${this.props.params.campaign_id}`)
      .then(({ data }) => {
        let campaign = data.results;
        
        if (!campaign)
          this.props.router.push(`/`);

        this.setState({ campaign, challenges });
      });
  }

  handleSubmit(e) {
    e.preventDefault();

    let { playerKey } = this.state;
    let validKey = playerKey.indexOf('@') > 0 || !isNaN(playerKey);

    this.setState({hasError: !validKey, errorMessage: undefined });

    if (validKey) {
      axios.get(`${config.api_base}/api/players/?search=${playerKey}`)
        .then(({ data }) => {
          let player = data.results;

          if (player) {
            this.props.router.push(`/campaign/${this.props.params.campaign_id}/player/${player.id}`);
          }
          else {
            let searchType = playerKey.indexOf('@') > 0 ? 'email' : 'SparkPost account';
            this.setState({hasError: true, errorMessage: `Looks like no one has ever played with that ${searchType}`});
          }
        });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="flex center-xs">
          <div className="col-xs-8 text--left">
            <div>
              <h3>View your progress!</h3>
              <form onSubmit={ (e) => this.handleSubmit(e) }>
                <fieldset className="fieldset">
                  <div className={`input__group ${this.state.hasError ? 'has-error' : ''}`}>
                    <input className="input__text input--full" onChange={(e) => this.setState({playerKey: e.target.value})} type="text" placeholder="Email or SparkPost ID" />
                    <div className="input__error">{this.state.errorMessage ? this.state.errorMessage : 'Please enter a valid email or SparkPost id'}</div>
                    <span className="input__buttonWrapper">
                      <button className="button button--full">Go</button>
                    </span>
                  </div>
                </fieldset>
              </form>
            </div>
            { _.map(challenges, (challenge, id) => {
              return (<ChallengeCard key={id} {...challenge} campaign={this.state.campaign}/>);
            }) }
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
