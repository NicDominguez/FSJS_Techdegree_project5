
//---------------------------
// Global Variables
//---------------------------

const gallery = document.getElementById('gallery')
const overlay = document.getElementById('overlay')
const searchContainer = document.getElementsByClassName('search-container')[0]
const allEmployees = []



//---------------------------
// FETCH FUNCTIONS
//---------------------------

fetch('https://randomuser.me/api/?nat=us,gb&results=12')
    .then(response => response.json())
    .then(data => createClass(data))
    .catch(err => console.log(err));

//---------------------------
// ON PAGE LOAD
//---------------------------

//NOT WORKING ON PAGE LOAD AND DON'T KNOW WHY
allEmployees.forEach((employee) => {
    employee.generateCard()
})


//---------------------------
// Class Construction
//---------------------------

class Employee {
    constructor(pictureURL, firstName, lastName, email, street, city, state, postcode, phone, dob) {
        this.pictureURL = pictureURL
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.street = street;
        this.city = city;
        this.state = state;
        this.postcode = postcode;
        this.phone = phone;
        this.dob = dob
    }

    cleanDOB() {
        return `${this.dob.slice(5, 7)}/${this.dob.slice(8, 10)}/${this.dob.slice(2, 4)}`
    }

    generateCard() {
        let card = document.createElement('DIV');
        const cardHtml = `
            <div class="card-img-container">
                <img class="card-img" src="${this.pictureURL}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${this.firstName} ${this.lastName}</h3>
                <p class="card-text">${this.email}</p>
                <p class="card-text cap">${this.city}, ${this.state}</p>
            </div>
            `;
        card.classList.add('card')
        card.innerHTML = cardHtml;
        gallery.appendChild(card);    
    }

    generateModalCard() {
    const modalCard = document.createElement('DIV')
    const modalCardHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${this.pictureURL}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${this.firstName} ${this.lastName}</h3>
                <p class="modal-text">${this.email}</p>
                <p class="modal-text cap">${this.city}</p>
                <hr>
                <p class="modal-text">${this.phone}</p>
                <p class="modal-text">${this.street}, ${this.city}, ${this.state} ${this.postcode}</p>
                <p class="modal-text">Birthday: ${this.cleanDOB()}</p>
            </div>
        `;
    modalCard.classList.add('modal-container')    
    modalCard.innerHTML = modalCardHTML
    gallery.appendChild(modalCard)
    }
}
   

//---------------------------
// HELPER FUNCTIONS
//---------------------------

function createClass(data) {
    data.results.forEach((employee) => {
        employee = new Employee(
            employee.picture.large, //pictureURL
            employee.name.first, //firstName
            employee.name.last, //lastName
            employee.email, //email
            employee.location.street, //steet
            employee.location.city, //city
            employee.location.state, //state
            employee.location.postcode, //postcode
            employee.phone, //phone
            employee.dob.date.slice(0, 10) //dob
        )
        allEmployees.push(employee);
    })
}



//---------------------------
// EVENT LISTENERS
//---------------------------

document.addEventListener("DOMContentLoaded", function () {
    gallery.addEventListener('click', (e) => {
        const cardForFocus = e.target.closest('.card');
        cardForFocus.id = 'focuscard';
        generateModalCard(cardForFocus)
        overlay.style.display = 'block';
    })

})

gallery.addEventListener('click', (e) => {
    let btn = e.target;
    const focusCard = document.getElementById('focuscard')
    const modalCard = document.getElementById("modalcard");
    const previousCard = focusCard.previousElementSibling
    const nextCard = focusCard.nextElementSibling

    if (btn.id === 'close-btn') {
        overlay.style.display = "none"
        focusCard.removeAttribute('id')
        modalCard.remove()
    }
    else if (btn.id === 'left-arrow' && previousCard !== null) {
        focusCard.removeAttribute("id");
        previousCard.id = "focuscard"
        modalCard.remove()
        generateModalCard(previousCard)
    } else if (btn.id === 'right-arrow' && nextCard !== null) {
        focusCard.removeAttribute("id");
        nextCard.id = "focuscard"
        modalCard.remove()
        generateModalCard(nextCard)
    }

})

searchContainer.addEventListener('keyup', (e) => {
    let filterText = filter.value.toLowerCase();
    cardsNodeList = document.getElementsByClassName('card');
    const cardsArray = Array.prototype.slice.call(document.getElementsByClassName('card'));
    // show all cards again
    cardsArray.forEach(card => card.style.display = 'flex')

    // loop through first and last name
    cardsArray.forEach(card => {
        let name = card.children[1].children[0].innerText.toLowerCase();
        if (name.includes(filterText) === false) {
            card.style.display = 'none'
        }

    })

})



