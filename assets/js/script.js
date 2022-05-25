const timeBlocksEl = $(".time-block");
const currentDateEl = $("#current-day");
const scheduleEl = $(".container");

const clearBtn = $('#clear-btn');

const times = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
    "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM"
];

const displayDateTime = () => {

    let currentDate = moment().format("MMMM Do, YYYY");
    let currentTime = moment().format("h:mm:ss A")

    currentDateEl.html(`Date: ${currentDate} <br><br> Time: ${currentTime}`);
};

const startClock = () => {

    setInterval(displayDateTime, 1000);

};

const createSchedule = () => {

    timeBlocksEl.empty();

    for (let i = 0; i < times.length; i++) {

        let hour = times[i];

        let row = $('<div class="row time-block">');
        timeBlocksEl.append(row);
        
        let time = $('<div class="hour col py-3">');
        time.text(hour);
        row.append(time);

        let eventInput = $(`<textarea class="userInput col-9" data-index="${i}" 
        placeholder="Click here to enter an event">`);
        row.append(eventInput);

        let saveBtn = $(`<button class="saveBtn col mr-4" data-button="${i}">Save</button>`);
        row.append(saveBtn);
    };
};

const saveEvent = (event) => {

    const btnClicked = $(event.target);

    const index = btnClicked.data("button");
    const textArea = btnClicked.siblings("textarea");
    const userEvent = textArea.val();

    if (userEvent === "") {
        return;
    }

    localStorage.setItem(`scheduler-row-${index}`, userEvent);
    
};

const renderSavedEvents = () => {

    for (let i = 0; i < times.length; i++) {

        let retrievedEvent = localStorage.getItem(`scheduler-row-${i}`);
        let respectiveTextArea = $(`[data-index="${i}"]`);

        respectiveTextArea.val(retrievedEvent);

    }
};

const clearEvents = () => {

    let confirmClear = confirm("Are you sure you want to clear your schedule?");

    if (confirmClear) {

        for (let i = 0; i < times.length; i++) {

            localStorage.removeItem(`scheduler-row-${i}`);

        };

    } else {

        return;

    };

    renderSavedEvents();

};

const colorBlocks = () => {

}

const init = () => {
    
    startClock();
    createSchedule();
    renderSavedEvents();

};




timeBlocksEl.on("click", ".saveBtn", saveEvent);
clearBtn.click(clearEvents);

init();