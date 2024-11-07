import { TableCell, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState, ReactElement } from 'react';

interface TableCellWithTooltipProps {
  text: string | ReactElement;
}

const TableCellWithTooltip: React.FC<TableCellWithTooltipProps> = ({ text }) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowed(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [text]);

  return (
    <TableCell>
      <Tooltip title={isOverflowed && typeof text === 'string' ? text : ''} placement="top" arrow>
        <Typography
          ref={textRef}
          variant="body2"
          sx={{
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};

export default TableCellWithTooltip;
