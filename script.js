/**
 * STEPS:
 * 1. create a requestController class and define the needed variables for the API call
 * 2. Create a method that will get the current (last added) comic and set the currentComicsNumber and
 *    maxComicsNumber accordingly, call that method on load
 * 3. Register an event for the random comic number and add all the chain of event to display it
 * 4. Add Previous/Next, First/Last and get Comic by ID functionality to the app
 * 5. Adjust UI states accordingly
 */

 class DomInterface {
    constructor() {
        this.form = document.querySelector('#comic-form');
        this.searchField = document.querySelector('#search-input');

        this.title = document.querySelector('#comic-title');
        this.image = document.querySelector('#comic-image');

        this.error = document.querySelector('#error');
        this.formError = document.querySelector('#form-error');
        this.loader = document.querySelector('#loader');

        this.controls = {
            previous: document.querySelector('#request-prev'),
            next: document.querySelector('#request-next'),
            random: document.querySelector('#request-random'),
            first: document.querySelector('#request-first'),
            last: document.querySelector('#request-last'),
        };
    }

    clearResults() {
        this.title.innerHTML = 'Loading...';
        this.image.src = '';
        this.image.alt = '';
    }

    hideLoader() {
        this.loader.classList.remove('d-flex');
        this.loader.classList.add('d-none');
    }

    showLoader() {
        this.loader.classList.remove('d-none');
        this.loader.classList.add('d-flex');
    }

    showError() {
        this.hideLoader();
        this.error.innerHTML = 'There has been an error, please try again';
    }

    showFormError(message) {
        this.hideLoader();
        this.formError.innerHTML = message;
    }

    hideErrors() {
        this.error.innerHTML = '';
        this.formError.innerHTML = '';
    }

    showComics(data) {
        const { title, img } = data;

        this.title.innerHTML = title;
        this.image.src = img;
        if (data.alt) this.image.alt = data.alt;

        this.hideLoader();
    }
}

class requestController {
    constructor() {
        this.DomInterface = new DomInterface();
        this.corsHeader = 'https://the-ultimate-api-challenge.herokuapp.com';
        this.URL = 'https://xkcd.com';
        this.currentComic = 'info.0.json';
        this.superAgent = superagent;

        this.getLatestComic();
        this.DomInterface.hideLoader();
    }

    getLatestComic() {
        const requestUrl = `${this.corsHeader}/${this.URL}/${this.currentComic}`;
        this.superAgent.get(requestUrl).end((error, response) => {
            if (error) {
                this.DomInterface.showError();
            }
            const data = response.body;
            this.DomInterface.showComics(data);
            
        });
    }
}

const comics = new requestController();