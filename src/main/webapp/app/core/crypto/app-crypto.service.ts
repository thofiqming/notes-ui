import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AppCryptoService {

  salt = CryptoJS.lib.WordArray.random(16);

  encrypt(content: string): string {
    const encryptionKey = this.getEncryptionKey('secret');
    return CryptoJS.AES.encrypt(content.trim(), encryptionKey).toString();
  }

  decrypt(content: string): string {
    const decryptionKey = this.getEncryptionKey('secret');
    return CryptoJS.AES.decrypt(content.trim(), decryptionKey).toString(CryptoJS.enc.Utf8);
  }

  private getEncryptionKey(secret: string): string {
    const key = CryptoJS.PBKDF2(secret, this.salt, {
      keySize: 16,
      iterations: 10000,
      hasher: CryptoJS.algo.SHA256
    }).toString();
    return key;
  }

}
