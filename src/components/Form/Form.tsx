import Color from 'color'
import styled from 'styled-components'

import { DesignToken, Font } from '../../design-tokens'

export const Input = styled.input`
  background-color: ${props => props.theme.form.backgroundColor};
  color: ${props => props.theme.form.borderColor};
  background-color: ${props =>
    Color(props.theme.form.borderColor)
      .alpha(0.05)
      .string()};
  border: 0px none transparent;
  border-bottom: ${DesignToken.form.borderWidth} solid ${props => props.theme.form.borderColor};
  font-size: ${DesignToken.form.fontSize};
  line-height: calc(${DesignToken.form.fontSize} * ${DesignToken.lineHeightFactor});
  padding: ${DesignToken.form.padding};
  width: calc(100% - ${DesignToken.form.padding} * 2);
  margin-bottom: ${DesignToken.form.marginBottom};
  outline: 0;
  transition: all ${DesignToken.defaultTransitionLength};
  font-family: ${Font.regular};

  &:focus {
    color: ${props => props.theme.form.textColor};
    border-color: ${props => props.theme.form.textColor};
  }
`

export const Label = styled.label`
  font-size: ${DesignToken.defaultFontSize};
  line-height: calc(${DesignToken.defaultFontSize} * ${DesignToken.lineHeightFactor});
  display: block;
  font-family: ${Font.regular};
`

export const Button = styled.button`
  border-radius: ${DesignToken.form.borderRadius};
  border: 0 transparent none;
  background-color: ${props => props.theme.form.button.backgroundColor};
  color: ${props => props.theme.form.button.textColor};
  font-size: ${DesignToken.form.fontSize};
  padding: ${DesignToken.form.button.padding};
  margin-top: ${DesignToken.form.button.marginTop};
  margin-bottom: ${DesignToken.form.button.marginBottom};
  cursor: pointer;
  outline: 0;
  transition: all ${DesignToken.defaultTransitionLength};
  font-family: ${Font.bold};

  box-shadow: 0 3px 4px
    ${props =>
      Color(props.theme.form.button.backgroundHoverColor)
        .alpha(0.5)
        .string()};

  &:hover {
    background-color: ${props => props.theme.form.button.backgroundHoverColor};
    box-shadow: 0 4px 10px
      ${props =>
        Color(props.theme.form.button.backgroundHoverColor)
          .alpha(0.5)
          .string()};
  }
`
