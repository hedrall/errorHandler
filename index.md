## 型による収集

mizchi氏のGeneratorによる収集: https://zenn.dev/mizchi/articles/main-is-composite-function

## generator関数とは？

> yield キーワードは、ジェネレーター関数の実行を一時停止し、ジェネレーターの呼び出し元に yield キーワードに続く値を返します。


promiseはgenerator関数の糖衣構文だった。

```ts
const sleep100 = () => new Promise((resolve) => setTimeout(resolve, 100));
+async function() {
    await sleep100();
} 
```

```ts
+function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep100();
    });
};
```

### ポイント

- 幽霊型を生成する時に型を保持させる
  - `type E<E extends ErrorType> = { [__EFFECT_TYPE__]?: E };`
- 通常の関数はreturnが1つだが、generator関数はyieldの度に値を返すことができる
- Error, 副作用

## neverthrow

- めっちゃ軽量

## メリデメ

- 前提
  - エラーを型安全に扱いたい

- 通常パターン (try/catch)
  - 型安全でない
- 型パターン (Generator)
  - メリット
    - お手軽
      - 関数の戻り値に書くだけ
    - 別の情報も収集できる
      - 副作用
      - 認可・validation・監査
    - 既存の実装の邪魔にならない
 - デメリット
    - main関数をAsyncGeneratorで書く必要がある
      - 関数の合成で表現することは可能
    - ThrowするErrorの列挙は開発者の責任
    - (型解析が重くなる？)
    - yeildをわすれてはならない
- Neverthrowパターン
  - メリット
    - 仕組みがシンプル
  - デメリット
    - 明示的な`err()`以外に言語仕様上どうしてもthrowの可能性は残る
    - neverthrowの書き方を理解する必要
    - 既存のthrowの動作を書き直す必要がある
      - 記述が少し冗長になる
  
- [TypeScript エラーハンドリングにResult型は要らない？](https://zenn.dev/remon/articles/a7ba17630f1a8a)
  - 結局neverthrowが使いやすいと
- https://speakerdeck.com/akeno/typescriptfalseerachu-li-es2022falsexin-ji-neng-wotian-ete?slide=5 
