module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#993556',
          light: '#D4537E',
          bg: '#FBEAF0',
          border: '#F4C0D1'
        },
        teal: {
          DEFAULT: '#0F6E56',
          light: '#E1F5EE'
        },
        amber: {
          DEFAULT: '#633806',
          light: '#FAEEDA'
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(153, 53, 86, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
    }
  }
}
