# 5. 状態の切り出しとテスト

[この章までのコード例](https://github.com/Kiikurage/VirtualList/tree/05-state-and-test/src)

今は各行のサイズもviewportのサイズも固定だったが、実用上はどちらも動的に変えられる必要がある。

この対応をする前に、今後の拡張を容易にするために「仮想リストの状態」ロジックをViewから切り出す事を考える。

```typescript
export class VirtualListState {
    constructor(
        public readonly scrollTop: number,
        public readonly rows: number,
        public readonly rowHeight: number,
        public readonly viewportHeight: number,
    ) {}

    static create(rows: number, rowHeight: number, viewportHeight: number): VirtualListState {
        return new VirtualListState(0, rows, rowHeight, viewportHeight);
    }

    setScrollTop(scrollTop: number): VirtualListState {
        return new VirtualListState(scrollTop, this.rows, this.rowHeight, this.viewportHeight);
    }

    setRows(rows: number): VirtualListState {
        return new VirtualListState(this.scrollTop, rows, this.rowHeight, this.viewportHeight);
    }

    getVisibleRowRange(): [rowFrom: number, rowTo: number] {
        const rowFrom = Math.max(0, Math.min(Math.floor(this.scrollTop / this.rowHeight), this.rows));
        const rowTo = Math.max(
            0,
            Math.min(Math.ceil((this.scrollTop + this.viewportHeight) / this.rowHeight), this.rows),
        );

        return [rowFrom, rowTo];
    }
}
```

Reactの状態管理との相性を考え、`VirtualListState`クラスはイミュータブルな設計となっている。

## テスト

ロジックとViewを切り分けることで、テストの記述が容易になる。

```typescript
describe('getVisibleRowRange', () => {
    it('通常', () => {
        const state = new VirtualListState(0, 1000, 50, 150);
        const [rowFrom, rowTo] = state.getVisibleRowRange();

        expect(rowFrom).toBe(0);
        expect(rowTo).toBe(3);
    });
});
```
