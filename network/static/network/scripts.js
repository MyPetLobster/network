const editPostLinks = document.querySelectorAll('.edit-post-link');
editPostLinks.forEach(link => {
    link.addEventListener('click', () => {
        const editPostForm = link.parentElement.parentElement.previousElementSibling;
        editPostForm.classList.toggle('hidden');
        editPostForm.querySelector('.cancel-edit').addEventListener('click', () => {
            editPostForm.classList.add('hidden');
        });

        editPostContent = editPostForm.querySelector('.edit-post-content');
        editPostContent.focus();
        editPostForm.onsubmit = (event) => {
            event.preventDefault(); 
            // Retrieve the CSRF token from Django hidden input field
            const csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            const formData = new FormData();
            formData.append('content', editPostContent.value);
            console.log('Submitting edit post form...');
            fetch(`edit_post/${editPostForm.querySelector('.post-id').textContent}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: editPostContent.value
                }),
                headers: {
                    'X-CSRFToken': csrf_token,
                }
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                const postId = editPostForm.querySelector('.post-id').textContent;
                const postContentElement = document.querySelector(`#post-content-${postId}`);
                postContentElement.textContent = result.content;
                editPostForm.classList.add('hidden');
            });
        };
    });
});