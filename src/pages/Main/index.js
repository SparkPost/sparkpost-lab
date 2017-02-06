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
          <p className="marginBottom--lg">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui animi consectetur voluptatem, nisi quas consequuntur non reprehenderit laboriosam dicta. Molestias non eligendi consequuntur, praesentium voluptatibus repudiandae quasi iusto ducimus ipsum, nostrum tempore sit aspernatur cumque quod provident aliquid totam! Sapiente.</p>
          { this.state.campaigns.map((campaign) => <CampaignCard key={campaign.id} {...campaign} />)}

          { !this.state.campaigns.length ? <h1 className="text--center">Check back later.</h1> : '' }
        </div>
      </div>
    );
  }
}

export default Main;