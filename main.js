const imgInput = document.getElementById('input-file');
const spaceForImg = document.getElementById('img_for-upload');
const uploadTxt = document.getElementById('upload-txt');
const dropZone = document.getElementById('drop-zone');
const inputFileBtn = document.getElementById('input_file-button');

const clearAllDiv = document.getElementById('clear_all-block');

const galleryCont = document.getElementById('galleryCont_forImgs');

const arrOfImgs = [];

const arrOfURLs = [];

const storedURLs = JSON.parse(localStorage.getItem('arrayOfURLs'));

window.onload = async function() {
    console.log('Загружено URL:', storedURLs?.length);

    if (!storedURLs) {return}


    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const binary = atob(parts[1]);
        const array = Uint8Array.from(binary, char => char.charCodeAt(0));

        return new Blob([array], {type: mime});
    }

    let currentIndex = 0;
    
    function processNext() {
        if (currentIndex >= storedURLs.length) {
            return;
        }
        
        try {
            const blobFile = dataURLToBlob(storedURLs[currentIndex]);
            mainFunc(blobFile);
        } catch (error) {
            console.error(`Ошибка в элементе ${currentIndex + 1}:`, error);
        }
        
        currentIndex++;
        
        if (currentIndex < storedURLs.length) {
            setTimeout(processNext, 300);
        }
    }
    
    processNext();
}
// file upload by dragNdrop
  
dropZone.addEventListener("dragenter", function(e) {
    e.preventDefault();
});
  
dropZone.addEventListener("dragover", function(e) {
    e.preventDefault();
});
  
dropZone.addEventListener("dragleave", function(e) {
    e.preventDefault();
});

dropZone.addEventListener("drop", function(e) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file) {
        const fileName = file.name;
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            mainFunc(file);
        } else {
            alert('Please, select an IMAGE!');
        }
    }
});
// file upload by click

imgInput.addEventListener('change', function(e) {
    const file = e.target.files[0];

    if (file) {
        const fileName = file.name;
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
            mainFunc(file);
        }  else {
            alert('Please, select an IMAGE!');
        }
    } else {
        alert("You have not selected a file");
    };
    e.target.value = null;
});

// local storage func

function addValueURL(value) {
    if (localStorage.getItem('arrayOfURLs') === null) {
        const arrOfValues = [];
        arrOfValues.push(value);
        localStorage.setItem('arrayOfURLs', JSON.stringify(arrOfValues));
    } else {
        const arrOfValues = JSON.parse(localStorage.getItem('arrayOfURLs'));
        if (arrOfValues.includes(value)) {
            return;
        } else {
            arrOfValues.push(value);
            localStorage.setItem('arrayOfURLs', JSON.stringify(arrOfValues));
        }
    }
}

// Main gallery and img upload function

function mainFunc(img) {
    console.log('mainFunc вызвана с blob размером:', img.size);
    const reader = new FileReader();

    reader.onload = function(e) {
        const imageURL = e.target.result;

        if (arrOfURLs.find(urlOfImg => urlOfImg === imageURL)) {
            uploadTxt.textContent = 'This image is already in the gallery';
            return;
        };

        const newImg = document.createElement('img');
        const newImgDiv = document.createElement('div');

        const deleteImgBtn = document.createElement('span');

        const clearAllBtn = document.getElementById('clearAllBtn');

        deleteImgBtn.textContent = '×';

        newImg.src = imageURL;

        arrOfImgs.push(newImg);
        arrOfURLs.push(imageURL);

        addValueURL(imageURL);

        newImg.classList.add('img_ofAGallery');
        newImgDiv.classList.add('divFor_ImgOfAGallery')

        deleteImgBtn.classList.add('deleteImg-sign');

        //clear all func

        clearAllBtn.onclick = function() {
            localStorage.clear();
            if (arrOfImgs.length !== 0) {
                const galImgs = document.querySelectorAll('.divFor_ImgOfAGallery');
                galImgs.forEach(el => {
                    el.style.opacity = '0'
                    });
                clearAllBtn.style.opacity = '0';

                setTimeout(() => {
                    clearAllDiv.style.display = "none"
                    galleryCont.innerHTML = '';
                    arrOfImgs.splice(0, arrOfImgs.length);
                    arrOfURLs.splice(0, arrOfURLs.length);
                }, 200)
            } else {
                alert('Gallery is already empty!');
            };
        };

        //delete only 1 func

        deleteImgBtn.onclick = function() {
            const urls = JSON.parse(localStorage.getItem('arrayOfURLs'));

            urls.splice(urls.indexOf(imageURL), 1);

            localStorage.setItem('arrayOfURLs', JSON.stringify(urls));

            arrOfImgs.splice(arrOfImgs.indexOf(img), 1);
            arrOfURLs.splice(arrOfURLs.indexOf(imageURL), 1);

            newImgDiv.style.opacity = '0';
            newImg.style.opacity = '0';
            setTimeout(() => {
                newImgDiv.remove();
            }, 100);
        };

        //lightbox onclick

        newImg.onclick = function() {
            spaceForImg.src = newImg.src;
            document.getElementById('fs-lightbox').style.display = 'block';
            document.getElementById('fs-img').src = newImg.src;
        };

        // end

        newImgDiv.appendChild(newImg);
        newImgDiv.appendChild(deleteImgBtn);
        galleryCont.appendChild(newImgDiv);
        
        setTimeout(() => {
            newImg.style.opacity = '1';
            newImgDiv.style.opacity = '1';
            clearAllBtn.style.opacity = '1';
            clearAllDiv.style.display = 'block';
            document.querySelector('.filters-container').style.display = 'flex';
        }, 100);
        uploadTxt.textContent = "Your image has been uploaded successfully!";
    };
    reader.readAsDataURL(img);

    if (spaceForImg.style.display === 'block') {
        spaceForImg.style.opacity = '0';
        setTimeout(() => {
            spaceForImg.style.opacity = '1';
            spaceForImg.src = URL.createObjectURL(img);
        }, 200);
    } else {
        spaceForImg.src = URL.createObjectURL(img);
        spaceForImg.style.display = 'block';
        
        setTimeout(() => {
            spaceForImg.style.opacity = '1';
        }, 15);
    };
};

