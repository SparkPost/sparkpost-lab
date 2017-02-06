import React from 'react';
import config from '../../config';
import { Link } from 'react-router';

export default (props) => (
<div className="panel panel--accent">
    <div className="panel__body clearfix paddingBottom--none">
        <h4 className="float--left">{props.name}</h4>
      <h6 className="float--right text--green"><span className="fa fa-circle"></span> live</h6>
    </div>
    <div className="panel__body clearfix">
      <div className="float--left">{props.localpart}@{config.email_domain}</div>
      <Link to={`/campaign/${props.id}`} className="float--right">Play <span className="fa fa-chevron-right"></span></Link>
    </div>
</div>);
