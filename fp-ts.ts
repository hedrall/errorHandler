import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

class Error1 extends Error { name: 'error1' = 'error1';}
class Error2 extends Error { name: 'error2' = 'error2'; }
class Error3 extends Error { name: 'error3' = 'error3'; }
class Error4 extends Error { name: 'error4' = 'error4'; }
class Error5 extends Error { name: 'error5' = 'error5'; }
class Error6 extends Error { name: 'error6' = 'error6'; }

function toThrow1(): E<void, Error1> { console.log('to throw 1'); return 1;}
function toThrow2(): WithThrow<Error2, { hoge: 'hoge' }> { console.log('to throw 2'); return { hoge: 'hoge'}; }
async function toThrow3(): Promise<WithThrow<Error3>> { console.log('to throw 3')}
function toThrow4(): WithThrow<Error4> { console.log('to throw 4')}

const main = async () => {
  /* do */
  const res = pipe(
      1,
      v => (v + 1), // 2
      v => `v: ${v}` // 4
  );
  console.log(res);
};

(async () => {
  await main();
})().catch(console.error);
