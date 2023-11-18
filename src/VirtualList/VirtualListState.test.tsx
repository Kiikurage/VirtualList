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

    describe('setViewportHeight', () => {
        it('通常', () => {
            const state1 = new VirtualListState(0, 1000, 50, 150);
            const state2 = state1.setViewportHeight(250);

            expect(state2.viewportHeight).toBe(250);
            const [rowFrom, rowTo] = state2.getVisibleRowRange();

            expect(rowFrom).toBe(0);
            expect(rowTo).toBe(5);
        });

        it('scrollTopが通常のスクロール領域外になる場合', () => {
            const state1 = new VirtualListState(400, 10, 50, 100);
            const state2 = state1.setViewportHeight(500);

            expect(state2.viewportHeight).toBe(500);
            const [rowFrom, rowTo] = state2.getVisibleRowRange();

            expect(rowFrom).toBe(8);
            expect(rowTo).toBe(10);
        });
    });
});
