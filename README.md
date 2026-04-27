# Checklist App

🚧 Status: In progress

## Overview
A multi-tool inspection and request management app built with React and Supabase.
Users can fill out structured checklists across different tools (PROMPT, SUBDEW, FRUGAL, Roof Armour),
save drafts, submit reports, and export them as PDFs.
An admin dashboard allows reviewing, updating status, and managing all submissions.

## Tech Stack

- [React 19](https://react.dev/) — UI and component architecture
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Supabase](https://supabase.com/) — database, auth, and file storage
- [React Router v7](https://reactrouter.com/) — client-side routing
- [jsPDF](https://github.com/parallax/jsPDF) — PDF export

## Getting Started
Install dependencies:
npm install

Start dev server:
npm run dev

Requires a .env file with your Supabase credentials:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

## Features

- Multi-tool inspection forms with area-based questions, ratings, notes, and photo uploads
- Draft and submit flow per inspection
- Admin dashboard with submitted/draft tabs, status management, and reviewer tracking
- PDF export for each report
- Shared reusable components across tools

## Project Goals

This project is part of a real-world learning journey focused on:
component reusability, Supabase integration, state management, and building maintainable production-ready code.
