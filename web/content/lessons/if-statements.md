# 条件分岐

前の章では、比較の結果を `True` または `False` として表示しました。この章では、その結果を使って実行する処理を選びます。

## Trueのときだけ実行する

```python
score = 80

if score >= 60:
    print("PASS")
```

[if文](term:if-statement)は、[条件式](term:condition-expression)が `True` のときだけ、内側の処理を実行します。

`score >= 60` は「scoreは60以上ですか」という質問です。答えが `True` なら `print("PASS")` が動きます。`False` なら、その行は実行されません。

## インデントで処理のまとまりを表す

```python
score = 80

if score >= 60:
    print("合格")
    print("次へ進めます")

print("確認終了")
```

[インデント](term:indentation)されている2行は、ifの中の[ブロック](term:block)です。条件が `True` のときだけ実行されます。

最後の `print("確認終了")` はインデントされていないので、ifの外にあります。条件に関係なく実行されます。

Pythonでは、インデントは見た目だけでなく文法の一部です。通常は半角スペース4個を使います。

## Falseのときはelse

```python
score = 45

if score >= 60:
    print("PASS")
else:
    print("RETRY")
```

[else](term:else-clause)は、ifの条件が `False` だったときに実行する処理を書きます。

この例では、`score >= 60` が `False` なので `RETRY` が表示されます。

## 複数の条件はelifで順に調べる

```python
score = 75

if score >= 80:
    print("A")
elif score >= 60:
    print("B")
else:
    print("C")
```

[elif](term:elif-clause)は、前の条件が `False` だったときに、次の条件を調べます。条件は上から順に判定され、最初に `True` になったブロックだけが実行されます。

この例では `score >= 80` は `False` ですが、`score >= 60` は `True` なので `B` が表示されます。いったん `B` のブロックが実行されると、下の `else` は実行されません。

## 条件の順番に注意する

```python
score = 85

if score >= 60:
    print("B")
elif score >= 80:
    print("A")
```

このコードでは、85点でも `B` が表示されます。先に `score >= 60` が `True` になるため、下の `score >= 80` まで進まないからです。

範囲を分けるときは、より厳しい条件を先に書くことがあります。問題文を読み、どの順番で条件を調べるべきか確認します。

## 練習へ進む前に

条件分岐の問題では、次の順に整理します。

1. どの値を入力するか
2. どんな条件で分けるか
3. それぞれの分岐で何を出力するか
4. 条件をどの順番で調べるか

まずは `if`、`else`、`elif` を使って、入力に応じた1つの結果を表示できるようにします。
