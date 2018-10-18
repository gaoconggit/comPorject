/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 获取传参
 */
export const getQueryString = (key) => {
  const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
  const result = window.location.search.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};


/**
 * 设置cookie
 */

export const setCookie = (c_name, value, expiredays = 2) => {
  const exdate = new Date();
  exdate.setHours(exdate.getHours() + expiredays);
  document.cookie = c_name + "=" + encodeURIComponent(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

/**
 * 获取cookie
 */
export const getCookie = (name) => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
};


/**
 * 删除cookie
 *
 */
export const delCookie = (name) => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

//转义字符转字符串
export const escape2Html = str => {
  const arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
};
