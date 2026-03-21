<nav aria-label="Social links">
  <div class="social-icons">
    <a href="https://banapana.substack.com" target="_blank" rel="noopener noreferrer" aria-label="Substack">
      <img src="/images/social-icons/substack-logo.png" alt="" width="40" height="40" />
    </a>
    <a href="https://medium.com/minds-on-media" target="_blank" rel="noopener noreferrer" aria-label="Medium">
      <img src="/images/social-icons/medium-logo.png" alt="" width="40" height="40" />
    </a>
    <a href="https://linkedin.com/in/russellbits" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
      <img src="/images/social-icons/linkedin-logo.png" alt="" width="40" height="40" />
    </a>
    <a href="https://www.quora.com/profile/Russell-Warner" target="_blank" rel="noopener noreferrer" aria-label="Quora">
      <img src="/images/social-icons/quora-logo.png" alt="" width="40" height="40" />
    </a>
    <a href="https://www.reddit.com/user/ruzelmania/" target="_blank" rel="noopener noreferrer" aria-label="Reddit">
      <img src="/images/social-icons/reddit-logo.png" alt="" width="40" height="40" />
    </a>
  </div>
</nav>

<style>
  nav {
    background: #000;
    height: 85px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
    margin: 0;
  }

  .social-icons {
    display: flex;
    align-items: center;
    height: 100%;
    gap: 10px;
    padding: 0 10px;
    margin-left: auto;
    width: fit-content;
  }

  .social-icons img {
    width: 40px;
    height: 40px;
    filter: brightness(0) invert(1);
    display: block;
    border-radius: 0;
  }

  @media (max-width: 480px) {
    .social-icons img {
      width: 32px;
      height: 32px;
    }

    .social-icons {
      gap: 8px;
    }
  }
</style>
