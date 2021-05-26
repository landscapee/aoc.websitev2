// 某些依赖使用了window对象 不能在worker中使用
import JSEncrypt from 'jsencrypt';

// data为需要加密的数据
export function encryptedData(data) {
	let publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANWnvOm0wS9hsY9xiAs2G09Ah88zaJHMwEdXiVBa+pCJVSlJdSglewnHFWuT/4GBMTbcfusTQWChjDNn3trzWwcCAwEAAQ=='; //公钥
	// 新建JSEncrypt对象
	let encryptor = new JSEncrypt();
	// 设置公钥
	encryptor.setPublicKey(publicKey);
	// 加密数据
	return encryptor.encrypt(data);
}
