/* eslint-disable sort-keys */

// Options
export enum Color {
  heavyMetal = '#333533',
  grayNurse = '#dddfdd',
  white = '#ffffff',

  goldenrod = '#FBCE75',
  tussock = '#C09842',
  cornHarvest = '#87650A',

  pomegranate = '#F43A21',
  guardsmanRed = '#D50201',
}

export enum Padding {
  xxs = '0.25rem',
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

export enum BorderWidth {
  xs = '1px',
  s = '2px',
  m = '3px',
  l = '4px',
  xl = '5px',
}

export enum TransitionLength {
  s = '300ms',
  m = '500ms',
  l = '1000ms',
}

export enum BorderRadius {
  xs = '0.1rem',
  s = '0.2rem',
  m = '0.3rem',
  l = '0.5rem',
  xl = '0.8rem',
}

export enum BreakPoint {
  mobile = '768px',
}

export enum Font {
  regular = "'TiredOfCourier W01 Regular', Courier, serif",
  bold = "'TiredOfCourier W01 Bold', Courier, serif",
}

// Decisions
export const DesignToken = {
  lineHeightFactor: 1.613,

  defaultPadding: Padding.m,
  defaultBorderRadius: BorderRadius.m,
  defaultFontSize: FontSize.s,
  defaultTransitionLength: TransitionLength.s,

  maxWidth: '1170px',

  dateHeader: {
    padding: Padding.m,
    fontSize: FontSize.m,
  },

  form: {
    borderRadius: BorderRadius.s,
    borderWidth: BorderWidth.xs,
    fontSize: FontSize.s,
    padding: Padding.xxs,
    marginBottom: Padding.xs,

    button: {
      padding: `${Padding.xs} ${Padding.s}`,
      marginTop: Padding.xs,
      marginBottom: Padding.xxs,

      small: {
        padding: `${Padding.xxs} ${Padding.xs}`,
      },
    },
  },

  todoEntry: {
    padding: Padding.xs,

    selectBorder: {
      width: BorderWidth.s,
    },
  },
}
