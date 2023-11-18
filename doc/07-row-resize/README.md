# 7. 行のリサイズへの対応

[この章までのコード例](https://github.com/Kiikurage/VirtualList/tree/07-row-resize/src)

行のサイズ変更に対応する。

## VirtualListState

これまでは行サイズは固定だったため行の数を保持していたが、代わりに行のサイズの配列 `rowHeights: number[]` を保持し、
行の数 `rows` はここから算出する。

```typescript
class VirtualListState {
    get rows(): number {
        return this.rowHeights.length;
    }
}
```

同様にスクロール領域の大きさや各行のtopなども算出方法を変える必要がある。

```typescript
class VirtualListState {
    getRowTops(): number[] {
        const rowTops: number[] = []
        let top = 0;
        for (const rowHeight of this.rowHeights) {
            rowTops.push(top);
            top += rowHeight;
        }
        return rowTops;
    }

    getScrollHeight(): number[] {
        let total = 0;
        for (const rowHeight of this.rowHeights) {
            total += rowHeight;
        }
        return total;
    }
}
```

> [!NOTE]
> `rows`とは異なり、`getRowTops()`や`getScrollHeights()`は計算量`O(N)`なため、
> 安易に何度も呼び出してはならないという意味を込めてgetterではなくメソッドとして定義した。
> 
> ただし、状態変更の多くはスクロールによって引き起こされるため、そもそもこれらの値を毎回計算するのは無駄である。
> この値はキャッシュしたほうが良い。

表示範囲 `[rowFrom, rowTo)` の算出には[二分探索](https://ja.wikipedia.org/wiki/%E4%BA%8C%E5%88%86%E6%8E%A2%E7%B4%A2)による
上限、下限の探索が有効である。二分探索の計算量は`O(log N)`であり、効率よく範囲を算出できる。

```typescript
class VirtualListState {
    getVisibleRowRange(): [rowFrom: number, rowTo: number] {
        const rowTops = this.getRowTops();

        const rowFrom = getRowFrom(rowTops, this.scrollTop);
        const rowTo = getRowTo(rowTops, this.scrollTop + this.viewportHeight);
        
        return [rowFrom, rowTo];
    }
}
```

> [!NOTE]
> ただし、そもそも`getRowTops()`が`O(N)`であるため二分探索を使うメリットは現状はない。
> 今後、`getRowTops()`のキャッシュに伴い効果が現れてくるところである。

## View

Viewport同様、リサイズの検知には[ResizeObserver](https://developer.mozilla.org/ja/docs/Web/API/ResizeObserver)を用いればよい。

ただし、`ResizeObserver`には監視対象の要素を複数登録することはできても、コールバック関数は全体で1つしか登録できず不便なため、ラッパークラスを用意する。

```typescript
export function useResizeObserver(): ResizeObserverWrapper {
    const [resizeObserver] = useState(() => new ResizeObserverWrapper());

    useEffect(() => {
        return () => resizeObserver.disconnect();
    }, [resizeObserver]);

    return resizeObserver;
}

class ResizeObserverWrapper {
    private readonly resizeObserver: ResizeObserver;
    private readonly callbacks = new Map<Element, (entry: ResizeObserverEntry) => void>();

    constructor() {
        this.resizeObserver = new ResizeObserver(this.onResize);
    }

    private readonly onResize = (entries: ResizeObserverEntry[]) => {
        for (const entry of entries) {
            this.callbacks.get(entry.target)?.(entry);
        }
    };

    // ResizeObserverのオリジナルのAPIデザインを極力踏襲することで学習コストを減らす

    observe(target: Element, callback: (entry: ResizeObserverEntry) => void) {
        this.unobserve(target);
        this.resizeObserver.observe(target);
        this.callbacks.set(target, callback);
    }

    unobserve(target: Element) {
        this.resizeObserver.unobserve(target);
        this.callbacks.delete(target);
    }

    disconnect() {
        this.resizeObserver.disconnect();
        this.callbacks.clear();
    }
}
```

ResizeObserverのAPIデザインをまねているため、既存コードの変更は最小限で済む。

```diff
const VirtualList = () => {
    const [virtualListState, setVirtualListState] = useState(...);

-   const resizeObserver = useResizeObserver((entries) => {
-       for (const entry of entries) {
-           setVirtualListState((oldState) => oldState.setViewportHeight(entry.contentRect.height));
-       }
-   });
+   const resizeObserver = useResizeObserver();

    const viewportRef = useRef<HTMLUListElement | null>(null);
    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (viewport === null) return;
        
-       resizeObserver.observe(viewport);
+       resizeObserver.observe(viewport, (entry) => {
+           setVirtualListState(oldState => oldState.setViewportHeight(entry.contentRect.height));
+       });
        return () => resizeObserver.unobserve(viewport);
    }, [resizeObserver]);
    
    return (
        <div ref={viewportRef}>
            {...省略}
        </div>
    );
}
```

行要素もResizeObserverで監視するために、新たなコンポーネントを用意する。

```typescript jsx
const VirtualListRow = ({
    row,    
    resizeObserver,
    onResize
}: {
    row: number,
    resizeObserver: ResizeObserverWrapper,
    onResize: (row: number, entry: ResizeObserverEntry) => void
}) => {
    const rowRef = useRef<HTMLUListElement | null>(null);
    useLayoutEffect(() => {
        const viewport = rowRef.current;
        if (viewport === null) return;
        
        resizeObserver.observe(viewport, (entry) => onResize(row, entry));
        return () => resizeObserver.unobserve(viewport);
    }, [row, resizeObserver, onResize]);
    
    return (
        <div ref={rowRef}>
            {...省略}
        </div>
    );
}
```

<div><video controls src="https://github.com/Kiikurage/VirtualList/assets/3253117/e310ccd5-201c-4a71-a1ba-b7f1ba5ceff0" muted="false"></video></div>

60FPSを維持したまま、行のリサイズに伴い後続要素の位置が適切に調整されていることや、描画する要素数が適切に制御されていることがわかる。