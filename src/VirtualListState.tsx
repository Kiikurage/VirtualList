export interface VirtualListState {
    viewportSize: number;
    itemSizes: number[];
    scrollOffset: number;
}

export module VirtualListState {
    export function create({
        numItems = 1,
        defaultItemSize = 100,
    }: {
        numItems?: number;
        defaultItemSize?: number;
    } = {}): VirtualListState {
        return {
            viewportSize: 0,
            itemSizes: new Array(numItems).fill(defaultItemSize),
            scrollOffset: 0,
        };
    }

    export function setViewportSize(
        oldState: VirtualListState,
        viewportSize: number,
        scrollAnchor: 'start' | 'end',
    ): VirtualListState {
        let newState = oldState;
        newState = { ...newState, viewportSize };
        newState = setScrollOffset(
            newState,
            scrollAnchor === 'end'
                ? oldState.scrollOffset + oldState.viewportSize - viewportSize
                : oldState.scrollOffset,
        );

        return newState;
    }

    export function setScrollOffset(oldState: VirtualListState, scrollOffset: number): VirtualListState {
        const oldContentSize = getContentSize(oldState);
        scrollOffset = Math.max(0, Math.min(scrollOffset, oldContentSize - oldState.viewportSize));

        return { ...oldState, scrollOffset };
    }

    export function setItemSize(oldState: VirtualListState, index: number, size: number): VirtualListState {
        if (oldState.itemSizes[index] === size) return oldState;

        const newItemSizes = oldState.itemSizes.slice();
        newItemSizes[index] = size;

        return { ...oldState, itemSizes: newItemSizes };
    }

    export function addItem(
        oldState: VirtualListState,
        index: number,
        defaultItemSize: number = 100,
    ): VirtualListState {
        const newItemSizes = oldState.itemSizes.slice();
        newItemSizes.splice(index, 0, defaultItemSize);

        return { ...oldState, itemSizes: newItemSizes };
    }

    export function addItemAtLast(oldState: VirtualListState, defaultItemSize: number = 100): VirtualListState {
        return addItem(oldState, oldState.itemSizes.length, defaultItemSize);
    }

    export function deleteItem(oldState: VirtualListState, index: number): VirtualListState {
        const newItemSizes = oldState.itemSizes.slice();
        newItemSizes.splice(index, 1);

        return { ...oldState, itemSizes: newItemSizes };
    }

    export function deleteItemAtLast(oldState: VirtualListState): VirtualListState {
        return deleteItem(oldState, oldState.itemSizes.length - 1);
    }

    export function getContentSize(state: VirtualListState): number {
        let total = 0;
        for (const size of state.itemSizes) total += size;
        return total;
    }

    export function getItemOffsets(state: VirtualListState): number[] {
        const offsets: number[] = [];
        let offset = 0;
        for (const size of state.itemSizes) {
            offsets.push(offset);
            offset += size;
        }

        return offsets;
    }
}
