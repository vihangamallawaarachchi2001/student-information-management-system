# Student Information Management System

A local web application for managing student information from Excel sheets.

## Requirements

* Windows 10/11
* Docker Desktop

## Setup

### 1. Install Docker Desktop

Download and install Docker Desktop:

https://www.docker.com/products/docker-desktop/

Recommended guide:

https://docs.docker.com/desktop/setup/install/windows-install/

### 2. Start the Application

Open PowerShell in the project folder and run:

```bash
docker compose up -d
```

Wait for the containers to start.

### 3. Open the Application

Open your browser and go to:

```text
http://localhost:3000
```

That's it.

## Daily Usage

After the initial setup, Docker Desktop can be configured to start automatically with Windows.

The application uses:

* **Next.js** — Web application
* **MySQL** — Database
* **Docker** — Runs the application locally

Your data is stored locally on the computer.

## Useful Commands

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Check status:

```bash
docker compose ps
```

Rebuild after an update:

```bash
docker compose up -d --build
```

> **Important:** Do not run `docker compose down -v` unless you intentionally want to delete the database volume and all stored data.
