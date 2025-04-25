#!/bin/bash

# GitHub setup script
# This script handles GitHub authentication and pushes to a remote repository

# Function to handle errors
handle_error() {
    echo "Error: $1" >&2
    exit 1
}

# Clear the screen for better readability
clear

echo "======================================="
echo "GitHub Repository Setup Script"
echo "======================================="
echo "This script will set up your GitHub remote with authentication"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    handle_error "Git is not installed. Please install git first."
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "This directory is not a git repository."
    read -p "Would you like to initialize a git repository here? (y/n): " init_repo
    if [[ $init_repo == "y" || $init_repo == "Y" ]]; then
        git init || handle_error "Failed to initialize git repository"
        echo "Git repository initialized successfully."
    else
        handle_error "Not a git repository. Exiting."
    fi
fi

# Ask for GitHub credentials
read -p "Enter your GitHub username: " github_username
if [[ -z "$github_username" ]]; then
    handle_error "GitHub username cannot be empty"
fi

# Securely ask for Personal Access Token
echo "Enter your GitHub Personal Access Token (input will be hidden):"
read -s github_token
echo "" # Add a newline after the hidden input
if [[ -z "$github_token" ]]; then
    handle_error "GitHub token cannot be empty"
fi

# Get the current repository name
repo_name=$(basename -s .git "$(git config --get remote.origin.url 2>/dev/null || echo "$(basename "$(pwd)")")")

# Ask if the repository name is correct
echo ""
echo "Current repository name: $repo_name"
read -p "Is this correct? If not, enter the correct name (or press Enter to confirm): " new_repo_name
if [[ -n "$new_repo_name" ]]; then
    repo_name="$new_repo_name"
fi

# Construct the remote URL with authentication
remote_url="https://$github_username:$github_token@github.com/$github_username/$repo_name.git"

# Check if the origin remote exists
if git config --get remote.origin.url &> /dev/null; then
    echo "Remote 'origin' already exists. Updating URL..."
    git remote set-url origin "$remote_url" || handle_error "Failed to update remote URL"
else
    echo "Setting up remote 'origin'..."
    git remote add origin "$remote_url" || handle_error "Failed to add remote"
fi

echo "Remote URL has been configured successfully."

# Check if there are any commits
if ! git rev-parse --verify HEAD &> /dev/null; then
    echo "No commits found. You need to make at least one commit before pushing."
    read -p "Would you like to commit all current files? (y/n): " make_commit
    if [[ $make_commit == "y" || $make_commit == "Y" ]]; then
        git add .
        git commit -m "Initial commit" || handle_error "Failed to create initial commit"
        echo "Initial commit created."
    else
        echo "Please make a commit before pushing to GitHub."
        exit 0
    fi
fi

# Ask if user wants to push to GitHub
read -p "Would you like to push to GitHub now? (y/n): " push_now
if [[ $push_now == "y" || $push_now == "Y" ]]; then
    echo "Pushing to GitHub..."
    
    # Get the current branch name
    current_branch=$(git symbolic-ref --short HEAD 2>/dev/null || echo "main")
    
    # Push to GitHub with the correct branch
    git push -u origin "$current_branch" || handle_error "Failed to push to GitHub"
    echo "Successfully pushed to GitHub!"
else
    echo "Remote is set up. You can push manually when ready using: git push -u origin <branch-name>"
fi

# Clean up - Don't echo the token to terminal or store it anywhere else
github_token=""

echo ""
echo "Setup complete!"
echo "======================================="