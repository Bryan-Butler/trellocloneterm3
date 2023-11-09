// declare the trelloData variable
// and object with an array of columns, each column is an object with a name and an array of cards.
// each card is an object with a title, content , a timestamp
let trelloData = {
    columns: [
        {
            name: "To-Do",
            cards: [
                {
                    title: "example card",
                    content: "drag this card around to try out the app",
                    timestamp: null
                }
            ]
        },
        {
            name: "Doing",
            cards: [
            ]
        }
    ]
}


console.log(trelloData);

function renderColumns(){
    let trelloDataRowRootNode = document.getElementById("dataDisplayRow");
    //removing any stale or old html content
    trelloDataRowRootNode.innerHTML = "";
    //generate new html content
    trelloData.columns.forEach((column)=> {
        console.log(column.name);
        
        
        //create the element to contain the column
        let columnNode = document.createElement("div");

        //set the column id in the dom
        columnNode.id = column.name;

        columnNode.classList.add("trelloColumn");
        
        //give the columns some drag and drop event handling
        columnNode.addEventListener("dragover", allowDrop);

        //allow us to detect when a card is dropped into a column
        columnNode.addEventListener("drop", dropCard)
        
        //content to render column data
        let columnHeading = document.createElement("h3");
        columnHeading.innerText = column.name;
        columnNode.appendChild(columnHeading);


        // create the cards
        column.cards.forEach ((card) =>{
            //find the card preview, copy it and save the copy to the variable
            let newCard = document.getElementById("cardPreview").cloneNode(true);

            if (!card.timestamp || isNaN(card.timestamp)){
                card.timestamp = Date.now();
            }

            newCard.id = card.timestamp;
            //Find the h3 of the card title and change its content
            newCard.querySelector("h3").innerText = card.title;
            newCard.querySelector(".cardDisplay-title").innerText = card.title;

            //Same as above for paragraph
            newCard.querySelector(".cardDisplay-content").innerText = card.content;
            
            //allow cards to be draggable
            newCard.addEventListener("dragstart", drag)
            
            //after data is all done attach card to column
            columnNode.appendChild(newCard);
        })

        //after  column is created append it to its node as a child
        trelloDataRowRootNode.appendChild(columnNode);
    })
}

// when we drag a dom element around, we tell the browser some data about what we are dragging
function drag(event){
    event.dataTransfer.setData("text", event.target.id);
}

document.getElementById("cardPreview").addEventListener("dragstart", drag)

function allowDrop(event){
    event.preventDefault();
}

function dropCard(event){
    event.preventDefault();
    console.log("Event target: " + event.target.id);

    let data = event.dataTransfer.getData("text");
    //console.log("dropped card, id: " + data);

    let oldCardElement = document.getElementById(data);
    let oldCardData = {
        title: oldCardElement.querySelector(".cardDisplay-title").innerText,
        content: oldCardElement.querySelector(".cardDisplay-content").innerText,
        timestamp: oldCardElement.id
    }

    //find the column data for the column that we just dragged 
    //push the card into its data
    trelloData.columns.forEach(column =>{


        column.cards = column.cards.filter(card => card.timestamp != oldCardData.timestamp)
        if (column.name == event.target.id){
            column.cards.push(oldCardData);
        }
    })

    //any time we modify trelloData, we should re-render columns and cards
    renderColumns();
}

let createCardForm = document.getElementById("cardForm")

createCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let title = document.getElementById("cardTitle").value
    let content = document.getElementById("cardContent").value
    let newCardTitle = document.querySelector(".cardDisplay-title")
    let newCardContent = document.querySelector(".cardDisplay-content")
    newCardTitle.innerHTML = title
    newCardContent.innerHTML = content
    console.log(title)

})

document.getElementById("cardTitle").addEventListener("click", (event) => {
    console.log(event)
})
let createColumnForm = document.getElementById("columnForm")

createColumnForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let name = document.getElementById("columnTitle").value
    let newColumn = {
        name: name,
        cards: []
    };
    trelloData.columns.push(newColumn);
    renderColumns();
})

renderColumns();
