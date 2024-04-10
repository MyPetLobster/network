from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post


def index(request):
    post_list = Post.objects.all()
    p = Paginator(post_list, 1)
    page_number = request.GET.get('page')
    posts = p.get_page(page_number)
    return render(request, "network/index.html", {
        "posts": posts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


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
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required
def create_post(request):
    if request.method == "POST":
        content = request.POST["post-content"]
        user = request.user
        post = Post(user=user, content=content)
        post.save()

        return HttpResponseRedirect(reverse("index"))
    

@login_required 
def profile(request, user_id):
    profile_user = User.objects.get(id=user_id)
    return render(request, "network/profile.html", {
        "profile_user": profile_user,
        "user_posts": Post.objects.filter(user=profile_user)
    })


@login_required
def following(request):
    followed_posts = Post.objects.filter(user__in=request.user.following.all())
    return render(request, "network/following.html", {
        "followed_posts": followed_posts
    })