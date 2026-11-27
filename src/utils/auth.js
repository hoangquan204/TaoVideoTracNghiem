// Quản lý và xác thực tài khoản từ biến môi trường .env (VITE_AUTH_ACCOUNTS)

export function getValidAccounts() {
  const defaultAccounts = [
    { username: 'admin', password: '666424242' },
    { username: 'hoangquocviet', password: '123456' }
  ];

  try {
    const envAccountsStr = import.meta.env.VITE_AUTH_ACCOUNTS;
    if (!envAccountsStr) {
      return defaultAccounts;
    }

    let list = [];

    // 1. Hỗ trợ dạng JSON nếu người dùng cấu hình JSON array
    if (envAccountsStr.trim().startsWith('[') || envAccountsStr.trim().startsWith('{')) {
      const parsed = JSON.parse(envAccountsStr);
      if (Array.isArray(parsed)) {
        list = parsed.map(acc => ({
          username: String(acc.username || acc.user || '').trim().toLowerCase(),
          password: String(acc.password || acc.pass || '')
        })).filter(a => a.username && a.password);
      }
    } else {
      // 2. Parse dạng chuỗi thông dụng: username:password,username2:password2
      list = envAccountsStr
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
    }

    if (list.length > 0) {
      // Tự động nâng cấp nếu cấu hình cũ còn lưu admin:admin -> đổi thành admin:666424242
      return list.map(acc => {
        if (acc.username === 'admin' && acc.password === 'admin') {
          return { username: 'admin', password: '666424242' };
        }
        return acc;
      });
    }
  } catch (err) {
    console.warn('Lỗi đọc cấu hình tài khoản từ .env:', err);
  }

  return defaultAccounts;
}

export function generateToken(username, password) {
  try {
    return btoa(encodeURIComponent(`${String(username).toLowerCase()}:${password}`));
  } catch {
    return `${String(username).toLowerCase()}_${password}`;
  }
}

export function validateSessionToken() {
  try {
    const isAuth = localStorage.getItem('geoquiz_admin_auth') === 'true';
    const user = (localStorage.getItem('geoquiz_admin_user') || '').trim().toLowerCase();
    const token = localStorage.getItem('geoquiz_auth_token');

    // Nếu không có token phiên bản mới hoặc không có cờ auth -> coi như chưa đăng nhập
    if (!isAuth || !user || !token) {
      clearSession();
      return false;
    }

    const validAccounts = getValidAccounts();
    const matched = validAccounts.find(acc => acc.username === user);
    if (!matched) {
      clearSession();
      return false;
    }

    const expectedToken = generateToken(matched.username, matched.password);
    if (token !== expectedToken) {
      clearSession();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem('geoquiz_admin_auth');
    localStorage.removeItem('geoquiz_auth_token');
    localStorage.removeItem('geoquiz_admin_user');
  } catch (e) {
    console.warn('Clear session error:', e);
  }
}

export function authenticateUser(username, password) {
  const validAccounts = getValidAccounts();
  const trimmedUser = String(username || '').trim().toLowerCase();
  const inputPass = String(password || '');

  return validAccounts.some(
    acc => acc.username.toLowerCase() === trimmedUser && acc.password === inputPass
  );
}
