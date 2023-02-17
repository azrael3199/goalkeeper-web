const MALACHITE = {
  50: '#85eda8',
  100: '#6de997',
  200: '#54e585',
  300: '#3ce174',
  400: '#23de62',
  500: '#0bda51',
  600: '#089939',
  700: '#066d29',
  800: '#034118',
  900: '#011608',
}
const MIDNIGHT_GREEN = {
  50: '#e5ffff',
  100: '#c8ffff',
  200: '#ace6f2',
  300: '#75aeba',
  400: '#407a84',
  500: '#004953',
  600: '#003e48',
  700: '#003038',
  800: '#002328',
  900: '#001518',
}
const ISABELLINE = {
  50: '#faf8f7',
  100: '#f4f0ec',
  200: '#eee8e2',
  300: '#e8e0d8',
  400: '#e2d8cd',
  500: '#dcd0c3',
  600: '#d6c7b9',
  700: '#d0bfae',
  800: '#cab7a4',
  900: '#c4af9a',
}
const RIPE_MANGO = {
  50: '#ffda78',
  100: '#ffd568',
  200: '#ffd157',
  300: '#ffcc47',
  400: '#ffc837',
  500: '#ffc326',
  600: '#ffbf16',
  700: '#ffba06',
  800: '#f4b100',
  900: '#e4a500',
}

export default {
  colors: {
    malachite: MALACHITE,
    midnightGreen: MIDNIGHT_GREEN,
    isabelline: ISABELLINE,
    ripeMango: RIPE_MANGO,
  },
  styles: {
    global: {
      body: {
        bg: ISABELLINE[100],
      },
    },
  },
}
