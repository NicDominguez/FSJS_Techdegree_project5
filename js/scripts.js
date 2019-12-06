
//---------------------------
// Global Variables
//---------------------------

const gallery = document.getElementById('gallery')
const overlay = document.getElementById('overlay')
const searchContainer = document.getElementsByClassName('search-container')[0]
const allEmployees = []

//---------------------------
// ON PAGE LOAD
//---------------------------

appendSeach()

//---------------------------
// FETCH FUNCTIONS
//---------------------------

fetch('https://randomuser.me/api/?nat=us,gb&results=12')
    .then(response => response.json())
    .then(data => {
        createClass(data)
        allEmployees.forEach((employee) => {
            employee.generateCard()
        })

    })
    .catch(err => console.log(err));

//---------------------------
// Class Construction
//---------------------------

class Employee {
    constructor(id, pictureURL, firstName, lastName, email, street, city, state, postcode, phone, dob) {
        this.id = id
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

    // removes extra digits from the dob
    cleanDOB() {
        return `${this.dob.slice(5, 7)}/${this.dob.slice(8, 10)}/${this.dob.slice(2, 4)}`
    }


    // creates a card using the employee object
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
        card.setAttribute("index", `${this.id}`)
        card.innerHTML = cardHtml;
        gallery.appendChild(card);    
    }

}
   

//---------------------------
// HELPER FUNCTIONS
//---------------------------

// creates an employee object based on the Employee class and pushes that employee to the allEmployees array
function createClass(data) {
    data.results.forEach((employee, index) => {
        employee = new Employee(
            index, //id number
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

// Creates a modal window using the employee object from the allEmployees array that matches the id of the object to the index of the card element
function generateModalCard(object) {
    const modalCard = document.createElement('DIV')
    const modalCardHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${object.pictureURL}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${object.firstName} ${object.lastName}</h3>
                <p class="modal-text">${object.email}</p>
                <p class="modal-text cap">${object.city}</p>
                <hr>
                <p class="modal-text">${object.phone}</p>
                <p class="modal-text">${object.street.number} ${object.street.name}, ${object.city}, ${object.state} ${object.postcode}</p>
                <p class="modal-text">Birthday: ${object.cleanDOB()}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;
    modalCard.classList.add('modal-container')
    modalCard.setAttribute("index", `${object.id}`)
    modalCard.innerHTML = modalCardHTML
    gallery.appendChild(modalCard)
}

// adds the search box to the page
function appendSeach() {
    const searchBox = document.createElement('FORM')
    const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
        `;
    searchBox.innerHTML = searchHTML 
    searchContainer.appendChild(searchBox)
}

//---------------------------
// EVENT LISTENERS
//---------------------------

gallery.addEventListener('click', (e) => {
    //generates a modal card only if a modal card is not already present
    if (gallery.lastChild.classList.contains("card")) {
        let target = e.target.closest(".card")
        let index = target.getAttribute("index")
        let employee = allEmployees[index]
        generateModalCard(employee)
    }

    // establishes functions of the various modal card buttons
    if (gallery.lastChild.classList.contains("modal-container")) {
        const btn = e.target;
        const modalCard = document.getElementsByClassName("modal-container")[0];
        const index = parseInt(modalCard.getAttribute("index"), 10);
        const nextCard = allEmployees[index + 1]
        const previousCard = allEmployees[index - 1]

        if (btn.id === 'modal-close-btn' || btn.parentNode.id === 'modal-close-btn') {
            gallery.removeChild(gallery.lastChild)
        }
        else if (btn.id === 'modal-prev' && previousCard !== undefined) {
            gallery.removeChild(gallery.lastChild)
            generateModalCard(previousCard)
        } else if (btn.id === 'modal-next' && nextCard !== undefined) {
            gallery.removeChild(gallery.lastChild)
            generateModalCard(nextCard)
        }
    }
})

// creates filter function for search field
searchContainer.addEventListener('keyup', (e) => {
    let displayArray = []  
    const searchInput = document.getElementById("search-input")
    let filterText = searchInput.value.toLowerCase();

    // loop through first and last name
    allEmployees.forEach((employee) => {
        let firstName = employee.firstName.toLowerCase()
        let lastName = employee.lastName.toLowerCase()
        if (firstName.includes(filterText) || lastName.includes(filterText)) {
            displayArray.push(employee)
        }
    })

    // remove all current cards
    while (gallery.lastChild) {
        gallery.removeChild(gallery.lastChild)
    }

     //generate cards for display array employees
    displayArray.forEach((employee) => {
        employee.generateCard(employee)
    })
})



