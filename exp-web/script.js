// The following event listener waits for the HTML to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // The following function 'create card' defines what I will display on the cards from the CSV, and says "these are cards are not inputted by the user"
    function createCard(lesson, Title, Snippet, isUserCard = false, id = null) {
        const card = document.createElement('div');
        card.className = 'card';
        if (id) card.dataset.id = id; // Save ID to element for deletion
    // Select what to display on the front and back of cards; adds delete button if user creates card
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front">${lesson}</div>
            <div class="card-back">
              <h4>${Title}</h4>
              <p>${Snippet}</p>
              ${isUserCard ? '<button class="delete-btn">Delete</button>' : ''}
            </div>
          </div>
        `;
    // Add delete handler if it's a user-created card, add event listener to remove the card from parent IF user clicks delete button
  if (isUserCard) {
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      const parentRow = card.parentElement;
      parentRow.removeChild(card);

    // If the row is now empty, remove the row
      if (parentRow.children.length === 0) {
        parentRow.remove();

    // Remove from local storage
    const idToRemove = card.dataset.id;
    let savedCards = JSON.parse(localStorage.getItem('userCards')) || [];
    savedCards = savedCards.filter(c => c.id !== idToRemove);
    localStorage.setItem('userCards', JSON.stringify(savedCards));

      }
    });
  }  
    
        return card;
      }


    // Define function 'createInputCard' to create a new card with a form, making all fields required
      function createInputCard() {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front">Add your lesson</div>
            <div class="card-back">
              <form class="inline-form">
                <input type="text" name="lesson" placeholder="Lesson" required />
                <input type="text" name="title" placeholder="Title" required />
                <textarea name="snippet" placeholder="Your breakup story" required></textarea>
                <button type="submit">Add</button>
              </form>
            </div>
          </div>
        `;
      
        // Find the form in the card, add event listener to call function, 'preventDefault,' stops any page refreshing from happening, gets what the user wrote for each field, and creates a new card with that info
        const form = card.querySelector('form');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const lesson = form.lesson.value;
          const title = form.title.value;
          const snippet = form.snippet.value;

          // Generate unique ID
        const id = Date.now().toString();

        // Save to localStorage
        const newCardData = { id, lesson, title, snippet };
        const savedCards = JSON.parse(localStorage.getItem('userCards')) || [];
        savedCards.push(newCardData);
        localStorage.setItem('userCards', JSON.stringify(savedCards));

        const newCard = createCard(lesson, title, snippet, true, id);
      
        
          // Get the container where the rest of the cards are - the ones from Reddit
          const container = document.getElementById('cards-container');
      
          // Remove the new form card from its row
          const parentRow = card.parentElement;
          parentRow.removeChild(card);
      
        // If the row has space AKA less than 2 cards, add the new user card to it
        if (parentRow.children.length < 2) {
            parentRow.appendChild(newCard);
        } else {
            const newRow = document.createElement('div');
            newRow.className = 'card-row';
            newRow.appendChild(newCard);
            container.appendChild(newRow);
        }
  
      
        // Always append a new row with two blank input cards
        const newRowForInput = document.createElement('div');
        newRowForInput.className = 'card-row';
        newRowForInput.appendChild(createInputCard());
        newRowForInput.appendChild(createInputCard());
        container.appendChild(newRowForInput);

        });
      
        return card;
      }
      
      // This is the CSV portion where Papa Parse loads the CSV and parses the headers, keeps only the first 19 rows b/c there were 19 posts
      function loadCSVAndRenderCards() {
        Papa.parse('posts.csv', {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            const cardsData = results.data.slice(0, 19); // First 19 cards
            const container = document.getElementById('cards-container');
            // Clear the current card container for the incoming data
            container.innerHTML = '';
            // Loop through the data to put it in rows of 2
            for (let i = 0; i < cardsData.length; i += 2) {
              const row = document.createElement('div');
              row.className = 'card-row';
      
              // For the final row, if there's only one card left, also add the input card
              if (i + 1 === cardsData.length) {
                // Add 19th card
                const cardData = cardsData[i];
                const card = createCard(cardData.Lesson, cardData.Title, cardData.Snippet);
                row.appendChild(card);
      
                // Add 20th input card
                const inputCard = createInputCard();
                row.appendChild(inputCard);
      
              } else {
                // Normal pair of cards
                for (let j = i; j < i + 2 && j < cardsData.length; j++) {
                  const { Title, Snippet, Lesson } = cardsData[j];
                  const card = createCard(Lesson, Title, Snippet);
                  row.appendChild(card);
                }
              }
              container.appendChild(row);
            }
            const savedUserCards = JSON.parse(localStorage.getItem('userCards')) || [];
      for (let i = 0; i < savedUserCards.length; i += 2) {
        const row = document.createElement('div');
        row.className = 'card-row';

        const card1 = savedUserCards[i];
        row.appendChild(createCard(card1.lesson, card1.title, card1.snippet, true, card1.id));

        if (savedUserCards[i + 1]) {
          const card2 = savedUserCards[i + 1];
          row.appendChild(createCard(card2.lesson, card2.title, card2.snippet, true, card2.id));
        }

        container.appendChild(row);
            }
          }
        });
      }
      
      // Call the function when the page loads to initialize cards from CSV
      loadCSVAndRenderCards();    
      
}); 

