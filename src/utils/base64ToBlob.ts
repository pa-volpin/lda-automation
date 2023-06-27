export async function base64ToBlob(base64String: string) {
  const response = await fetch(base64String);
  const data = await response.blob();
  return data;
}