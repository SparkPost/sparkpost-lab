import React, { Component } from 'react';
import CampaignCard from '../../components/CampaignCard';
import config from '../../config';
import axios from 'axios';

class Main extends Component {

  constructor(props) {
    super(props);

    this.state = {
      campaigns: []
    };
  }

  componentWillMount() {
    axios.get(`${config.api_base}/api/campaigns`)
      .then(({ data }) => {
        this.setState({campaigns: data.results});
      });
  }

  render() {
    return (
      <div className="flex">
        <div className="col-xs-8 col-xs-offset-2">
          <p className="marginBottom--lg">Learn how to use SparkPost by completing challenges using your SparkPost account. The more challenges you complete, the more awesome SparkPost Swag you could receive.</p>
          { this.state.campaigns.map((campaign) => <CampaignCard key={campaign.id} {...campaign} />)}

          { !this.state.campaigns.length ? <h1 className="text--center">Check back later.</h1> : '' }
        </div>
      </div>
    );
  }
}

export default Main;
