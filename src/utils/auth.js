// Quản lý và xác thực tài khoản từ biến môi trường .env (VITE_AUTH_ACCOUNTS)

export function getValidAccounts() {
  const defaultAccounts = [
    { username: 'admin', password: 'admin' },
    { username: 'hoangquocviet', password: '123456' }
  ];

  try {
    const envAccountsStr = import.meta.env.VITE_AUTH_ACCOUNTS;
    if (!envAccountsStr) {
      return defaultAccounts;
    }

    // 1. Hỗ trợ dạng JSON nếu người dùng cấu hình JSON array
    if (envAccountsStr.trim().startsWith('[') || envAccountsStr.trim().startsWith('{')) {
      const parsed = JSON.parse(envAccountsStr);
      if (Array.isArray(parsed)) {
        return parsed.map(acc => ({
          username: String(acc.username || acc.user || '').trim().toLowerCase(),
          password: String(acc.password || acc.pass || '')
        })).filter(a => a.username && a.password);
      }
    }

    // 2. Parse dạng chuỗi thông dụng: username:password,username2:password2
    const list = envAccountsStr
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(pair => {
        const parts = pair.split(':');
        const username = (parts[0] || '').trim().toLowerCase();
        const password = parts.slice(1).join(':').trim();
        return { username, password };
      })
      .filter(a => a.username && a.password);

    if (list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn('Lỗi đọc cấu hình tài khoản từ .env:', err);
  }

  return defaultAccounts;
}

export function authenticateUser(username, password) {
  const validAccounts = getValidAccounts();
  const trimmedUser = String(username || '').trim().toLowerCase();
  const inputPass = String(password || '');

  return validAccounts.some(
    acc => acc.username.toLowerCase() === trimmedUser && acc.password === inputPass
  );
}

