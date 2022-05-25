const timeBlocksEl = $(".time-block");
const currentDateEl = $("#currentDay");

const times = [
    "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm",
    "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm"
];

const displayTime = () => {
    let currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    currentDateEl.text(currentDate);
    currentDateEl.text(`Current date: ${currentDate}`);
}
setInterval(displayTime, 1000);


const createSchedule = () => {
    timeBlocksEl.empty();

    for (let i = 0; i < times.length; i++) {
        let hour = times[i];

        let row = $('<div class="row time-block">');
        timeBlocksEl.append(row);

        let time = $('<div class="hour">');
        time.text(hour);
        row.append(time);

        let eventInput = $(`<textarea class="userInput" id="${i}" 
        placeholder="Click here to enter an event">`);
        row.append(eventInput);

        let saveBtn = $(`<button class="saveBtn" data-index="${i}">Save</button>`);
        row.append(saveBtn);
    }
}

createSchedule();


