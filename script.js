
const generateButton = document.getElementById('generate');
const bubbleButton = document.getElementById('bubble');
const mergeButton = document.getElementById('merge');
const quickButton = document.getElementById('quick');
const pauseButton = document.getElementById('pause');
const container = document.getElementById('barscontainer');

let dataarray = [];
let isPaused = false;


const compareSound = new Audio('compare.mp3');
const swapSound = new Audio('swap.mp3');
const mergeSound = new Audio('mergeaction.mp3');
const pivotSound = new Audio('pivotbell.mp3');
const doneSound = new Audio('completed.mp3');

function generatenewarray() {
    container.innerHTML = '';
    dataarray = [];
    for (let i = 0; i < 50; i++) {
        const v = Math.floor(Math.random() * 350 + 30);
        dataarray.push(v);

        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';

        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${v}px`;

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.innerText = v;

        barWrapper.appendChild(bar);
        barWrapper.appendChild(label);
        container.appendChild(barWrapper);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitWhilePaused() {
    while (isPaused) {
        await sleep(100);
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}


function disableButtons() {
    generateButton.disabled = true;
    bubbleButton.disabled = true;
    mergeButton.disabled = true;
    quickButton.disabled = true;
    pauseButton.disabled = false;
}

function enableButtons() {
    generateButton.disabled = false;
    bubbleButton.disabled = false;
    mergeButton.disabled = false;
    quickButton.disabled = false;
    pauseButton.disabled = true;
}


async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < dataarray.length - 1; i++) {
        for (let j = 0; j < dataarray.length - 1 - i; j++) {
            await waitWhilePaused();
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            playSound(compareSound);
            await sleep(40);

            if (dataarray[j] > dataarray[j + 1]) {
                [dataarray[j], dataarray[j + 1]] = [dataarray[j + 1], dataarray[j]];
                bars[j].style.height = `${dataarray[j]}px`;
                bars[j + 1].style.height = `${dataarray[j + 1]}px`;
                bars[j].nextSibling.innerText = dataarray[j];
                bars[j + 1].nextSibling.innerText = dataarray[j + 1];
                bars[j].classList.add('swapped');
                bars[j + 1].classList.add('swapped');
                playSound(swapSound);
                await sleep(60);
                bars[j].classList.remove('swapped');
                bars[j + 1].classList.remove('swapped');
            }

            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
    }
    playSound(doneSound);
}


async function mergeSort(start = 0, end = dataarray.length - 1) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    let left = dataarray.slice(start, mid + 1);
    let right = dataarray.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;
    const bars = document.querySelectorAll('.bar');

    while (i < left.length && j < right.length) {
        await waitWhilePaused();
        playSound(compareSound);

        if (left[i] <= right[j]) {
            dataarray[k] = left[i];
            bars[k].style.height = `${left[i]}px`;
            bars[k].nextSibling.innerText = left[i];
            i++;
        } else {
            dataarray[k] = right[j];
            bars[k].style.height = `${right[j]}px`;
            bars[k].nextSibling.innerText = right[j];
            j++;
        }
        bars[k].classList.add('swapped');
        playSound(mergeSound);
        await sleep(50);
        bars[k].classList.remove('swapped');
        k++;
    }

    while (i < left.length) {
        await waitWhilePaused();
        dataarray[k] = left[i];
        bars[k].style.height = `${left[i]}px`;
        bars[k].nextSibling.innerText = left[i];
        bars[k].classList.add('swapped');
        playSound(mergeSound);
        await sleep(40);
        bars[k].classList.remove('swapped');
        i++; k++;
    }

    while (j < right.length) {
        await waitWhilePaused();
        dataarray[k] = right[j];
        bars[k].style.height = `${right[j]}px`;
        bars[k].nextSibling.innerText = right[j];
        bars[k].classList.add('swapped');
        playSound(mergeSound);
        await sleep(40);
        bars[k].classList.remove('swapped');
        j++; k++;
    }
}

async function quickSort(start = 0, end = dataarray.length - 1) {
    if (start < end) {
        let pivotIndex = await partition(start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    }
}

async function partition(start, end) {
    let pivot = dataarray[end];
    playSound(pivotSound);
    let i = start - 1;
    const bars = document.querySelectorAll('.bar');

    for (let j = start; j < end; j++) {
        await waitWhilePaused();
        playSound(compareSound);
        if (dataarray[j] < pivot) {
            i++;
            [dataarray[i], dataarray[j]] = [dataarray[j], dataarray[i]];
            bars[i].style.height = `${dataarray[i]}px`;
            bars[j].style.height = `${dataarray[j]}px`;
            bars[i].nextSibling.innerText = dataarray[i];
            bars[j].nextSibling.innerText = dataarray[j];
            bars[i].classList.add('swapped');
            bars[j].classList.add('swapped');
            playSound(swapSound);
            await sleep(50);
            bars[i].classList.remove('swapped');
            bars[j].classList.remove('swapped');
        }
    }

    [dataarray[i + 1], dataarray[end]] = [dataarray[end], dataarray[i + 1]];
    bars[i + 1].style.height = `${dataarray[i + 1]}px`;
    bars[end].style.height = `${dataarray[end]}px`;
    bars[i + 1].nextSibling.innerText = dataarray[i + 1];
    bars[end].nextSibling.innerText = dataarray[end];
    await sleep(50);
    return i + 1;
}

// Button Listeners
generateButton.addEventListener('click', generatenewarray);

bubbleButton.addEventListener('click', async () => {
    disableButtons();
    await bubbleSort();
    enableButtons();
});

mergeButton.addEventListener('click', async () => {
    disableButtons();
    await mergeSort();
    playSound(doneSound);
    enableButtons();
});

quickButton.addEventListener('click', async () => {
    disableButtons();
    await quickSort();
    playSound(doneSound);
    enableButtons();
});

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? "Resume" : "Pause";
});


generatenewarray();



