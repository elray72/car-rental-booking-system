# Key decisions

### Forms

React Hook Forms and Zod are the most popular form and validation libraries. This decision was made from personal experience with the library and industry popularity. Gemini was asked "What is the most popular form and validation library for React", Gemini suggested React Hook Forms and Zod as
the "undisputed industry standard" (Google, 2026).

- `react-hook-form`
- `zod`
- `@hookform/resolvers`

A common `Form` component will be created to facilitate this.

Update:

Customer facing forms will not use the standard Form component - it's too hard to style without making it too complicated.

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

### Other library choices

- **Multi-select box:** `react-select` was selected to enabled multiple checkbox, `react-multi-select-component` was initially proposed, but `react-select` suited the aesthetic better with 'pills' and popularity 11m weekly downloads vs 100k (NPM, 2025).

- **Toast alerts:** I didn't like the error paragraph we were using in forms on the home page - used `react-hot-toast` library to pop up errors.

- **React icons:** `react-icons` was used for it's popularity and large library of icons.

- **React spinner:** `react-spinner` was used for loading screens due to it's ease of implementation and compatibility with React 18.

---

### Data models

- Most fields will use `trim()` to ensure data integrity and avoid bugs related to trailing spaces. This will be applied to what makes sense, vs as a global rule.

- Cars - `car.location` was initially going to required, but decided we'll remove that requirement.

- Cars - featured, initially thought to use a 'featured' boolean but was kinda more annoying to use on the forms, decided I can leverage the tags and just add featured there.

---

### Design

GenAI was used via Canva to add a slight blur to the stock photo (Canva, n.d.) for a photograph of the Gold Coast skyline acquired via Pexels (Patel, n.d.). This will be used for the home page banner.

---

## References

Canva. (n.d.). Canva [Computer software]. [https://www.canva.com](https://www.canva.com)

Google. (2026). Gemini (Gemini 1.5 Flash) [Large language model](https://gemini.google.com/)

Patel, Parth (n.d). _Stunning aerial view of Gold Coast Skyline at Dusk_
Pexels. [https://www.pexels.com/photo/stunning-aerial-view-of-gold-coast-skyline-at-dusk-37845991/](https://www.pexels.com/photo/stunning-aerial-view-of-gold-coast-skyline-at-dusk-37845991/)

Max, A. (2025, July 31). _LocalStorage vs SessionStorage vs Cookies: A Complete Guide_
DEV Community. [https://dev.to/hmpljs/localstorage-vs-sessionstorage-vs-cookies-a-complete-guide-3m6d](https://dev.to/hmpljs/localstorage-vs-sessionstorage-vs-cookies-a-complete-guide-3m6d)

Watson, J. (2025, Jully 11). _react-select_
NPM JS. [https://www.npmjs.com/package/react-select](https://www.npmjs.com/package/react-select)

Zalavadiya, H. (2022, October 7). _react-multi-select-component_
NPM JS. [https://www.npmjs.com/package/react-multi-select-component](https://www.npmjs.com/package/react-multi-select-component)
