import { ethers } from "ethers";
const fs = require('fs');
const btoa = require('btoa');

export const getTokenId = (label: string) => {
    const labelHash = ethers.keccak256(ethers.toUtf8Bytes(label));
    const tokenId = ethers.toBigInt(labelHash).toString();
    return tokenId;
}

export function importFont(font_path: string, media_type: string) {
    const buff = fs.readFileSync(font_path);
    const base64data = buff.toString('base64');
    return `data:${media_type};charset=utf-8;base64,${base64data}`;
}

export default function base64EncodeUnicode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}