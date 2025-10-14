class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <!-- Footer: single source of truth -->
            <footer class="fixed-bottom py-4 my-10 border-top text-center bg-info">
                <p class="mb-0 text-muted">&copy; 2025 BCIT COMP1800</p>
            </footer>
        `;
  }
}

customElements.define("site-footer", SiteFooter);
