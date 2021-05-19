/*
 * interfaceType
 * 普通链接地址
 * 双流-fpms 
 * 天府-api
*/
let interfaceType = "fpms"
/*
 * socketInterfaceType
 * socket的链接地址
 * 双流-ghms 
 * 天府-fpms
*/
let socketInterfaceType = "ghms"
/*
 * sysEdition
 * 系统版本
 * 双流-shuangliu 
 * 天府-tianfu
*/
let sysEdition = 'shuangliu'
/*
 * coder
 * 登录，修改密码是否加密
 * 天府-加密-true 
 * 双流-不加密-false
*/
let coder = true

window.webConfig = {
    interfaceType,
    socketInterfaceType,
    sysEdition,
    coder
}
