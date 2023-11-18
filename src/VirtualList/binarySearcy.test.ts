import { findRowFrom, findRowTo } from './binarySearcy';

describe('binarySearch', () => {
    it('同じ値が存在する場合', () => {
        expect(findRowFrom([0, 1, 2, 3, 4, 5], 3)).toBe(3);
        expect(findRowTo([0, 1, 2, 3, 4, 5], 3)).toBe(3);
    });

    it('同じ値が存在しない場合', () => {
        expect(findRowFrom([0, 2, 4, 6, 8], 3)).toBe(1);
        expect(findRowTo([0, 2, 4, 6, 8], 3)).toBe(2);
    });

    it('配列が空の場合', () => {
        expect(findRowFrom([], 99)).toBe(0);
        expect(findRowTo([], 99)).toBe(0);
    });

    it('配列の最小値よりvalueが小さい場合', () => {
        expect(findRowFrom([0, 1, 2, 3, 4, 5], -99)).toBe(0);
        expect(findRowTo([0, 1, 2, 3, 4, 5], -99)).toBe(0);
    });

    it('配列の最大値よりvalueが大きい場合', () => {
        expect(findRowFrom([0, 1, 2, 3, 4, 5], 99)).toBe(6);
        expect(findRowTo([0, 1, 2, 3, 4, 5], 99)).toBe(6);
    });

    it('valueと同じ値が複数存在する場合', () => {
        expect(findRowFrom([0, 1, 1, 1, 2, 2], 1)).toBe(3);
        expect(findRowTo([0, 1, 1, 1, 2, 2], 1)).toBe(1);
    });

    it('valueと異なる値が複数存在する場合', () => {
        expect(findRowFrom([0, 1, 1, 1, 3, 3], 2)).toBe(3);
        expect(findRowTo([0, 1, 1, 1, 3, 3], 2)).toBe(4);
    });
});
