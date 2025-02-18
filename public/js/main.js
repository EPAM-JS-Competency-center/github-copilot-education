document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('user-list');
    const addUserButton = document.getElementById('add-user');
    const removeUserButtons = document.querySelectorAll('.remove-user');
    
    addUserButton.addEventListener('click', function() {
        // Logic to add a new user
        const newUserName = prompt('Enter new user name:');
        if (newUserName) {
            const newUserItem = document.createElement('li');
            newUserItem.textContent = newUserName;
            newUserItem.innerHTML += ' <button class="remove-user">Remove</button>';
            userList.appendChild(newUserItem);
            attachRemoveUserEvent(newUserItem.querySelector('.remove-user'));
        }
    });

    removeUserButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userItem = button.parentElement;
            userList.removeChild(userItem);
        });
    });

    function attachRemoveUserEvent(button) {
        button.addEventListener('click', function() {
            const userItem = button.parentElement;
            userList.removeChild(userItem);
        });
    }
});