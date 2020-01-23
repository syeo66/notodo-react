// Options
export enum Color {
  heavyMetal = '#333533',
  pumice = '#bbbfbb',
  white = '#ffffff',

  goldenrod = '#FBCE75',
  tussock = '#C09842',
  cornHarvest = '#87650A',
}

export enum Padding {
  xs = '0.5rem',
  s = '1rem',
  m = '1.2rem',
  l = '1.6rem',
  xl = '2rem',
  xxl = '2.4rem',
}

export enum FontSize {
  xs = '0.8rem',
  s = '1rem',
  m = '1.4rem',
  l = '1.8rem',
  xl = '2rem',
  xxl = '2.2rem',
}

export enum BreakPoint {
  mobile = '768px',
}

// Decisions
export const DesignToken = {
  lineHeightFactor: 1.613,

  defaultPadding: Padding.m,

  maxWidth: '1170px',

  dateHeader: {
    padding: Padding.m,
    fontSize: FontSize.m,
  },

  todoEntry: {
    padding: Padding.xs,

    selectBorder: {
      width: '2px',
    },
  },
}
