const timeBlocksEl = $(".time-block");
const currentDateEl = $("#current-day");

// variable that links to the clear button created in the HTML doc
const clearBtn = $('#clear-btn');

// an array of times, from 9AM to 9PM
const times = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
    "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM"
];

// function that generates the schedule/time-blocks
const createSchedule = () => {

    // ensures that the time-blocks ul is empty just in case
    timeBlocksEl.empty();

    // loops for however many time-blocks there are in the times array and generates a row for each time-block
    for (let i = 0; i < times.length; i++) {

        let hour = times[i];

        let row = $('<div class="row time-block">');
        timeBlocksEl.append(row);
        
        // each row has a div that contains the hour. added some padding for better readability
        let time = $('<div class="hour col py-3">');
        time.text(hour);
        row.append(time);

        // each row has a textarea for the user to enter events. Each one has a unique index number for quicker referencing.
        // this block is larger than the others
        let eventInput = $(`<textarea class="userInput col-9" data-index="${i}" 
        placeholder="Click here to enter an event">`);
        row.append(eventInput);

        // each row has a button that links to its respective textarea so that the user can save their events.
        // added a margin to make the schedule look more tidy on the page. each button also has a unique
        // button number for easier referencing
        let saveBtn = $(`<button class="saveBtn col mr-4" data-button="${i}">Save</button>`);
        row.append(saveBtn);
    };
};

// function that displays the date and time utilizing moment.js
const displayDateTime = () => {

    // creation of variables that store the date and time respectively
    let currentDate = moment().format("MMMM Do, YYYY");
    let currentTime = moment().format("h:mm:ss A")

    // writes the date and time to the current-day <p> in the HTML document
    currentDateEl.html(`Date: ${currentDate} <br><br> Time: ${currentTime}`);

    // calls the colorBlocks function that colors the time-blocks according to
    // the time. The colorBlocks function is called here, because the parent 
    // function (displayDateTime) is called every second and we want the 
    // time-blocks' color to update accordingly.
    colorBlocks();
};

// function that calls the setInterval function that calls the displayDateTime function
// every second. This essentially causes the time retrieved using moment.js to behave
// like a clock.
const startClock = () => {

    setInterval(displayDateTime, 1000);

};

// function that is linked to the save buttons generated when creating the scheduler
// and allows the user to save events to localStorage
const saveEvent = (event) => {

    // saves the button clicked as a variable
    const btnClicked = $(event.target);

    // stores the button's data number in a variable
    const index = btnClicked.data("button");
    // stores the respective textarea element as a variable (for readability)
    const textArea = btnClicked.siblings("textarea");
    // stores the user's input from that textarea element in a variable
    const userEvent = textArea.val();

    // if the user didn't enter anything when they clicked the save button, function exits
    if (userEvent === "") {
        return;
    }

    // stores the user's event according to the row that the user clicked the save button in
    localStorage.setItem(`scheduler-row-${index}`, userEvent);
    
};

// function that renders any saved user events to the scheduler from localStorage. Called
// when the page loads. Not called when the user saves an event just in case they entered
// multiple events prior to saving each one
const renderSavedEvents = () => {

    // loops however many time-blocks there are in the times array
    for (let i = 0; i < times.length; i++) {

        // retrieves each stored user input event and stores it in a variable
        let retrievedEvent = localStorage.getItem(`scheduler-row-${i}`);
        // variable linking to the respective row that the event was enter into
        let respectiveTextArea = $(`[data-index="${i}"]`);

        // writes the stored event to the respective row's textarea
        respectiveTextArea.val(retrievedEvent);

    }
};

// function that clears all events and erases localStorage data
const clearEvents = () => {

    // ask the user to confirm that they want to erase their events
    let confirmClear = confirm("Are you sure you want to clear your schedule?");

    // if yes, then removes all stored events from localStorage
    if (confirmClear) {

        for (let i = 0; i < times.length; i++) {

            localStorage.removeItem(`scheduler-row-${i}`);

        };
    
    // if no, then function exits.
    } else {

        return;

    };

    // calls the renderSavedEvents function to repopulate the textareas of the scheduler. Since
    // all events have been erased from localStorage, this essentially clears the scheduler
    renderSavedEvents();

};

// function that colors the time-blocks depending on if each block is in the past, present
// or future
const colorBlocks = () => {

    // this gets only the hour (in AM/PM) format as a moment object and stores it as a variable
    // the exact syntax is iffy, even to me. I believe the moment().format("h A") inside the moment() 
    // function is actually a normal string (for example, "10 AM"), but passing it into the moment() 
    // function, converts it back into a moment object, which allows moment object functions to be
    // called on it or compared to it.
    let currentTime = moment(moment().format("h A"), "h A");

    // loops through the entire scheduler
    for (let i = 0; i < times.length; i++) {

        // stores each time-block hour as a moment object in a variable
        let timeBlock = moment(times[i], 'h A');
        // a variable linking to each textarea element
        let textAreaBlock = $(`[data-index="${i}"]`);

        // if the hour in the time-block is before the currentTime, then the textarea element
        // gets the past class and the future and present classes are removed 
        if (timeBlock.isBefore(currentTime)) {
            textAreaBlock.addClass("past");
            textAreaBlock.removeClass("future present");

        // if the hour in the time-block is the same as the currentTime, then the textarea 
        // element gets the present class and the past and future classes are removed 
        } else if (timeBlock.isSame(currentTime)) {
            textAreaBlock.addClass("present");
            textAreaBlock.removeClass("future past");

        // Otherwise, the timeblock must be after the currentTime, so the textarea element
        // gets the future class and the past and present classes and removed
        } else {
            textAreaBlock.addClass("future");
            textAreaBlock.removeClass("present past");
        };
    };
};

// function that is called when the page loads
const init = () => {
    
    // these functions create the scheduler, displays the date and starts the clock, and renders
    // any saved events from localStorage to the scheduler
    createSchedule();
    startClock();
    renderSavedEvents();

};

// listener for the save buttons in the scheduler
timeBlocksEl.on("click", ".saveBtn", saveEvent);
// listener for the clar button
clearBtn.click(clearEvents);

// calls init function when page loads
init();