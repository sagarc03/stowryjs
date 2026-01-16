import { StowryClient } from '../src';

const client = new StowryClient({
  endpoint: 'http://localhost:5708',
  accessKey: 'FE373CEF5632FDED3081',
  secretKey: '9218d0ddfdb1779169f4b6b3b36df321099e98e9',
});

const getUrl = await client.presignGet('/files/document.pdf');
console.log('GET URL:', getUrl);

const putUrl = await client.presignPut('/files/upload.txt');
console.log('PUT URL:', putUrl);

const deleteUrl = await client.presignDelete('/files/old.txt');
console.log('DELETE URL:', deleteUrl);
