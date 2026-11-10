<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />
<div align="center">
  <h3 align="center">Boykotify</h3>

  <p align="center">
    A project that scans your Spotify playlists and helps you remove songs by artists flagged by the project.
    <br />
    <a href="https://boykotify.vercel.app"><strong>Live Demo</strong></a>
    <br />
    <br />
    <a href="https://github.com/aybrkaknc/boykotify/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/aybrkaknc/boykotify/issues/new?labels=enhancement">Request Feature</a>
  </p>

  <p align="center">
    <a href="README.md">English</a> | <a href="README.tr.md">Türkçe</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Boykotify scans the playlists in your Spotify library and flags songs by artists on its list. You can filter the results by category and remove flagged songs from your playlists in one click or in bulk.

- **Fast Scanning**: Detects flagged artists in your Spotify playlists instantly.
- **Interactive Filtering**: Filter songs by category from the score table.
- **One-Click Cleanup**: Remove flagged songs one at a time or in bulk.
- **Data Persistence**: Scan results are kept when the page is reloaded.
- **Minimalist Design**: A modern, action-focused interface.
- **Animations**: Transition effects for the song removal action.

For more details, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React-shield]][React-url]
* [![Vite][Vite-shield]][Vite-url]
* [![Supabase][Supabase-shield]][Supabase-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

* Node.js and npm
* A Spotify Developer application with a Web API client ID

### Installation

1. Install dependencies
   ```sh
   npm install
   ```
2. Create a `.env` file from `.env.example` and add your API keys
3. Start the development server
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Open the app, connect your Spotify account, and run a scan on your playlists. Review the flagged songs in the score table, filter them by category, and remove them from your playlists.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome. Fork the repository, create a feature branch, commit your changes, and open a pull request. You can also open an issue with the tag "enhancement".

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Ayberk - [@aybrkaknc](https://github.com/aybrkaknc)

Project Link: [https://github.com/aybrkaknc/boykotify](https://github.com/aybrkaknc/boykotify)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/aybrkaknc/boykotify.svg?style=for-the-badge
[contributors-url]: https://github.com/aybrkaknc/boykotify/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aybrkaknc/boykotify.svg?style=for-the-badge
[forks-url]: https://github.com/aybrkaknc/boykotify/network/members
[stars-shield]: https://img.shields.io/github/stars/aybrkaknc/boykotify.svg?style=for-the-badge
[stars-url]: https://github.com/aybrkaknc/boykotify/stargazers
[issues-shield]: https://img.shields.io/github/issues/aybrkaknc/boykotify.svg?style=for-the-badge
[issues-url]: https://github.com/aybrkaknc/boykotify/issues
[React-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[Vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Supabase-shield]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
