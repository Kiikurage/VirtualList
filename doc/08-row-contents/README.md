# 8. 行に任意の内容を表示する

[この章までのコード例](https://github.com/Kiikurage/VirtualList/tree/08-row-contents/src)

リストの中に任意のコンテンツを表示できるようにする。


```typescript jsx
const VirtualList = ({ rowRenderer }: { rowRenderer: React.ComponentType<{ row: number }> }) => {
    const row = <RowWrapper rowRenderer={RowRenderer} />
}

const RowWrapper = ({ rowRenderer: RowRenderer }: { rowRenderer: React.ComponentType<{ row: number }> }) => {
    return (
        <li>
            <RowRenderer row={row} />
        </li>
    );
}
```

具体的なコンテンツをレンダリングするコンポーネント `RowRenderer` をpropsで受け取り、RowWrapper側で実際に `ReactNode` を生成する。

<div><video controls src="https://github.com/Kiikurage/VirtualList/assets/3253117/edf118d9-9554-4ce9-a96f-3f64c2b8395f" muted="false"></video></div>

行に任意のコンテンツを表示することができるようになった。
