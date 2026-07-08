# 比較と真偽値

これまでは、入力された値を計算して表示してきました。この章では、値を比べて判断の基準を作ります。この基準を[条件](term:condition)と呼びます。

## 比べると真偽値になる

```python
age = 20
print(age >= 18)
```

[比較演算子](term:comparison-operator)を使うと、2つの値を比べられます。比較の結果は、`True` または `False` という[真偽値](term:boolean)です。

```text
True
```

`age >= 18` は「ageは18以上ですか」という質問のように読めます。答えが正しければ `True`、正しくなければ `False` になります。

## よく使う比較演算子

```python
a = 5
b = 8

print(a == b)
print(a != b)
print(a < b)
print(a <= b)
print(a > b)
print(a >= b)
```

主な比較演算子は次の通りです。

| 書き方 | 読み方 |
| --- | --- |
| `a == b` | aとbは等しい |
| `a != b` | aとbは等しくない |
| `a < b` | aはbより小さい |
| `a <= b` | aはb以下 |
| `a > b` | aはbより大きい |
| `a >= b` | aはb以上 |

`==` は、2つの値が等しいかを調べます。[代入](term:assignment)に使う `=` とは役割が違います。

```python
score = 100
print(score == 100)
```

1行目の `=` は、`score` という名前と `100` を結び付けます。2行目の `==` は、`score` の値が `100` と等しいかを調べます。

## 条件式として読む

比較を使って `True` または `False` になる[式](term:expression)は、[条件式](term:condition-expression)として読めます。

```python
price = 800
money = 1000
print(money >= price)
```

この条件式は「moneyはprice以上ですか」と読めます。問題文を読んだら、まず日本語の条件を作り、それを条件式へ直します。

1. 何と何を比べるか
2. 等しい、違う、大きい、小さい、以上、以下のどれか
3. 結果として `True` または `False` を表示するか

## 文字列も等しいか比べられる

```python
expected = "yes"
answer = "yes"
print(expected == answer)
```

[文字列](term:string)も `==` や `!=` で比べられます。大文字と小文字は別の文字として扱われます。

```python
print("Python" == "python")
```

この結果は `False` です。

## 次の章へつながる考え方

この章では、比較の結果をそのまま表示します。次の章では、`True` のときだけ処理する、`False` のときは別の処理をする、という条件分岐へ進みます。

まずは、比較式を「はい・いいえで答えられる質問」として読めるようにします。
