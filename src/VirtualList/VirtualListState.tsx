import { findRowFrom, findRowTo } from './binarySearcy';

export class VirtualListState {
    constructor(
        public readonly scrollTop: number,
        public readonly rowHeights: number[],
        public readonly viewportHeight: number,
    ) {}

    get rows(): number {
        return this.rowHeights.length;
    }

    static create(rows: number, defaultRowHeight: number, viewportHeight: number): VirtualListState {
        return new VirtualListState(0, new Array(rows).fill(defaultRowHeight), viewportHeight);
    }

    setScrollTop(scrollTop: number): VirtualListState {
        return new VirtualListState(scrollTop, this.rowHeights, this.viewportHeight);
    }

    setViewportHeight(viewportHeight: number): VirtualListState {
        return new VirtualListState(this.scrollTop, this.rowHeights, viewportHeight);
    }

    setRowHeight(row: number, height: number): VirtualListState {
        const rowHeights = this.rowHeights.slice();
        rowHeights[row] = height;

        return new VirtualListState(this.scrollTop, rowHeights, this.viewportHeight);
    }

    setRows(rows: number, defaultRowHeight: number): VirtualListState {
        const rowHeights = this.rowHeights.slice(0, rows);

        while (rowHeights.length < rows) {
            rowHeights.push(defaultRowHeight);
        }

        return new VirtualListState(this.scrollTop, rowHeights, this.viewportHeight);
    }

    getVisibleRowRange(): [rowFrom: number, rowTo: number] {
        const rowTops = this.getRowTops();

        const rowFrom = findRowFrom(rowTops, this.scrollTop);
        const rowTo = findRowTo(rowTops, this.scrollTop + this.viewportHeight);

        return [rowFrom, rowTo];
    }

    getRowTops(): number[] {
        let top = 0;
        const rowTops: number[] = [];

        for (const rowHeight of this.rowHeights) {
            rowTops.push(top);
            top += rowHeight;
        }

        return rowTops;
    }

    getScrollHeight(): number {
        let total = 0;
        for (const rowHeight of this.rowHeights) {
            total += rowHeight;
        }
        return total;
    }
}
