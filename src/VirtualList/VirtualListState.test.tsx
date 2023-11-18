import { VirtualListState } from './VirtualListState';

describe('VirtualListState', () => {
    describe('getVisibleRowRange', () => {
        it('通常', () => {
            const state = new VirtualListState(0, 1000, 50, 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(3);
        });

        it('scrollTopが行の途中の場合', () => {
            const state = new VirtualListState(170, 1000, 50, 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(3);
            expect(rowTo).toBe(7);
        });

        it('行数が少なく、余白が余る場合', () => {
            const state = new VirtualListState(0, 2, 50, 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(2);
        });

        it('scrollTopがマイナスの場合', () => {
            const state = new VirtualListState(-80, 1000, 50, 150);
            const [rowFrom, rowTo] = state.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(2);
        });
    });
});
