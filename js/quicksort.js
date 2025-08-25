/**
 * Quicksort implementation in JavaScript
 * This implementation provides both standard and in-place versions of quicksort
 */

/**
 * Standard quicksort implementation that creates new arrays
 * @param {Array} arr - The array to be sorted
 * @returns {Array} - A new sorted array
 * @complexity Time: O(n log n) average case, Space: O(n)
 */
function quickSort(arr) {
    // Base case: arrays of length 0 or 1 are already sorted
    if (arr.length <= 1) {
        return arr;
    }

    // Choose pivot as middle element to avoid worst case for sorted arrays
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];

    // Partition elements into left, equal, and right arrays
    for (let element of arr) {
        if (element < pivot) {
            left.push(element);
        } else if (element > pivot) {
            right.push(element);
        } else {
            equal.push(element);
        }
    }

    // Recursively sort left and right partitions
    return [...quickSort(left), ...equal, ...quickSort(right)];
}

/**
 * In-place quicksort implementation that modifies the original array
 * @param {Array} arr - The array to be sorted
 * @param {number} [start=0] - Start index of the partition
 * @param {number} [end=arr.length-1] - End index of the partition
 * @complexity Time: O(n log n) average case, Space: O(log n) for recursion
 */
function quickSortInPlace(arr, start = 0, end = arr.length - 1) {
    if (start >= end) {
        return;
    }

    const pivotIndex = partition(arr, start, end);
    quickSortInPlace(arr, start, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, end);
}

/**
 * Partition helper function for in-place quicksort
 * @param {Array} arr - The array to be partitioned
 * @param {number} start - Start index of the partition
 * @param {number} end - End index of the partition
 * @returns {number} - The final position of the pivot
 * @private
 */
function partition(arr, start, end) {
    // Choose last element as pivot
    const pivot = arr[end];
    let i = start - 1;

    // Move elements smaller than pivot to the left side
    for (let j = start; j < end; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Place pivot in its final position
    [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
    return i + 1;
}

// Example usage:
// const arr = [64, 34, 25, 12, 22, 11, 90];
// 
// // Using standard quicksort (returns new sorted array)
// const sortedArr = quickSort([...arr]);
// console.log('Original array:', arr);
// console.log('New sorted array:', sortedArr);
// 
// // Using in-place quicksort (modifies original array)
// quickSortInPlace(arr);
// console.log('Sorted in place:', arr);