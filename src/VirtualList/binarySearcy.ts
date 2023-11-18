/**
 * value以下の要素で最大のインデックスを返す。
 * @param array 昇順にソート済みの配列
 * @param value
 * @return value以下の要素で最大のインデックス。valueがarrayの値域外の場合は0またはarary.lengthの近い方を帰す
 */
export function findRowFrom(array: number[], value: number): number {
    if (array.length === 0) return 0;
    if (value < array[0]) return 0;
    if (value > array[array.length - 1]) return array.length;

    let from = 0;
    let to = array.length - 1;

    while (from <= to) {
        const mid = from + ((to - from) >> 1);

        if (array[mid] > value) {
            to = mid - 1;
        } else {
            from = mid + 1;
        }
    }

    return to;
}

/**
 * value以上の要素で最小のインデックスを返す。
 * @param array 昇順にソート済みの配列
 * @param value
 * @return value以上の要素で最小のインデックス。valueがarrayの値域外の場合は0またはarary.lengthの近い方を帰す
 */
export function findRowTo(array: number[], value: number): number {
    if (array.length === 0) return 0;
    if (value < array[0]) return 0;
    if (value > array[array.length - 1]) return array.length;

    let from = 0;
    let to = array.length - 1;

    while (from <= to) {
        const mid = from + ((to - from) >> 1);

        if (array[mid] < value) {
            from = mid + 1;
        } else {
            to = mid - 1;
        }
    }

    return from;
}
