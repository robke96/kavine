# ☕ Kavinė: A Tinder-inspired Discord bot written in TypeScript

[![.png](https://i.postimg.cc/QM6M5KSV/Group-4.png)](https://postimg.cc/947VHM6j)

## ✨ Features
- **🛡️ Verification System**: To get verified, users must solve a simple math question.
- **❤️ Tinder System**: 
  - **➡️ Swiping**: Users can swipe left or right on other profiles, just like Tinder.
  - **💘 Matching**: When two users swipe right on each other, they get matched and can interact.
  - **📝 Profile Creation and Editing**: Users can create and edit their profiles to enhance the matching experience, allowing for a personalized interaction.
- **🖼️ Card Loading System**: Upon bot startup, a new card is rendered for each channel from an **SVG template**.

## 🏃 Getting Started

> [!WARNING]
> Kavinė is still in a very early stage of development and may change at any time.

### 1. Clone the Repository
Clone or fork the repository and navigate into the project directory:

```shell
git clone https://github.com/robke96/kavine.git
cd kavine
```
### 2. Install Bun and Dependencies
- If you haven't installed [Bun](https://bun.sh/), install it first:
- Then install project dependencies:
```shell
      bun install
``` 

### 3. Create a Discord Server
You will need a Discord server created using the following template:
👉 [Click here to create an server](https://discord.new/NGAWtkCjx4qU)

### 4. Setup Docker (Recommended)
For a quick, isolated development setup, use Docker:

```shell
docker compose -f compose.dev.yml up -d
```
This command will start all necessary services in the background.

#### Without Docker (Manual Setup)
If you prefer not to use Docker, you can manually set up the necessary services like MongoDB and MinIO - or any S3-compatible service.


### 5. Configure .env
1. Fill credentials
   - BOT_TOKEN: Create your bot and retrieve the token from the [Discord Developer Portal](https://discord.com/developers/applications).
   - MONGO_URI: If using Docker, you can keep the default value.
   - GUILD_ID: Insert your Discord server (guild) ID.
   - S3 Configuration (Docker): 
      - Open `localhost:9001` in your browser
      - Use the login details from `compose.dev.yml`
      - Create a bucket with the name specified in `S3_BUCKETNAME`
      - Set the bucket's access policy to **public** and generate Access Keys.
   - SYSTEM: Leave blank to default to `true` or set to `FALSE` to disable the system.

2. Rename `.env.example` to `.env`

### 6. Run the Bot
Once everything is set up, start the bot using
```shell
bun run start
```

## 🤝 Contributing

There are several ways you can contribute to:

- **Reporting Bugs**:
   - If you encounter a bug, please search for existing issues on the issue tracker first. 
   - If you can't find a duplicate issue, open a new one.
   -  Provide a clear description of the bug, including steps to reproduce it if possible.
  Screenshots, logs, or code snippets can also be helpful.
-  **Suggesting Features**:
   - Have an idea on how Kavinė can be improved? Share your toughs by opening an issue.
   - Describe the proposed feature in details, including its benefits and potential implementation considerations.
-  **Submitting Pull Requests**:
   - To get started with contributing code, fork the repository on GitHub.
   - Follow the [# 🏃 Getting Started](#-getting-started) guide to have the bot running.
   - Make your changes on your local fork and create a pull request to the main repository.
   - Ensure your code adheres to our project structure and style guidelines.
  Write clear and concise commit messages that describe your changes.




