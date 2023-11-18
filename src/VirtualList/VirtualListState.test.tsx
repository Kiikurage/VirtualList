import { VirtualListState } from './VirtualListState';

describe('VirtualListState', () => {
    describe('getVisibleRowRange', () => {
        it('通常', () => {
            const state = new VirtualListState(0, new Array(1000).fill(50), 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(3);
        });

        it('scrollTopが行の途中の場合', () => {
            const state = new VirtualListState(170, new Array(1000).fill(50), 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(3);
            expect(rowTo).toBe(7);
        });

        it('行数が少なく、余白が余る場合', () => {
            const state = new VirtualListState(0, new Array(2).fill(50), 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(2);
        });

        it('scrollTopがマイナスの場合', () => {
            const state = new VirtualListState(-80, new Array(1000).fill(50), 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(2);
        });

        it('行の高さが異なる場合', () => {
            const state = new VirtualListState(20, [10, 20, 30, 40, 50], 50);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(1);
            expect(rowTo).toBe(4);
        });
    });

    describe('setRowHeights', () => {
        it('通常', () => {
            const state1 = new VirtualListState(20, [10, 20, 30, 40, 50], 50);
            expect(state1.getVisibleRowRange()).toEqual([1, 4]);

            const state2 = state1.setRowHeight(1, 40);
            expect(state2.rowHeights).toEqual([10, 40, 30, 40, 50]);
            expect(state2.getVisibleRowRange()).toEqual([1, 3]);
        });
    });

    describe('setViewportHeight', () => {
        it('通常', () => {
            const state1 = new VirtualListState(0, new Array(1000).fill(50), 150);
            const state2 = state1.setViewportHeight(250);

            expect(state2.viewportHeight).toBe(250);
            const [rowFrom, rowTo] = state2.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(5);
        });

        it('scrollTopが通常のスクロール領域外になる場合', () => {
            const state1 = new VirtualListState(400, new Array(10).fill(50), 100);
            const state2 = state1.setViewportHeight(500);

            expect(state2.viewportHeight).toBe(500);
            const [rowFrom, rowTo] = state2.getVisibleRowRange();

            expect(rowFrom).toBe(8);
            expect(rowTo).toBe(10);
        });
    });
});
