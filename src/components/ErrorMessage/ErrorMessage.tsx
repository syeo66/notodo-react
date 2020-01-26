import styled from 'styled-components'
import { DesignToken } from '../../design-tokens'

const ErrorMessage = styled.div`
  border: 2px solid;

  border-color: ${props => props.theme.errorColor};
  border-radius: ${DesignToken.defaultBorderRadius};
  padding: ${DesignToken.defaultPadding};
  margin-bottom: ${DesignToken.defaultPadding};
`

export default ErrorMessage
