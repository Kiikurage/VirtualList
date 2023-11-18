# 6. Viewportのリサイズへの対応

[この章までのコード例](https://github.com/Kiikurage/VirtualList/tree/06-viewport-resize/src)

Viewportのサイズ変更に対応する。

## VirtualListState

`VirtualListState` はもともと`viewportHeight`をプロパティに持っているので、これを変更可能にするだけで良い。

```typescript
class VirtualListState {
    setViewportHeight(viewportHeight: number): VirtualListState {
        return new VirtualListState(this.scrollTop, this.rows, this.rowHeight, viewportHeight);
    }
}
```

## View

View側ではリサイズを検知し、適切にStateの変更を呼び出す必要がある。

リサイズの検知には[ResizeObserver](https://developer.mozilla.org/ja/docs/Web/API/ResizeObserver)を用いる。

```typescript jsx
import { useEffect } from "react";

function useResizeObserver(callback: (entries: ResizeObserverEntry[]) => void) {
    const [resizeObserver] = useState(() => new ResizeObserver(callback));

    useEffect(() => {
        return () => resizeObserver.disconnect()
    }, []);
    
    return resizeObserver;
}

const VirtualList = () => {
    const [virtualListState, setVirtualListState] = useState(...);
    
    const resizeObserver = useResizeObserver((entry) => {
        setVirtualListState(oldState => oldState.setViewportHeight(entry.contentRect.height));
    });

    const viewportRef = useRef<HTMLUListElement | null>(null);
    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (viewport === null) return;
        
        resizeObserver.observe(viewport);
        return () => resizeObserver.unobserve(viewport);
    }, [resizeObserver]);
    
    return (
        <div ref={viewportRef}>
            {...省略}
        </div>
    );
}
```

<div><video controls src="https://github.com/Kiikurage/VirtualList/assets/3253117/097d8657-fa9c-4bd0-be60-137a06469089" muted="false"></video></div>

60FPSを維持したまま、Viewportのリサイズに合わせて描画される要素数が変化していることがわかる。
