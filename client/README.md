# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

when in development
redirect to local host after payment: http://localhost:5173/proceed-payment

when in production
redirect to local host after payment: https://www.nursingfront.com?isPostJob=true

# Git Commands

Fetch information about remote branches:

- git fetch origin

This command fetches information about all branches on the remote named "origin" (you can replace "origin" with the name of your remote).

- git checkout -b local_branch_name origin/remote_branch_name

If you want to switch to an existing local branch that should track a remote branch, you can set up tracking using:

- git branch -u origin/remote_branch_name local_branch_name

You can pull changes from the remote branch using:

- git pull origin remote_branch_name

# How to removing the body top padding (padding-top: 60px;) if the page has a different color

- Add the pages path to App.jsx in const coloredPages
