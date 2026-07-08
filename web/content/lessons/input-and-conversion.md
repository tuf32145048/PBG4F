# 入力と型変換

これまではコードの中に値を書きました。この章では、実行する人や別の仕組みから値を受け取ります。

## 1行の入力を受け取る

```python
name = input()
print(name)
```

[input()](term:input) は、[標準入力](term:standard-input)から1行を受け取ります。受け取った値は、まず[文字列](term:string)になります。

## 数値として計算する

```python
age_text = input()
age = int(age_text)
print(age + 1)
```

`input()` の結果へそのまま `1` を足すことはできません。[int()](term:int)を使って文字列を整数へ[型変換](term:type-conversion)します。

短く書く場合は次のようにできます。

```python
age = int(input())
print(age + 1)
```

最初は処理を分けて書き、どの時点で値の種類が変わったか確認する方法がおすすめです。

## 文字列へ戻す

```python
score = 80
message = "得点: " + str(score)
print(message)
```

[str()](term:str)は値を文字列へ変換します。ただし、`print("得点:", score)` のように、`print`へ複数の値を渡せる場面では無理に連結する必要はありません。

## 入力・処理・出力を分ける

問題を読むときは、次の3つを最初に整理します。

1. 何が入力されるか
2. その値を使って何を計算するか
3. どの形式で出力するか

この区切りを意識すると、長く見える問題でも小さな手順へ分解できます。
