import styled from 'styled-components'

import { DesignToken } from '../../design-tokens'

export const Input = styled.input`
  border-radius: ${DesignToken.form.borderRadius};
  border: ${DesignToken.form.borderWidth} solid ${props => props.theme.form.borderColor};
  font-size: ${DesignToken.form.fontSize};
  line-height: calc(${DesignToken.form.fontSize} * ${DesignToken.lineHeightFactor});
  padding: ${DesignToken.form.padding};
  width: calc(100% - ${DesignToken.form.padding} * 2);
  margin-bottom: ${DesignToken.form.marginBottom};
`
