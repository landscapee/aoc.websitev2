//对称加密和解密使用crypto-js--前端解密使用
//非对称加密使用jsencrypt,--发送到后端使用
import * as CryptoJS from 'crypto-js/crypto-js';
// import { JSEncrypt } from 'jsencrypt' 
// 或者下面这种方式引入
import JSEncrypt from 'jsencrypt/bin/jsencrypt'

const  key = 'o08YQii9QF5MuzYj'
//与后端约定的解密key
// const key = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEA1ae86bTBL2Gxj3GICzYbT0CHzzNokczAR1eJUFr6kIlVKUl1KCV7CccVa5P/gYExNtx+6xNBYKGMM2fe2vNbBwIDAQABAkA377Bv51jklMkt6uVZOhMwTo6/2o+4DEkS5IIYvZj4GeHxN+qxVrSb6YNKGFp1MnAQABwd0KFOqdiA/smfkpIBAiEA675xVtrPXo4Z8B3i/ugQJ49tvNp8YWn4ItIk2GfIl4cCIQDoA2t4nCdSi2Z+63ZjQhXqnRNTW772pxcd9f8Zc+kAgQIgJ22NpTopbqYTnn5RJdMISKWLdAeSv/QqRSCievM4sGcCIQDJCk2R0R1xtUE3MSkAkT8UcM9SJ+mtKNQrLgHCOGHqAQIgNVX7ywUn29Ub7UXXmh4K6sQ0j3yqLFesettmfcKFgtg=';
//非对称加密的公钥
let publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANWnvOm0wS9hsY9xiAs2G09Ah88zaJHMwEdXiVBa+pCJVSlJdSglewnHFWuT/4GBMTbcfusTQWChjDNn3trzWwcCAwEAAQ=='



//对称解密(获取数据后用该方法解密)
export function decrypt(data) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(data)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  //以utf-8的形式输出解密过后内容
  return decrypted.toString(CryptoJS.enc.Utf8);
}
 //非对称加密（数据传到后端）
 export function encryptedData(data) {
 // 新建 JSEncrypt 对象
 let encryptor = new JSEncrypt()
 // 设置公钥
 encryptor.setPublicKey(publicKey)
 // 加密数据
 return encryptor.encrypt(data)
}