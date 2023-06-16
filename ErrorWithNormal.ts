// Type Utility
import {number} from "fp-ts";

declare const __EFFECT_TYPE__: unique symbol;

class Error1 extends Error { name: 'error1' = 'error1'; e1 = '@@@ Error 1 @@@' }
class Error2 extends Error { name: 'error2' = 'error2'; e2 = '@@@ Error 2 @@@' }
class Error3 extends Error { name: 'error3' = 'error3'; e3 = '@@@ Error 3 @@@' }
class Error4 extends Error { name: 'error4' = 'error4'; e4 = '@@@ Error 4 @@@' }
class Error5 extends Error { name: 'error5' = 'error5'; e5 = '@@@ Error 5 @@@' }
type ErrorType = Error1 | Error2 | Error3 | Error4 | Error5;


const toThrow1 = (): void => {
    console.log('>>> exec to throw 1')
}
const toThrow2 = (): string => {
    // throw new Error2();
    console.log('>>> exec to throw 2');
    return 'test';
}
const toThrow3 = async (): Promise<number> => {
    // throw new Error3();
    console.log('>>> exec to throw 3')
    return 100;
}
const toThrow4 = (): { hoge: 'fuga' } => {
    console.log('>>> exec to throw 4');
    return { hoge: 'fuga' };
}

type AnyGenerator<T> = AsyncGenerator<T> | Generator<T>;

const main = async () => {
    return [
        toThrow1(),
        toThrow2(),
        await toThrow3(),
        toThrow4(),
    ];
}

(async () => {
    try {
        return await main();
    } catch (e: unknown) {
        // eの型は？
    }
})().catch(console.error);
