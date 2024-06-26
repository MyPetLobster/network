
from django.conf import settings
from django.urls import path
from django.conf.urls.static import static

from . import views


urlpatterns = [
    path("", views.landing, name="landing"),
    path("all_posts", views.index, name="all_posts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("reply_post/<int:post_id>", views.reply_post, name="reply_post"),
    path("post/reply_post/<int:post_id>", views.reply_post, name="reply_post"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit_post"),
    path("profile/edit_post/<int:post_id>", views.edit_post, name="edit_post"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("edit_profile/<int:user_id>", views.edit_profile, name="edit_profile"),
    path("edit_profile_picture/<int:user_id>", views.edit_profile_picture, name="edit_profile_picture"),
    path("profile/delete_profile_picture/<int:user_id>", views.delete_profile_picture, name="delete_profile_picture"),
    path("edit_password/<int:user_id>", views.edit_password, name="edit_password"),
    path("following", views.following, name="following"),
    path("like_post/<int:post_id>", views.like_post, name="like_post"),
    path("post/like_post/<int:post_id>", views.like_post, name="like_post"),
    path("profile/like_post/<int:post_id>", views.like_post, name="like_post"),
    path("following/like_post/<int:post_id>", views.like_post, name="like_post"),
    path("follower_list/<int:user_id>", views.follower_list, name="follower_list"),
    path("following_list/<int:user_id>", views.following_list, name="following_list"),
    path("post/<int:post_id>", views.post, name="post"),
]

if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)