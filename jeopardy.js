// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const BASE_URL = 'https://rithm-jeopardy.herokuapp.com/api';

let categories = [];
let randomCategories = [];
let categoryDetails = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let categoryIds = await axios.get(`${BASE_URL}/categories?count=100`);
    return categoryIds.data;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    let categoryData = await axios.get(`${BASE_URL}/category?id=${catId}`);
    return categoryData;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    categoryDetails = [];
   
    $('div').append('<table style = "display : none"></table>');
    $('table').append(`<thead></thead>`);
    $('table').append(`<tbody></tbody>`);
    $('thead').append(`<tr id='head-tr'></tr>`);
    // $('tbody').append(`<tr id='body-tr'></tr>`);

    for (let randomCategory of randomCategories){
        let categoryData = await getCategory(randomCategory[0].id);
        categoryDetails.push(categoryData);
    }   
    for (x=1; x<6; x++){
        $(`tbody`).append(`<tr id=q${x}></tr>`);
    }
    for (i=0;i<6;i++){
        $(`#head-tr`).append(`<th>${categoryDetails[i].data.title}</th>`);
        for (j=0; j<5; j++){
            $(`#q${j+1}`).append(`<td class = 'c${i} q${j}' data-showing=''>X</td>`);
        }
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    console.log ('click');
    if (evt.target.dataset.showing === ''){
        evt.target.innerText = categoryDetails[evt.target.classList[0][1]].data.clues[evt.target.classList[1][1]].question;
        evt.target.dataset.showing = 'question';
    } else if (evt.target.dataset.showing === 'question'){
        evt.target.innerText = categoryDetails[evt.target.classList[0][1]].data.clues[evt.target.classList[1][1]].answer;
        evt.target.dataset.showing = 'answer';
    } 
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    $('table').hide();
    $('img').show();
    $('div').empty();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    $('table').show();   
    $('img').hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    randomCategories = [];
    categories = await getCategoryIds();

    for (i=0; i<6; i++){
        let ndx = Math.floor(Math.random()*(14-i));
        let randomCategory = categories.splice(ndx,1);
        randomCategories.push(randomCategory);
    }

    fillTable();    
    setTimeout(hideLoadingView, 1000);
}

/** On click of start / restart button, set up game. */

$('button').click(setupAndStart);

/** On page load, add event handler for clicking clues */

$('div').on('click', handleClick);




