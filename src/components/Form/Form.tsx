import styled from 'styled-components'

import { DesignToken } from '../../design-tokens'

export const Input = styled.input`
  border-radius: ${DesignToken.form.borderRadius};
  background-color: ${props => props.theme.form.backgroundColor};
  color: ${props => props.theme.form.borderColor};
  border: ${DesignToken.form.borderWidth} solid ${props => props.theme.form.borderColor};
  font-size: ${DesignToken.form.fontSize};
  line-height: calc(${DesignToken.form.fontSize} * ${DesignToken.lineHeightFactor});
  padding: ${DesignToken.form.padding};
  width: calc(100% - ${DesignToken.form.padding} * 2);
  margin-bottom: ${DesignToken.form.marginBottom};
  outline: 0;

  &:focus {
    color: ${props => props.theme.form.textColor};
    border-color: ${props => props.theme.form.textColor};
  }
`

export const Label = styled.label`
  font-size: ${DesignToken.defaultFontSize};
  line-height: calc(${DesignToken.defaultFontSize} * ${DesignToken.lineHeightFactor});
  display: block;
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

  &:hover {
  }
`
