async function loadIncludes() {
  const includeNodes = document.querySelectorAll('[data-include]');

  await Promise.all(
    Array.from(includeNodes).map(async (node) => {
      const path = node.getAttribute('data-include');
      if (!path) {
        return;
      }

      try {
        const normalizedPath = path.replace(/^\/+/, '');
        const candidates = [
          path,
          `./${normalizedPath}`,
          `/${normalizedPath}`,
          new URL(normalizedPath, window.location.href).toString()
        ];
        let html = null;

        for (const candidate of candidates) {
          const response = await fetch(candidate, { cache: 'no-store' });
          if (response.ok) {
            html = await response.text();
            break;
          }
        }

        if (!html) {
          throw new Error(`Failed to load include: ${path}`);
        }

        node.outerHTML = html;
      } catch (error) {
        console.error(error);
        node.outerHTML = `<div class="px-8 py-4 text-sm text-red-600">No se pudo cargar ${path}</div>`;
      }
    })
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadIncludes();
  document.dispatchEvent(new CustomEvent('includes:loaded'));
});
