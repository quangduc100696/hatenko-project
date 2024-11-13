import { SUCCESS_CODE } from 'configs';
import { arrayEmpty } from 'utils/dataUtils';
import RequestUtils from 'utils/RequestUtils';

const ProductAttrService = {
  attrs: {},
  attrsValue: {},
  empty () {
    this.attrs = {};
    this.attrsValue = {};
  },
	async loadByIds(ids = []) {
		if(!ids || arrayEmpty(ids)) {
			return [];
		}
		let idNeedFetch = [], idResult = [];
		for (let id of ids) {
			if(!this.attrs[id]) {
        idNeedFetch.push(id);
      } else {
        idResult.push(id);
      }
		}
    let datas = [];
    if(arrayEmpty(idNeedFetch)) {
      for (let id of idResult) {
        datas.push(this.attrs[id]);
      }
      return datas;
    }
    const { data: embedded, errorCode } = await RequestUtils.Get("/attributed/fetch-attr-ids", { ids: idNeedFetch });
    if(errorCode !== SUCCESS_CODE) {
      return [];
    }
		for (let item of embedded) {
      this.attrs[item.id] = item;
    }
    for (let id of ids) {
      datas.push(this.attrs[id]);
    }
    return datas;
	},
  async loadValueByIds(ids = []) {
		if(!ids || arrayEmpty(ids)) {
			return [];
		}
		let idNeedFetch = [], idResult = [];
		for (let id of ids) {
			if(!this.attrsValue[id]) {
        idNeedFetch.push(id);
      } else {
        idResult.push(id);
      }
		}
    let datas = [];
    if(arrayEmpty(idNeedFetch)) {
      for (let id of idResult) {
        datas.push(this.attrsValue[id]);
      }
      return datas;
    }
    const { data: embedded, errorCode } = await RequestUtils.Get("/attributed/fetch-value-by-ids", { ids: idNeedFetch });
    if(errorCode !== SUCCESS_CODE) {
      return [];
    }
		for (let item of embedded) {
      this.attrsValue[item.id] = item;
    }
    for (let id of ids) {
      datas.push(this.attrsValue[id]);
    }
    return datas;
	},
  async createDataOptionInForm(attrs, attrValues) {
    if(arrayEmpty(attrs) || arrayEmpty(attrValues)) {
      return [];
    }
    let dataAttrs = await this.loadByIds(attrs);
    let dataAttrValues = await this.loadValueByIds(attrValues);
    let datas = [];
    for(let attr of dataAttrs) {
      const data = { label: attr.name, value: attr.id }
      const values = dataAttrValues.filter(i => i.attributedId === attr.id);
      let childs = [];
      for(let value of values) {
        childs.push({ label: value.value, value: value.id });
      }
      data.children = childs;
      datas = datas.concat(data);
    }
    /* console.log(datas); */
    return datas;
  }
}

export default ProductAttrService;