// fs lightbox functions

document.getElementById('fs-lightbox_x-sign').onclick = () => {
    document.getElementById('fs-lightbox').style.display = 'none';
}

const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.onclick = function() {
    const currImg = document.getElementById('fs-img');
    const currInd = arrOfImgs.findIndex(img => img.src === currImg.src);

    if (arrOfImgs.length === 1) {
        alert('There is only 1 photo in gallery!')
        return;
    }
    if (currInd === 0) {
        currImg.src = arrOfImgs.at(-1).src;
    } else {
        currImg.src = arrOfImgs[currInd - 1].src;
    }
};

rightArrow.onclick = function() {
    const currImg = document.getElementById('fs-img');
    const currInd = arrOfImgs.findIndex(img => img.src === currImg.src);

    if (arrOfImgs.length === 1) {
        alert('There is only 1 photo in gallery!')
        return;
    };
    if (currInd + 1 === arrOfImgs.length) {
        currImg.src = arrOfImgs.at(0).src;
    } else {
        currImg.src = arrOfImgs[currInd + 1].src;
    }
};

// filter slider

let sliderInd = 0;

const leftSlider = document.getElementById('left-slider');
const rightSlider = document.getElementById('right-slider');

const arrOfBtnsDivs = Array.from(document.querySelectorAll('.filter-slide'));

leftSlider.onclick = function() {
    const sliderInput = arrOfBtnsDivs.at(sliderInd).querySelector('.rangeFilter-input');
    const btnBlock = arrOfBtnsDivs.at(sliderInd).querySelector('.filter-btn');
    if (arrOfBtnsDivs.length + sliderInd - 1 === 0) {
        if (sliderInput.style.display === 'block') {
            arrOfBtnsDivs.at(sliderInd).style.maxWidth = '200px';
            arrOfBtnsDivs.at(sliderInd).style.height = '50px';

            setTimeout(() => {
                arrOfBtnsDivs.at(sliderInd).style.display = 'none';
                sliderInd = 0;
                arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
                sliderInput.style.display = 'none';
                btnBlock.style.display = 'block'
            }, 200)
        } else {
            arrOfBtnsDivs.at(sliderInd).style.display = 'none';
            sliderInd = 0;
            arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
        }
    } else {
        if (sliderInput.style.display === 'block') {
            arrOfBtnsDivs.at(sliderInd).style.maxWidth = '200px';
            arrOfBtnsDivs.at(sliderInd).style.height = '50px';

            setTimeout(() => {
                arrOfBtnsDivs.at(sliderInd).style.display = 'none';
                sliderInd -= 1;
                arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
                sliderInput.style.display = 'none';
                btnBlock.style.display = 'block'
            }, 200)
        } else {
            arrOfBtnsDivs.at(sliderInd).style.display = 'none';
            sliderInd -= 1;
            arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
        }
    };
}

