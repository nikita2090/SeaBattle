export {calculateAvailableValues, calculateHalo};

function calculateAvailableValues(arrOfClickedElems) {
    let minVal = Math.min(...arrOfClickedElems);
    let maxVal = Math.max(...arrOfClickedElems);
    let result = [];
    let dif = maxVal - minVal;

    if (dif === 0) {
        result = [minVal - 10, minVal + 10];
        if (!checkLeftBorder(minVal)) result = result.concat([minVal - 1]);
        if (!checkRightBorder(minVal)) result = result.concat([minVal + 1]);
    } else if (dif === 1 || dif === 2 || dif === 3) {
        if (!checkLeftBorder(minVal)) result = result.concat([minVal - 1]);
        if (!checkRightBorder(maxVal)) result = result.concat([maxVal + 1]);
    } else if (dif === 10 || dif === 20 || dif === 30) {
        minVal = minVal - 10;
        maxVal = maxVal + 10;
        result = [minVal, maxVal];
    }
    return result.filter((elem) => elem >= 0 && elem < 100);
}

function calculateHalo(arr) {
    let minVal = Math.min(...arr);
    let maxVal = Math.max(...arr);
    let result = [minVal - 10, minVal + 10];

    if (!checkLeftBorder(minVal)) result = result.concat([minVal - 1, minVal - 11, minVal + 9]);
    if (!checkRightBorder(minVal)) result = result.concat([minVal + 1, minVal + 11, minVal - 9]);

    let dif = maxVal - minVal;
    //if (dif === 1 || dif === 2 || dif === 3 || dif === 10 || dif === 20 || dif === 30) {
    if (dif <= 30) {
        result = result.concat([maxVal - 10, maxVal + 10]);
        if (!checkLeftBorder(maxVal)) result = result.concat([maxVal - 1, maxVal - 11, maxVal + 9]);
        if (!checkRightBorder(maxVal)) result = result.concat([maxVal + 1, maxVal + 11, maxVal - 9]);
    }

    if (dif > 0 && dif <= 3) {
        result = result.filter(elem => elem !== maxVal - 1 && elem !== minVal + 1);
    }

    if (dif >= 10 && dif <= 30) {
        result = result.filter(elem => elem !== maxVal - 10 && elem !== minVal + 10);
    }

    result = result.filter(elem => elem >= 0 && elem < 100);
    result = result.filter((item, pos) => result.indexOf(item) === pos);
    return result;
}

function checkLeftBorder(value) {
    let leftBorder = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
    return leftBorder.some((borderElem) => borderElem === value);
}

function checkRightBorder(value) {
    let rightBorder = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
    return rightBorder.some((borderElem) => borderElem === value);
}


