export function isValidSkuCode(code: string) {
  const regexSKU = /^\d+$/;
  return code.length === 7 && regexSKU.test(code);
}