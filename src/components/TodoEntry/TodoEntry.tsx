import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

import { DesignToken } from '../../design-tokens'
import { TIME_FORMAT } from '../../constants'

const EntryCell = styled.div`
  &:not(:first-child) {
    padding-left: ${DesignToken.defaultPadding};
  }
`

const TickCell = styled(EntryCell)`
  width: 1rem;
  font-size: 130%;
  text-align: center;
`

const TimeCell = styled(EntryCell)`
  width: 2rem;
  text-align: center;
`

interface TodoEntryComponentProps {
  title: string
  className?: string
  isSelected?: boolean
  doneAt?: Date
}

const TodoEntryComponent: React.FC<TodoEntryComponentProps> = ({ title, className, doneAt }) => {
  console.log(doneAt)
  return (
    <div className={className}>
      <TickCell>{!!doneAt && '✓'}</TickCell>
      <TimeCell>{!!doneAt && format(doneAt, TIME_FORMAT)}</TimeCell>
      <EntryCell>{title}</EntryCell>
    </div>
  )
}

const TodoEntry = styled(TodoEntryComponent)`
  display: flex;
  align-items: center;
  padding: ${DesignToken.todoEntry.padding};
  color: ${props => (props.isSelected ? props.theme.primaryColor : props.theme.textColor)};
  opacity: ${props => (props.isSelected || !!props.doneAt ? 1 : 0.4)};
  transition: opacity 500ms, color 500ms, border 500ms;
  border: ${DesignToken.todoEntry.selectBorder.width} solid
    ${props => (props.isSelected ? props.theme.primaryColor : 'transparent')};

  &:hover {
    color: ${props => props.theme.secondaryColor};
    border: ${DesignToken.todoEntry.selectBorder.width} solid ${props => props.theme.secondaryColor};
    opacity: 1;
  }
`

export default TodoEntry
