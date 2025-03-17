# Code Citations

## License: unknown
https://github.com/MrWittman612/blog-site/tree/871c9026c38b66b51139fd9ffbb4022e7c8b5def/client/src/utils/auth.js

```
) => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['
```

