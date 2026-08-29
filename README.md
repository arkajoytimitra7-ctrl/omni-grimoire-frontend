# Omni Grimoire Frontend

Create the initial frontend foundation for a web application called Omni Grimoire.



IMPORTANT DATABASE RULES:



- An existing Supabase database already exists for this project.

- The existing Supabase database is the source of truth.

- Do NOT create a new Supabase project.

- Do NOT create, delete, rename, or modify any database tables, columns, relationships, RLS policies, storage buckets, triggers, functions, or authentication configuration.

- Do NOT create mock database tables to replace the existing schema.

- First inspect and use the existing Supabase schema.



For this first phase, focus ONLY on the frontend foundation:



- React + TypeScript architecture

- Clean component structure

- Application routing

- Reusable UI components

- Responsive layout foundation

- Supabase client integration

- Environment configuration

- Type-safe database integration

- Authentication infrastructure without changing the existing database

- Basic application shell



Do not build the complete application yet.



Before making substantial changes, inspect the connected Supabase project and summarize the existing schema and how the frontend will consume it.



The expected core database entities are:

profiles

private_categories

public_tags

files

file_tags

likes



Use the existing database types/schema rather than inventing replacements.



The project should be structured so that future features can be added cleanly:



- Authentication

- Dashboard

- Library

- File management

- Categories

- Tags

- Likes

- Search



Prioritize maintainability, security, type safety, and responsive design.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5365ce14-c68c-4cd6-8a72-e87b63d913d2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
