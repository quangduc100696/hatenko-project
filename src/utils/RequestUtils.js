import { GATE_EVN, GATEWAY } from 'configs';
import axios from 'axios';

class RequestUtils {

	static encodeQueryData(data) {
		if(!data) {
			return '';
		}
		const ret = [];
		for (let d in data) {
			if(!data[d]) {
				continue;
			}
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
		}
		return ret.length > 0 ? ('?' + ret.join('&')) : '';
	}

	static generateUrlGetParams (enpoint, params = {}) {
		return String(enpoint).concat(this.encodeQueryData(params));
	}

	static httpRequest( input, service, method = 'GET', params = '') {
	   const urlDomainApi = ['/context-type/fetch', '/enterprice/fetch?limit=10', '/enterprice/create', '/context-type/create', '/context-type/update', '/context/fetch']
		const _uri = urlDomainApi.includes(service) ? GATE_EVN.configAi + service : GATEWAY + service;
		let getOrPost;
		if (method === 'GET') {
			getOrPost = axios.get(_uri + this.encodeQueryData(input));
		} else {
			getOrPost = axios.post(_uri + this.encodeQueryData(params), input);
		}
		return getOrPost.then(({ data }) => {
			return data;
		}).catch( (response) => {
			return response;
		});
	}

	static Get(service, input = {}) {
		return this.httpRequest( input, service, 'GET' );
	}

	 static async GetAsList(service, input = {}) {
		let { data, errorCode } = await this.httpRequest( input, service, 'GET' );
		return errorCode === 200 ? data : [];
	}

	static Post(service, input = {}, params = {}) {
		return this.httpRequest( input, service, 'POST', params );
	}

	static getJsonFromUrl(url) {
		if(!url) return {};
		var query = url.substr(1);
		var result = {};
		query.split("&").forEach(function(part) {
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	}
}

export default RequestUtils;
