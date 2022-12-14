import postal from 'postal'
import {isObject, isString, has, isFunction, some} from 'lodash';
 import {Message} from 'element-ui';
import {getUserSerializ} from './localStorageTemp'
/**
 * @describe 去抖函数
 * @param { Function } [action] 抖动执行函数
 * @param { Number } [wait] 抖动延迟时间(毫秒)
 * @param { Boolean } [immediate] 是否立即执行
**/
export const debounce = function (action, wait, immediate = true) {
    var timer = null;

    return function () {
        let ctx = this, args = arguments;

        clearTimeout(timer)

        if (immediate) {
            let callNow = !timer;

            timer = setTimeout(function () {
                timer = null;
            }, wait)

            if (callNow) action.apply(ctx, args)
        } else {
            timer = setTimeout(function () {
                action.apply(ctx, args)
            }, wait)
        }

    }
};

/**
 * @describe 节流函数
 * @param { Function } [action] 节流执行函数
 * @param { Number } [wait] 节流延迟时间(毫秒)
**/
export const throttle = function (action, wait) {
    let previous = 0;

    return function () {
        let now = Date.now();

        if (now - previous > wait) {
            action.apply(this, arguments);
            previous = now;
        }
    }
};
/**
 * @describe 正则验证函数
 * @param { String } [type] 验证类型
 * @param { Number|String } [value] 验证值
 * @return { Boolean } [valid]
**/
export const regularValid = function (type, value) {
    let valid = false

    switch (type) {
        case 'int+': // 正整数
            valid = /^[0-9]+$/.test(value)
            break
        case 'float': // 保留后两位校验
            valid = /^[-+]?[0-9]+\.?[0-9]{0,2}$/.test(value)
            break
        case 'phone': // 手机号码校验
            valid = /^1[3-9]\d{9}$/.test(value)
            break
        case 'name': // 账户名，数字+字母+下划线组合
            valid = !/\W+/.test(value)
            break
        case 'password': // 密码校验，非法字符
            valid = !/[`~()|{}':;',\[\].<>/?~！￥……&*（）——|{}【】‘；：”“'。，、？]/.test(value)
            break
    }
    return valid
}

/**
 * @describe 获取时间戳
 * @param { String } [dateStr] 日期
 * @return { Number|Null }
**/
export const getTimestamp = function (dateStr) {
    if (dateStr) {
        return new Date(dateStr.replace(/-/g, "/")).getTime()
    } else {
        return null
    }
}

/**
 * @describe 获取地址栏参数
 * @param { String } [name] 参数
**/
export const getUrlParam = function (name) {
    var t = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        n = window.location.search.substr(1).match(t);

    return null != n ? unescape(n[2]) : null
}
// 判断是否有某 权限 （资源）
export const hasRole = function (key,isMessage=true) {
    let blo=false
    let menus=getUserSerializ().menus
    function f(arr) {
        for(let i=0;i<arr.length;i++){
            if(arr[i].code===key){
                blo=true
                break
            }
        }
    }
    f(menus)
    if(isMessage&&!blo){
        Message.warning('您暂无该权限，请联系管理员配置')
    }
    return blo
}

export const sizeStr = (str) => {
    try {
        return str.match(/[^ -~]/g) == null ? str.length : str.length + str.match(/[^ -~]/g).length;
    } catch (e) {
        return false;
    }
}

export const getQueryNum = (value) => {
    const testCfg = [
        { query: 'gt', reg: new RegExp(/^>\d+$/) },
        { query: 'ge', reg: new RegExp(/^>=\d+$/) },
        { query: 'lt', reg: new RegExp(/^<\d+$/) },
        { query: 'lte', reg: new RegExp(/^<=\d+$/) },
        { query: 'eq', reg: new RegExp(/^\d+$/) },
        // { query: 'between', reg: new RegExp(/^(20|21|22|23|[0-1]\d)[0-5]\d-(20|21|22|23|[0-1]\d)[0-5]\d$/) },
    ];
    let query;
    some(testCfg, (test) => {
        let right = test.reg.test(value);
        if (right) {
            query = test.query;
        }
        return right;
    });
    if (query) {
        return {
            query,
            value: parseInt(value.match(/\d+/g)[0]),
        };
    } else {
        return false;
    }
};