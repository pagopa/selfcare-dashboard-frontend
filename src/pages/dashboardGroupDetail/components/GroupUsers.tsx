import { Typography } from '@mui/material';

type Props = {
  groupStatusClass: string;
};

export default function GroupUsers({ groupStatusClass }: Props) {
  return <Typography className={groupStatusClass}> TEST</Typography>;
}
