
document.addEventListener('DOMContentLoaded', () => {
    const fadedBackground = document.querySelector("#faded-background")
    const editPostLinks = document.querySelectorAll('.edit-post-link');
    editPostLinks.forEach(link => {
        link.addEventListener('click', () => {
            fadedBackground.classList.toggle('hidden');
            const editPostForm = link.nextElementSibling
            editPostForm.classList.toggle('hidden');
            editPostForm.querySelector('.cancel-edit').addEventListener('click', () => {
                editPostForm.classList.add('hidden');
                fadedBackground.classList.add('hidden');
            });

            editPostContent = editPostForm.querySelector('.edit-post-content');
            editPostContent.focus();

            // if user clicks anywhere outside of form, hide form and fadedBG
            fadedBackground.addEventListener('click', () => {
                editPostForm.classList.add('hidden');
                fadedBackground.classList.add('hidden');
            });

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

    const deletePostButtons = document.querySelectorAll('.delete-post-btn');
    deletePostButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.parentElement.parentElement.querySelector('.post-id').textContent;
            const post = button.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            const response = await fetch(`/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });
            if (response.ok) {
                post.remove();
                fadedBackground.classList.add('hidden');
            }
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




    const profilePicture = document.getElementById('profile-picture');
    const editProfilePicCancelBtn = document.getElementById('edit-prof-pic-cancel-btn');
    const editProfilePicForm = document.getElementById('edit-profile-picture-form');

    if (profilePicture) {
        profilePicture.addEventListener('click', () => {
            editProfilePicForm.classList.remove('hidden');
            fadedBackground.classList.remove('hidden');
            fadedBackground.addEventListener('click', () => {
                editProfilePicForm.classList.add('hidden');
                fadedBackground.classList.add('hidden');
            });
        });
        editProfilePicCancelBtn.addEventListener('click', () => {
            editProfilePicForm.classList.add('hidden');
            fadedBackground.classList.add('hidden');
        });

        editProfilePicForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const userId = document.querySelector("#profile-id").textContent;
            const formData = new FormData(editProfilePicForm);
            fetch(`/edit_profile_picture/${userId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
                }
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                console.log(`result.profile_picture: ${result.profile_picture}`);
                document.querySelector('#profile-picture').src = result.profile_picture;
                editProfilePicForm.classList.add('hidden');
                fadedBackground.classList.add('hidden');    
                const deleteProfPicBtnDiv = document.querySelector('#delete-prof-pic-btn-div');
                if (deleteProfPicBtnDiv) {
                    deleteProfPicBtnDiv.classList.remove('hidden');
                }
            });
            
        });
    }


    const deleteProfilePictureButton = document.getElementById('delete-prof-pic-btn');
    if (deleteProfilePictureButton) {
        deleteProfilePictureButton.addEventListener('click', () => {
            const profileId = document.getElementById('profile-id').innerText;
            fetch(`delete_profile_picture/${profileId}`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
                }
            })
            .then(response => response.json())
            .then(result => { 
                console.log(result);
                document.querySelector('#profile-picture').src = result.profile_picture;
                console.log(`result.profile_picture: ${result.profile_picture}`);
                editProfilePicForm.classList.add('hidden');
                fadedBackground.classList.add('hidden');

                if (result.profile_picture === '/media/profile_pictures/default.jpg') {
                    document.querySelector('#delete-prof-pic-btn-div').classList.add('hidden');
                }
            })
        });
    }


    const editProfileLink = document.querySelector("#edit-profile");
    const editProfileForm = document.querySelector("#edit-profile-form");

    if (editProfileLink) {
        editProfileLink.addEventListener("click", () => {
            editProfileForm.classList.toggle("hidden");
            fadedBackground.classList.toggle("hidden");
            if (!fadedBackground.classList.contains("hidden")) {
                fadedBackground.addEventListener("click", () => {
                    editProfileForm.classList.add("hidden");
                    fadedBackground.classList.add("hidden");
                });
            }
            editProfileForm.querySelector("#edit-prof-cancel-btn").addEventListener("click", () => {
                editProfileForm.classList.add("hidden");
                fadedBackground.classList.add("hidden");
            });
        });


        editProfileForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const userId = document.querySelector("#profile-id").textContent;
            const formData = new FormData(editProfileForm);

            fetch(`/edit_profile/${userId}`, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector("input[name='csrfmiddlewaretoken']").value
                }
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                document.querySelector("#profile-name").innerHTML = `<span class="bold">Name:</span> ${result.first_name} ${result.last_name}`;
                document.querySelector("#profile-email").innerHTML = `<span class="bold">Email:</span> ${result.email}`;
                document.querySelector("#profile-username").innerHTML =`<span class="bold">Username:</span> ${result.username}`;
                document.querySelector("#profile-bio").innerHTML = `<span class="bold">Bio:</span> ${result.bio}`;
                document.querySelector("#h1-name").textContent = `${result.username}'s Profile`;
                if (result.first_name === "" && result.last_name === "") {
                    document.querySelectorAll(".card-username").forEach(name => {
                        name.textContent = `${result.username}`;
                    });
                } else {
                    document.querySelectorAll(".card-full-name").forEach(name => {
                        name.textContent = `${result.first_name}.${result.last_name}`;
                    });
                }
                document.querySelector("#profile-picture").src = result.profile_picture;
                document.querySelector("#edit-profile-form").reset();
                editProfileForm.classList.add("hidden");
                fadedBackground.classList.add("hidden");
            });
        });
    }

    const editPasswordLink = document.querySelector("#edit-password");
    const editPasswordForm = document.querySelector("#edit-password-form");

    if (editPasswordLink) {
        editPasswordLink.addEventListener("click", () => {
            editPasswordForm.classList.toggle("hidden");
            fadedBackground.classList.toggle("hidden");
            if (!fadedBackground.classList.contains("hidden")) {
                fadedBackground.addEventListener("click", () => {
                    editPasswordForm.classList.add("hidden");
                    fadedBackground.classList.add("hidden");
                });
            }
            editPasswordForm.querySelector("#edit-pass-cancel-btn").addEventListener("click", () => {
                editPasswordForm.classList.add("hidden");
                fadedBackground.classList.add("hidden");
            });
        });

        editPasswordForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const userId = document.querySelector("#profile-id").textContent;
            const formData = new FormData(editPasswordForm);
            editPasswordForm.classList.add("hidden");
            fadedBackground.classList.add("hidden");
            fetch(`/edit_password/${userId}`, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector("input[name='csrfmiddlewaretoken']").value
                }
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                document.querySelector("#edit-password-form").reset();
                if (result.message) {
                    const changePasswordMessageDiv = document.querySelector("#change-password-message-div");
                    changePasswordMessageDiv.classList.remove("hidden");
                    if (result.message === "Incorrect password." || result.message === "Passwords do not match.") {
                        changePasswordMessageDiv.classList.add("error");
                    } else {
                        changePasswordMessageDiv.classList.remove("error");
                    }
                    changePasswordMessageDiv.textContent = result.message;
                    setTimeout(() => {
                        changePasswordMessageDiv.textContent = "";
                        changePasswordMessageDiv.classList.add("hidden");
                    }, 3000);
                }
            });
        });
    }



    const expandTopPagination = document.getElementById('expand-top-pagination');
    const topPagination = document.getElementById('top-pagination');
    const collapseTopPagination = document.getElementById('collapse-top-pagination');

    if (topPagination) {
        collapseTopPagination.addEventListener('mouseover', () => {
            topPagination.style.transitionDuration = '3s';
            topPagination.style.transform = 'scale(0.25)';
        });
        collapseTopPagination.addEventListener('mouseout', () => {
            topPagination.style.transform = 'scale(1)';
        });

        expandTopPagination.addEventListener('mouseover', () => {
            expandTopPagination.style.transitionDuration = '4s';
            expandTopPagination.style.width = '64px';
        });
        expandTopPagination.addEventListener('mouseout', () => {
            expandTopPagination.style.width = '32px';
        });

        if (sessionStorage.getItem('topPagination') === 'expanded') {
            expandTopPagination.classList.add('hidden');
            topPagination.classList.remove('hidden');
            collapseTopPagination.classList.remove('hidden');
            collapseTopPagination.addEventListener('click', () => {
                sessionStorage.setItem('topPagination', 'collapsed')
                expandTopPagination.classList.remove('hidden');
                topPagination.classList.add('hidden');
                collapseTopPagination.classList.add('hidden');
            });
        } else {
            expandTopPagination.classList.remove('hidden');
            topPagination.classList.add('hidden');
            collapseTopPagination.classList.add('hidden');
        }

        expandTopPagination.addEventListener('click', () => {
            sessionStorage.setItem('topPagination', 'expanded')
            expandTopPagination.classList.add('hidden');
            topPagination.classList.remove('hidden');
            collapseTopPagination.classList.remove('hidden');
            collapseTopPagination.addEventListener('click', () => {
                sessionStorage.setItem('topPagination', 'collapsed')
                expandTopPagination.classList.remove('hidden');
                topPagination.classList.add('hidden');
                collapseTopPagination.classList.add('hidden');
            });
        });
    }

    let currentPageNumber = document.getElementById('current_page').textContent;
    let currentPageLinks = document.querySelectorAll('.page-link-' + currentPageNumber);
    currentPageLinks.forEach(link => {
        link.classList.add('active-page-link');
    });



    const handleLinks = document.querySelectorAll('.handle-link');
    handleLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.previousElementSibling.style.transition = '0.3s';
            link.previousElementSibling.style.fontSize = '0.7em';
            link.previousElementSibling.firstElementChild.transition = '0.3s';
            link.previousElementSibling.firstElementChild.firstElementChild.transition = '0.3s';
            link.previousElementSibling.firstElementChild.style.width = '20px';
            link.previousElementSibling.firstElementChild.style.height = '20px';
        })
    })
    handleLinks.forEach(link => {
        link.addEventListener('mouseout', () => {
            link.previousElementSibling.style.fontSize = '1em';
            link.previousElementSibling.firstElementChild.style.width = '30px';
            link.previousElementSibling.firstElementChild.style.height = '30px';
        })
    })


    const cardBodies = document.querySelectorAll('.card-body');
    // if user clicks on card body, open corresponding post page "post/<int:post_id>"
    cardBodies.forEach(cardBody => {
        const northwestArrow = cardBody.querySelector('.northwest-arrow');
        if (northwestArrow) {
            northwestArrow.addEventListener('click', () => {
                const postId = cardBody.querySelector('.post-id-div').textContent;
                window.location.href = `/post/${postId}`;
            });
        }
    });

    const replyLinks = document.querySelectorAll('.reply-post-link');
    const replyForm = document.querySelector('#reply-form');
    const fadedBackgroundLayout = document.querySelector('#faded-background-layout');
    replyLinks.forEach(link => {
        const replyToId = link.nextElementSibling.textContent; 
        link.addEventListener('click', () => {
            replyForm.classList.remove('hidden');
            fadedBackgroundLayout.classList.remove('hidden');
            replyForm.querySelector('#reply-to-id').textContent = replyToId;
            replyForm.querySelector('#reply-to-id').value = replyToId;
            replyForm.querySelector('#reply-content').focus();
            fadedBackgroundLayout.addEventListener('click', () => {
                replyForm.classList.add('hidden');
                fadedBackgroundLayout.classList.add('hidden');
            });
            replyForm.querySelector('.cancel-reply').addEventListener('click', () => {
                replyForm.classList.add('hidden');
                fadedBackgroundLayout.classList.add('hidden');
            });
        });
    });

    replyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const postId = replyForm.querySelector('#reply-to-id').textContent;
        const content = replyForm.querySelector('#reply-content').value;

        const csrf_token = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        replyForm.classList.add('hidden');
        fadedBackgroundLayout.classList.add('hidden');
        
        fetch(`reply_post/${postId}`, {
            method: 'POST',
            body: JSON.stringify({
                content: content
            }),
            headers: {
                'X-CSRFToken': csrf_token,
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            window.location.href = `/post/${postId}`;
        })
    });
});





