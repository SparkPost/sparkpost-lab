import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config';
import challenges from '../../../server/challenges';
import ChallengeCard from '../../components/ChallengeCard';
import _ from 'lodash';
import moment from 'moment';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      campaign: {},
      player: {},
      challenges: {},
      loading: true
    };
  }

  componentWillMount() {
    this.load();
  }

  load() {
    this.setState({
      loading: true
    });

    let campaign, player, completions;

    axios.get(`${config.api_base}/api/campaigns/${this.props.params.campaign_id}`)
      .then(({ data }) => {
        campaign = data.results;
        
        if (!campaign)
          this.props.router.push(`/`);

        return axios.get(`${config.api_base}/api/players/${this.props.params.player_id}/completions/${this.props.params.campaign_id}`)
      })
      .then(({ data }) => {
        completions = data.results;

        _.each(completions, (completion) => {
          if (_.has(challenges, completion.challenge_id))
            challenges[completion.challenge_id]['completed'] = true;
        });

        _.each(challenges, (challenge) => {
          challenge.unlocked = true;

          if (!challenge.completed) {
            return false;
          }
        });

        return axios.get(`${config.api_base}/api/players/${this.props.params.player_id}`)
      })
      .then(({ data }) => {
        player = data.results;
      
        if (!player)
            this.props.router.push(`/`);

        let allDone = _.filter(challenges, (challenge) => {
          return !challenge.completed;
        } ).length === 0;
        
        setTimeout(() => {
          this.setState({ campaign, challenges, player, completions, allDone, loading: false, loaded_at: moment() });
        }, 100);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="flex center-xs">
          <div className="col-xs-8">
          <div className="clearfix marginBottom--xs">
            <h3 className="float--left">Hey {this.state.player.first_name}</h3>
            <div className="float--right text--right">
              { this.state.loading ? <b>Loading</b> : ''}
              { !this.state.loading ? <a onClick={ (e) => { e.preventDefault(); this.load(); } }>refresh <span className="fa fa-chevron-right"></span></a> : '' }
              <div className="text--muted">{ moment(this.state.loaded_at).format("dddd, MMMM Do YYYY, h:mm:ss a") }</div>
            </div>
          </div>
          { _.map(challenges, (challenge, id) => {
            return (<ChallengeCard key={id} {...challenge} isPlayer={true} campaign={this.state.campaign}/>);
          }) }
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
