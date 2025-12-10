# 🏡 Nomad Housing: International Real Estate Broker Website

[![Next.js Badge](https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL Badge](https://img.shields.io/badge/-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma Badge](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![FastAPI Badge](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

## 🌟 Overview

**Nomad Housing** is a high-performance platform connecting international real estate brokers with clients globally. It utilizes a robust **monorepo-style setup** combining a modern Next.js frontend with specialized FastAPI microservices for handling complex search and data aggregation tasks.

---

## 🛠️ Technology Stack

This project is structured as a full-stack application leveraging the following core technologies:

### Frontend (Next.js)

* **Framework:** **Next.js** (React)
* **Styling:** **Tailwind CSS** for rapid and utility-first styling.
* **Language:** TypeScript

### Backend / Data

* **Database:** **PostgreSQL** (Relational Database)
* **ORM:** **Prisma** (Next-generation ORM) for database access, migrations, and model generation.
* **Microservices:** Specialized services built with **FastAPI** (Python) for:
    * **Search Feature:** Handling complex property filtering and indexing.
    * **Listing Aggregation:** Processing and standardizing data from various external property sources.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

You must have [Node.js](https://nodejs.org/) (v18+), [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/), and **Docker** installed (recommended for running the PostgreSQL database and FastAPI services easily).

### 1. Clone the repository

```bash
git clone [YOUR_REPO_URL]
cd nomad-housing
