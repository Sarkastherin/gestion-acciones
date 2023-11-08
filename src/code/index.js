const previewAction = document.getElementById('previewAction');
const nextAction = document.getElementById('nextAction'); 

previewAction.addEventListener('click', () => {
    let cardActive = document.querySelector('.card-slide-item--active');
    let numCardActive = cardActive.id;
    if (numCardActive > 1) {
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        let newCardActive = document.getElementById(numCardActive - 1);
        newCardActive.classList.add('card-slide-item--active');
        newCardActive.classList.remove('card-slide-item');
    }
    else {
        
    }
})
nextAction.addEventListener('click', () => {
    let cardItems = document.querySelectorAll('div[class*="card-slide-item"]');
    let numCardItems = cardItems.length
    let cardActive = document.querySelector('.card-slide-item--active');
    let numCardActive = Number(cardActive.id);
    if (numCardActive != numCardItems) {
        cardActive.classList.remove('card-slide-item--active');
        cardActive.classList.add('card-slide-item');
        let newCardActive = document.getElementById(numCardActive+1);
        newCardActive.classList.add('card-slide-item--active');
        newCardActive.classList.remove('card-slide-item');
    }
})