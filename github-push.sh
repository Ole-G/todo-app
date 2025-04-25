#!/bin/bash

echo "Please enter your GitHub username:"
read username

echo "Please enter your GitHub personal access token (it won't be displayed):"
read -s token

# Update the remote URL with authentication
git remote set-url origin "https://$username:$token@github.com/$username/todo-app.git"

# Push to GitHub
git push origin master

# Deploy to GitHub Pages
npm run deploy

# Reset the remote URL to remove credentials from local config
git remote set-url origin "https://github.com/$username/todo-app.git"

echo "Push and deployment complete!"