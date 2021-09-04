import {Injectable} from '@angular/core';

declare function encryptData(text: string, key: string): void;

@Injectable({
  providedIn: 'root'
})
export class AppCryptoService {

  salt = window.crypto.getRandomValues(new Uint8Array(16));
  iv = window.crypto.getRandomValues(new Uint8Array(12));

  // @ts-ignore
  private key: CryptoKey;

  constructor() {
    this.init();
  }

  async init() {
    await this.getEncryptionKey("secret").then(val => this.key = val);
  }

  getMessageEncoding(content: string | undefined): Uint8Array {
    let enc = new TextEncoder();
    return enc.encode(content);
  }

  async encryptMessage(content: string | undefined): Promise<ArrayBuffer> {
    let encoded = this.getMessageEncoding(content);
    // The iv must never be reused with a given key.
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: this.iv
      },
      this.key,
      encoded
    );
    return ciphertext;
  }

  str2ab(str: string | undefined): ArrayBuffer {
    if (str != null) {
      const buf = new ArrayBuffer(str.length); // 1 bytes for each char
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }
    return new Uint8Array();
  }

  async decryptMessage(content: string | undefined): Promise<string> {
    const encryption = this.str2ab(content);
    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: this.iv
      },
      this.key,
      encryption
    );
    let dec = new TextDecoder();
    return dec.decode(decrypted);
  }


  async getEncryptionKey(secret: string): Promise<CryptoKey> {
    let computedKey;
    await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
        iterations: 10000,
        salt: this.salt
      },
      true,
      ["encrypt", "decrypt"]
    ).then((key) => {
      computedKey = key;
    });
    // @ts-ignore
    return computedKey;
  }


}
