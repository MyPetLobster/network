# CS50W - Project 4 - Network 

### Echo - A Social Media Site Inspired by Twitter
#### By Cory Suzuki - April 2024

#### Quick Links
- Project Repo: https://github.com/MyPetLobster/network
- Demo Video: https://youtu.be/
- Course Website: https://cs50.harvard.edu/web/2020/projects/4/network/


## Video Demo, Screenshots, and Gifs

**Submission Youtube Video**

<a href=""><img src="" height="150px"></a>


**Site Screenshots**

<img src="media/demo_media/screenshots/echo-screenshot-01.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-02.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-03.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-04.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-05.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-06.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-07.png" height="300px">
<img src="media/demo_media/screenshots/echo-screenshot-08.png" height="300px">

**Site Gifs**
 
<img src="" height="300px">
<img src="" height="300px">
<img src="" height="300px">
<img src="" height="300px">


## Other Project Media
### Decided to design a logo for my site, Echo. Here are a few iterations and the final design.
#### Prototype/Planning - started with an 'E' and did some rearranging 

<img src="media/demo_media/echo-logo-1.png" height="200px">
<img src="media/demo_media/echo-logo-2.png" height="200px"> 

#### Final Logo Evolution
<img src="media/demo_media/echo-logo-3.png" height="200px">
<img src="media/demo_media/echo-logo-4.png" height="200px">
<img src="media/demo_media/echo-logo-5.png" height="200px">
<img src="media/demo_media/echo-logo-final.png" height="200px"> 


#### Default profile picture I "designed" this, aka realized default profile pics are often just two circles.
<img src="media/demo_media/default-prof-pic.png" height="300px">

### Demo Database - User Profile Pictures
#### I used DeepAi.org to generate some user profile pictures, here are the prompts and images:
##### "A politician who was just informed he accidentally tweeted what was supposed to be a private google search." 

<img src="media/profile_pictures/senhumphries.jpg" height="150px"> 


##### "Profile picture for a conspiracy theorist's twitter account"

<img src="media/profile_pictures/illuminatiinsider.jpg" height="150px">  


##### "Profile picture of a snarky man who runs a parody twitter account called 'RealFakeFacts'"

<img src="media/profile_pictures/realfakefacts.jpg" height="150px"> 

##### "Picture of a blonde woman used by scammers running a fake Taylor Swift twitter account"

<img src="media/profile_pictures/therealtaylorswift2.jpg" height="150px">


##### I made this one in Gimp. It's the logo for a news company called "The Source News". In this fictional world, they were sued by Coke AND Pepsi and won both lawsuits. 

<img src="media/profile_pictures/the-source-news-2.jpg" height="150px"> 



## Project Specifications

### 1. New Post
- 

### 2. All Posts
- 

### 3. Profile Page
- 

### 4. Following
- 

### 5. Pagination
- 

### 6. Edit Post
- 

### 7. "Like" and "Unlike" 
- 


## Additional Features

1. ** **




## Usage

### Optional -- Included Test Database
- A test database is included with sample data for testing and demonstration purposes.


### Installation and startup
1. Install Django.
2. Clone the project repository.
3. Set up the database and run migrations. (Optional: use the included test database)
4. Run the Django development server.


```bash

```

## Things I Learned and Challenges

### 1. HTML dataset property: 
- In my project I needed a way to get assign user_id to follow/unfollow buttons. I learned about the dataset property in HTML which allows you to store custom data attributes in HTML elements. I used the dataset property to store the user_id in the follow/unfollow buttons so that I could access those values in my JavaScript functions.
##### HTML -
```     
{% if profile_user in user.following.all %} 
    <button id="unfollow-button" class="follow-button btn btn-primary" data-profile-id="{{ profile_user.id }}">Unfollow</button>
    ...
```
##### JavaScript -
```
button.addEventListener("click", () => {
    const profileId = button.dataset.profileId;
    fetch(`/profile/${profileId}`, {
        ...
```

### 2. Django Paginator:
- In my last project I implemented pagination using only JavaScript. This time, I learned about Django's built-in Paginator class, which much like many other Django features, was incredibly simple to implement. I was able to paginate my posts with just a few lines of code. Then I spent the time I saved trying to make cool animations for the paginator controls. 


### 3. Django Settings Deep Dive:
- Once I had finished the project requirements, I wanted to challenge myself and add at least one extra feature that I've never implemented before. I decided to add a feature that would allow users to upload a profile picture. This was a great learning experience because it required me to dive deep into Django settings and learn about how to configure the media files settings. I also learned about the ImageField model field type and how to use the Pillow library to resize images. In the end, I ended up not even needing to use Pillow, but it was a great way to force myself to really understand how Django settings work.


## Closing Thoughts 
- I spent a lot of time on project 2, Commerce, and honestly feeling a little bit of self-doubt seeing how long it took me to finish that project. But since then I've been able to complete projects 3 and 4 in a much shorter amount of time. For both projects, I think I could have technically submitted them after only a few hours of work. But that doesn't include time spent styling and adding dynamic features. I think I've gotten better at estimating how long it will take me to complete a project and I'm getting better at managing my time. I'm very excited to move onto the capstone project. Since I started my coding journey, I've had an idea for an application. Until recently, it felt like an impossible task to build it. But now I feel like mayyyybbee 
I can pull it off. I'm gonna try at least. 