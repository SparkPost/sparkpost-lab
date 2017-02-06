import React, { Component } from 'react';
import axios from 'axios';
import config from '../../config';
import moment from 'moment';

class Admin extends Component {

  constructor(props) {
    super(props);

    this.state = {
      campaigns: [],
      name: '',
      localpart: '',
      loaded_at: moment()
    };
  }

  componentWillMount() {
    this.loadCampaigns();
  }

  handleSubmit(e) {
    e.preventDefault();

  let nameError = false, localpartError = false;

    if (!this.state.name) {
      nameError = true;
    }

    if (!this.state.localpart || !/^\w+$/.test(this.state.localpart || '')) {
      localpartError = true;
    }

    this.setState({ nameError, localpartError });

    if (!nameError && !localpartError) {
      axios.post(`${config.api_base}/api/campaigns/`, {
        name: this.state.name,
        localpart: this.state.localpart,
      })
      .then(({ data }) => {
        this.loadCampaigns();
      });
    }
  }

  loadCampaigns() {
    axios.get(`${config.api_base}/api/campaigns/all`)
      .then(({ data }) => {
        if (data.error) {
          this.props.router.push(`/`);
        }

        this.setState({campaigns: data.results || [] });
      });
  }

  campaignStart(id) {
    axios.put(`${config.api_base}/api/campaigns/${id}/start`)
      .then(() => {
         this.loadCampaigns();
      });
  }

  campaignEnd(id) {
    axios.put(`${config.api_base}/api/campaigns/${id}/end`)
      .then(() => {
        this.loadCampaigns();
      });
  }

  render() {
    return (
      <div className="flex center-xs">
        <div className="col-xs-12 col-md-10 col-lg-7">
          <div className="panel panel--accent">
            <div className="panel__body">
              <h3>Create a Campaign</h3>
              <form onSubmit={ (e) => this.handleSubmit(e) }>
                <fieldset className="fieldset">
                  <label className="label">Campaign Name</label>
                  <div className={`input__group ${this.state.nameError ? 'has-error' : ''}`}>
                    <input className="input__text" onChange={(e) => this.setState({name: e.target.value})} type="text" placeholder="Name" />
                    <div className="input__error">Please enter a valid name.</div>
                  </div>
                </fieldset>
                <fieldset className="fieldset">
                  <label className="label">Campaign email address</label>
                  <div className={`input__group ${this.state.localpartError ? 'has-error' : ''}`}>
                    <input className="input__text input--full" onChange={(e) => this.setState({localpart: e.target.value})} type="text" placeholder="Localpart" />
                    <div className="input__error">Please enter a valid email address.</div>
                    <span className="input__buttonWrapper">
                      <button className="button button--full button--muted" disabled>@{ config.email_domain }</button>
                    </span>
                  </div>
                </fieldset>
                <div className="flex">
                  <div className="col-md-3 col-xs">
                    <button className="button button--full">Go</button>
                  </div>

                  <div className="col-md-9 col-xs text--right">
                    <a href={`${config.api_base}/auth/logout`} className="button button--muted float--right">Logout</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
          { this.state.campaigns.map((campaign) => (
            <div className="panel" key={campaign.id}>
              <div className="panel__body">
                <div className="flex middle-xs">
                  <h3 className="col-xs margin--none">{ campaign.name }</h3>
                  <div className="col-md-6 col-xs-6 text--right">
                    { !campaign.starts_at ? <button className="button button--blue" onClick={() => this.campaignStart(campaign.id)}>Start</button> : ''}
                    { campaign.starts_at && (!campaign.ends_at || moment().isBefore(campaign.ends_at)) ? <button onClick={() => this.campaignEnd(campaign.id)} className="button">End Now</button> : ''}
                    { moment().isAfter(campaign.ends_at) ? <span className="fa fa-check-circle text--green fa-2x"></span> : '' }
                  </div>
                </div>
                { moment().isAfter(campaign.ends_at) ? <div className="text--muted">Ended on { moment(campaign.ends_at).format("dddd, MMMM Do YYYY, h:mm a") }</div> : '' }
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Admin;