rightSlider.onclick = function() {
    const sliderInput = arrOfBtnsDivs.at(sliderInd).querySelector('.rangeFilter-input');
    const btnBlock = arrOfBtnsDivs.at(sliderInd).querySelector('.filter-btn');
    if (arrOfBtnsDivs.length - sliderInd - 1 === 0) {
        if (sliderInput.style.display === 'block') {
            arrOfBtnsDivs.at(sliderInd).style.maxWidth = '200px';
            arrOfBtnsDivs.at(sliderInd).style.height = '50px';
            

            setTimeout(() => {
                arrOfBtnsDivs.at(sliderInd).style.display = 'none';
                sliderInd = 0;
                arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
                sliderInput.style.display = 'none';
                btnBlock.style.display = 'block'
            }, 200)
        } else {
            arrOfBtnsDivs.at(sliderInd).style.display = 'none';
            sliderInd = 0;
            arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
        }
    } else {
        if (sliderInput.style.display === 'block') {
            arrOfBtnsDivs.at(sliderInd).style.maxWidth = '200px';
            arrOfBtnsDivs.at(sliderInd).style.height = '50px';

            setTimeout(() => {
                arrOfBtnsDivs.at(sliderInd).style.display = 'none';
                sliderInd += 1;
                arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
                sliderInput.style.display = 'none';
                btnBlock.style.display = 'block'
            }, 200)
        } else {
            arrOfBtnsDivs.at(sliderInd).style.display = 'none';
            sliderInd += 1;
            arrOfBtnsDivs.at(sliderInd).style.display = 'flex';
        };
    };
}

// filter btns system

arrOfBtnsDivs.forEach((div) => {
    div.querySelector('.filter-btn').onclick = function() {
        if (spaceForImg.style.display === 'block') {
            div.style.maxWidth = '300px';
            div.style.height = '70px';
            const divsBtn = div.querySelector('.filter-btn');
            const filterInput = div.querySelector('.rangeFilter-input');
            filterInput.style.display = 'block';
            divsBtn.style.display = 'none';
        } else {
            alert('You have not selected a photo yet!');
        };
    };
});

const arrOfInputs = Array.from(document.querySelectorAll('.rangeFilter-input'));
const spanForVal = document.querySelector('.filter-valueTxt');

arrOfInputs.forEach((inp) => {
    inp.addEventListener('input', function() {
        if (this.value == 0) {
            spanForVal.textContent = this.value
        } else {
            spanForVal.textContent = this.value + '%';
        }
    })
})

// filter system

const brightFilter = document.getElementById('brightness-input');
const contrastFilter = document.getElementById('contrast-input');
const blurFilter = document.getElementById('blur-input');
const saturateFilter = document.getElementById('saturate-input');
const grayscaleFilter = document.getElementById('grayscale-input');
const sepiaFilter = document.getElementById('sepia-input');

const currentFilters = {
    brightness: 100,
    contrast: 50,
    blur: 0,
    saturate: 50,
    grayscale: 0,
    sepia: 0
}

function doFilters(filterName, value) {
    currentFilters[filterName] = value;

    const filterString = `
        brightness(${currentFilters.brightness}%)
        contrast(${currentFilters.contrast * 2}%)
        blur(${currentFilters.blur}px)
        saturate(${currentFilters.saturate * 2}%)
        grayscale(${currentFilters.grayscale}%)
        sepia(${currentFilters.sepia}%)
    `.trim().replace(/\s+/g, ' ');
    
    spaceForImg.style.filter = filterString;
};

brightFilter.addEventListener('input', (event) => {doFilters('brightness', event.target.value);});

contrastFilter.addEventListener('input', (event) => {doFilters('contrast', event.target.value)});

blurFilter.addEventListener('input', (event) => {doFilters('blur', event.target.value)});

saturateFilter.addEventListener('input', (event) => {doFilters('saturate', event.target.value)});

grayscaleFilter.addEventListener('input', (event) => {doFilters('grayscale', event.target.value)});

sepiaFilter.addEventListener('input', (event) => {doFilters('sepia', event.target.value)});

const revomeAllFiltersBtn = document.getElementById('removeFilterBtn');

revomeAllFiltersBtn.onclick = function() {
    brightFilter.value = 100;
    contrastFilter.value = 50;
    blurFilter.value = 0;
    saturateFilter.value = 50;
    grayscaleFilter.value = 0;
    sepiaFilter.value = 0;

    currentFilters.brightness = 100;
    currentFilters.contrast = 50;
    currentFilters.blur = 0;
    currentFilters.saturate = 50;
    currentFilters.grayscale = 0;
    currentFilters.sepia = 0;

    const filterString = `
        brightness(100%)
        contrast(1)
        blur(0px)
        saturate(1)
        grayscale(0)
        sepia(0)
    `.trim().replace(/\s+/g, ' ');

    spaceForImg.style.filter = filterString;
}