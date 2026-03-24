const profileSurface = {
  request: {
    request_id: 'github-profile-static-surface',
    x_request_timestamp: 'static-surface',
    x_request_path: '/README.md',
    x_request_method: 'READ',
  },
  surface: {
    name: 'github-profile',
    kind: 'editorial-profile',
    public_urls: [
      'https://mozg.com.br/',
      'https://mozgbrasil.github.io/',
      'https://github.com/mozgbrasil',
    ],
  },
};

process.stdout.write(`${JSON.stringify(profileSurface, null, 2)}\n`);
