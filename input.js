function Books(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UIBooks(){

}



UIBooks.prototype.addBookToTable = function(book){
    const tbody = document.querySelector('#book-list')
    const lis = document.createElement('tr');

    lis.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `

    tbody.appendChild(lis);

}
UIBooks.prototype.clearInputs = function(){
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
}

UIBooks.prototype.removeBook = function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
    }
}

UIBooks.prototype.addMessage = function(message, className){
    removeMessage()
    const inputContainer = document.querySelector('.input-container');
    const heading = document.querySelector('.heading');

    const msgDiv = document.createElement('div');

    msgDiv.append(document.createTextNode(message))
    msgDiv.className = `alert ${className}`;

    inputContainer.insertBefore(msgDiv, heading);

    setTimeout(function(){
        removeMessage();
    }, 3000)
    
}

function removeMessage(){
    const currentMessage = document.querySelector('.alert');
    if(currentMessage){
        currentMessage.remove();
    }
}


//Store to LocalStorage
class StoreToLS{
   static getBook(){
        let books;
        if(localStorage.getItem('Books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('Books'));
        }
        return books;
    }
    
    
    static displayBooks (){
        const books = StoreToLS.getBook();

        books.forEach(function(book){
            const uiBooks = new UIBooks;

            uiBooks.addBookToTable(book);
        })
    }
   static addBookToUI(book){
    const books = StoreToLS.getBook();

    books.push(book);
    localStorage.setItem('Books', JSON.stringify(books))
        
    }
    static removeFromLS(isbn){
        const books = StoreToLS.getBook();
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        });
        localStorage.setItem('Books', JSON.stringify(books))
    }
}

//Event to get Book
document.addEventListener('DOMContentLoaded', StoreToLS.displayBooks)

//Evet to add books
document.querySelector('.book-form').addEventListener('submit', function(e){
    const title = document.querySelector('#title').value,
            author = document.querySelector('#author').value,
            isbn = document.querySelector('#isbn').value;

    const book = new Books(title, author, isbn);

    const uiBooks = new UIBooks();

   
    if(title === '' || author === '' || isbn === ''){
         
        uiBooks.addMessage(`Please fill in the fields!`, 'error');
         e.preventDefault();

    }else{
        // console.log(book)
        uiBooks.validateInput();
        
        uiBooks.addBookToTable(book);

        uiBooks.clearInputs();

        StoreToLS.addBookToUI(book);
        
        uiBooks.addMessage(`Congratulations "${book.title}" has been added!`, 'success');
        e.preventDefault();

        
        
    }
    

})


//To remove books

document.querySelector('.table').addEventListener('click', function(e){
    const uiBooks = new UIBooks();

    uiBooks.removeBook(e.target);

    // StoreToLS.removeBookFromLs(e.target.parentElement.)
   StoreToLS.removeFromLS(e.target.parentElement.previousElementSibling.textContent);

    uiBooks.addMessage(`You've removed book from list`, 'success')
})


document.querySelector('#isbn').addEventListener('blur', function(){
    const isbnVal = document.getElementById('isbn');
    const re = /^[0-9]{4}#$/
    if(!re.test(isbnVal.value)){
        isbnVal.classList.add('is-invalid');
        document.querySelector('label[for="isbn"]').classList.add('is-invalid')
        
        
        const isbnInput = document.querySelector('.isbn-input');
        const divErr = document.createElement('div');
        
        divErr.append(document.createTextNode('fill in a correct ISBN(e.g 4334#)'))
        divErr.className = 'error-message';
        
        isbnInput.appendChild(divErr);
    }else{
        document.querySelector('.error-message').remove();
        isbnVal.classList.remove('is-invalid');
        document.querySelector('label[for="isbn"]').classList.remove('is-invalid')
    }
})
UIBooks.prototype.validateInput = function(){
    const inputs = document.querySelectorAll('input[type="text"]');

        inputs.forEach(input =>{
                if(input.classList.contains('is-invalid')){
                    e.preventDefault(); 
                    return;
                }
        })
}