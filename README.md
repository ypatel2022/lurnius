# Lurnius: About the Project
The best learning resources ranked for you, Reddit-style. 🧠
<br>

## Inspiration 🌈
Have you ever found yourself scrolling through YouTube looking for the best coding tutorial? Let's face it - there are millions of tutorials out there, some published 7 years ago and some published as early as yesterday. How do you know which tutorials are worth your time and which ones are better left unseen? And not only YouTube videos, but what about the millions of books, blogs, podcasts, Medium articles, and other resources available on the web? As university students, struggling to find the best learning resources is a challenge many of us face, and relying on the internet is not always the best guide (due to misinformation, outdated links, etc.). So we figured: Why not have a way for communities of students (like you and me) to collectively agree on the best learning resource and make these findings public and universally available?

## What It Does ⚙️
Lurnius solves this educational/productivity problem by using AI LLMs to curate the best learning materials (books, podcasts, videos, textbooks, etc) for you on a web-based interface and getting the worldwide community of students to vote on them, thereby ranking these materials from best to worst.

## How We Built It 🪛
We used the Cohere API to scrape articles/resources from the web and, by using Cohere's LLM, to automatically recommend related resources. In addition, we used the Cohere API to classify resources by subject area (for example, classifying math resources apart from science resources). We used PlanetScale as a relational mySQL database to store data related to these resources, such as field of study, number of upvotes, and thumbnail (if a YouTube video is included). We used the Google YouTube and Books APIs to extract videos and books as part of our learning media. For the frontend, we stuck with a tried-and-true stack, which consisted of NextJS/React/TypeScript (and Figma for design/prototyping). Backend technologies included Node/Express, TypeScript (for setting up the database), and Python (for communicating with the Cohere API).

## Challenges We Ran Into 🧱
The biggest challenge we ran into is that most of the websites we took data from (such as Medium) do not have public APIs for extracting posts, so we had to work around this by using the Google Search API. Thankfully, we were lucky enough to stumble across a platform called Open Educational Resources (OER), which has a publicly available API from which we were able to extract textbooks.

## Accomplishments That We're Proud Of 🏆
From a technical standpoint, we're most proud of being able to implement Cohere's LLM to assist in the recommendation and classifying of learning materials. This was our first time using Cohere's LLM, and it was challenging to figure out given our lack of experience with AI. Nonetheless, we were able to successfully use the Cohere LLM to achieve our end goal of learning resource classification. From a non-technical standpoint, we're proud of our teamwork and, specifically, our division of labour. In particular, we had 2 individuals working on the backend (Yax, Sharvin) and 2 working on the frontend design (Peter, Shiv). This division of responsibilities made the entire workflow smoother and hassle-free.

## What We Learned 📚
Besides the Cohere API, this was our first time using PlanetScale as a database. Therefore, we applied a lot of new unfamiliar technologies in building Lurnius, providing a tremendous technical learning experience. We also learned the importance of double-checking our code, since we spent a lot of time debugging simple (seemingly stupid) errors such as forgetting to include ENV (environment) variables.

## What's Next for Lurnius ⚡
From a technical perspective, we plan to introduce more personalized features, such as personalizing and recommending topic areas based on a user's recent searches. In order to do this effectively, we plan to introduce user accounts and profiles, which can be customized by including a user's favourite subject areas, books, YouTube videos, etc. Establishing user profiles will then make it possible to create comments and even allow users to upload their own learning resources in addition to the ones automatically curated by Lurnius. On the non-technical side, we are considering introducing a paid subscription model for particularly eager learners (potentially with discounts offered to students at eligible Canadian universities and high schools). As a particularly ambitious vision, we are considering partnering with global educational nonprofits, such as Khan Academy, to expand education access to disadvantaged students from across the world.
