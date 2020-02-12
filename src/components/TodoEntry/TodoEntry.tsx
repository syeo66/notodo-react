import { format } from 'date-fns'
import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'

import { TIME_FORMAT } from '../../constants'
import { DesignToken } from '../../design-tokens'

const EntryCell = styled.div`
  &:not(:first-child) {
    padding-left: ${DesignToken.defaultPadding};
  }
`

const TickCell = styled(EntryCell)`
  width: 1rem;
  flex-shrink: 0;
  font-size: 130%;
  text-align: center;
`

const TimeCell = styled(EntryCell)`
  width: 2rem;
  flex-shrink: 0;
  text-align: center;
  padding-right: ${DesignToken.defaultPadding};
`

const TextCell = styled(EntryCell)`
  text-align: left;
  word-break: break-word;
  hyphens: auto;
`

interface TodoEntryComponentProps {
  title: string
  className?: string
  isSelected?: boolean
  doneAt?: Date
}

const TodoEntryComponent: React.FC<TodoEntryComponentProps> = ({ title, className, doneAt, isSelected }) => {
  const element = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (isSelected && element.current && element.current.parentElement) {
      const currentPos = element.current?.offsetTop
      const maxPos =
        (element.current?.parentElement?.offsetHeight +
          element.current?.parentElement?.offsetTop +
          element.current?.offsetHeight) /
        2

      element.current?.parentElement?.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: currentPos - maxPos,
      })
    }
  }, [isSelected])

  return (
    <div className={className} ref={element}>
      <TickCell>{doneAt ? '✓' : <>&nbsp;</>}</TickCell>
      <TimeCell>{!!doneAt && format(doneAt, TIME_FORMAT)}</TimeCell>
      <TextCell>{title}</TextCell>
    </div>
  )
}

const TodoEntry = styled(TodoEntryComponent)`
  display: flex;
  align-items: center;
  padding: ${DesignToken.todoEntry.padding};
  color: ${props => (props.isSelected ? props.theme.primaryColor : props.theme.textColor)};
  opacity: ${props => (props.isSelected || !!props.doneAt ? 1 : 0.4)};
  transition: opacity ${DesignToken.defaultTransitionLength}, color ${DesignToken.defaultTransitionLength},
    border ${DesignToken.defaultTransitionLength};
  border: ${DesignToken.todoEntry.selectBorder.width} solid
    ${props => (props.isSelected ? props.theme.primaryColor : 'transparent')};
`

export default TodoEntry
