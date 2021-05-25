import nocache from 'superagent-no-cache';
import request from 'superagent';

const agent = request.agent().use(nocache);

export default agent;