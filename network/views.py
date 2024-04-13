import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post


PAGINATOR_RANGE = 10


# Views - Authentication
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("landing"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("all_posts"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("landing"))
    else:
        return render(request, "network/register.html")




# Views - Login Not Required
def landing(request):
    return render(request, "network/landing.html")


def index(request):
    post_list = Post.objects.all().filter(reply_to=None)
    p = Paginator(post_list, PAGINATOR_RANGE)
    page_number = request.GET.get('page')
    posts = p.get_page(page_number)
    return render(request, "network/index.html", {
        "posts": posts,
    })


def profile(request, user_id):
    profile_user = User.objects.get(pk=user_id)
    if request.method == "PUT":
        user = request.user
        if user in profile_user.followers.all():
            profile_user.followers.remove(user)
        else:
            profile_user.followers.add(user)
        profile_user.save()
        return JsonResponse({
            'followers': profile_user.followers.count(),
            'followed': user in profile_user.followers.all()
            })
    
    p = Paginator(Post.objects.filter(user=profile_user), PAGINATOR_RANGE)
    page_number = request.GET.get('page')
    posts = p.get_page(page_number)
    return render(request, "network/profile.html", {
        "profile_user": profile_user,
        "user_posts": posts,
        "page_number": page_number
    })


def follower_list(request, user_id):
    user = User.objects.get(pk=user_id)
    followers = user.followers.all()
    return render(request, "network/follower_list.html", {
        "followers": followers,
        "user": user,
        "current_user": request.user,
    })


def following_list(request, user_id):
    user = User.objects.get(pk=user_id)
    following = user.following.all()
    return render(request, "network/following_list.html", {
        "following": following,
        "user": user,
        "current_user": request.user,
    })


def post(request, post_id):
    post = Post.objects.get(pk=post_id)

    # If the post is a reply, get the original post
    if post.reply_to:
        post = Post.objects.get(pk=post.reply_to.id)

    if request.method == "DELETE":
        post.delete()
        return JsonResponse({"message": "Post deleted."})
    
    post_replies = Post.objects.filter(reply_to=post)
    post_reply_count = post_replies.count()

    return render(request, "network/post.html", {
        "og_post": post,
        "post_replies": post_replies,
        "post_reply_count": post_reply_count
    })




# Views & Actions - Login Required
@login_required
def following(request):
    followed_posts = Post.objects.filter(user__in=request.user.following.all())
    p = Paginator(followed_posts, PAGINATOR_RANGE)
    page_number = request.GET.get('page')
    followed_posts = p.get_page(page_number)
    return render(request, "network/following.html", {
        "followed_posts": followed_posts,
        "page_number": page_number
    })


@login_required
def create_post(request):
    if request.method == "POST":
        content = request.POST["post-content"]
        user = request.user
        post = Post(user=user, content=content)
        post.save()

        return HttpResponseRedirect(reverse("all_posts"))
    

@login_required
def edit_profile(request, user_id):
    user = User.objects.get(pk=user_id)
    if request.method == "POST":
        user.first_name = request.POST.get("edit-first-name", "")
        user.last_name = request.POST.get("edit-last-name", "")
        user.email = request.POST.get("edit-email", "")
        user.username = request.POST.get("edit-username", "")
        user.save()

        return JsonResponse({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'username': user.username
        })
        

@login_required
def edit_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.method == "PUT":
        data = json.loads(request.body)
        post.content = data["content"]
        post.save()
        return JsonResponse({'content': post.content})
  

@login_required
def like_post(request, post_id):
    post = Post.objects.get(pk=post_id)
    user = request.user
    if user in post.likes.all():
        post.likes.remove(user)
    else:
        post.likes.add(user)
    post.save()
    return JsonResponse({
        'likes': post.likes.count(),
        'liked': user in post.likes.all()
        })


@login_required
def reply_post(request, post_id):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data["content"]
        user = request.user
        reply_to = Post.objects.get(pk=post_id)
        post = Post(user=user, content=content, reply_to=reply_to)
        post.save()

        return JsonResponse({
            'user': user.username,
            'content': post.content,
            'timestamp': post.timestamp,
            'post_id': post.id
        })