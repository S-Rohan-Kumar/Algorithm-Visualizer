document.addEventListener('DOMContentLoaded',()=>{
    const arrayContainer = document.querySelector(".array-display");
    const arrayWraped = document.querySelector(".array-wrapper")
    const generateBtn = document.querySelector(".btn-primary");
    const startBtn = document.querySelector(".btn-secondary");
    const pauseBtn = document.querySelector(".btn-warning");
    const resetBtn = document.querySelector(".btn-danger");
    const algoifo = document.querySelector(".algorithm-info")
    let statusBadge = algoifo.querySelector(".status-badge");
    const algorithmSelect = document.getElementById("algorithm");
    const arraySizeInput = document.getElementById("arraySize");
    const speedInput = document.getElementById("speed");
    const dataTypeSelect = document.getElementById("dataType");
    let array = [];
    let isSorting = false;
    let isPaused = false;
    let speedin = speedInput.value;
    let statusbar =null;
    arraySizeInput.addEventListener('input',()=>{
        document.querySelector("#arraySize + .range-value").textContent = `${arraySizeInput.value} elements`
    })

    speedInput.addEventListener('input',()=>{
        document.querySelector("#speed + .range-value").textContent = `${speedInput.value}ms`
    })

    generateBtn.addEventListener('click',()=>{
        let size = arraySizeInput.value.trim();
        let type = dataTypeSelect.value.trim();
        isSorting=false;
        generateArray(size,type)
    })

    algorithmSelect.addEventListener('change',()=>{
        const selectedAlgorithm = algorithmSelect.value;
        let alogname =""
        if(selectedAlgorithm === "bubble"){
            alogname = "Bubble Sort";
        }
        else if (selectedAlgorithm === "selection") {
            alogname = "Selection Sort";
        }
        else if (selectedAlgorithm === "insertion") {
            alogname = "Insertion Sort";
        }
        else if (selectedAlgorithm === "merge") {
            alogname = "Merge Sort";
        }
        else if (selectedAlgorithm === "quick") {
            alogname = "Quick Sort";
        }
        else if (selectedAlgorithm === "heap") {
            alogname = "Heap Sort";
        }
        algoifo.innerHTML = `
            <span>Algorithm: <strong>${alogname}</strong></span>
            <div class="status-badge status-ready">Ready</div>
        `
        statusBadge = algoifo.querySelector(".status-badge");
    })

    startBtn.addEventListener("click", async () => {
        if (isSorting) return;
        
        isSorting = true;

        if(isSorting) {
            statusBadge.classList.add("status-sorting")
            statusBadge.textContent = "Sorting...";
        }

        const selectedAlgorithm = algorithmSelect.value;

        if (selectedAlgorithm === "bubble") {
            await bubblesort(array);
        }
        else if (selectedAlgorithm === "selection") {
            await selectionsort(array);
        }
        else if(selectedAlgorithm === "quick"){
            await quicksort(array,0,arraySizeInput.value);
        }
        else if(selectedAlgorithm === "insertion"){
            await insertionsort(array);
        }
        else if(selectedAlgorithm === "merge"){
            await mergesort(array,0,arraySizeInput.value-1);
        }
        else if(selectedAlgorithm === "heap"){
            await heapSort(array);
        }
        isSorting = false;

        if (statusBadge) {
            statusBadge.classList.remove('status-sorting');
            statusBadge.classList.add("status-complete");
            statusBadge.textContent = "Done";
        }
        console.log(array);
    });



    function generateArray(size,type){
        array=[];
        for(let i=0;i<size;i++){
            let value;
            if (type === "random") value = Math.floor(Math.random() * 100) + 1;
            if (type === "ascending") value = i + 1;
            if (type === "descending") value = size - i;
            if (type === "identical") value = 50; 
            array.push(value);
        }
        renderArray();
    }

    function renderArray(){
        arrayContainer.innerHTML="";
        arrayContainer.classList.remove('demo-array');
        array.forEach(value => {
            const box = document.createElement('div');
            box.classList.add('array-box');

            if (value < 25) box.classList.add("value-low");
            else if (value < 50) box.classList.add("value-medium");
            else if (value < 75) box.classList.add("value-high");
            else box.classList.add("value-highest");

            box.textContent = value;
            arrayContainer.appendChild(box);
        });
    }

    async function bubblesort(array){
        const boxes = document.querySelectorAll(".array-box");

        for(let i=0;i<array.length-1;i++){
            for(let j=0;j<array.length-1-i;j++){

                boxes[j].classList.add("comparing");
                boxes[j + 1].classList.add("comparing");

                await sleep(speedin)

                if(array[j]>array[j+1]){
                    [array[j],array[j+1]] = [array[j+1],array[j]];
                    boxes[j].textContent = array[j];
                    boxes[j + 1].textContent = array[j + 1];
                    boxes[j].classList.add("swapping");
                    boxes[j + 1].classList.add("swapping");
                    await sleep(speedin);
                }
                boxes[j].classList.remove("comparing", "swapping");
                boxes[j + 1].classList.remove("comparing", "swapping");

            }
            boxes[array.length - 1 - i].classList.add("sorted");
        }
        boxes[0].classList.add("sorted");
    }

    async function selectionsort(array) {
        const boxes  = document.querySelectorAll(".array-box");

        for(let i=0;i<array.length-1;i++){
            let k=i;
            boxes[i].classList.add('pivot')
            await sleep(speedin);
            let j=i+1;
            while(j<array.length){
                boxes[k].classList.add('comparing');
                boxes[j].classList.add('comparing');
                await sleep(speedin);
                if(array[j]<array[k]){
                    k=j;
                }
                boxes[j].classList.remove("comparing");
                if (j !== k) boxes[k].classList.remove('comparing');
                j++;
            }
            if(k!=i){
                [array[i],array[k]] = [array[k],array[i]];
                boxes[i].textContent = array[i];
                boxes[k].textContent = array[k];
                boxes[i].classList.add("swapping");
                boxes[k].classList.add("swapping");
                await sleep(speedin);
                boxes[i].classList.remove('swapping',"comparing");
                boxes[k].classList.remove('swapping',"comparing");
            }
            boxes[i].classList.remove("pivot");
            boxes[i].classList.add('sorted');
        }
        boxes[array.length-1].classList.add('sorted');
    }

    async function partition(array,l,h){
        const boxes  = document.querySelectorAll(".array-box");
        let pivot = array[l];
        let i=l;
        let j=h;
        boxes[l].classList.add("pivot");
        await sleep(speedin);

        do{
            do {
                i++
            } while (array[i]<=pivot);
            do{
                j--;
            }while(array[j]>pivot);
            if(i<j){
                boxes[i].classList.add("comparing");
                boxes[j].classList.add("comparing");
                await sleep(speedin);
                boxes[i].classList.add("swapping");
                boxes[j].classList.add("swapping");
                [array[i],array[j]]=[array[j],array[i]]
                boxes[i].textContent = array[i];
                boxes[j].textContent = array[j];
                await sleep(speedin);
                boxes[i].classList.remove("swapping","comparing");
                boxes[j].classList.remove("swapping","comparing");
            }
        }while(i<j);
        [array[l],array[j]] = [array[j],array[l]];
        boxes[l].textContent = array[l];
        boxes[j].textContent = array[j];
        boxes[l].classList.remove("pivot");
        boxes[j].classList.add("sorted");
        await sleep(speedin);
        return j;
    }

    async function quicksort(array,l,h) {
        if(l<h){
            let pi = await partition(array,l,h);
            await quicksort(array,l,pi);
            await quicksort(array,pi+1,h);
        }
    }

    async function insertionsort(array) {
        const boxes  = document.querySelectorAll(".array-box");

        for(let i=1;i<array.length;i++){
            let pivot = array[i];
            let j=i-1;

            boxes[i].classList.add("pivot");
            await sleep(speedin);

            while(array[j]>=0 && array[j]>pivot ){

                boxes[j].classList.add("comparing");
                boxes[j+1].classList.add("swapping");

                await sleep(speedin);

                array[j+1] = array[j];
                boxes[j+1].textContent = array[j+1];

                await sleep(speedin);

                boxes[j].classList.remove("comparing");
                boxes[j+1].classList.remove("swapping");

                j--;

            }
            await sleep(speedin)
            array[j+1] = pivot; 
            boxes[j+1].textContent = pivot
            await sleep(sleep)
            boxes[i].classList.remove("pivot");
            for(let k=0;k<=i;k++){
                boxes[k].classList.add("sorted");
            }
        }
    }

    async function merge(array,l,mid,h) {

        const boxes  = document.querySelectorAll(".array-box");

        let left = array.slice(l,mid+1);
        let right = array.slice(mid+1,h+1);
        let i=0,j=0,k=l;
        while(i<left.length && j<right.length){
            boxes[k].classList.add("comparing");
            await sleep(speedin);

            if(left[i]<=right[j]){
                array[k] = left[i];
                boxes[k].textContent = left[i];
                i++;
            }
            else{
                array[k]=right[j];
                boxes[k].textContent = right[j];
                j++;
            }
            boxes[k].classList.remove("comparing");
            boxes[k].classList.add("swapping"); 
            await sleep(speedin);
            boxes[k].classList.remove("swapping");
            k++
        }
        while(i<left.length){
            boxes[k].classList.add("swapping");
            array[k] = left[i];
            boxes[k].textContent = left[i];
            await sleep(speedin);
            boxes[k].classList.remove("swapping");
            i++;
            k++;
        }
        while(j<right.length){
            boxes[k].classList.add("swapping");
            array[k] = right[j];
            boxes[k].textContent = right[j];
            await sleep(speedin);
            boxes[k].classList.remove("swapping");
            j++;
            k++;
        }
    }

    async function mergesort(array,l,h) {
        if(l<h){
            let mid=Math.floor((l+h)/2);
            await mergesort(array,l,mid);
            await mergesort(array,mid+1,h);
            await merge(array,l,mid,h);
        }
        await sleep(speedin)
        if(l===0 && h===array.length-1){
            const boxes = document.querySelectorAll(".array-box");
            boxes.forEach(box=>
                box.classList.add("sorted")
            )
        }
    }

    async function heapify(array, n, i) {
        const boxes = document.querySelectorAll(".array-box");
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        boxes[i].classList.add("pivot");
        await sleep(speedin);

        if (left < n) boxes[left].classList.add("comparing");
        if (right < n) boxes[right].classList.add("comparing");
        await sleep(speedin);

        if (left < n && array[left] > array[largest]) largest = left;
        if (right < n && array[right] > array[largest]) largest = right;

        if (largest != i) {
            boxes[i].classList.add("swapping");
            boxes[largest].classList.add("swapping");
            [array[i], array[largest]] = [array[largest], array[i]];
            boxes[i].textContent = array[i];
            boxes[largest].textContent = array[largest];
            await sleep(speedin);
            boxes[i].classList.remove("swapping", "pivot");
            boxes[largest].classList.remove("swapping", "comparing");
            await heapify(array, n, largest);
        }

        boxes[i].classList.remove("pivot");
        if (i >= Math.floor(n/2)) boxes[i].classList.add("sorted"); 
        if (left < n) boxes[left].classList.remove("comparing");
        if (right < n) boxes[right].classList.remove("comparing");
    }

    async function heapSort(array) {
        const n = array.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(array, n, i);
        }

        const boxes = document.querySelectorAll(".array-box");

        for (let i = n - 1; i > 0; i--) {
            boxes[0].classList.add("swapping");
            boxes[i].classList.add("swapping");
            [array[0], array[i]] = [array[i], array[0]];
            boxes[0].textContent = array[0];
            boxes[i].textContent = array[i];
            await sleep(speedin);
            boxes[i].classList.add("sorted"); 
            boxes[0].classList.remove("swapping");
            boxes[i].classList.remove("swapping");

            await heapify(array, i, 0);
        }
        boxes[0].classList.add("sorted"); 
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



})

