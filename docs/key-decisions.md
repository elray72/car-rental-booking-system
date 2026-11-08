# Key decisions

### Forms

React Hook Forms and Zod are the most popular form and validation libraries. This decision was made from personal experience with the library and industry popularity. Gemini was asked "What is the most popular form and validation library for React", Gemini suggested React Hook Forms and Zod as
the "undisputed industry standard" (Google, 2026).

- `react-hook-form`
- `zod`
- `@hookform/resolvers`

A common `Form` component will be created to facilitate this

---

### Roles

The decided roles will be `customer`, `staff` and `admin`.

1. The registration process will have create users with the 'customer' role by default.
2. Staff members who register will have their roles promoted to 'staff' or 'admin' via database input in this iteration.

#### Visibility:
- Locations can be viewed by Staff and Admin but only Admin may edit and delete
- Cars visibility was originally set to Admin only but will now be visible to Staff but not editable, retirable

---

### Local storage vs Session storage vs Cookies

The decision on method of persistence was based on the following factors:

- Ease of implementation relative to security offered
- Cross tab capability

The options were `local storage`, `session storage` or `cookies`. Local storage was decided as the best option given it's ability to persist through tabs and ease of implementation, however it does not expire and is more suitable for things like user settings (Max, 2025). This approach is in conflict with our security requirement. We can move to cookie storage at a later date for better
security.

Update Nov 7, 2026: Implemented cookies with expiry in CR-12 to satisfy R024.

---

### Design alignment

Due to compressed timelines, the core functionality will be built ahead of aligment with the Figma designs. This will be reflected in JIRA.

---

### Multi-select box

`react-select` was selected to enabled multiple checkbox, `react-multi-select-component` was initially proposed, but `react-select` suited the aesthetic better with 'pills' and popularity 11m weekly downloads vs 100k (NPM, 2025).

### Data models

- Most fields will use `trim()` to ensure data integrity and avoid bugs related to trailing spaces. This will be applied to what makes sense, vs as a global rule.

#### Car

`car.location` was initially going to required, but decided we'll remove that requirement.

---

## References

Google. (2026). Gemini (Gemini 1.5 Flash) [Large language model](https://gemini.google.com/)

Max, A. (2025, July 31). _LocalStorage vs SessionStorage vs Cookies: A Complete Guide_
DEV Community. [https://dev.to/hmpljs/localstorage-vs-sessionstorage-vs-cookies-a-complete-guide-3m6d](https://dev.to/hmpljs/localstorage-vs-sessionstorage-vs-cookies-a-complete-guide-3m6d)

Watson, J. (2025, Jully 11). _react-select_
NPM JS. [https://www.npmjs.com/package/react-select](https://www.npmjs.com/package/react-select)

Zalavadiya, H. (2022, October 7). _react-multi-select-component_
NPM JS. [https://www.npmjs.com/package/react-multi-select-component](https://www.npmjs.com/package/react-multi-select-component)
