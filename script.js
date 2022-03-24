class DomInterface {
    constructor() {
        this.form = document.querySelector('#comic-form');
        this.searchField = document.querySelector('#search-input');

        this.title = document.querySelector('#comic-title');
        this.image = document.querySelector('#comic-image');
        this.date = document.querySelector('#comic-date');

        this.error = document.querySelector('#error');
        this.formError = document.querySelector('#form-error');
        this.loader = document.querySelector('#loader');

        this.controls = {
            first: document.querySelector('#request-first'),
            last: document.querySelector('#request-last'),
            previous: document.querySelector('#request-prev'),
            next: document.querySelector('#request-next'),
            random: document.querySelector('#request-random'),
        };
    }

    clearResults() {
        this.title.innerHTML = 'Loading...';
        this.image.src = '';
        this.image.alt = '';
        this.image.title = '';
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
        const { title, img, month, day, year, num } = data;

        this.title.innerHTML = title;
        this.image.src = img;
        
        if (data.alt) { 
            this.image.title = data.alt; // display text when mousing over image
            this.image.alt = data.alt; // display text if image fails to load
        };
        
        this.date.innerHTML = `XKCD #${num} Published: ${month}, ${day}, ${year}`;

        this.hideLoader();
    }
}

class requestController {
    constructor() {
        this.DomInterface = new DomInterface();
        this.corsHeader = 'https://the-ultimate-api-challenge.herokuapp.com';
        this.URL = 'https://xkcd.com';
        this.suffix = 'info.0.json';
        this.superAgent = superagent;

        const requestUrl = `${this.corsHeader}/${this.URL}/${this.suffix}`; // GET most recent comic

        this.superAgent.get(requestUrl).end((error, response) => {
            if (error) { this.DomInterface.showError(); }
            const data = response.body;

            this.DomInterface.showComics(data);
            this.setCurrentComicsNumber(data.num);
            this.setMaxComicsNumber(data.num);
        });

        this.registerEvents();
    }

    setCurrentComicsNumber(number) {
        this.currentComicsNumber = number;
    }

    setMaxComicsNumber(number) {
        this.maxComicsNumber = number;
    }

    getRandomComicNumber() {
        return Math.floor(Math.random() * this.maxComicsNumber + 1);
    }

    getComicByNumber(number) {
        this.DomInterface.hideErrors();
        this.DomInterface.showLoader();
        this.DomInterface.clearResults();

        const requestUrl = `${this.corsHeader}/${this.URL}/${number}/${this.suffix}`;

        this.superAgent.get(requestUrl).end((error, response) => {
            if (error) { this.DomInterface.showError(); }

            const data = response.body;

            this.setCurrentComicsNumber(data.num);
            this.DomInterface.showComics(data);
        });
    }

    getPreviousComic() {
        const requestedComicsNumber = this.currentComicsNumber - 1;
        if (requestedComicsNumber < 1) { return };

        this.getComicByNumber(requestedComicsNumber);
    }

    getNextComic() {
        const requestedComicsNumber = this.currentComicsNumber + 1;
        if (requestedComicsNumber > this.maxComicsNumber) { return };

        this.getComicByNumber(requestedComicsNumber);
    }

    getComicById(e) {
        e.preventDefault();

        const query = this.DomInterface.searchField.value;
        if (!query || query === '') { return };
        if (query < 1 || query > this.maxComicsNumber) {
            return this.DomInterface.showFormError(`Try a number between 1 and ${this.maxComicsNumber}`);
        }

        this.getComicByNumber(query);
    }

    registerEvents() {
        this.DomInterface.controls.random.addEventListener('click', () =>
            this.getComicByNumber(this.getRandomComicNumber())
        );

        this.DomInterface.controls.first.addEventListener('click', () => this.getComicByNumber(1));
        this.DomInterface.controls.last.addEventListener('click', () => this.getComicByNumber(this.maxComicsNumber));

        this.DomInterface.controls.previous.addEventListener('click', () => this.getPreviousComic());
        this.DomInterface.controls.next.addEventListener('click', () => this.getNextComic());

        this.DomInterface.form.addEventListener('submit', e => this.getComicById(e));
    }
}

const comics = new requestController();