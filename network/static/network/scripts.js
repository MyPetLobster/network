
document.addEventListener('DOMContentLoaded', () => {
    const editPostLinks = document.querySelectorAll('.edit-post-link');
    editPostLinks.forEach(link => {
        link.addEventListener('click', () => {
            const fadedBackground = document.querySelector("#faded-background")
            fadedBackground.classList.toggle('hidden');
            const editPostForm = link.nextElementSibling;
            editPostForm.classList.toggle('hidden');
            editPostForm.querySelector('.cancel-edit').addEventListener('click', () => {
                editPostForm.classList.add('hidden');
                fadedBackground.classList.toggle('hidden');
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
                    fadedBackground.classList.toggle('hidden');
                });
            };
        });
    });


    heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const postId = icon.id.split('-')[2];
            const csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
            fetch(`like_post/${postId}`, {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrf_token,
                }
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                const likesDiv = icon.parentElement;
                const likesCount = likesDiv.querySelector('.card-text');
                likesCount.textContent = `${result.likes}`;
                const textSpan = document.createElement('span');
                textSpan.textContent = result.likes === 1 ? ' person/bot liked this post' : ' people/bots liked this post';
                likesCount.appendChild(textSpan);
                if (result.liked) {
                    console.log('liked');
                    const emptyHeart = document.querySelector(`#empty-heart-path-${postId}`)
                    const redHeart = document.querySelector(`#red-heart-path-${postId}`)
                    if (emptyHeart) {
                        emptyHeart.style.fill = '#F94056';
                    } else {
                        redHeart.style.fill = '#F94056';
                    }
                } else {
                    console.log('unliked');
                    const redHeart = document.querySelector(`#red-heart-path-${postId}`)
                    const emptyHeart = document.querySelector(`#empty-heart-path-${postId}`)
                    if (redHeart) {
                        redHeart.style.fill = '#ffffff';
                    } else {
                        emptyHeart.style.fill = '#ffffff';
                    }
                    
                }
            });
        });
    });
    



    const followButtons = document.querySelectorAll(".follow-button");

    followButtons.forEach(button => {
        button.addEventListener("click", () => {
            const profileId = button.dataset.profileId;
            fetch(`/profile/${profileId}`, {
                method: "PUT",
                headers: {
                    "X-CSRFToken": document.querySelector("input[name='csrfmiddlewaretoken']").value
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.followed) {
                    button.classList.add("hidden");
                    document.querySelector("#unfollow-button").classList.remove("hidden");
                    document.querySelector("#followers-count").textContent = result.followers;
                } else {
                    button.classList.add("hidden");
                    document.querySelector("#follow-button").classList.remove("hidden");
                    document.querySelector("#followers-count").textContent = result.followers;
                }
            });
        });
    });

});