
from django.urls import path

from . import views

urlpatterns = [
    path("all_posts", views.index, name="all_posts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("", views.landing, name="landing"),
    path("create_post", views.create_post, name="create_post"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("edit_profile/<int:user_id>", views.edit_profile, name="edit_profile"),
    path("following", views.following, name="following"),
    path("edit_post/<int:post_id>", views.edit_post, name="edit_post"),
    path("profile/edit_post/<int:post_id>", views.edit_post, name="edit_post"),
    path("like_post/<int:post_id>", views.like_post, name="like_post"),
    path("profile/like_post/<int:post_id>", views.like_post, name="like_post"),
    path("following/like_post/<int:post_id>", views.like_post, name="like_post"),
    path("follower_list/<int:user_id>", views.follower_list, name="follower_list"),
    path("following_list/<int:user_id>", views.following_list, name="following_list"),
]
