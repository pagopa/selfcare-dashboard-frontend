import { TableCell, Tooltip, Typography } from '@mui/material';
import { ReactElement, useEffect, useRef, useState } from 'react';

interface TableCellWithStyleProps {
  text: string | ReactElement;
}

const TableCellWithStyle: React.FC<TableCellWithStyleProps> = ({ text }) => {
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
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    </TableCell>
  );
};

export default TableCellWithStyle;
