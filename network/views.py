import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post

PAGINATOR_RANGE = 5

def landing(request):
    return render(request, "network/landing.html")

def index(request):
    post_list = Post.objects.all()
    p = Paginator(post_list, PAGINATOR_RANGE)
    page_number = request.GET.get('page')
    posts = p.get_page(page_number)
    return render(request, "network/index.html", {
        "posts": posts,
        "page_number": page_number
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


