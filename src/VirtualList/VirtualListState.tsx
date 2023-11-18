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
