# README

Read-Timer is a chrome extension built with JavaScript that provides an estimate of the amount of time it will take to read an article on a webpage. 

The present implementation starts off with a user's estimate of his/her read speed to calculate the time. Speeds across websites are also tracked and used to refine this initial value and learn the user's actual read speed.

Additionally, the user's current scroll position is used to provide an estimate of the time remaining in the article.

The future scope of this extension could include:

* Providing a visualization of the progression of the user's read speed over time

* Factoring in the complexity of the article while computing the estimate 

* Factoring in other intangible aspects such as user interest in the topic/ nature of the article (for example, a comic) and so on. 

Contributing:

1) Fork and clone the repo.

2) Figure out something you'd like to work on, say feature X (the milestones/issues sections are generally good places to look). Do drop a comment saying you'd like to work on such a feature.

3) Choose a descriptive branch name for the feature, apart from master or develop.

4) Checkout develop and create a new branch with this name, like so:
```
    git fetch upstream
    git checkout develop
    git merge upstream/develop
    git checkout -b your-branch-name
```

5) Make a commit to your feature branch with a descriptive commit message, like so:

```
    git commit -a -m "{{YOUR COMMIT MESSAGE HERE}}"
    git push origin {{YOUR BRANCH NAME}}
```

6) Once done, create a pull request. You're done!

Feel free to reach out in case of any doubts.

Run instructions:

* Ensure you have the latest version of Google Chrome.

* Get the extension from the Chrome store at http://bit.ly/1MzUZEe

* Set your read speed estimate in the options tab

* Click the icon while on a blog article to run the extension!
