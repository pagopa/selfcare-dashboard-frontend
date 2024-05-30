import { TableCell, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const TableCellWithTooltip: React.FC<{ text: string }> = ({ text }) => {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowed(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [text]);

  return (
    <TableCell>
      <Tooltip title={isOverflowed ? text : ''} placement="top" arrow>
        <Typography
          ref={textRef}
          variant="body2"
          sx={{
            fontWeight: '600',
            width: '90%',
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
