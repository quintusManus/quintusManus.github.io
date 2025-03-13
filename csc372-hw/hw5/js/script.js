/**
 * Name: Benjamin Woods
 * Date: 03.13.2025
 * CSC 372-01
 *
 * Description:
 * Fetches a GitHub user's latest 20 repositories and displays them in a gallery.
 * Each repo shows name, description, creation date, update date, watchers, 
 * language list, and commit count. A direct link goes to the repository page.
 *
 * Note: Because commit counting requires multiple requests, this sample 
 * uses the 'Link' header approach to estimate total commits. 
 * May be rate-limited by GitHub.
 */

/**
 * getRepos - fetches the list of repos for a given username
 * @param {string} username - GitHub username to retrieve repositories for
 * @return {Promise<Array>} - array of repo objects
 */
async function getRepos(username) {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`User not found or error with request: ${response.status}`);
    }
    const data = await response.json();
    return data; // array of repo objects
  }
  
  /**
   * getCommitCount - fetches commit metadata to determine total commits for a repo
   * @param {string} username - GitHub username
   * @param {string} repoName - repository name
   * @return {Promise<number>} - total number of commits
   */
  async function getCommitCount(username, repoName) {
    // First fetch HEAD of commits to get 'Link' header
    const commitsUrl = `https://api.github.com/repos/${username}/${repoName}/commits?per_page=1`;
    const response = await fetch(commitsUrl);
    if (!response.ok) {
      // If there's an error (e.g. no commits or private repo), just return 0
      return 0;
    }
  
    // If there's no 'Link' header, there's likely 1 or 0 commits
    const linkHeader = response.headers.get('Link');
    if (!linkHeader) {
      // If the JSON is non-empty, there's at least 1 commit
      const data = await response.json();
      return data.length ? data.length : 0;
    }
  
    // The last page link is typically: <https://api.github.com/repos/.../commits?page=N>; rel="last"
    // We'll parse out 'page=N' from the link
    const match = linkHeader.match(/&page=(\d+)>; rel=\"last\"/);
    if (match) {
      const totalPages = parseInt(match[1], 10);
      return totalPages;
    }
    return 0;
  }
  
  /**
   * getLanguages - fetches the languages used in a repo
   * @param {string} url - the languages_url from the repo object
   * @return {Promise<string>} - comma-separated string of language names
   */
  async function getLanguages(url) {
    const response = await fetch(url);
    if (!response.ok) {
      return 'N/A';
    }
    const data = await response.json();
    // The keys of the returned object are language names
    const langKeys = Object.keys(data);
    if (langKeys.length === 0) {
      return 'None';
    }
    return langKeys.join(', ');
  }
  
  /**
   * createRepoCard - creates a DOM element representing a single repository
   * @param {object} repo - repository object from GitHub
   * @param {number} commits - total commits
   * @param {string} languages - list of languages
   * @return {HTMLElement} - the repo card element
   */
  function createRepoCard(repo, commits, languages) {
    const card = document.createElement('div');
    card.classList.add('repo-card');
  
    // Repo name + link
    const repoName = document.createElement('h3');
    const repoLink = document.createElement('a');
    repoLink.href = repo.html_url;
    repoLink.target = '_blank';
    repoLink.textContent = repo.name;
    repoName.appendChild(repoLink);
  
    // Description
    const desc = document.createElement('p');
    desc.textContent = repo.description ? repo.description : 'No description';
  
    // Metadata
    const meta = document.createElement('div');
    meta.classList.add('repo-meta');
  
    // Creation date & update date
    const createdAt = new Date(repo.created_at).toLocaleDateString();
    const updatedAt = new Date(repo.updated_at).toLocaleDateString();
  
    // watchers_count -> watchers
    // languages
    // commits
    meta.innerHTML = `
      <p><strong>Created:</strong> ${createdAt}</p>
      <p><strong>Updated:</strong> ${updatedAt}</p>
      <p><strong>Watchers:</strong> ${repo.watchers_count}</p>
      <p><strong>Languages:</strong> ${languages}</p>
      <p><strong>Commits:</strong> ${commits}</p>
    `;
  
    card.appendChild(repoName);
    card.appendChild(desc);
    card.appendChild(meta);
  
    return card;
  }
  
  /**
   * renderRepos - renders the array of repository objects into the DOM
   * @param {Array} repos - array of repository objects
   * @param {string} username - current GitHub username to fetch data for
   */
  async function renderRepos(repos, username) {
    const gallerySection = document.getElementById('gallery-section');
    // Clear existing content
    gallerySection.innerHTML = '';
  
    // For each repo, we fetch commits & languages in parallel
    for (let i = 0; i < repos.length; i++) {
      const repo = repos[i];
  
      try {
        // commits and languages can be fetched in parallel:
        const [commits, languages] = await Promise.all([
          getCommitCount(username, repo.name),
          getLanguages(repo.languages_url),
        ]);
  
        const cardEl = createRepoCard(repo, commits, languages);
        gallerySection.appendChild(cardEl);
      } catch (err) {
        console.error(`Error fetching data for repo ${repo.name}:`, err);
      }
    }
  }
  
  /**
   * handleSearch - triggered when user clicks Search or enters a username
   */
  async function handleSearch() {
    const usernameInput = document.getElementById('username-input');
    const gallerySection = document.getElementById('gallery-section');
  
    const username = usernameInput.value.trim();
    if (!username) return;
  
    // Clear gallery & show a loading message
    gallerySection.innerHTML = '<p>Loading...</p>';
  
    try {
      const repos = await getRepos(username);
      await renderRepos(repos, username);
    } catch (err) {
      console.error(err);
      gallerySection.innerHTML = `<p>Error: ${err.message}</p>`;
    }
  }
  
  // Setup event listeners on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
  
    searchButton.addEventListener('click', handleSearch);
  
    // Optionally allow pressing Enter in the text field
    const usernameInput = document.getElementById('username-input');
    usernameInput.addEventListener('keyup', (evt) => {
      if (evt.key === 'Enter') {
        handleSearch();
      }
    });
  
    // Load default user (e.g. 'quintusManus') on page load
    handleSearch();
  });