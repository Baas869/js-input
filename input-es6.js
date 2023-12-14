class Books{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
class UIStore{
    static addBookToTable(book){
        //create tr 
        // create 4 td with the lastone having a.tag with delete class
        //get tbody & inset tr to the tbody
        

        const lis = document.createElement('tr');
        lis.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `
        const tableBody = document.querySelector('#book-list');

        tableBody.appendChild(lis);

    }

    static message(msg, className){
        removeMessage();
        //Select where to input the message (between the fomr & heading)
        //create div for the message 
        //give it a class name of `alert ${className}`
        //append createtextNode into the message 
        //insert the message div into the form
        //set timeout and remove alert
        const inputContainer = document.querySelector('.input-container');
        const heading = document.querySelector('.heading');

        const msgDiv = document.createElement('div');
        msgDiv.className = `alert ${className}`;
        msgDiv.append(document.createTextNode(msg));

        inputContainer.insertBefore(msgDiv, heading);

        setTimeout(function(){
            removeMessage().remove();
        },3000)

    }

    static clearFields(){
        const title = document.getElementById('title').value = '',
                author = document.getElementById('author').value = '',
                isbn = document.getElementById('isbn').value = '';
    }

    static removeBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove()
        }
    }
    static validateInput(){
        const inputs = document.querySelectorAll('input[type="text"]');

        inputs.forEach(input =>{
                if(input.classList.contains('is-invalid')){
                    e.preventDefault(); 
                    return;
                }
        })
    }
}


class LSStore{
    static getBook(book){
        let books;
        if(localStorage.getItem('Books') === null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('Books'));
        }

        return books;
    }

    static saveBooksToLS(book){
        const books = LSStore.getBook();
        books.push(book);
        localStorage.setItem('Books', JSON.stringify(books))

    }

    static saveBookToTable(){
        const books = LSStore.getBook();
        books.forEach(function(book){
            UIStore.addBookToTable(book);
        })
    }

    static removeBookFromLs(isbn){
        const books = LSStore.getBook();
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1)
            }
        })
        localStorage.setItem('Books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', LSStore.saveBookToTable)

document.querySelector('.book-form').addEventListener('submit', function(e){
        const title = document.getElementById('title').value,
                author = document.getElementById('author').value,
                isbn = document.getElementById('isbn').value;

        const book = new Books (title, author, isbn);
        if(title === '' || author === '' || isbn === ''){
             UIStore.message(`Please fill in the fields!`, 'error')
        }else{
            UIStore.validateInput();
            UIStore.addBookToTable(book);

            UIStore.message(`Congratulations "${book.title}" has been added!`, 'success');
            UIStore.clearFields();
            LSStore.getBook(book);
            LSStore.saveBooksToLS(book);
            

            e.preventDefault();
        }
        
        
})

document.querySelector('#book-list').addEventListener('click', function(e){
    UIStore.removeBook(e.target)
    UIStore.message(`You've removed book from list`, 'success');
    LSStore.removeBookFromLs(e.target.parentElement.previousElementSibling.textContent)

    // console.log(e.target.parentElement.previousElementSibling);
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

function removeMessage(){
    const currentMessage = document.querySelector('.alert');
    if(currentMessage){
        currentMessage.remove();
    }
}