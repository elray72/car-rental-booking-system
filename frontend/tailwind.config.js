module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          strong: 'var(--color-accent-strong)',
        },
        muted: 'var(--color-text-muted)',
        line: 'var(--color-border)',
        surface: 'var(--color-surface)',
        canvas: 'var(--color-bg)',
        subtle: 'var(--color-bg-subtle)',
        danger: {
          DEFAULT: 'var(--color-danger)',
          light: 'var(--color-danger-light)',
          hover: 'var(--color-danger-hover)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          hover: 'var(--color-success-hover)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          hover: 'var(--color-warning-hover)',
        },
      },
    },
  },
  plugins: [],
};
