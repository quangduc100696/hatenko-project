import { isEmpty } from "lodash";
import { arrayEmpty } from "utils/dataUtils";

const NGHI_KHONG_LUONG = 1;
const NGHI_OM_BHXH = 4;
const NGHI_CO_LUONG = 5;
const NGHI_CHE_DO_CONG_TY = 7; 

export const genNerateChartLeave = ({ data }) => {
  let chart = [], leaves = [];
  const inChart = [ NGHI_KHONG_LUONG, NGHI_OM_BHXH, NGHI_CO_LUONG, NGHI_CHE_DO_CONG_TY ];
  for (const [ key, value ] of Object.entries(data)) {
    const { leaveOff, leaveUser } = value;
    for(let loff of leaveOff) {
      if(!inChart.includes(loff.type)) {
        continue;
      }
      let item = chart.find(i => i.time === key && i.type === loff.type) || {};
      if(isEmpty(item)) {
        item.time = key;
        item.type = loff.type;
        item.value = loff.total;
        chart.push(item);
      } else {
        item.value += loff.total;
      }
    }
    for(let lu of leaveUser) {
      let item = leaves.find(i => i.userId === lu.userId) || {};
      if(isEmpty(item)) {
        item.userId = lu.userId;
        item.value = lu.total;
        leaves.push(item);
      } else {
        item.value += lu.total;
      }
    }
  }
  const addEmpty = (type, time) => {
    let item = {};
    item.time = time;
    item.type = type;
    item.value = 0;
    chart.push(item);
  }

  /* eslint-disable-next-line */
  for (const [ key, value ] of Object.entries(data)) {
    let item = chart.find(i => i.time === key && i.type === NGHI_KHONG_LUONG) || {};
    if(isEmpty(item)) {
      addEmpty(NGHI_KHONG_LUONG, key);
    }
    item = chart.find(i => i.time === key && i.type === NGHI_OM_BHXH) || {};
    if(isEmpty(item)) {
      addEmpty(NGHI_OM_BHXH, key);
    }
    item = chart.find(i => i.time === key && i.type === NGHI_CO_LUONG) || {};
    if(isEmpty(item)) {
      addEmpty(NGHI_CO_LUONG, key);
    }
    item = chart.find(i => i.time === key && i.type === NGHI_CHE_DO_CONG_TY) || {};
    if(isEmpty(item)) {
      addEmpty(NGHI_CHE_DO_CONG_TY, key);
    }
  }

  let itemNghiCoLuong = [];
  for(let item of chart) {
    let label = '';
    if(item.type === NGHI_KHONG_LUONG){
      label = "Leave without pay";
    } else if(item.type === NGHI_OM_BHXH){
      label = "Nghỉ ốm hưởng BHXH";
    } else if(item.type === NGHI_CO_LUONG){
      label = "Paid leave";
      itemNghiCoLuong.push({ time: item.time, 'Paid leave': item.value });
    } else if(item.type === NGHI_CHE_DO_CONG_TY){
      label = "N.P theo chế độ C.Ty";
    }
    item.label = label;
  }
  chart = chart.sort((a,b) => (new Date(String(a.time))).getTime() - (new Date(String(b.time))).getTime());
  return { chart, itemNghiCoLuong, leaves };
}

export const genNerateChartOverTime = ({ data }) => {

  let chart = [], otUser = [];
  const takeTotal = (arr) => {
    let total = 0;
    if(arrayEmpty(arr)) {
      return total;
    }
    for(let item of arr) {
      for (const [ userId, value ] of Object.entries(item)) {
        total += value;
        let item = chart.find(i => i.userId === userId) || {};
        if(isEmpty(item)) {
          item.userId = userId;
          item.total = value;
          otUser.push(item);
        } else {
          item.total += value;
        }
      }
    }
    return total;
  }

  for (const [ key, value ] of Object.entries(data)) {
    let item = chart.find(i => i.time === key) || {};
    if(isEmpty(item)) {
      item.time = key;
      item.HoursOT = takeTotal(value);
      chart.push(item);
    } else {
      item.total += takeTotal(value);
    }
  }

  chart = chart.sort((a,b) => (new Date(String(a.time))).getTime() - (new Date(String(b.time))).getTime());
  return { chart, otUser }
}
